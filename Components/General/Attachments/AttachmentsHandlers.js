import { isEmpty } from "lodash";
import { Alert } from "react-native";
import {
  getFileType,
  loadFileFromExplorer,
  openFileInBrowser,
} from "../../../Utils/General/FilesManagement";
import {
  addFile,
  getFiles,
  uploadFile,
  deleteFile,
} from "../../../Utils/Persistence/Actions";

export async function onAddFileBtnPress(
  args,
  modalRef,
  ownerId,
  ownerCollection,
  reload
) {
  if (isEmpty(args.path)) {
    args.setPathError("You must specify a valid path");
    return;
  }
  args.setPathError(null);
  let uploadDate = new Date();
  const file = {
    name: "(" + uploadDate + ") " + args.fileName,
    displayName: args.fileName,
    uploadDate: uploadDate,
    ownerId: ownerId,
    downloadUrl: null,
    type: getFileType(args.fileName),
  };
  args.setLoading(true);
  let result = await uploadFile(args.path, "files", file.name);
  if (result.successful) {
    file.downloadUrl = result.url;
  } else {
    args.setLoading(false);
    Alert.alert("Error", "There was an error while uploading the file");
    return;
  }
  result = await addFile(file, ownerCollection);
  args.setLoading(false);
  if (result.successful) {
    args.setFileName("");
    await reload();
    modalRef.current.show(false);
  } else {
    Alert.alert("Error", "There was an error while adding the file");
  }
}

export async function onFocus(args, filesLimit, ownerId, ownerCollection) {
  args.setLoading(true);
  const result = await getFiles(ownerId, ownerCollection, filesLimit);
  args.setLoading(false);
  if (result.successful) {
    args.setFiles(result.objects);
    args.setStartFile(result.start);
  } else {
    Alert.alert("Error", "Error while getting the project files");
  }
}

export async function onListEndReached(
  args,
  filesLimit,
  ownerId,
  ownerCollection
) {
  if (!args.startFile) {
    return;
  }
  args.setLoading(true);
  const result = await getFiles(
    ownerId,
    ownerCollection,
    filesLimit,
    args.startFile
  );
  args.setLoading(false);
  if (result.successful) {
    args.setStartFile(result.start);
    args.setFiles([...args.files, ...result.objects]);
  }
}

export async function onUploadIconPress(args) {
  const result = await loadFileFromExplorer();
  if (result.successful) {
    args.setPath(result.uri);
    args.setFileName(result.name);
  }
}

export function onItemPress(args, file, reload, ownerCollection) {
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
