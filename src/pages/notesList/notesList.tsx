import cls from "./notesList.module.css";
import { Note } from "./ui/note/note";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { selectAllNotes } from "@/features/notesCRUD";
import { useAppSelector } from "@/shared/types";
import { NoteModal } from "./ui/noteModal/noteModal";

/** Страница со списком заметок */
export function NotesList() {
  const notesFromStore = useAppSelector(selectAllNotes);

  return (
    <div className={cls.notesList}>
      <NoteModal variant="create">
        {({ openCreate }) => (
          <Button
            onClick={openCreate}
            className={cls.createBtn}
            icon={<PlusOutlined />}
            iconPlacement="end"
            type="primary"
          >
            Новая заметка
          </Button>
        )}
      </NoteModal>

      <ul className={cls.notes}>
        {notesFromStore.map((n) => (
          <li key={n.id}>
            <Note note={n} />
          </li>
        ))}
      </ul>
    </div>
  );
}
