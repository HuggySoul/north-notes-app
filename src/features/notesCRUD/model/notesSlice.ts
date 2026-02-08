import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Note } from "@/shared/types";
import { dbGetAllNotes } from "./notesIndexDB";
import type { NoteImage } from "@/shared/types";
import { MockNotes } from "@/shared/models";
import { dbPutNotesIfMissing } from "./notesIndexDB";

export type NotesState = {
  /** Заметки в нормализованном виде */
  entities: Record<string, Note>;

  /** Список id заметок для удобства рендера в нужном порядке */
  ids: string[];

  /** Флаг первичной синхронизации хранилища и indexDb */
  isHydrating: boolean;

  error: string | null;
};

/** Добавляет мок-заметки в IndexedDB, если их там ещё нет */
export const seedMockNotesToDb = createAsyncThunk<void>(
  "notes/seedMockNotesToDb",
  async () => {
    const mockList: Note[] = Object.values(MockNotes.entities);
    await dbPutNotesIfMissing(mockList);
  },
);

/** Загружает все заметки из IndexDB */
export const hydrateNotes = createAsyncThunk<Note[]>("notes/hydrate", async () => {
  const notes = await dbGetAllNotes();
  return notes;
});

type NotePayload = {
  title: string;
  text?: string;
  image?: NoteImage;
};

type UpdateNotePayload = {
  id: string;
  changes: Partial<Pick<Note, "title" | "text" | "image">>;
};

const initialState: NotesState = MockNotes;

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    createNote: {
      reducer(state, action: PayloadAction<Note>) {
        const note = action.payload;
        state.entities[note.id] = note;
        state.ids.unshift(note.id);
      },
      prepare(payload: NotePayload) {
        const now = new Date().toISOString();
        const note: Note = {
          id: crypto.randomUUID(),
          title: payload.title,
          text: payload.text,
          image: payload.image,
          createdAt: now,
        };
        return { payload: note };
      },
    },

    updateNote(state, action: PayloadAction<UpdateNotePayload>) {
      const { id, changes } = action.payload;
      const existing = state.entities[id];

      if (!existing) return;

      state.entities[id] = {
        ...existing,
        ...changes,
      };
    },

    deleteNote(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (!state.entities[id]) return;

      delete state.entities[id];
      state.ids = state.ids.filter((x) => x !== id);
    },

    setAllNotes(state, action: PayloadAction<Note[]>) {
      state.entities = {};
      state.ids = [];

      const sorted = [...action.payload].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
      for (const n of sorted) {
        state.entities[n.id] = n;
        state.ids.push(n.id);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(hydrateNotes.pending, (state) => {
        state.isHydrating = true;
        state.error = null;
      })
      .addCase(hydrateNotes.fulfilled, (state, action) => {
        state.isHydrating = false;

        state.ids = [];
        state.entities = {};
        // Сортируем по дате создания
        const sorted = [...action.payload].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        );

        for (const n of sorted) {
          state.entities[n.id] = n;
          state.ids.push(n.id);
        }
      })
      .addCase(hydrateNotes.rejected, (state, action) => {
        state.isHydrating = false;
        state.error = action.error.message ?? "Failed to hydrate notes";
      });
  },
});

export const { createNote, updateNote, deleteNote, setAllNotes } = notesSlice.actions;

export const notesReducer = notesSlice.reducer;
