import { Platform, Alert } from "react-native";
import * as GoogleSignIn from "expo-google-sign-in";
import * as firebase from "firebase";

export async function googleSignInAsync(setLoading) {
  try {
    await GoogleSignIn.initAsync();
    if (Platform.OS === "android") {
      await GoogleSignIn.askForPlayServicesAsync();
    }
    const { type, user } = await GoogleSignIn.signInAsync();
    if (type === "success") {
      onSignIn(user, setLoading);
      setLoading(false);
      return true;
    } else {
      setLoading(false);
      Alert.alert("Error", JSON.stringify(result));
      return { cancelled: true };
    }
  } catch (error) {
    setLoading(false);
    Alert.alert("Error", error.message);
    return { error: true };
  }
}

function onSignIn(googleUser, setLoading) {
  const unsubscribe = firebase
    .auth()
    .onAuthStateChanged(function (firebaseUser) {
      unsubscribe();
      if (!isUserEqual(googleUser, firebaseUser)) {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.auth.idToken,
          googleUser.auth.accessToken
        );
        setLoading(true);
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(() => {
            setLoading(false);
          })
          .catch(function (error) {
            setLoading(false);
            Alert.alert("Error", error.message);
          });
      } else {
        Alert.alert("Error", "The user is already logged");
      }
    });
}

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    let providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.getBasicProfile().getId()
      ) {
        return true;
      }
    }
  }
  return false;
}
