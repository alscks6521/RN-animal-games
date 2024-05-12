import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import styled from "styled-components/native";
import { auth } from "../../firebaseConfig";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SelectStackScreenList } from "../../stacks/SeletStack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";

// useCallback은 함수를 메모이제이션(memoization)하는 훅이다.
//  메모이제이션이란 이전에 계산한 결과를 메모리에 저장해 두었다가, 동일한 입력이 들어오면 저장해둔 결과를 바로 내어주는 기법
//
// useCallback(fn, deps)에서 deps는 의존성 배열로, 배열 안에 있는 값들 중 하나라도 변경되면 fn 함수를 새로 생성한다.
//  반대로 의존성 배열 안의 값들이 변경되지 않는다면, 이전에 메모이제이션된 함수를 재사용한다.

type Animal = {
  id: string;
  type: string;
  level: number;
  imageUrl: string;
  moveGifUrl: string;
};

// 전체 구역------------------------------------------------------------
const Container = styled(ImageBackground)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffefef;
`;
// A구역 가로정렬------------------------------
const HomeBox = styled(View)`
  background-color: transparent;
  width: 100%;
  height: 100%;
  flex-direction: row;
`;
// A-A구역------------------------------
const LeftBox = styled(View)`
  flex: 1;
  background-color: transparent;
`;
const AnimalNameBox = styled(View)`
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  margin: 5px 0px 0px 5px;
`;
const AnimalName = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  padding: 8px;
`;
// A-B구역------------------------------
const ImageBox = styled(View)`
  flex: 3;
  justify-content: flex-end;
  padding-bottom: 5%;
  position: relative;
`;
const AnimalImage = React.memo(styled(Animated.Image)`
  width: 180px;
  height: 180px;
  position: absolute;
  bottom: 0;
`);

// A-C구역------------------------------
const RightBox = styled(View)`
  flex: 1;
  background-color: transparent;
`;
const StyledButton = styled(TouchableOpacity)`
  background-color: #4fadff;
  border-radius: 15px;
  margin: 5px 0px 0px 5px;
`;
const LevelText = styled(AnimalName)`
  font-size: 18px;
  font-weight: bold;
  color: white;
  padding: 8px;
`;

// B구역 CreateText------------------------------------------------------------
const CreateAccount = styled(Text)`
  color: #4fadff;
  text-decoration: underline;
  text-align: center;
  margin-bottom: 10px;
`;

// 배경
const BGImgDir = require("../../assets/livigbackground.png");

// 캐시 이미지 URI 다운 및 캐시저장
const fetchCachedImage = async (
  // 캐시된 이미지 파일의 URI를 가져오는 함수
  // 캐시에 이미지가 없으면 다운로드하여 캐시에 저장한 후 URI를 반환
  animalType: string,
  imageName: string,
  storage: any // Firebase Storage 인스턴스
) => {
  const fileUri = `${FileSystem.cacheDirectory}${imageName}`; // 캐시 경로와 파일명 조합
  const image = await FileSystem.getInfoAsync(fileUri); // 캐시에 이미지 파일 존재 여부 확인

  if (image.exists) {
    return fileUri;
  } else {
    const imageUrl = await getDownloadURL(
      ref(storage, `${animalType}/${imageName}`)
    );
    await FileSystem.downloadAsync(imageUrl, fileUri);
    return fileUri; // 캐시된 이미지 URI 반환
  }
};

// Gif 애니메이션 URI get
const fetchMoveGifUrl = async (animalType: string, storage: any) => {
  const gifUrl = await getDownloadURL(
    ref(storage, `${animalType}/panda_move.gif`)
  );
  return gifUrl;
};

export default () => {
  const [animal, setAnimal] = useState<Animal | null>(null); // 동물 정보 상태 관리
  const xAnim = useRef(new Animated.Value(0)).current; // 애니메이션을 위한 x 좌표값 관리

  // 네비게이션 객체 가져오기
  const navigation =
    useNavigation<NativeStackNavigationProp<SelectStackScreenList>>();

  // 동물 선택 함수
  const goToSignUp = useCallback(
    () => navigation.navigate("AnimalSelectionScreen"),
    [navigation]
  );

  // Level Up 함수
  const levelUp = useCallback(async () => {
    if (animal) {
      const db = getFirestore();
      const animalDocRef = doc(db, "user_animals", animal.id);
      const newLevel = animal.level + 1;
      await updateDoc(animalDocRef, { level: newLevel });
      fetchSelectedAnimal();
    }
  }, [animal]);

  // 선택한 동물 정보 get 함수
  const fetchSelectedAnimal = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore();
      const storage = getStorage();
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const selectedAnimalId = userData?.selectedAnimalId;

        if (selectedAnimalId) {
          const animalDocRef = doc(
            db,
            "user_animals",
            `${user.uid}_${selectedAnimalId}`
          );
          const animalDoc = await getDoc(animalDocRef);

          if (animalDoc.exists()) {
            const animalData = animalDoc.data();
            const animalType = animalData?.animalId;
            const level = animalData?.level;
            const imageName = `${animalType}${level <= 10 ? "1" : "2"}.png`; // 동물 이미지 캐싱
            const imageUrl = await fetchCachedImage(
              animalType,
              imageName,
              storage
            );
            const moveGifUrl = await fetchMoveGifUrl(animalType, storage);

            // 동물의 정보 Update
            setAnimal({
              id: animalDoc.id,
              type: animalType || "",
              level: level || 0,
              imageUrl,
              moveGifUrl,
            });
          } else {
            setAnimal(null);
          }
        } else {
          setAnimal(null);
        }
      }
    }
  }, []);

  const rotateAnim = useRef(new Animated.Value(0)); // 애니메이션을 위한 회전 값 관리

  // GIF 애니메이션을 시작. 함수
  const startMoveAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(xAnim, {
          toValue: 200,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim.current, {
          toValue: 1,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(xAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [xAnim, rotateAnim]);

  // useFocusEffect을 이용해, 화면에 포커스가 되면 fetchSelectedAnimal 함수를 호출하여 동물 정보를 가져옴
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchSelectedAnimal();
      };
      fetchData();
    }, [fetchSelectedAnimal])
  );

  // useEffect을 이용해, GIF 애니메이션 파일 URL이 있으면 startMoveAnimation 함수를 호출하여 애니메이션 시작
  useEffect(() => {
    if (animal?.moveGifUrl) startMoveAnimation();
  }, [animal?.moveGifUrl, startMoveAnimation]);

  // GIF 애니메이션 이미지 렌더링
  const memoizedMoveImages = useMemo(
    () =>
      animal?.moveGifUrl ? (
        <AnimalImage
          key={0}
          source={{ uri: animal.moveGifUrl }}
          style={{
            transform: [
              {
                translateX: xAnim, // x 좌표 애니메이션 적용
              },
              {
                scaleX: rotateAnim.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, -1], // 회전 애니메이션 적용
                }),
              },
            ],
          }}
          resizeMode="contain"
        />
      ) : null,
    [animal?.moveGifUrl, xAnim, rotateAnim]
  );

  return animal ? (
    <Container source={BGImgDir}>
      <HomeBox>
        <LeftBox>
          <AnimalNameBox>
            <AnimalName>{`Level ${animal.level}`}</AnimalName>
          </AnimalNameBox>
        </LeftBox>
        <ImageBox>{memoizedMoveImages}</ImageBox>
        <RightBox>
          <StyledButton onPress={levelUp}>
            <LevelText>Level Up</LevelText>
          </StyledButton>
        </RightBox>
      </HomeBox>
    </Container>
  ) : (
    <CreateAccount onPress={goToSignUp}>동물 선택</CreateAccount>
  );
};
