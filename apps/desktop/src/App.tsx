import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonIcon,
  IonLabel,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import { checkboxOutline, calendarOutline, sparklesOutline } from "ionicons/icons";

import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import SummaryPage from "./pages/SummaryPage";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tasks" component={TasksPage} />
          <Route exact path="/calendar" component={CalendarPage} />
          <Route exact path="/summary" component={SummaryPage} />
          <Redirect exact from="/" to="/tasks" />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tasks" href="/tasks">
            <IonIcon icon={checkboxOutline} />
            <IonLabel>Tarefas</IonLabel>
          </IonTabButton>
          <IonTabButton tab="calendar" href="/calendar">
            <IonIcon icon={calendarOutline} />
            <IonLabel>Calendario</IonLabel>
          </IonTabButton>
          <IonTabButton tab="summary" href="/summary">
            <IonIcon icon={sparklesOutline} />
            <IonLabel>Resumo IA</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
