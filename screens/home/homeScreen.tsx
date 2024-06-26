import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import styled from "styled-components/native";
import HomeContainer from "./homeContainer";
import { auth } from "../../firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

// 전체 구역------------------------------------------------------------
const Container = styled(ImageBackground)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffefef;
`;

// B구역 CreateText------------------------------------------------------------
const CreateAccount = styled(Text)`
  color: #fff;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
`;

// NON 동물선택 상태--------------------------------------------------------
const SelectContainer = styled(View)`
  background-color: rgb(255, 255, 255);
  width: 80%;
  height: 60%;
  border-radius: 15px;
  align-items: center;
  padding: 20px;
`;

const SelectText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const TouchContainer = styled(TouchableOpacity)`
  border: 1px solid #2097ff;
  background-color: #2097ff;
  border-radius: 12px;
  margin-top: 40px;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 40%;
`;

// 배경
const BGImgDir = require("../../assets/livigbackground.png");

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [isAnimalSelected, setIsAnimalSelected] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const checkAnimalSelection = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const selectedAnimalId = userData?.selectedAnimalId;
        setIsAnimalSelected(selectedAnimalId ? true : false);
      } else {
        setIsAnimalSelected(false);
      }
    } else {
      setIsAnimalSelected(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkAnimalSelection();
    }, [checkAnimalSelection])
  );

  const goToAnimalSelection = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("AnimalSelectionScreen");
    }, 2000); // 2초 후에 페이지 전환
  };

  // if (isAnimalSelected === null) {
  //   return (
  //     <Container source={BGImgDir}>
  //       <ActivityIndicator size="large" color="#ffffff" />
  //     </Container>
  //   );
  // }

  return (
    <Container source={BGImgDir}>
      {isAnimalSelected ? (
        <HomeContainer />
      ) : (
        <SafeAreaView>
          <SelectContainer>
            <SelectText>반가워요!</SelectText>
            <SelectText>동물들을 보러 가실래요?</SelectText>
            <TouchContainer onPress={goToAnimalSelection}>
              <CreateAccount>선택하러 가기</CreateAccount>
            </TouchContainer>
          </SelectContainer>
        </SafeAreaView>
      )}
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </Container>
  );
};

export default HomeScreen;
