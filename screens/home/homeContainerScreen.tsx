// HomeScreen.tsx
import React from "react";
import {
  SafeAreaView,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import styled from "styled-components/native";
import { Animal } from "../../components/HomeTypes";

const ModalContainer = styled(View)`
  flex: 1;

  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled(View)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

const ModalTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ModalMessage = styled(Text)`
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`;

const ModalButton = styled(TouchableOpacity)`
  background-color: #007aff;
  padding: 10px 20px;
  border-radius: 5px;
`;

const ModalButtonText = styled(Text)`
  color: white;
  font-size: 16px;
  font-weight: bold;
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
  border-radius: 0px 15px 15px 0px;
  margin: 10px 0px 0px 0px;
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
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;
const EatStyledButton = styled(TouchableOpacity)`
  background-color: #4fadff;
  border-radius: 12px;
  width: 100px;
  z-index: 99;
  padding: 15px 0px;
  margin: 10px 0px 0px 0px;
`;

const PlayStyledButton = styled(EatStyledButton)`
  background-color: #4bd852;
`;

const LevelText = styled(AnimalName)`
  font-size: 18px;
  font-weight: bold;
  color: white;
  padding: 8px;
`;

const BubbleContainer = styled.View`
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

interface HomeScreenProps {
  animal: Animal | null;
  animalSource: string | null;
  showSpeechBubble: boolean;
  randomDialogue: string;
  moveGif: boolean;
  showLevelUpModal: boolean;
  handleImageClick: () => void;
  eatUp: () => void;
  plays: () => void;
  closeLevelUpModal: () => void;
  memoizedMoveImages: JSX.Element | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  animal,
  showSpeechBubble,
  showLevelUpModal,
  eatUp,
  plays,
  closeLevelUpModal,
  memoizedMoveImages,
}) => {
  return animal ? (
    <SafeAreaView>
      <HomeBox>
        <LeftBox>
          <AnimalNameBox>
            <AnimalName>{`Level ${animal.level}`}</AnimalName>
            <AnimalName>{`Xp ${animal.experience}`}</AnimalName>
          </AnimalNameBox>
        </LeftBox>
        <ImageBox>{memoizedMoveImages}</ImageBox>
        <RightBox>
          <EatStyledButton onPress={eatUp} disabled={showSpeechBubble}>
            <LevelText>밥주기</LevelText>
          </EatStyledButton>
          <PlayStyledButton onPress={plays} disabled={showSpeechBubble}>
            <LevelText>걷기운동</LevelText>
          </PlayStyledButton>
        </RightBox>
      </HomeBox>
      <Modal visible={showLevelUpModal} transparent={true} animationType="fade">
        <ModalContainer>
          <ModalContent>
            <ModalTitle>축하합니다!</ModalTitle>
            <ModalMessage>레벨이 올랐습니다!</ModalMessage>
            <ModalMessage>성장은 레벨 10단위로 성장합니다.</ModalMessage>
            <ModalButton onPress={closeLevelUpModal}>
              <ModalButtonText>확인</ModalButtonText>
            </ModalButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </SafeAreaView>
  ) : null;
};

export default HomeScreen;
