import { Alert } from "react-native";

export async function onAddProjectBtnPress(
  args,
  modalRef,
  reload,
  createObject,
  addObject
) {
  const objectMap = createObject(args.objectData);
  args.setLoading(true);
  const result = await addObject(objectMap);
  args.setLoading(false);
  if (result.successful) {
    await reload();
    modalRef.current.show(false);
  } else {
    console.log(result.error);
    Alert.alert("Error", "The addition could not be done");
  }
}

export async function onFocus(args, navigation, objectsLimit, getObjects) {
  args.setLoading(true);
  const result = await getObjects(objectsLimit);
  args.setLoading(false);
  if (result.successful) {
    args.setObjects(result.objects);
    args.setStartObject(result.start);
  } else {
    console.log(result.error);
    Alert.alert("Error", "Error while getting the data");
    navigation.goBack();
  }
}

export async function onListEndReached(args, objectsLimit, getMoreObjects) {
  if (!args.scrolling) {
    return;
  }
  if (!args.startObject) {
    return;
  }
  args.setLoading(true);
  const result = await getMoreObjects(objectsLimit, args.startObject);
  args.setLoading(false);
  if (result.successful) {
    args.setStartObject(result.start);
    args.setObjects([...args.objects, ...result.objects]);
  }
}
