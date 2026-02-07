import cls from "./note.module.css";
import type { Note } from "@/shared/types";
import { Card, Button, Tooltip } from "antd";
import { EditFilled } from "@ant-design/icons";
import { useMemo } from "react";
import { getDateParams } from "@/shared/utils";

interface IProps {
  note: Note;
}

/** Заметка */
export function Note({ note }: IProps) {
  const formattedDate = useMemo(() => {
    const dateParams = getDateParams(note.createdAt);
    return `${dateParams.month}.${dateParams.day}.${dateParams.year}`;
  }, [note.createdAt]);

  return (
    <>
      <article>
        <Card
          cover={
            note.image && (
              <img
                className={cls.image}
                draggable={false}
                alt="note image"
                src={note.image}
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
              shape="circle"
              icon={<EditFilled />}
              type="primary"
              className={cls.editBtn}
              size="large"
            ></Button>
          </Tooltip>
        </Card>
      </article>
    </>
  );
}
