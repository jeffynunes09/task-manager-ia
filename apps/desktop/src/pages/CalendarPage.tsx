import { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonList,
  IonText,
  IonButtons,
} from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import { tasksApi, Task } from "../services/api";
import TaskCard from "../components/TaskCard";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const CalendarPage: React.FC = () => {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    tasksApi.list().then(setTasks).catch(() => {});
  }, []);

  const prevMonth = () =>
    setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });

  const nextMonth = () =>
    setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const padDate = (n: number) => String(n).padStart(2, "0");

  const getTasksForDay = (day: number) => {
    const dateStr = `${current.year}-${padDate(current.month + 1)}-${padDate(day)}`;
    return tasks.filter(t => t.due_date?.startsWith(dateStr));
  };

  const isToday = (day: number) =>
    day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();

  const firstDayOfWeek = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedTasks = getTasksForDay(selectedDay);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={prevMonth}>
              <IonIcon icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ textAlign: "center" }}>
            {MONTHS[current.month]} {current.year}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={nextMonth}>
              <IonIcon icon={chevronForward} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid style={{ padding: "8px 4px 0" }}>
          <IonRow>
            {DAYS.map(d => (
              <IonCol key={d} style={{ textAlign: "center", fontWeight: 600, color: "var(--ion-color-medium)", fontSize: "0.75rem", padding: "4px 0" }}>
                {d}
              </IonCol>
            ))}
          </IonRow>

          {Array.from({ length: Math.ceil(cells.length / 7) }, (_, week) => (
            <IonRow key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((day, i) => {
                const hasTasks = day ? getTasksForDay(day).length > 0 : false;
                const selected = day === selectedDay;
                const todayDay = day ? isToday(day) : false;

                return (
                  <IonCol
                    key={i}
                    style={{ textAlign: "center", padding: "4px 2px", cursor: day ? "pointer" : "default" }}
                    onClick={() => day && setSelectedDay(day)}
                  >
                    {day && (
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        margin: "0 auto",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: selected
                          ? "var(--ion-color-primary)"
                          : todayDay
                            ? "var(--ion-color-primary-shade)"
                            : "transparent",
                        color: selected || todayDay ? "white" : "inherit",
                        fontWeight: selected || todayDay ? 700 : 400,
                        position: "relative",
                        fontSize: "0.9rem",
                      }}>
                        {day}
                        {hasTasks && (
                          <span style={{
                            position: "absolute", bottom: 2, right: 4,
                            width: 5, height: 5, borderRadius: "50%",
                            background: selected ? "white" : "var(--ion-color-primary)",
                          }} />
                        )}
                      </div>
                    )}
                  </IonCol>
                );
              })}
            </IonRow>
          ))}
        </IonGrid>

        <div style={{ padding: "8px 0" }}>
          <IonText color="medium">
            <p style={{ padding: "0 16px 4px", fontWeight: 600, fontSize: "0.8rem" }}>
              {selectedDay}/{current.month + 1}/{current.year} — {selectedTasks.length} tarefa(s)
            </p>
          </IonText>

          {selectedTasks.length > 0 ? (
            <IonList>
              {selectedTasks.map(task => (
                <TaskCard key={task.id} task={task} onComplete={() => {}} onDelete={() => {}} />
              ))}
            </IonList>
          ) : (
            <IonText color="medium">
              <p style={{ padding: "12px 16px", fontSize: "0.9rem" }}>
                Nenhuma tarefa para este dia.
              </p>
            </IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CalendarPage;
