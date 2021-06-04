import React, { useCallback, useRef, useState } from "react";
import { FlatList } from "react-native";
import FloatingButton from "../../Buttons/FloatingButton";
import { AppContainer } from "../../Containers/AppContainer";
import Loading from "../Loading";
import { AppIcon } from "../../Icons/AppIcon";
import {
  onAddProjectBtnPress,
  onFocus,
  onListEndReached,
} from "./AppObjectListHandlers";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function AppObjectListComponent({
  ModalForm,
  createObject,
  addObject,
  getObjects,
  getMoreObjects,
  renderItem,
  limit = 12,
}) {
  const navigation = useNavigation();
  const modalRef = useRef();
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startObject, setStartObject] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const objectsLimit = limit;

  const reload = () => {
    onFocus(
      { setObjects, setLoading, setStartObject, startObject },
      navigation,
      objectsLimit,
      getObjects
    );
  };

  useFocusEffect(useCallback(reload, []));

  return (
    <AppContainer>
      <FlatList
        data={objects}
        keyExtractor={(item, index) => String(index)}
        renderItem={(element) =>
          renderItem(element, { setLoading, reload, setLoadingMessage })
        }
        onEndReachedThreshold={0.1}
        onEndReached={() =>
          onListEndReached(
            {
              objects,
              setObjects,
              startObject,
              setStartObject,
              setLoading,
              scrolling,
            },
            objectsLimit,
            getMoreObjects
          )
        }
        onScrollBeginDrag={() => setScrolling(true)}
        onMomentumScrollEnd={() => setScrolling(false)}
        initialNumToRender={objectsLimit}
      />
      {ModalForm && (
        <FloatingButton
          icon={<AppIcon name="plus" />}
          onPress={() => modalRef.current.show(true)}
        />
      )}
      {ModalForm && (
        <ModalForm
          modalRef={modalRef}
          onConfirm={(objectData) =>
            onAddProjectBtnPress(
              {
                objectData,
                setLoading,
                setStartObject,
              },
              modalRef,
              reload,
              createObject,
              addObject
            )
          }
        />
      )}
      <Loading isVisible={loading} text={loadingMessage} />
    </AppContainer>
  );
}
