import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input, ListItem } from "react-native-elements";
import ModalForm from "../../Components/General/ModalForm";
import AppObjectListComponent from "../../Components/General/AppObectList/AppObjectListComponent";
import { isEmpty } from "lodash";
import TaskItem from "../../Components/ListItems/TaskItem";
import { addTask, getTasks } from "../../Utils/Persistence/Actions";
import { useFocusEffect } from "@react-navigation/native";
import TasksFilterModal from "./TasksFilterModal";

export default function TasksListScreen({
  activitiesRoute,
  activity,
  navigation,
  role,
}) {
  return (
    <AppObjectListComponent
      options={{ title: "Tasks" }}
      navigation={navigation}
      ModalForm={(args) =>
        AddTaskForm({ ...args, activityId: activity.id, activitiesRoute })
      }
      addObject={addTask}
      getObjects={(limit, startActivity, filterObj) =>
        getTasks(activitiesRoute, activity.id, limit, startActivity, filterObj)
      }
      createObject={createTask}
      renderItem={(task) => (
        <TaskItem
          task={task.item}
          onPress={(task) =>
            navigation.navigate("TaskInfoScreen", {
              task,
              role,
            })
          }
        />
      )}
      FilterModal={TasksFilterModal}
    />
  );
}

function AddTaskForm({ modalRef, onConfirm, activityId, activitiesRoute }) {
  const [taskNameError, setTaskNameError] = useState(null);
  const [name, setName] = useState(null);
  return (
    <ModalForm
      modalRef={modalRef}
      btnText="Add task"
      onConfirm={onConfirmBtnPress}
    >
      <Input
        placeholder="Activity task"
        onChangeText={(text) => setName(text)}
        errorMessage={taskNameError}
      />
    </ModalForm>
  );

  function onConfirmBtnPress() {
    if (isEmpty(name)) {
      setTaskNameError("You must specify a valid name for the task");
      return;
    }
    onConfirm({
      name: name,
      activityId: activityId,
      activitiesRoute: activitiesRoute,
    });
  }
}

function createTask(taskData) {
  return {
    name: taskData.name,
    creationDate: new Date(),
    completionDate: null,
    done: false,
    description: null,
    activityId: taskData.activityId,
    activitiesRoute: taskData.activitiesRoute,
  };
}
