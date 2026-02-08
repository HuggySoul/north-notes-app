export interface Note {
  id: string;

  title: string;
  text?: string;
  image?: NoteImage;

  createdAt: string;
}

export type NoteImage = { kind: "blob"; blob: Blob } | { kind: "url"; url: string };
