import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
} from "@ionic/react";
import { sparkles, refreshOutline } from "ionicons/icons";
import { useSummary } from "../hooks/useSummary";

const SummaryPage: React.FC = () => {
  const { summary, loading, error, generate } = useSummary();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Resumo do Dia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonButton expand="block" onClick={generate} disabled={loading}>
          {loading ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={summary ? refreshOutline : sparkles} />
              {summary ? "Atualizar Resumo" : "Gerar Resumo com IA"}
            </>
          )}
        </IonButton>

        {error && (
          <IonText color="danger">
            <p style={{ textAlign: "center", marginTop: 16 }}>{error}</p>
          </IonText>
        )}

        {summary && (
          <IonCard style={{ marginTop: 16 }}>
            <IonCardContent>
              <IonText>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: "0.95rem" }}>
                  {summary}
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {!summary && !loading && !error && (
          <IonText color="medium">
            <p style={{ textAlign: "center", marginTop: 48, lineHeight: 1.6 }}>
              Clique no botao para gerar um resumo<br />
              inteligente das suas tarefas de hoje.
            </p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SummaryPage;
