import type { NoteImage } from "@/shared/types/";

/** Получение готовой ссылки на картинку для src */
export function noteImageToSrc(image: NoteImage): string {
  if (image.kind === "url") return image.url;

  return URL.createObjectURL(image.blob);
}

/** Очистка ObjectURL */
export function revokeIfBlob(image: NoteImage, src: string) {
  if (image.kind === "blob") URL.revokeObjectURL(src);
}
