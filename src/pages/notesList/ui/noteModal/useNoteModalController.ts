import { useMemo, useReducer } from "react";
import type { Note, NoteImage } from "@/shared/types";
import { initialState, noteModalReducer } from "./noteModalReducer";
import { useAppDispatch } from "@/shared/types";
import {
  createNote,
  updateNote,
  deleteNote,
} from "@/features/notesCRUD/model/notesSlice";
import { message } from "antd";
import { noteImageToSrc, revokeIfBlob } from "@/shared/utils";

type Variant = "attached" | "create";

/** хук для управления состоянием формы просмотра/редактирования/создания заметки */
export function useNoteModalController(params: {
  variant: Variant;
  note?: Note;
  noteId?: string;
}) {
  const { variant, note, noteId } = params;

  const dispatch = useAppDispatch();
  const [state, localDispatch] = useReducer(noteModalReducer, initialState);

  const isEdit = state.mode === "edit" || state.mode === "create";
  const canSave = state.title.trim().length > 0;

  const imageSrc = useMemo(() => {
    return state.image ? noteImageToSrc(state.image) : null;
  }, [state.image]);

  const safeRevokeCurrentImageUrl = () => {
    if (!state.image || !imageSrc) return;
    revokeIfBlob(state.image, imageSrc);
  };

  const openView = () => {
    if (variant !== "attached") return;
    if (!noteId || !note) return;
    localDispatch({ type: "OPEN_VIEW", note, noteId });
  };

  const openEdit = () => {
    if (variant !== "attached") return;
    if (!noteId || !note) return;
    localDispatch({ type: "OPEN_EDIT", note, noteId });
  };

  const openCreate = () => {
    if (variant !== "create") return;
    localDispatch({ type: "OPEN_CREATE" });
  };

  const close = () => {
    safeRevokeCurrentImageUrl();
    localDispatch({ type: "CLOSE" });
  };

  const cancel = () => {
    if (state.mode === "edit") {
      safeRevokeCurrentImageUrl();
      localDispatch({ type: "CANCEL_EDIT" });
      return;
    }
    close();
  };

  const changeTitle = (value: string) => localDispatch({ type: "CHANGE_TITLE", value });
  const changeText = (value: string) => localDispatch({ type: "CHANGE_TEXT", value });

  const setImageFromFile = (file: File) => {
    const image: NoteImage = { kind: "blob", blob: file };
    localDispatch({ type: "SET_IMAGE", image });
  };

  const removeImage = () => {
    safeRevokeCurrentImageUrl();
    localDispatch({ type: "REMOVE_IMAGE" });
  };

  const save = () => {
    if (!canSave) {
      void message.warning("Заголовок не может быть пустым");
      return;
    }

    if (state.mode === "create") {
      dispatch(
        createNote({
          title: state.title.trim(),
          text: state.text || undefined,
          image: state.image,
        }),
      );
      close();
      return;
    }

    if (state.mode === "edit") {
      const id = state.noteId ?? noteId;
      if (!id) return;

      dispatch(
        updateNote({
          id,
          changes: {
            title: state.title.trim(),
            text: state.text || undefined,
            image: state.image,
          },
        }),
      );

      localDispatch({ type: "AFTER_SAVE_SWITCH_TO_VIEW" });
      return;
    }
  };

  const del = () => {
    const id = variant === "attached" ? noteId : state.noteId;
    if (!id) {
      close();
      return;
    }

    dispatch(deleteNote(id));
    close();
  };

  const switchToEditFromView = () => {
    if (variant !== "attached") return;
    if (!noteId || !note) return;
    localDispatch({ type: "OPEN_EDIT", note, noteId });
  };

  const ui = {
    isEdit,
    canSave,
    isView: state.mode === "view",
    isCreate: state.mode === "create",
    isEditMode: state.mode === "edit",
  };

  return {
    state,
    ui,
    imageSrc,

    // public api
    openView,
    openEdit,
    openCreate,

    // handlers для модалки
    close,
    cancel,
    save,
    del,

    // handlers для полей ввода
    changeTitle,
    changeText,
    setImageFromFile,
    removeImage,

    switchToEditFromView,
  };
}
