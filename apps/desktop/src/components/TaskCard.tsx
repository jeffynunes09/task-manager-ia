import {
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonNote,
} from "@ionic/react";
import { checkmarkOutline, trashOutline } from "ionicons/icons";
import { Task } from "../services/api";

const PRIORITY_COLOR: Record<Task["priority"], string> = {
  high: "danger",
  medium: "warning",
  low: "success",
};

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  high: "Alta",
  medium: "Media",
  low: "Baixa",
};

interface Props {
  task: Task;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<Props> = ({ task, onComplete, onDelete }) => (
  <IonItem lines="full" style={{ opacity: task.completed ? 0.5 : 1 }}>
    <IonLabel>
      <h2 style={{ textDecoration: task.completed ? "line-through" : "none" }}>
        {task.title}
      </h2>
      {task.description && <p>{task.description}</p>}
      {task.due_date && (
        <IonNote>
          {new Date(task.due_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </IonNote>
      )}
    </IonLabel>

    <IonBadge color={PRIORITY_COLOR[task.priority]} slot="end">
      {PRIORITY_LABEL[task.priority]}
    </IonBadge>

    {!task.completed && (
      <IonButton fill="clear" slot="end" onClick={() => onComplete(task.id)}>
        <IonIcon icon={checkmarkOutline} />
      </IonButton>
    )}

    <IonButton fill="clear" color="danger" slot="end" onClick={() => onDelete(task.id)}>
      <IonIcon icon={trashOutline} />
    </IonButton>
  </IonItem>
);

export default TaskCard;
