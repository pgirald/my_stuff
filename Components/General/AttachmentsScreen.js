import React, { useCallback, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import { AppIcon } from "../Icons/AppIcon";
import FileItem from "../ListItems/FileItem";
import { appColors } from "../Styles/Colors";
import {
  getFileType,
  loadFileFromExplorer,
  openFileInBrowser,
} from "../../Utils/General/FilesManagement";
import AppObjectListComponent from "./AppObectList/AppObjectListComponent";
import NameFilterModal from "./NameFilterModal";
import {
  addFile,
  deleteFile,
  getFiles,
  uploadFile,
} from "../../Utils/Persistence/Actions";
import ModalForm from "./ModalForm";
import { isEmpty } from "lodash";

export default function AttachmentsScreen({
  navigation,
  ownerId,
  ownerCollection,
}) {
  return (
    <AppObjectListComponent
      options={{ title: "Files" }}
      navigation={navigation}
      addObject={insertFile}
      createObject={createFile}
      ModalForm={(args) => AddFileForm({ ...args, ownerCollection, ownerId })}
      FilterModal={(args) =>
        NameFilterModal({ ...args, fieldName: "displayName" })
      }
      getObjects={(limit, start, filterObj) =>
        getFiles(ownerId, ownerCollection, limit, start, filterObj)
      }
      renderItem={(file, { setLoading, reload }) => (
        <FileItem
          file={file.item}
          onPress={(file) =>
            onItemPress({ setLoading }, file, reload, ownerCollection)
          }
        />
      )}
    />
  );
}

function onItemPress(args, file, reload, ownerCollection) {
  Alert.alert("", "What do you want to do with " + file.name + "?", [
    { text: "Nothing", style: "cancel" },
    {
      text: "Delete",
      onPress: () =>
        deleteSelectedFile(args.setLoading, file, reload, ownerCollection),
    },
    { text: "Open", onPress: () => openFile(file.downloadUrl) },
  ]);
}

async function openFile(url) {
  const result = await openFileInBrowser(url);
  if (!result.successful) {
    Alert.alert(
      "Error",
      "There was an error while opening the default web browser"
    );
  }
}

async function deleteSelectedFile(setLoading, file, reload, ownerCollection) {
  setLoading(true);
  const result = await deleteFile(file, ownerCollection);
  setLoading(false);
  if (result.successful) {
    await reload();
    Alert.alert("Nice!", "The file was successfully deleted");
  } else {
    Alert.alert("Error", "There was an error while deleting the file");
  }
}

function AddFileForm({ modalRef, onConfirm, ownerCollection, ownerId }) {
  const [fileName, setFileName] = useState(null);
  const [pathError, setPathError] = useState(undefined);
  const [path, setPath] = useState(null);
  return (
    <ModalForm
      modalRef={modalRef}
      btnText="Add file"
      onConfirm={onConfirmBtnPress}
    >
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
    </ModalForm>
  );
  function onConfirmBtnPress() {
    if (isEmpty(path)) {
      setPathError("You must specify a valid path");
      return;
    }
    setPathError(null);
    onConfirm({ ownerCollection, path, name: fileName, ownerId });
  }
  async function onUploadIconPress() {
    const result = await loadFileFromExplorer();
    if (result.successful) {
      setPath(result.uri);
      setFileName(result.name);
    }
  }
}

const createFile = (fileData) => {
  const uploadDate = new Date();
  return {
    ownerCollection: fileData.ownerCollection,
    path: fileData.path,
    file: {
      name: fileData.name + "(" + uploadDate + ") ",
      displayName: fileData.name,
      uploadDate: uploadDate,
      ownerId: fileData.ownerId,
      downloadUrl: null,
      type: getFileType(fileData.name),
    },
  };
};

const insertFile = async (fileInfo) => {
  const file = fileInfo.file;
  let result = await uploadFile(fileInfo.path, "Files", file.name);
  if (result.successful) {
    file.downloadUrl = result.url;
  } else {
    return result;
  }
  result = await addFile(file, fileInfo.ownerCollection);
  return result;
};

const styles = StyleSheet.create({});
