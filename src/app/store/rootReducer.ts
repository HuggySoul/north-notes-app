import { combineReducers } from "@reduxjs/toolkit";
import { notesReducer } from "@/features/notesCRUD/";

export const rootReducer = combineReducers({
  notes: notesReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
