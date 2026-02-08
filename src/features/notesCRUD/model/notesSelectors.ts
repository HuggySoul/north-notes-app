import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/types";
import type { Note } from "@/shared/types/";

export const selectNotesState = (s: RootState) => s.notes;
export const selectNotesIds = (s: RootState) => s.notes.ids;
export const selectNotesEntities = (s: RootState) => s.notes.entities;

export const selectAllNotes = createSelector(
  [selectNotesIds, selectNotesEntities],
  (ids, entities): Note[] => {
    const res: Note[] = [];
    for (const id of ids) {
      const n = entities[id];
      if (n) res.push(n);
    }
    return res;
  },
);

export const selectNoteById =
  (id: string) =>
  (s: RootState): Note | undefined =>
    s.notes.entities[id];
