import { useEffect, useState } from "react";
import CommunityScreen from "./communityScreen";
import { auth } from "../../firebaseConfig";
import { User, signOut } from "firebase/auth";
import { Alert, Linking } from "react-native";

export default () => {
  return <CommunityScreen />;
};
