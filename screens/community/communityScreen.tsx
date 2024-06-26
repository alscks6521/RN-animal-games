// communityScreen.tsx
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import CommunityContainer from "./communityContainer";
import styled from "styled-components";

export type UserAnimal = {
  id: string;
  displayName: string;
  userId: string;
  animalId: string;
  likes: { [userId: string]: boolean };
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

const ModalContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled(View)`
  background-color: white;
  padding: 20px;
  width: 80%;
  height: 300px;
  border-radius: 10px;
  align-items: center;
`;

const ModalText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const LikeButton = styled(TouchableOpacity)`
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  padding: 0px 30px;
  border: 1px solid gray;
  border-radius: 10px;
`;

const LikeIcon = styled(Image)`
  width: 50px;
  height: 50px;
`;

const CloseButton = styled(LikeButton)`
  position: absolute;
  padding: 10px 50px;
  bottom: 20px;
`;

const imgDir = require("../../assets/rank-title.png");
const likeIconDir = require("../../assets/like-icon.png");
const noLikeIconDir = require("../../assets/no-like-icon.png");

const db = getFirestore();
const auth = getAuth();

const CommunityScreen = () => {
  const [userAnimals, setUserAnimals] = useState<UserAnimal[]>([]);
  const [selectedUserAnimal, setSelectedUserAnimal] =
    useState<UserAnimal | null>(null);
  const [isLiked, setIsLiked] = useState(false);

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
        likes: doc.data().likes || {},
      }));
      setUserAnimals(fetchedUserAnimals);
    });
  };

  const handleUserPress = (userAnimal: UserAnimal) => {
    setSelectedUserAnimal(userAnimal);
    checkIfLiked(userAnimal);
  };

  const checkIfLiked = async (userAnimal: UserAnimal) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      setIsLiked(userAnimal.likes[userId] || false);
    }
  };

  const handleLikePress = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && selectedUserAnimal) {
      const userId = currentUser.uid;
      const userAnimalRef = doc(db, "user_animals", selectedUserAnimal.id);

      if (isLiked) {
        const updatedLikes = { ...selectedUserAnimal.likes };
        delete updatedLikes[userId];
        await updateDoc(userAnimalRef, {
          likes: updatedLikes,
        });
        setIsLiked(false);
        setSelectedUserAnimal((prevUserAnimal) => {
          if (prevUserAnimal) {
            return {
              ...prevUserAnimal,
              likes: updatedLikes,
            };
          }
          return prevUserAnimal;
        });
      } else {
        const updatedLikes = {
          ...selectedUserAnimal.likes,
          [userId]: true,
        };
        await updateDoc(userAnimalRef, {
          likes: updatedLikes,
        });
        setIsLiked(true);
        setSelectedUserAnimal((prevUserAnimal) => {
          if (prevUserAnimal) {
            return {
              ...prevUserAnimal,
              likes: updatedLikes,
            };
          }
          return prevUserAnimal;
        });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ComTitleBox>
        <ComTitle source={imgDir} resizeMode="contain" />
      </ComTitleBox>
      <CommunityContainer
        userAnimals={userAnimals}
        onUserPress={handleUserPress}
      />
      <Modal visible={selectedUserAnimal !== null} transparent>
        <ModalContainer>
          <ModalContent>
            {selectedUserAnimal && (
              <>
                <ModalText>{selectedUserAnimal.displayName}</ModalText>
                <ModalText>
                  동물 타입: {selectedUserAnimal.animalId.toUpperCase()}
                </ModalText>
                <ModalText>레벨: {selectedUserAnimal.level}</ModalText>
                <ModalText>
                  좋아요 수: {Object.keys(selectedUserAnimal.likes).length}
                </ModalText>
                <LikeButton onPress={handleLikePress}>
                  <LikeIcon source={isLiked ? likeIconDir : noLikeIconDir} />
                </LikeButton>
              </>
            )}
            <CloseButton onPress={() => setSelectedUserAnimal(null)}>
              <Text style={{ fontWeight: "600" }}>닫기</Text>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </SafeAreaView>
  );
};

export default CommunityScreen;
