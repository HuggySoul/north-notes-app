import type { NoteImage, Note } from "@/shared/types";

/** Снимок состояния заметки (для откатов) */
type Snapshot = {
  title: string;
  text: string;
  image?: NoteImage;
};

/** Состояние модального окна просмотра/редактирования заметки */
type State = {
  open: boolean;
  mode: Mode;
  title: string;
  text: string;
  image?: NoteImage;
  snapshot: Snapshot | null; // для отмены в edit
  noteId?: string;
};

type Mode = "view" | "edit" | "create";

type Action =
  | { type: "OPEN_VIEW"; note: Note; noteId: string }
  | { type: "OPEN_EDIT"; note: Note; noteId: string }
  | { type: "OPEN_CREATE" }
  | { type: "CLOSE" }
  | { type: "CHANGE_TITLE"; value: string }
  | { type: "CHANGE_TEXT"; value: string }
  | { type: "SET_IMAGE"; image?: NoteImage }
  | { type: "REMOVE_IMAGE" }
  | { type: "CANCEL_EDIT" }
  | { type: "AFTER_SAVE_SWITCH_TO_VIEW" };

function makeSnapshot(note: Note): Snapshot {
  return {
    title: note.title ?? "",
    text: note.text ?? "",
    image: note.image,
  };
}

export const initialState: State = {
  open: false,
  mode: "view",
  title: "",
  text: "",
  image: undefined,
  snapshot: null,
  noteId: undefined,
};

/** Редьюсер для урправления состоянием модального окна заметки */
export function noteModalReducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN_VIEW": {
      const snap = makeSnapshot(action.note);
      return {
        open: true,
        mode: "view",
        title: snap.title,
        text: snap.text,
        image: snap.image,
        snapshot: snap,
        noteId: action.noteId,
      };
    }

    case "OPEN_EDIT": {
      const snap = makeSnapshot(action.note);
      return {
        open: true,
        mode: "edit",
        title: snap.title,
        text: snap.text,
        image: snap.image,
        snapshot: snap,
        noteId: action.noteId,
      };
    }

    case "OPEN_CREATE": {
      return {
        open: true,
        mode: "create",
        title: "Новая заметка",
        text: "",
        image: undefined,
        snapshot: null,
        noteId: undefined,
      };
    }
    case "CLOSE":
      return initialState;

    case "CHANGE_TITLE":
      return { ...state, title: action.value };

    case "CHANGE_TEXT":
      return { ...state, text: action.value };

    case "SET_IMAGE":
      return { ...state, image: action.image ? action.image : undefined };

    case "REMOVE_IMAGE":
      return { ...state, image: undefined };

    case "CANCEL_EDIT": {
      if (state.mode === "create") return initialState;

      const snap = state.snapshot;
      if (!snap) return { ...state, mode: "view" };

      return {
        ...state,
        mode: "view",
        title: snap.title,
        text: snap.text,
        image: snap.image,
      };
    }

    case "AFTER_SAVE_SWITCH_TO_VIEW": {
      return {
        ...state,
        mode: "view",
        snapshot: { title: state.title, text: state.text, image: state.image },
      };
    }

    default:
      return state;
  }
}
