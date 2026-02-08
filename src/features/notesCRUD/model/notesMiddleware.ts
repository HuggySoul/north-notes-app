import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import type { RootReducerState } from "@/app/store/rootReducer";
import { createNote, updateNote, deleteNote } from "./notesSlice";
import { dbPutNote, dbDeleteNote } from "./notesIndexDB";

/** middleware для синхронизации indexDB и store Redux */
export const notesMiddleware = createListenerMiddleware<RootReducerState>();

notesMiddleware.startListening({
  matcher: isAnyOf(createNote, updateNote),
  effect: async (action, api) => {
    const state = api.getState();

    if (createNote.match(action)) {
      await dbPutNote(action.payload);
      return;
    }

    if (updateNote.match(action)) {
      const id = action.payload.id;
      const note = state.notes.entities[id];
      if (!note) return;

      await dbPutNote(note);
      return;
    }
  },
});

notesMiddleware.startListening({
  actionCreator: deleteNote,
  effect: async (action) => {
    await dbDeleteNote(action.payload);
  },
});
