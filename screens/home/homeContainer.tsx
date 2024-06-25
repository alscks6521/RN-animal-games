// HomeContainer.tsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import LoadingScreen from "../loadingScreen";
import HomeScreen from "./homeContainerScreen";
import { Animal } from "../../components/HomeTypes";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components";

const AnimalImage = React.memo(styled(Animated.Image)`
  width: 180px;
  height: 180px;
  position: absolute;
  bottom: 0;
`);

const BubbleContainer = styled(View)`
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 200px;
  z-index: 1;
`;

// 말풍선 스타일 정의
const SpeechBubble = styled(View)`
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #cccccc;
`;

const Tail = styled(View)`
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-left-width: 1px;
  border-bottom-width: 1px;
  border-color: #cccccc;
  transform: rotate(-45deg);
  margin-top: -10px;
`;

const SpeechText = styled(Text)`
  font-size: 16px;
  color: #333;
`;

// 캐시 이미지 URI 다운 및 캐시저장
const fetchCachedImage = async (
  animalType: string,
  imagelevel: string,
  storage: any
) => {
  const fileUri = `${FileSystem.cacheDirectory}${imagelevel}`;
  const image = await FileSystem.getInfoAsync(fileUri);

  if (image.exists) {
    return fileUri;
  } else {
    const imageUrl = await getDownloadURL(
      ref(storage, `${animalType}/${imagelevel}.png`)
    );
    await FileSystem.downloadAsync(imageUrl, fileUri);
    return fileUri;
  }
};

// Gif 애니메이션 URI get
const fetchMoveGifUrl = async (
  animalType: string,
  animalLevel: string,
  storage: any
) => {
  const gifUrl = await getDownloadURL(
    ref(storage, `${animalType}/${animalLevel}/${animalType}_move.gif`)
  );
  return gifUrl;
};

const fetchBlinkGifUrl = async (
  animalType: string,
  animalLevel: string,
  storage: any
) => {
  const gifUrl = await getDownloadURL(
    ref(storage, `${animalType}/${animalLevel}/${animalType}_blink.gif`)
  );
  return gifUrl;
};

const dialogues = [
  // "안녕하세요!",
  // "오늘 하루도 화이팅해요!",
  // "저는 당신의 친구에요.",
  // "함께 행복한 시간 보내요.",
  // "좋은 하루 되세요!",
  "교수님! A학점 주세요! 혹시 +도 같이?... 탕탕",
  "리액트네이티브 재밌다",
  "교수님 그 동안 감사했습니다",
];

const HomeContainer: React.FC = () => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [animalSource, setAnimalSource] = useState<string | null>(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [randomDialogue, setRandomDialogue] = useState("");
  const [moveGif, setMoveGif] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  const handleImageClick = useCallback(() => {
    if (showSpeechBubble) return;

    const randomIndex = Math.floor(Math.random() * dialogues.length);
    setRandomDialogue(dialogues[randomIndex]);
    setShowSpeechBubble(true); // 레벨업 모달 표시

    setTimeout(() => {
      setShowSpeechBubble(false);
    }, 1300);
  }, [showSpeechBubble]);

  const showBubble = useCallback(
    (str: string) => {
      if (showSpeechBubble) return; // 말풍선이 보이는 동안 클릭 막기

      setRandomDialogue(str);
      setShowSpeechBubble(true);

      setTimeout(() => {
        setShowSpeechBubble(false);
      }, 1300);
    },
    [showSpeechBubble]
  );

  const levelUp = useCallback(async () => {
    if (animal) {
      const db = getFirestore();
      const animalDocRef = doc(db, "user_animals", animal.id);
      const newLevel = animal.level + 1;
      await updateDoc(animalDocRef, { level: newLevel });

      fetchSelectedAnimal();
      setShowLevelUpModal(true);
    }
  }, [animal]);

  const closeLevelUpModal = useCallback(() => {
    setShowLevelUpModal(false);
  }, []);

  const eatUp = useCallback(async () => {
    if (animal) {
      const db = getFirestore();
      const animalDocRef = doc(db, "user_animals", animal.id);
      let addExperience = animal.experience + 50;

      showBubble("냠냠냠");

      if (addExperience >= 100) {
        await levelUp();
        addExperience = 0;
      }

      await updateDoc(animalDocRef, { experience: addExperience });
      fetchSelectedAnimal();
    }
  }, [animal, showSpeechBubble]);

  const plays = useCallback(async () => {
    if (animal) {
      const db = getFirestore();
      const animalDocRef = doc(db, "user_animals", animal.id);
      let addExperience = animal.experience + 90;

      showBubble("살이 쪄서 걷기 힘드네..");

      if (addExperience >= 100) {
        await levelUp();
        addExperience = 0;
      }

      await updateDoc(animalDocRef, { experience: addExperience });
      fetchSelectedAnimal();

      setMoveGif(true); // move.gif 실행
      setTimeout(() => {
        setMoveGif(false); // 일정 시간 후에 blink로 교체
      }, 2000);
    }
  }, [animal]);

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
            const experience = animalData?.experience;
            const imagelevel = `${animalType}${level <= 10 ? "1" : "2"}`;

            const imageUrl = await fetchCachedImage(
              animalType,
              imagelevel,
              storage
            );
            const moveGifUrl = await fetchMoveGifUrl(
              animalType,
              imagelevel,
              storage
            );
            const blinkGifUrl = await fetchBlinkGifUrl(
              animalType,
              imagelevel,
              storage
            );

            setAnimal({
              id: animalDoc.id,
              type: animalType || "",
              level: level || 0,
              experience: experience || 0,
              imageUrl,
              moveGifUrl,
              blinkGifUrl,
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

  useEffect(() => {
    if (animal?.blinkGifUrl) {
      setAnimalSource(animal.blinkGifUrl);
    }
  }, [animal?.blinkGifUrl]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSelectedAnimal();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    fetchData();
  }, [fetchSelectedAnimal]);

  const memoizedMoveImages = useMemo(() => {
    if (animalSource) {
      return (
        <TouchableOpacity onPress={handleImageClick} activeOpacity={0.95}>
          <AnimalImage
            key={0}
            source={{ uri: moveGif ? animal?.moveGifUrl : animal?.blinkGifUrl }}
            resizeMode="contain"
          />
          {showSpeechBubble && (
            <BubbleContainer>
              <SpeechBubble>
                <SpeechText>{randomDialogue}</SpeechText>
              </SpeechBubble>
              <Tail />
            </BubbleContainer>
          )}
        </TouchableOpacity>
      );
    }
    return null;
  }, [
    animalSource,
    handleImageClick,
    showSpeechBubble,
    randomDialogue,
    moveGif,
    animal,
  ]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <HomeScreen
      animal={animal}
      animalSource={animalSource}
      showSpeechBubble={showSpeechBubble}
      randomDialogue={randomDialogue}
      moveGif={moveGif}
      showLevelUpModal={showLevelUpModal}
      handleImageClick={handleImageClick}
      eatUp={eatUp}
      plays={plays}
      closeLevelUpModal={closeLevelUpModal}
      memoizedMoveImages={memoizedMoveImages}
    />
  );
};

export default HomeContainer;
