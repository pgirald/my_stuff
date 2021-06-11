import { firebaseApp } from "./Firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import { FireSQL } from "firesql";
import { fileToBlob } from "../General/FilesManagement";
import {
  getToken,
  generateNotificationMessage,
  sendPushNotification,
} from "../General/Communication";
import { filter, result } from "lodash";

//Storage link:
// service firebase.storage {
// 	match /b/{bucket}/o {
// 	  match /{allPaths=**} {
// 		allow read, write: if request.auth != null;
// 	  }
// 	}
//   }

const db = firebase.firestore(firebaseApp);

export const onStateChagedListener = (listener) => {
  return firebase.auth().onAuthStateChanged(listener);
};

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};

export const closeSession = () => {
  return firebase.auth().signOut();
};

export const registerUser = async (email, password) => {
  const result = { successful: true, error: null };
  try {
    const registeredUserId = (
      await firebase.auth().createUserWithEmailAndPassword(email, password)
    ).user.uid;
    const token = await getToken();
    await db
      .collection("Tokens")
      .doc(registeredUserId)
      .set({ token: token, uid: registeredUserId });
  } catch (error) {
    result.successful = false;
    result.error =
      "There is already a registered user with the specified email.";
  }
  return result;
};

export const loginWithEmailAndPassword = async (email, password) => {
  const result = { successful: true, error: null };
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const uploadFile = async (fileUri, path, name) => {
  const result = { successful: false, error: null, url: null };
  const reference = firebase.storage().ref(path).child(name);
  const blob = await fileToBlob(fileUri);
  try {
    await reference.put(blob);
    const url = await firebase
      .storage()
      .ref(path + "/" + name)
      .getDownloadURL();
    result.successful = true;
    result.url = url;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const updateProfile = async (data) => {
  const result = { successful: true, error: null };
  try {
    await firebase.auth().currentUser.updateProfile(data);
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const updateEmail = async (email) => {
  const result = { successful: true, error: null };
  try {
    await firebase.auth().currentUser.updateEmail(email);
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const updatePassword = async (password) => {
  const result = { successful: false, error: null };
  try {
    await firebase.auth().currentUser.updatePassword(password);
  } catch (error) {
    result.successful = true;
    result.error = error;
  }
  return result;
};

export const reAuthenticate = async (password) => {
  const result = { successful: true, error: null };
  const user = getCurrentUser();
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
  try {
    await user.reauthenticateWithCredential(credentials);
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const addDocumentWithoutId = async (collectionRef, data) => {
  const result = { successful: true, error: null };
  try {
    const docRef = await collectionRef.add(data);
    data.id = docRef.id;
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

/*export const getPagedData = async (query) => {
  const result = {
    successful: true,
    error: null,
    objects: [],
    start: null,
  };
  try {
    const response = await query.get();
    if (response.docs.length > 0) {
      result.start = response.docs[response.docs.length - 1].data();
    }
    response.forEach((doc) => {
      const object = doc.data();
      object.id = doc.id;
      result.objects.push(object);
    });
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};*/

export const addProject = async (project) => {
  const result = { successful: true, error: null };
  const batch = db.batch();
  project.participants = [getCurrentUser().uid];
  try {
    const newProjectDocRef = db.collection("Projects").doc();
    batch.set(newProjectDocRef, project);
    const projectParticipants = newProjectDocRef
      .collection("ProjectParticipants")
      .doc();
    batch.set(
      projectParticipants,
      generateParticipant(newProjectDocRef.id, "owner")
    );
    await batch.commit();
    project.id = newProjectDocRef.id;
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

const generateParticipant = (projectId, role) => {
  const user = getCurrentUser();
  const namesRegex = /^([A-Za-z ]+)@([A-Za-z ]+)/;
  const names = user.displayName && user.displayName.match(namesRegex);
  const phoneRegex = /\+([0-9]+) ([0-9]+) ([A-Z]+)$/;
  const phone = user.displayName && user.displayName.match(phoneRegex);
  return {
    projectId: projectId,
    email: user.email,
    role: role,
    creationDate: new Date(),
    name: names && names[1] + "@" + names[2],
    phone: phone && "+" + phone[1] + " " + phone[2],
    photoUrl: user.photoURL,
    uid: user.uid,
  };
};

export const getProjects = async (currentUserId, limit, start, filterObj) => {
  const result = { successful: true, objects: [], error: null, start: null };
  filterObj ||
    (filterObj = {
      orderFields: [{ name: "creationDate", direction: "DESC" }],
    });
  filterObj.participants = ["CONTAINS", `'${currentUserId}'`];
  try {
    const projects = await getData(
      db,
      "Projects",
      filterObj,
      start && {
        start,
        field: "creationDate",
      },
      limit,
      false
    );
    if (projects.length == 0) {
      return result;
    }
    let projectsIds = `('${projects[0].id}'`;
    for (let i = 1; i < projects.length; i++) {
      projectsIds += `, '${projects[i].id}'`;
    }
    projectsIds += ")";
    filterObj = {
      orderFields: [{ name: "creationDate", direction: "DESC" }],
      uid: ["=", `'${currentUserId}'`],
      projectId: ["IN", projectsIds],
    };
    const participants = await getData(
      db,
      "ProjectParticipants",
      filterObj,
      null,
      null,
      true
    );
    result.objects = projects.map((project) => {
      return {
        role: participants.find(
          (participant) => participant.projectId == project.id
        ).role,
        project,
      };
    });
    result.start = result.objects[result.objects.length - 1].project;
    return result;
  } catch (error) {
    result.error = error;
    result.successful = false;
  }
  return result;
};

export const updateProject = (id, data) => {
  return updateDocument(db.collection("Projects"), id, data);
};

export const updateDocument = async (collectionRef, docName, data) => {
  const result = { successful: true, error: null };
  try {
    await collectionRef.doc(docName).update(data);
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const deleteProject = (id) => {
  return deleteDocument(db.collection("Projects"), id);
};

export const deleteDocument = async (collectionRef, docName) => {
  const result = { successful: true, error: null };
  try {
    await collectionRef.doc(docName).delete();
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const addFile = (file, ownerCollection) => {
  return addDocumentWithoutId(
    db.collection(ownerCollection).doc(file.ownerId).collection("Files"),
    file
  );
};

export const getFiles = (ownerId, ownerCollection, limit, start, filterObj) => {
  const collRef = db.collection(ownerCollection).doc(ownerId);
  return getPagedData(collRef, "Files", filterObj, start, limit, "uploadDate");
};

export const deleteFile = async (file, ownerCollection) => {
  const result = await deleteDocument(
    db.collection(ownerCollection).doc(file.ownerId).collection("Files"),
    file.id
  );
  if (!result.successful) {
    return result;
  }
  const reference = firebase.storage().ref("files").child(file.name);
  try {
    await reference.delete();
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const addActivity = async (activity) => {
  const result = { successful: true, error: null };
  try {
    const projectDocRef = db.collection("Projects").doc(activity.projectId);
    const newActivityDocRef = projectDocRef.collection("Activities").doc();
    await db.runTransaction(async (transaction) => {
      const projectDoc = await transaction.get(projectDocRef);
      const projectData = projectDoc.data();
      const activityDocRef = await transaction.set(newActivityDocRef, activity);
      activity.id = activityDocRef.id;
      if (projectData.done) {
        projectData.completionDate = null;
        projectData.done = false;
      }
      projectData.activitiesCount += 1;
      await transaction.update(projectDocRef, projectData);
    });
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const getActivities = (projectId, limit, start, filterObj) => {
  const collRef = db.collection("Projects").doc(projectId);
  return getPagedData(
    collRef,
    "Activities",
    filterObj,
    start,
    limit,
    "creationDate"
  );
};

export const deleteActivity = async (activity) => {
  const result = { successful: true, error: null };
  try {
    const projectDocRef = db.collection("Projects").doc(activity.projectId);
    const activityDocRef = projectDocRef
      .collection("Activities")
      .doc(activity.id);
    await db.runTransaction(async (transaction) => {
      const projectDoc = await transaction.get(projectDocRef);
      const projectData = projectDoc.data();
      await transaction.delete(activityDocRef);
      projectData.activitiesCount -= 1;
      if (activity.done) {
        projectData.doneActivitiesCount -= 1;
      }
      if (projectData.activitiesCount === projectData.doneActivitiesCount) {
        projectData.done = true;
        projectData.completionDate = new Date();
      }
      await transaction.update(projectDocRef, projectData);
    });
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const updateActivity = async (activity, data, previusData) => {
  const result = { successful: true, error: null };
  try {
    const projectDocRef = db.collection("Projects").doc(activity.projectId);
    const activityDocRef = projectDocRef
      .collection("Activities")
      .doc(activity.id);
    await db.runTransaction(async (transaction) => {
      const projectDoc = await transaction.get(projectDocRef);
      if (previusData.done === data.done) {
        await transaction.update(activityDocRef, data);
        return;
      }
      const projectData = projectDoc.data();
      const now = new Date();
      if (previusData.done === false && data.done === true) {
        data.completionDate = now;
        projectData.doneActivitiesCount += 1;
        if (projectData.activitiesCount === projectData.doneActivitiesCount) {
          projectData.done = true;
          projectData.completionDate = now;
        }
      } else {
        data.completionDate = null;
        projectData.doneActivitiesCount -= 1;
        if (projectData.done) {
          projectData.done = false;
          projectData.completionDate = null;
        }
      }
      await transaction.update(activityDocRef, data);
      await transaction.update(projectDocRef, projectData);
    });
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const addTask = async (task) => {
  const result = { successful: true, error: null };
  try {
    const activityDocRef = db
      .collection(task.activitiesRoute)
      .doc(task.activityId);
    const newTaskDocRef = activityDocRef.collection("Tasks").doc();
    await db.runTransaction(async (transaction) => {
      const activityDoc = await transaction.get(activityDocRef);
      const activityData = activityDoc.data();
      const taskDocRef = await transaction.set(newTaskDocRef, task);
      task.id = taskDocRef.id;
      activityData.tasksCount += 1;
      await transaction.update(activityDocRef, activityData);
    });
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const getTasks = (
  activitiesRoute,
  activityId,
  limit,
  start,
  filterObj
) => {
  const collRef = db.collection(activitiesRoute).doc(activityId);
  return getPagedData(
    collRef,
    "Tasks",
    filterObj,
    start,
    limit,
    "creationDate"
  );
};

const getTasksQuery = (activitiesRoute, activityId, limit, start, taskName) => {
  const query = taskName
    ? db
        .collection(activitiesRoute)
        .doc(activityId)
        .collection("Tasks")
        .where("name", "==", taskName)
    : db.collection(activitiesRoute).doc(activityId).collection("Tasks");
  return start
    ? query
        .orderBy("creationDate", "desc")
        .startAfter(start.creationDate)
        .limit(limit)
    : query.orderBy("creationDate", "desc").limit(limit);
};

export const deleteTask = async (task) => {
  const result = { successful: true, error: null };
  try {
    const activityDocRef = db
      .collection(task.activitiesRoute)
      .doc(task.activityId);
    const taskDocRef = activityDocRef.collection("Tasks").doc(task.id);
    await db.runTransaction(async (transaction) => {
      const activityDoc = await transaction.get(activityDocRef);
      const activityData = activityDoc.data();
      await transaction.delete(taskDocRef);
      activityData.tasksCount -= 1;
      if (task.done) {
        activityData.doneTasksCount -= 1;
      }
      await transaction.update(activityDocRef, activityData);
    });
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const updateTask = async (task, data, previusData) => {
  const result = { successful: true, error: null };
  try {
    const activityDocRef = db
      .collection(task.activitiesRoute)
      .doc(task.activityId);
    const taskDocRef = activityDocRef.collection("Tasks").doc(task.id);
    await db.runTransaction(async (transaction) => {
      const activityDoc = await transaction.get(activityDocRef);
      if (previusData.done === data.done) {
        await transaction.update(taskDocRef, data);
        return;
      }
      const activityData = activityDoc.data();
      const now = new Date();
      if (previusData.done === false && data.done === true) {
        data.completionDate = now;
        activityData.doneTasksCount += 1;
      } else {
        data.completionDate = null;
        activityData.doneTasksCount -= 1;
      }
      await transaction.update(taskDocRef, data);
      await transaction.update(activityDocRef, activityData);
    });
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const getParticipants = (projectId, limit, start, filterObj) => {
  const collRef = db.collection("Projects").doc(projectId);
  return getPagedData(
    collRef,
    "ProjectParticipants",
    filterObj,
    start,
    limit,
    "creationDate"
  );
};

export const acceptRequest = async (acceptedRequest) => {
  const result = { successful: true, error: null };
  const projectDocRef = db
    .collection("Projects")
    .doc(acceptedRequest.projectId);
  const newParticipantDocRef = db
    .collection("Projects")
    .doc(acceptedRequest.projectId)
    .collection("ProjectParticipants")
    .doc();
  const acceptedRequestDocRef = db
    .collection("Requests")
    .doc(acceptedRequest.id);
  const newNotificationDocRef = db
    .collection("Projects")
    .doc(acceptedRequest.projectId)
    .collection("Notifications")
    .doc();
  const batch = db.batch();
  batch.update(projectDocRef, {
    participants: firebase.firestore.FieldValue.arrayUnion(
      getCurrentUser().uid
    ),
  });
  batch.set(
    newParticipantDocRef,
    generateParticipant(acceptedRequest.projectId, acceptedRequest.proposedRole)
  );
  batch.delete(acceptedRequestDocRef);
  batch.set(newNotificationDocRef, {
    projectId: acceptedRequest.projectId,
    creationDate: new Date(),
    text: acceptedRequest.receiverEmail + " has joined",
    email: acceptedRequest.receiverEmail,
    action: "joined",
  });
  try {
    await batch.commit();
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const ejectParticipant = async (projectId, participant) => {
  const result = { successful: true, error: null };
  const projectDocRef = db.collection("Projects").doc(projectId);
  const participantDocRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("ProjectParticipants")
    .doc(participant.id);
  const newNotificationDocRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("Notifications")
    .doc();
  const batch = db.batch();
  batch.update(projectDocRef, {
    participants: firebase.firestore.FieldValue.arrayRemove(participant.uid),
  });
  batch.delete(participantDocRef);
  batch.set(newNotificationDocRef, {
    projectId: projectId,
    creationDate: new Date(),
    text:
      participant.email === getCurrentUser().email
        ? participant.email + " has left"
        : participant.email + " has been ejected",
    email: participant.email,
    action: participant.email === getCurrentUser().email ? "left" : "ejected",
  });
  try {
    await batch.commit();
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const updateParticipantRole = async (
  projectId,
  participant,
  newRole
) => {
  const result = { successful: true, error: null };
  const participantDocRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("ProjectParticipants")
    .doc(participant.id);
  const newNotificationDocRef = db
    .collection("Projects")
    .doc(projectId)
    .collection("Notifications")
    .doc();
  const batch = db.batch();
  batch.update(participantDocRef, { role: newRole });
  batch.set(newNotificationDocRef, {
    projectId: projectId,
    creationDate: new Date(),
    text: participant.email + " is now a " + newRole,
    email: participant.email,
    action: "change to " + newRole,
  });
  try {
    await batch.commit();
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const getRequests = (limit, start, filterObj) => {
  return getPagedData(db, "Requests", filterObj, start, limit, "creationDate");
};

export const addRequest = async (requestData) => {
  const result = await isRequestEmailValid(
    requestData.receiverEmail,
    requestData.projectId
  );
  if (!result.successful) {
    return result;
  }
  return await addDocumentWithoutId(db.collection("Requests"), requestData);
};

const isRequestEmailValid = async (requestEmail, projectId) => {
  try {
    const response = await firebase
      .auth()
      .fetchSignInMethodsForEmail(requestEmail);
    if (response.length === 0) {
      return { successful: false, error: "The specified email is not valid" };
    }
    let docs = await db
      .collection("Requests")
      .where("receiverEmail", "==", requestEmail)
      .where("projectId", "==", projectId)
      .get();
    if (!docs.empty) {
      return {
        successful: false,
        error:
          "A request to the specified participant to join to this project has already been sent",
      };
    }
    docs = await db
      .collection("Projects")
      .doc(projectId)
      .collection("ProjectParticipants")
      .where("email", "==", requestEmail)
      .get();
    if (!docs.empty) {
      return {
        successful: false,
        error:
          "A participant with the specified email is already in the project",
      };
    }
  } catch (error) {
    return { successful: false, error: error };
  }
  return { successful: true, error: null };
};

export const denyRequest = async (requestId) => {
  return await deleteDocument(db.collection("Requests"), requestId);
};

export const getNotifications = (projectId, limit, start, filterObj) => {
  const collRef = db.collection("Projects").doc(projectId);
  return getPagedData(
    collRef,
    "Notifications",
    filterObj,
    start,
    limit,
    "creationDate"
  );
};

export const sendNotifications = async (
  projectId,
  projectName,
  messageBody
) => {
  const result = { successful: true, error: null };
  try {
    const participantsDocs = await db
      .collection("Projects")
      .doc(projectId)
      .collection("ProjectParticipants")
      .get();
    const ids = [];
    participantsDocs.forEach((participantDoc) => {
      ids.push(participantDoc.data().uid);
    });
    const tokensDocs = await db
      .collection("Tokens")
      .where("uid", "in", ids)
      .get();
    const messages = [];
    tokensDocs.forEach((tokenDoc) => {
      messages.push(
        generateNotificationMessage(
          tokenDoc.data().token,
          projectName,
          messageBody,
          null
        )
      );
    });
    const results = await Promise.all(
      messages.map((message) => sendPushNotification(message))
    );
    if (results.some((result) => result === false)) {
      result.successful = false;
      result.error = "it was not possible to send all the notifications";
    }
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const recoverPassword = async (email) => {
  const result = { successful: true, error: null };
  try {
    await firebase.auth().sendPasswordResetEmail(email);
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

const getData = (
  ref,
  collectionName,
  filterObj,
  offset,
  limit,
  isGroup = false
) => {
  const fireSql = new FireSQL(ref, { includeId: "id" });
  let sql = `SELECT * FROM${isGroup ? " GROUP" : ""} ${collectionName}`;
  if (offset) {
    if (filterObj) {
      filterObj[offset.field] = [">", offset.start[offset.field]];
    } else {
      filterObj = { [offset.field]: [">", offset.start[offset.field]] };
    }
  }
  let firstTime = true;
  i = 0;
  for (const key in filterObj) {
    if (key === "orderFields") {
      continue;
    }
    if (firstTime) {
      sql += ` WHERE ${key} ${filterObj[key][0]} ${filterObj[key][1]}`;
      firstTime = false;
      i = 2;
    }
    for (i; i < filterObj[key].length; i += 2) {
      sql += ` AND ${key} ${filterObj[key][i]} ${filterObj[key][i + 1]}`;
    }
    i = 0;
  }
  if (filterObj.orderFields) {
    let orderFields = `${filterObj.orderFields[0].name} ${filterObj.orderFields[0].direction}`;
    for (var i = 1; i < filterObj.orderFields.length; i++) {
      orderFields += `, ${filterObj.orderFields[i].name} ${filterObj.orderFields[i].direction}`;
    }
    sql += ` ORDER BY ${orderFields}`;
    limit && (sql += ` LIMIT ${limit}`);
  }
  return fireSql.query(sql);
};

const getPagedData = async (
  ref,
  collectionName,
  filterObj,
  start,
  limit,
  defaultOrderField,
  isGroup = false
) => {
  const result = { successful: true };
  filterObj || (filterObj = {});
  if (!filterObj.orderFields) {
    filterObj.orderFields = [{ name: defaultOrderField, direction: "DESC" }];
  }
  try {
    result.objects = await getData(
      ref,
      collectionName,
      filterObj,
      start && { start: start, field: defaultOrderField },
      limit,
      isGroup
    );
    result.start = result.objects[result.objects.length - 1];
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};
