import cls from "./notesList.module.css";
import { Note } from "./ui/note/note";

const MOCK_NOTES = [
  {
    id: "1",
    title:
      "Заметка 1в йцв йцв йцв й дйз дцузда цзузда цуда цдуах дцуад цхуд цдуха дцхуда цдуа",
    createdAt: "2026-02-02T12:38:22.481Z",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    text: "apflwlf p[lew[fl [wleff wefp wlepf у цзацзуда дуда здцзуда зхуцда хцузад цузад цзуад цхухад цуазд д apflwlf p[lew[fl [wleff wefp wlepf у цзацзуда дуда здцзуда зхуцда хцузад цузад цзуад цхухад цуазд д apflwlf p[lew[fl [wleff wefp wlepf у цзацзуда дуда здцзуда зхуцда хцузад цузад цзуад цхухад цуазд д apflwlf p[lew[fl [wleff wefp wlepf у цзацзуда дуда здцзуда зхуцда хцузад цузад цзуад цхухад цуазд д apflwlf p[lew[fl [wleff wefp wlepf у цзацзуда дуда здцзуда зхуцда хцузад цузад цзуад цхухад цуазд д apflwlf p[lew[fl [wleff wefp wlepf у цзацзуда дуда здцзуда зхуцда хцузад цузад цзуад цхухад цуазд д",
  },
];

/** Страница со списком заметок */
export function NotesList() {
  return (
    <div className={cls.notesList}>
      <Note note={MOCK_NOTES[0]} />
    </div>
  );
}
