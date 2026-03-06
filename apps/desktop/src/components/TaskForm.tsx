import { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonTextarea,
  IonSpinner,
  IonButtons,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
} from "@ionic/react";
import { sparkles } from "ionicons/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: string) => Promise<void>;
}

const TaskForm: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(input.trim());
      setInput("");
      onClose();
    } catch {
      setError("Nao foi possivel criar a tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setInput("");
    setError(null);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nova Tarefa</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose} disabled={loading}>
              Cancelar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem lines="none">
          <IonLabel position="stacked">Descreva em linguagem natural</IonLabel>
          <IonTextarea
            placeholder='"preciso estudar nestjs amanha de manha"'
            value={input}
            onIonInput={e => setInput(e.detail.value ?? "")}
            rows={4}
            autoGrow
            disabled={loading}
          />
        </IonItem>

        <IonText color="medium">
          <p style={{ fontSize: "0.85rem", padding: "4px 16px 16px" }}>
            A IA vai extrair titulo, prioridade e prazo automaticamente.
          </p>
        </IonText>

        {error && (
          <IonText color="danger">
            <p style={{ padding: "0 16px" }}>{error}</p>
          </IonText>
        )}

        <div style={{ padding: "0 16px" }}>
          <IonButton
            expand="block"
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <IonSpinner name="dots" />
            ) : (
              <>
                <IonIcon slot="start" icon={sparkles} />
                Criar com IA
              </>
            )}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default TaskForm;
