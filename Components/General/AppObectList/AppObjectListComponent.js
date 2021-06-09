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
  onFilterEnabled,
  onFilterDisabled,
} from "./AppObjectListHandlers";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FilterButton from "../FilterButton";
import { appColors } from "../../Styles/Colors";

export default function AppObjectListComponent({
  ModalForm,
  createObject,
  addObject,
  getObjects,
  renderItem,
  FilterModal,
  limit = 11,
}) {
  const navigation = useNavigation();
  const modalRef = useRef();
  const filterModalRef = useRef();
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startObject, setStartObject] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [filterObj, setFilterObj] = useState(null);
  const objectsLimit = limit;

  const reload = (filterObj = null) => {
    onFocus(
      { setObjects, setLoading, setStartObject, startObject, filterObj },
      navigation,
      objectsLimit,
      getObjects
    );
  };

  useFocusEffect(
    useCallback(() => {
      FilterModal &&
        navigation.setOptions({
          headerRight: () => (
            <AppIcon
              name="magnify"
              size={40}
              onPress={() => filterModalRef.current.show(true)}
              color={appColors.white}
            />
          ),
        });
      reload();
    }, [])
  );

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
              filterObj,
            },
            objectsLimit,
            getObjects
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
      {FilterModal && (
        <FilterModal
          onFilterEnabled={(filterObj) => {
            onFilterEnabled({ setFilterObj }, filterObj, reload);
          }}
          onFilterDisabled={() => {
            onFilterDisabled({ setFilterObj }, reload);
          }}
          modalRef={filterModalRef}
        />
      )}
      <Loading isVisible={loading} text={loadingMessage} />
    </AppContainer>
  );
}
