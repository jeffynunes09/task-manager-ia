import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";

import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import SummaryPage from "./pages/SummaryPage";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/tasks" component={TasksPage} />
        <Route exact path="/calendar" component={CalendarPage} />
        <Route exact path="/summary" component={SummaryPage} />
        <Redirect exact from="/" to="/tasks" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
