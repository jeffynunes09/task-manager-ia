import { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonSpinner,
  IonButton,
  IonButtons,
  IonToast,
  IonText,
} from "@ionic/react";
import { add, sparkles } from "ionicons/icons";
import { useTasks } from "../hooks/useTasks";
import { tasksApi } from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const TasksPage: React.FC = () => {
  const { tasks, loading, error, create, complete, remove, reorder } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);

  const handleSuggest = async () => {
    setSuggesting(true);
    try {
      const { order } = await tasksApi.suggestOrder();
      reorder(order);
      setToast({ msg: "Ordem sugerida pela IA aplicada!", color: "success" });
    } catch {
      setToast({ msg: "Erro ao sugerir ordem — verifique a API.", color: "danger" });
    } finally {
      setSuggesting(false);
    }
  };

  const pending = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tarefas ({pending.length})</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSuggest} disabled={suggesting || pending.length === 0} title="Sugerir ordem com IA">
              {suggesting ? <IonSpinner name="dots" style={{ width: 20, height: 20 }} /> : <IonIcon icon={sparkles} />}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <IonSpinner />
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p style={{ padding: "16px", textAlign: "center" }}>{error}</p>
          </IonText>
        )}

        {!loading && !error && tasks.length === 0 && (
          <IonText color="medium">
            <p style={{ textAlign: "center", marginTop: 60, fontSize: "1rem" }}>
              Nenhuma tarefa ainda.<br />Clique em + para adicionar.
            </p>
          </IonText>
        )}

        {pending.length > 0 && (
          <IonList>
            {pending.map(task => (
              <TaskCard key={task.id} task={task} onComplete={complete} onDelete={remove} />
            ))}
          </IonList>
        )}

        {done.length > 0 && (
          <>
            <IonText color="medium">
              <p style={{ padding: "16px 16px 4px", fontWeight: 600, fontSize: "0.85rem" }}>
                CONCLUIDAS ({done.length})
              </p>
            </IonText>
            <IonList>
              {done.map(task => (
                <TaskCard key={task.id} task={task} onComplete={complete} onDelete={remove} />
              ))}
            </IonList>
          </>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowForm(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <TaskForm isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={create} />

        <IonToast
          isOpen={!!toast}
          message={toast?.msg ?? ""}
          color={toast?.color ?? "success"}
          duration={2500}
          onDidDismiss={() => setToast(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default TasksPage;
