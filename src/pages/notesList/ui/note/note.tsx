import cls from "./note.module.css";
import type { Note as NoteType } from "@/shared/types";
import { Card, Button, Tooltip, Image } from "antd";
import { EditFilled } from "@ant-design/icons";
import { useMemo, useEffect, memo } from "react";
import { getDateParams } from "@/shared/utils";
import { revokeIfBlob, noteImageToSrc } from "@/shared/utils";
import { NoteModal } from "../noteModal/noteModal";

interface IProps {
  note: NoteType;
}

/** Заметка */
export const Note = memo(({ note }: IProps) => {
  const formattedDate = useMemo(() => {
    const dateParams = getDateParams(note.createdAt);
    return `${dateParams.day}.${dateParams.month}.${dateParams.year}`;
  }, [note.createdAt]);

  const src = useMemo(
    () => (note.image ? noteImageToSrc(note.image) : null),
    [note.image],
  );

  useEffect(() => {
    if (!note.image || !src) return;

    return () => revokeIfBlob(note.image!, src);
  }, [note.image, src]);

  return (
    <>
      <NoteModal note={note} noteId={note.id} variant="attached">
        {({ openEdit, openView }) => (
          <article>
            <Card
              onClick={openView}
              cover={
                src && (
                  <Image
                    preview={false}
                    className={cls.image}
                    alt="note image"
                    src={src}
                  />
                )
              }
              hoverable
              title={note.title}
              className={cls.note}
            >
              <p className={`${cls.text} ${note.image && cls.short}`}>{note.text}</p>
              <span className={cls.date}>{formattedDate}</span>
              <Tooltip placement="topRight" title="Редактировать">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit();
                  }}
                  shape="circle"
                  icon={<EditFilled />}
                  type="primary"
                  className={cls.editBtn}
                  size="large"
                ></Button>
              </Tooltip>
            </Card>
          </article>
        )}
      </NoteModal>
    </>
  );
});
