import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input, ListItem } from "react-native-elements";
import ModalForm from "../../Components/General/ModalForm";
import AppObjectListComponent from "../../Components/General/AppObectList/AppObjectListComponent";
import { isEmpty } from "lodash";
import ActivityItem from "../../Components/ListItems/ActivityItem";
import { useFocusEffect } from "@react-navigation/native";
import { addActivity, getActivities } from "../../Utils/Persistence/Actions";
import NameFilterModal from "../../Components/General/NameFilterModal";

export default function ActivitiesListScreen({ project, navigation, role }) {
  return (
    <AppObjectListComponent
      options={{ title: "Activities" }}
      navigation={navigation}
      ModalForm={(args) => AddActivityForm({ ...args, projectId: project.id })}
      addObject={addActivity}
      getObjects={(limit, startActivity, filterObj) =>
        getActivities(project.id, limit, startActivity, filterObj)
      }
      createObject={createActivity}
      renderItem={(activity) => (
        <ActivityItem
          activity={activity.item}
          onPress={(activity) =>
            navigation.navigate("ActivityTabNavigator", {
              activity,
              role,
            })
          }
        />
      )}
      FilterModal={NameFilterModal}
    />
  );
}

function AddActivityForm({ modalRef, onConfirm, projectId }) {
  const [activityNameError, setActvityNameError] = useState(null);
  const [name, setName] = useState(null);
  return (
    <ModalForm
      modalRef={modalRef}
      btnText="Add activity"
      onConfirm={onConfirmBtnPress}
    >
      <Input
        placeholder="Activity name"
        onChangeText={(text) => setName(text)}
        errorMessage={activityNameError}
      />
    </ModalForm>
  );

  function onConfirmBtnPress() {
    if (isEmpty(name)) {
      setActvityNameError("You must specify a valid name for the activity");
      return;
    }
    onConfirm({ name: name, projectId: projectId });
  }
}

function createActivity(activityData) {
  return {
    name: activityData.name,
    startDate: null,
    finishDate: null,
    creationDate: new Date(),
    location: null,
    adress: null,
    projectId: activityData.projectId,
    completionDate: null,
    done: false,
    description: null,
    tasksCount: 0,
    doneTasksCount: 0,
  };
}
