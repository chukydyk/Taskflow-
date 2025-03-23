import React, { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Chart, ChartSeries, ChartSeriesItem } from "@progress/kendo-react-charts";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { Notification } from "@progress/kendo-react-notification";
import "@progress/kendo-theme-material/dist/all.css";

const TaskFlow = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: "", priority: "Medium", dueDate: new Date() });
  const [progress, setProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const priorities = ["Low", "Medium", "High"];

  const addTask = () => {
    if (!task.title.trim()) return;
    const updatedTasks = [...tasks, { ...task, id: tasks.length + 1, completed: false }];
    setTasks(updatedTasks);
    updateProgress(updatedTasks);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const updateProgress = (taskList) => {
    const completedTasks = taskList.filter((t) => t.completed).length;
    setProgress((completedTasks / taskList.length) * 100);
  };

  const markCompleted = (id) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    updateProgress(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    updateProgress(updatedTasks);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">TaskFlow - Productivity Dashboard</h2>
      <TabStrip>
        <TabStripTab title="Tasks">
          <div className="mb-4 space-y-2">
            <Input
              placeholder="Task Title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
            <DropDownList
              data={priorities}
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.value })}
            />
            <DatePicker
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.value })}
            />
            <Button onClick={addTask} primary>Add Task</Button>
          </div>
          <Grid data={tasks} style={{ maxHeight: "300px" }}>
            <GridColumn field="title" title="Task" />
            <GridColumn field="priority" title="Priority" />
            <GridColumn field="dueDate" title="Due Date" format="{0:d}" />
            <GridColumn
              title="Status"
              cell={(props) => (
                <td>
                  <Button
                    onClick={() => markCompleted(props.dataItem.id)}
                    look={props.dataItem.completed ? "outline" : "solid"}
                    className={props.dataItem.completed ? "bg-green-500" : "bg-gray-500"}
                  >
                    {props.dataItem.completed ? "Completed" : "Mark Done"}
                  </Button>
                </td>
              )}
            />
            <GridColumn
              title="Actions"
              cell={(props) => (
                <td>
                  <Button fillMode="flat" themeColor="error" onClick={() => deleteTask(props.dataItem.id)}>
                    Delete
                  </Button>
                </td>
              )}
            />
          </Grid>
        </TabStripTab>

        <TabStripTab title="Analytics">
          <Chart>
            <ChartSeries>
              <ChartSeriesItem
                type="column"
                data={tasks.map((task, index) => ({ category: `Task ${index + 1}`, value: task.completed ? 1 : 0 }))}
              />
            </ChartSeries>
          </Chart>
          <ProgressBar value={progress} max={100} labelVisible={true} />
        </TabStripTab>
      </TabStrip>

      {showNotification && (
        <Notification type={{ style: "success", icon: true }}>
          Task added successfully!
        </Notification>
      )}
    </div>
  );
};

export default TaskFlow;
