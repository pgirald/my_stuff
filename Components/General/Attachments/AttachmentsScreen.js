import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Input, ListItem } from "react-native-elements";
import { AppButton } from "../../../Components/Buttons/AppButton";
import FloatingButton from "../../../Components/Buttons/FloatingButton";
import { modalButtonStyle } from "../../../Components/Buttons/ModalButtonStyle";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import Loading from "../../../Components/General/Loading";
import Modal from "../../../Components/General/Modal";
import { AppIcon } from "../../../Components/Icons/AppIcon";
import FileItem from "../../../Components/ListItems/FileItem";
import {
  onAddFileBtnPress,
  onFocus,
  onItemPress,
  onListEndReached,
  onUploadIconPress,
} from "./AttachmentsHandlers";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { appColors } from "../../../Components/Styles/Colors";
import { Linking } from "react-native";
import { openFileInBrowser } from "../../../Utils/General/FilesManagement";

export default function AttachmentsScreen({
  navigation,
  ownerId,
  ownerCollection,
}) {
  const reload = () => {
    onFocus(
      { setFiles, setLoading, setStartFile, startFile, path, setPathError },
      filesLimit,
      ownerId,
      ownerCollection
    );
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        navigation.setOptions({ title: "Files", headerRight: null });
        await reload();
      })();
    }, [])
  );

  const fileModalRef = useRef();
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [path, setPath] = useState(null);
  const [pathError, setPathError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [startFile, setStartFile] = useState(null);
  const filesLimit = 11;
  return (
    <AppContainer>
      <FlatList
        data={files}
        keyExtractor={(item, index) => String(index)}
        renderItem={(file) => (
          <FileItem
            file={file.item}
            onPress={(file) =>
              onItemPress({ setLoading }, file, reload, ownerCollection)
            }
          />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() =>
          onListEndReached(
            {
              files,
              setFiles,
              startFile,
              setStartFile,
              setLoading,
            },
            filesLimit,
            ownerId,
            ownerCollection
          )
        }
        initialNumToRender={filesLimit}
      />
      <FloatingButton
        icon={<AppIcon name="plus" />}
        onPress={() => fileModalRef.current.show(true)}
      />
      <Modal modalRef={fileModalRef}>
        <Input
          placeholder="File path"
          value={fileName}
          editable={false}
          errorMessage={pathError}
          rightIcon={
            <AppIcon
              name="file-upload"
              color={appColors.doveGray}
              size={35}
              onPress={() => onUploadIconPress({ setPath, setFileName })}
            />
          }
        />
        <AppButton
          style={modalButtonStyle()}
          title="Add file"
          onPress={() =>
            onAddFileBtnPress(
              {
                fileName,
                path,
                setLoading,
                setPathError,
                setFileName,
              },
              fileModalRef,
              ownerId,
              ownerCollection,
              reload
            )
          }
        />
      </Modal>
      <Loading isVisible={loading} />
    </AppContainer>
  );
}

const styles = StyleSheet.create({});
