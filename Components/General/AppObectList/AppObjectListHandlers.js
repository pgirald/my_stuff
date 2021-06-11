import { Alert } from "react-native";

export async function onAddObjectBtnPress(
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
    Alert.alert("Error", "The addition could not be done");
  }
}

export async function onFocus(args, navigation, objectsLimit, getObjects) {
  args.setLoading(true);
  const result = await getObjects(objectsLimit, null, args.filterObj);
  args.setLoading(false);
  if (result.successful) {
    args.setObjects(result.objects);
    args.setStartObject(result.start);
  } else {
    Alert.alert("Error", "Error while getting the data");
    console.log(result.error);
    navigation.goBack();
  }
}

export async function onListEndReached(args, objectsLimit, getObjects) {
  if (!args.scrolling) {
    return;
  }
  if (!args.startObject) {
    return;
  }
  args.setLoading(true);
  const result = await getObjects(
    objectsLimit,
    args.startObject,
    args.filterObj
  );
  args.setLoading(false);
  if (result.successful) {
    args.setStartObject(result.start);
    args.setObjects([...args.objects, ...result.objects]);
  }
}

export function onFilterEnabled(args, filterObj, reload) {
  args.setFilterObj(filterObj);
  return reload(filterObj);
}

export function onFilterDisabled(args, reload) {
  args.setFilterObj(null);
  return reload();
}
