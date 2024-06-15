// HomeScreen.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import HomeContainer from "./homeController";
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
  color: #4fadff;
  text-decoration: underline;
  text-align: center;
  z-index: 100;
  margin-bottom: 10px;
`;

// NON 동물선택 상태--------------------------------------------------------
const SelectContainer = styled(View)`
  background-color: rgb(255, 255, 255);
  width: 80%;
  height: 50%;
  border-radius: 15px;
  align-items: center;
  padding: 20px;
`;

const SelectText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

// 배경
const BGImgDir = require("../../assets/livigbackground.png");

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [isAnimalSelected, setIsAnimalSelected] = useState(false);
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
        setIsAnimalSelected(!!selectedAnimalId);
        console.log("check?,", selectedAnimalId);
      }
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
    }, 3000); // 3초 후에 페이지 전환
  };

  return (
    <Container source={BGImgDir}>
      {isAnimalSelected === undefined || isAnimalSelected === null ? (
        <HomeContainer />
      ) : (
        <SelectContainer>
          <SelectText>반가워요!</SelectText>
          <SelectText>동물들을 보러 가실래요?</SelectText>
          <TouchableOpacity onPress={goToAnimalSelection}>
            <CreateAccount>선택하러 가기</CreateAccount>
          </TouchableOpacity>
        </SelectContainer>
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

// import React, {
//   useState,
//   useCallback,
//   useRef,
//   useMemo,
//   useEffect,
// } from "react";
// import {
//   View,
//   Text,
//   ImageBackground,
//   TouchableOpacity,
//   Animated,
//   Easing,
// } from "react-native";
// import styled from "styled-components/native";
// import { auth } from "../../firebaseConfig";
// import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
// import { getStorage, ref, getDownloadURL } from "firebase/storage";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { SelectStackScreenList } from "../../stacks/SeletStack";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import * as FileSystem from "expo-file-system";

// type Animal = {
//   id: string;
//   type: string;
//   level: number;
//   experience: number;
//   imageUrl: string;
//   moveGifUrl: string;
//   blinkGifUrl: string;
// };

// // 전체 구역------------------------------------------------------------
// const Container = styled(ImageBackground)`
//   flex: 1;
//   justify-content: center;
//   align-items: center;
//   background-color: #ffefef;
// `;
// // A구역 가로정렬------------------------------
// const HomeBox = styled(View)`
//   background-color: transparent;
//   width: 100%;
//   height: 100%;
//   flex-direction: row;
// `;
// // A-A구역------------------------------
// const LeftBox = styled(View)`
//   flex: 1;
//   background-color: transparent;
// `;
// const AnimalNameBox = styled(View)`
//   background-color: rgba(255, 255, 255, 0.7);
//   border-radius: 0px 15px 15px 0px;
//   margin: 10px 0px 0px 0px;
// `;
// const AnimalName = styled(Text)`
//   font-size: 18px;
//   font-weight: bold;
//   padding: 8px;
// `;
// // A-B구역------------------------------
// const ImageBox = styled(View)`
//   flex: 3;
//   justify-content: flex-end;
//   padding-bottom: 5%;
//   position: relative;
// `;
// const AnimalImage = React.memo(styled(Animated.Image)`
//   width: 180px;
//   height: 180px;
//   position: absolute;
//   bottom: 0;
// `);

// // A-C구역------------------------------
// const RightBox = styled(View)`
//   flex: 1;
//   background-color: transparent;
// `;
// const StyledButton = styled(TouchableOpacity)`
//   background-color: #4fadff;
//   border-radius: 15px;
//   margin: 5px 0px 0px 5px;
// `;
// const LevelText = styled(AnimalName)`
//   font-size: 18px;
//   font-weight: bold;
//   color: white;
//   padding: 8px;
// `;

// // B구역 CreateText------------------------------------------------------------
// const CreateAccount = styled(Text)`
//   color: #4fadff;
//   text-decoration: underline;
//   text-align: center;
//   margin-bottom: 10px;
// `;

// // 배경
// const BGImgDir = require("../../assets/livigbackground.png");

// const BubbleContainer = styled.View`
//   flex-direction: column;
//   align-items: center;
//   position: absolute;
//   bottom: 200px;
//   z-index: 1;
// `;

// // 말풍선 스타일 정의
// const SpeechBubble = styled(View)`
//   background-color: #ffffff;
//   padding: 10px 20px;
//   border-radius: 10px;
//   border-width: 1px;
//   border-color: #cccccc;
// `;

// const Tail = styled(View)`
//   width: 20px;
//   height: 20px;
//   background-color: #ffffff;
//   border-left-width: 1px;
//   border-bottom-width: 1px;
//   border-color: #cccccc;
//   transform: rotate(-45deg);
//   margin-top: -10px;
// `;

// const SpeechText = styled(Text)`
//   font-size: 16px;
//   color: #333;
// `;

// const dialogues = [
//   "안녕하세요!",
//   "오늘 하루도 화이팅해요!",
//   "저는 당신의 친구에요.",
//   "함께 행복한 시간 보내요.",
//   "좋은 하루 되세요!",
//   // 더 많은 대화를 추가할 수 있습니다.
// ];

// // 캐시 이미지 URI 다운 및 캐시저장
// const fetchCachedImage = async (
//   animalType: string,
//   imagelevel: string,
//   storage: any
// ) => {
//   const fileUri = `${FileSystem.cacheDirectory}${imagelevel}`;
//   const image = await FileSystem.getInfoAsync(fileUri);

//   if (image.exists) {
//     return fileUri;
//   } else {
//     const imageUrl = await getDownloadURL(
//       ref(storage, `${animalType}/${imagelevel}.png`)
//     );
//     await FileSystem.downloadAsync(imageUrl, fileUri);
//     return fileUri;
//   }
// };

// // Gif 애니메이션 URI get
// const fetchMoveGifUrl = async (
//   animalType: string,
//   animalLevel: string,
//   storage: any
// ) => {
//   const gifUrl = await getDownloadURL(
//     ref(storage, `${animalType}/${animalLevel}/${animalType}_move.gif`)
//   );
//   return gifUrl;
// };

// const fetchBlinkGifUrl = async (
//   animalType: string,
//   animalLevel: string,
//   storage: any
// ) => {
//   const gifUrl = await getDownloadURL(
//     ref(storage, `${animalType}/${animalLevel}/${animalType}_blink.gif`)
//   );
//   return gifUrl;
// };

// export default () => {
//   const [animal, setAnimal] = useState<Animal | null>(null);
//   const [animalSource, setAnimalSource] = useState<string | null>(null);
//   const [showSpeechBubble, setShowSpeechBubble] = useState(false);
//   const [randomDialogue, setRandomDialogue] = useState("");
//   const [moveGif, setMoveGif] = useState(false);

//   const navigation =
//     useNavigation<NativeStackNavigationProp<SelectStackScreenList>>();

//   const goToSignUp = useCallback(
//     () => navigation.navigate("AnimalSelectionScreen"),
//     [navigation]
//   );

//   const handleImageClick = useCallback(() => {
//     const randomIndex = Math.floor(Math.random() * dialogues.length);
//     setRandomDialogue(dialogues[randomIndex]);
//     setShowSpeechBubble(true);

//     // 2.5초 후에 말풍선 숨기기
//     setTimeout(() => {
//       setShowSpeechBubble(false);
//     }, 2500);
//   }, []);

//   const levelUp = useCallback(async () => {
//     if (animal) {
//       const db = getFirestore();
//       const animalDocRef = doc(db, "user_animals", animal.id);
//       const newLevel = animal.level + 1;
//       await updateDoc(animalDocRef, { level: newLevel });
//       fetchSelectedAnimal();
//     }
//   }, [animal]);

//   const eatUp = useCallback(async () => {
//     if (animal) {
//       const db = getFirestore();
//       const animalDocRef = doc(db, "user_animals", animal.id);
//       let addExperience = animal.experience + 10;
//       console.log("animal class :" + animal.experience);

//       if (addExperience >= 100) {
//         console.log("level up!");
//         await levelUp();

//         addExperience = 0;
//       }

//       await updateDoc(animalDocRef, { experience: addExperience });
//       fetchSelectedAnimal();
//     }
//   }, [animal]);

//   const plays = useCallback(async () => {
//     if (animal) {
//       const db = getFirestore();
//       const animalDocRef = doc(db, "user_animals", animal.id);
//       let addExperience = animal.experience + 10;
//       console.log("animal class :" + animal.experience);

//       if (addExperience >= 100) {
//         console.log("level up!");
//         await levelUp();

//         addExperience = 0;
//       }

//       await updateDoc(animalDocRef, { experience: addExperience });
//       fetchSelectedAnimal();

//       setMoveGif(true); // move.gif 실행
//       setTimeout(() => {
//         setMoveGif(false); // 일정 시간 후에 blink로 교체
//       }, 2000); // 2초 후에 교체 (필요에 따라 시간 조정 가능)
//     }
//   }, [animal]);

//   const fetchSelectedAnimal = useCallback(async () => {
//     const user = auth.currentUser;
//     if (user) {
//       const db = getFirestore();
//       const storage = getStorage();
//       const userDocRef = doc(db, "users", user.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         const selectedAnimalId = userData?.selectedAnimalId;

//         if (selectedAnimalId) {
//           const animalDocRef = doc(
//             db,
//             "user_animals",
//             `${user.uid}_${selectedAnimalId}`
//           );
//           const animalDoc = await getDoc(animalDocRef);

//           if (animalDoc.exists()) {
//             const animalData = animalDoc.data();
//             const animalType = animalData?.animalId;
//             const level = animalData?.level;
//             const experience = animalData?.experience;
//             const imagelevel = `${animalType}${level <= 10 ? "1" : "2"}`;

//             const imageUrl = await fetchCachedImage(
//               animalType,
//               imagelevel,
//               storage
//             );
//             const moveGifUrl = await fetchMoveGifUrl(
//               animalType,
//               imagelevel,
//               storage
//             );
//             const blinkGifUrl = await fetchBlinkGifUrl(
//               animalType,
//               imagelevel,
//               storage
//             );

//             setAnimal({
//               id: animalDoc.id,
//               type: animalType || "",
//               level: level || 0,
//               experience: experience || 0,
//               imageUrl,
//               moveGifUrl,
//               blinkGifUrl,
//             });
//           } else {
//             setAnimal(null);
//           }
//         } else {
//           setAnimal(null);
//         }
//       }
//     }
//   }, []);

//   useEffect(() => {
//     console.log("useEffect");
//     if (animal?.blinkGifUrl) {
//       setAnimalSource(animal.blinkGifUrl);
//     }
//   }, [animal?.blinkGifUrl]);

//   useFocusEffect(
//     useCallback(() => {
//       const fetchData = async () => {
//         await fetchSelectedAnimal();
//       };
//       fetchData();
//     }, [fetchSelectedAnimal])
//   );

//   const memoizedMoveImages = useMemo(() => {
//     if (animalSource) {
//       return (
//         <TouchableOpacity onPress={handleImageClick} activeOpacity={0.95}>
//           <AnimalImage
//             key={0}
//             source={{ uri: moveGif ? animal?.moveGifUrl : animal?.blinkGifUrl }}
//             resizeMode="contain"
//           />
//           {showSpeechBubble && (
//             <BubbleContainer>
//               <SpeechBubble>
//                 <SpeechText>{randomDialogue}</SpeechText>
//               </SpeechBubble>
//               <Tail />
//             </BubbleContainer>
//           )}
//         </TouchableOpacity>
//       );
//     }
//     return null;
//   }, [
//     animalSource,
//     handleImageClick,
//     showSpeechBubble,
//     randomDialogue,
//     moveGif,
//     animal,
//   ]);

//   return animal ? (
//     <Container source={BGImgDir}>
//       <HomeBox>
//         <LeftBox>
//           <AnimalNameBox>
//             <AnimalName>{`Level ${animal.level}`}</AnimalName>
//             <AnimalName>{`Xp ${animal.experience}`}</AnimalName>
//           </AnimalNameBox>
//         </LeftBox>
//         <ImageBox>{memoizedMoveImages}</ImageBox>
//         <RightBox>
//           <StyledButton onPress={eatUp}>
//             <LevelText>Eat</LevelText>
//           </StyledButton>
//           <StyledButton onPress={plays}>
//             <LevelText>Play</LevelText>
//           </StyledButton>
//         </RightBox>
//       </HomeBox>
//     </Container>
//   ) : (
//     <CreateAccount onPress={goToSignUp}>동물 선택</CreateAccount>
//   );
// };
