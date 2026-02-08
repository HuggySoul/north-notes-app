import cls from "./noteModal.module.css";
import { Button, Popconfirm } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";

type Props = {
  mode: "view" | "edit" | "create";
  canSave: boolean;

  onDelete: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onSwitchToEditFromView: () => void;
};

export function NoteModalFooter({
  mode,
  canSave,
  onDelete,
  onSave,
  onCancelEdit,
  onSwitchToEditFromView,
}: Props) {
  return (
    <div className={cls.footer}>
      {mode === "view" && (
        <div className={cls.row}>
          <Button icon={<EditOutlined />} type="primary" onClick={onSwitchToEditFromView}>
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить заметку?"
            okText="Удалить"
            cancelText="Отмена"
            okButtonProps={{ danger: true }}
            onConfirm={onDelete}
          >
            <Button danger icon={<DeleteOutlined />}>
              Удалить
            </Button>
          </Popconfirm>
        </div>
      )}

      {(mode === "edit" || mode === "create") && (
        <div className={cls.row}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={onSave}
            disabled={!canSave}
          >
            Сохранить
          </Button>

          {mode === "edit" && (
            <Popconfirm
              title="Удалить заметку?"
              okText="Удалить"
              cancelText="Отмена"
              okButtonProps={{ danger: true }}
              onConfirm={onDelete}
            >
              <Button danger icon={<DeleteOutlined />}>
                Удалить
              </Button>
            </Popconfirm>
          )}

          <Button icon={<CloseOutlined />} onClick={onCancelEdit}>
            Отменить
          </Button>
        </div>
      )}
    </div>
  );
}
