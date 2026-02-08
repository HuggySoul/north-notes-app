import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Note } from "@/shared/types";

interface NotesDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: {
      "by-createdAt": string;
    };
  };
}

const DB_NAME = "north-notes-db";
const DB_VERSION = 1;
const STORE_NAME = "notes";

let dbPromise: Promise<IDBPDatabase<NotesDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<NotesDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("by-createdAt", "createdAt");
        }
      },
    });
  }

  return dbPromise;
}

export async function dbGetAllNotes(): Promise<Note[]> {
  const db = await getDb();
  return await db.getAll(STORE_NAME);
}

export async function dbPutNote(note: Note): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, note);
}

export async function dbDeleteNote(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export async function dbClearNotes(): Promise<void> {
  const db = await getDb();
  await db.clear(STORE_NAME);
}

/** Добавляет заметки в DB только если их там ещё нет */
export async function dbPutNotesIfMissing(notes: Note[]): Promise<void> {
  if (notes.length === 0) return;

  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  for (const n of notes) {
    const existing = await store.get(n.id);
    if (!existing) {
      await store.put(n);
    }
  }

  await tx.done;
}
