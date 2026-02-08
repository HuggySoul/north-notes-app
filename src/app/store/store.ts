import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { notesMiddleware } from "@/features/notesCRUD/model/notesMiddleware";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Blob и File — несериализуемые
        // Я осознанно храню Blob в state и IndexedDB в связи с отсутствием сервера
        ignoredActions: [
          "notes/createNote",
          "notes/updateNote",
          "notes/hydrate/fulfilled",
        ],
        ignoredPaths: ["notes.entities"],
      },
    }).prepend(notesMiddleware.middleware),
});
