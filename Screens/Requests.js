import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppObjectListComponent from "../Components/General/AppObectList/AppObjectListComponent";
import RequestItem from "../Components/ListItems/RequestItem";
import { getRequests } from "../Utils/Persistence/Actions";

export default function Requests() {
  return (
    <AppObjectListComponent
      getObjects={(limit) => getRequests(limit)}
      getMoreObjects={(limit, startRequest) => getRequests(limit, startRequest)}
      renderItem={(element, { setLoading, reload }) => (
        <RequestItem
          setLoading={setLoading}
          reload={reload}
          request={element.item}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({});
