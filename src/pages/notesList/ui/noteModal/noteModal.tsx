import cls from "./noteModal.module.css";
import { Modal, Typography, Button, Upload, Divider, Image, Input } from "antd";
import { DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import type { Note } from "@/shared/types";
import { useNoteModalController } from "./useNoteModalController";
import { NoteModalFooter } from "./noteModalFooter";

const { Title, Paragraph } = Typography;

type Variant = "attached" | "create";

type RenderApi = {
  openView: () => void;
  openEdit: () => void;
  openCreate: () => void;
};

interface NoteModalProps {
  variant: Variant;
  noteId?: string;
  note?: Note;
  children: (api: RenderApi) => React.ReactNode;
}

export function NoteModal({ variant, noteId, note, children }: NoteModalProps) {
  const c = useNoteModalController({ variant, noteId, note });

  return (
    <>
      {children({
        openView: c.openView,
        openEdit: c.openEdit,
        openCreate: c.openCreate,
      })}

      <Modal
        className={cls.noteModal}
        open={c.state.open}
        onCancel={c.close}
        footer={
          <NoteModalFooter
            mode={c.state.mode}
            canSave={c.ui.canSave}
            onDelete={c.del}
            onSave={c.save}
            onCancelEdit={c.cancel}
            onSwitchToEditFromView={c.switchToEditFromView}
          />
        }
        title={null}
        destroyOnHidden
        width={800}
      >
        <div className={cls.body}>
          <div className={cls.header}>
            <Title
              level={3}
              className={cls.title}
              editable={
                c.ui.isEdit
                  ? {
                      onChange: c.changeTitle,
                      autoSize: { maxRows: 3 },
                      triggerType: ["text", "icon"],
                    }
                  : false
              }
            >
              {c.state.title || (c.ui.isCreate ? "Новая заметка" : "")}
            </Title>
          </div>

          <div className={cls.imageBlock}>
            {c.state.image && c.imageSrc && (
              <Image className={cls.image} alt="note" src={c.imageSrc} />
            )}

            <div className={cls.imageActions}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  if (!file.type.toLowerCase().includes("image")) {
                    console.error("ERROR: неверный формат файла", file.type);
                    return;
                  }

                  c.setImageFromFile(file);
                  return false;
                }}
                disabled={!c.ui.isEdit}
              >
                <Button icon={<PictureOutlined />} disabled={!c.ui.isEdit}>
                  Добавить фото
                </Button>
              </Upload>

              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={!c.ui.isEdit || !c.state.image}
                onClick={c.removeImage}
              >
                Удалить фото
              </Button>
            </div>
          </div>

          <Divider className={cls.divider} />

          <div className={cls.content}>
            {!c.ui.isEdit && <Paragraph className={cls.text}>{c.state.text}</Paragraph>}

            {c.ui.isEdit && (
              <Input.TextArea
                className={cls.textarea}
                value={c.state.text}
                onChange={(e) => c.changeText(e.target.value)}
                autoSize={{ minRows: 7, maxRows: 14 }}
                placeholder="Нажмите, чтобы добавить текст"
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
