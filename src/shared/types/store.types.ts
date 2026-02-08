import type { store } from "@/app/store/store.ts";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

/** Тип корневого состояния Redux */
export type RootState = ReturnType<typeof store.getState>;

/** Тип корневого диспатча Redux */
export type AppDispatch = typeof store.dispatch;

/** Тип хранилища целиком */
export type AppStore = typeof store;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
