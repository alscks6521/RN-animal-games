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
//   border-radius: 15px;
//   margin: 5px 0px 0px 5px;
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
//   const xAnim = useRef(new Animated.Value(0)).current;
//   const [animalSource, setAnimalSource] = useState<string | null>(null);

//   const navigation =
//     useNavigation<NativeStackNavigationProp<SelectStackScreenList>>();

//   const goToSignUp = useCallback(
//     () => navigation.navigate("AnimalSelectionScreen"),
//     [navigation]
//   );

//   const levelUp = useCallback(async () => {
//     if (animal) {
//       const db = getFirestore();
//       const animalDocRef = doc(db, "user_animals", animal.id);
//       const newLevel = animal.level + 1;
//       await updateDoc(animalDocRef, { level: newLevel });
//       fetchSelectedAnimal();
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
//   const rotateAnim = useRef(new Animated.Value(0)); // 애니메이션을 위한 회전 값 관리

//   const startMoveAnimation = useCallback(() => {
//     let curn = Math.floor(Math.random() * 150) + 50; // 50부터 200까지의 랜덤한 값
//     console.log(curn);
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(xAnim, {
//           toValue: 0,
//           duration: 1000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//         Animated.timing(xAnim, {
//           toValue: 1,
//           duration: 900,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//         Animated.timing(xAnim, {
//           toValue: curn,
//           duration: 3000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//         Animated.timing(rotateAnim.current, {
//           toValue: 1,
//           duration: 0,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),

//         Animated.timing(xAnim, {
//           toValue: 0,
//           duration: 3000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, [xAnim]);

//   useEffect(() => {
//     if (animal?.moveGifUrl && animal?.blinkGifUrl) {
//       xAnim.addListener(({ value }) => {
//         if (value === 0) {
//           setAnimalSource(animal.blinkGifUrl);
//         } else {
//           setAnimalSource(animal.moveGifUrl);
//         }
//       });

//       return () => {
//         xAnim.removeAllListeners();
//       };
//     }
//   }, [animal?.moveGifUrl, animal?.blinkGifUrl, xAnim]);

//   useFocusEffect(
//     useCallback(() => {
//       const fetchData = async () => {
//         await fetchSelectedAnimal();
//       };
//       fetchData();
//     }, [fetchSelectedAnimal])
//   );

//   useEffect(() => {
//     if (animal?.moveGifUrl) startMoveAnimation();
//   }, [animal?.moveGifUrl, startMoveAnimation]);

//   const memoizedMoveImages = useMemo(() => {
//     if (animalSource) {
//       return (
//         <AnimalImage
//           key={0}
//           source={{ uri: animalSource }}
//           style={{
//             transform: [
//               {
//                 translateX: xAnim,
//               },
//               {
//                 scaleX: rotateAnim.current.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [1, -1],
//                 }),
//               },
//             ],
//           }}
//           resizeMode="contain"
//         />
//       );
//     }
//     return null;
//   }, [animalSource, xAnim, rotateAnim]);

//   return animal ? (
//     <Container source={BGImgDir}>
//       <HomeBox>
//         <LeftBox>
//           <AnimalNameBox>
//             <AnimalName>{`Level ${animal.level}`}</AnimalName>
//           </AnimalNameBox>
//         </LeftBox>
//         <ImageBox>{memoizedMoveImages}</ImageBox>
//         <RightBox>
//           <StyledButton onPress={levelUp}>
//             <LevelText>Level Up</LevelText>
//           </StyledButton>
//         </RightBox>
//       </HomeBox>
//     </Container>
//   ) : (
//     <CreateAccount onPress={goToSignUp}>동물 선택</CreateAccount>
//   );
// };
