export type { NotesState } from "./model/notesSlice";
export { hydrateNotes, seedMockNotesToDb } from "./model/notesSlice";
export {
  notesReducer,
  createNote,
  updateNote,
  deleteNote,
  setAllNotes,
} from "./model/notesSlice";

export { notesMiddleware } from "./model/notesMiddleware";
export { selectAllNotes, selectNoteById } from "./model/notesSelectors";
