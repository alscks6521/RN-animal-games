// communityScreen.tsx
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import CommunityContainer from "./communityContainer";
import styled from "styled-components";

export type UserAnimal = {
  id: string;
  displayName: string;
  userId: string;
  animalId: string;
  likes: number;
  level: number;
  experience: number;
};

const ComTitleBox = styled(View)`
  align-items: center;
  background-color: transparent;
`;

const ComTitle = styled(Image)`
  height: 120px;
`;

const imgDir = require("../../assets/rank-title.png");

const db = getFirestore();

const CommunityScreen = () => {
  const [userAnimals, setUserAnimals] = useState<UserAnimal[]>([]);

  useEffect(() => {
    const unsubscribe = fetchUserAnimals();
    return () => unsubscribe();
  }, []);

  const fetchUserAnimals = () => {
    const q = query(collection(db, "user_animals"), orderBy("level", "desc"));
    return onSnapshot(q, (snapshot) => {
      const fetchedUserAnimals: UserAnimal[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        animalId: doc.data().animalId,
        level: doc.data().level,
        experience: doc.data().experience,
        displayName: doc.data().displayName,
        likes: doc.data().likes,
      }));
      setUserAnimals(fetchedUserAnimals);
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ComTitleBox>
        <ComTitle source={imgDir} resizeMode="contain" />
      </ComTitleBox>
      <CommunityContainer userAnimals={userAnimals} />
    </SafeAreaView>
  );
};

export default CommunityScreen;
