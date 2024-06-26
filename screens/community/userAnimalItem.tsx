// userAnimalItem.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { UserAnimal } from "./communityScreen";
import { Image } from "expo-image";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";

type Props = {
  item: UserAnimal;
  index: number;
  onPress: () => void;
};

const CardContainer = styled(TouchableOpacity)`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ItemContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const StyledImage = styled(Image)`
  width: 70px;
  height: 70px;
  border-radius: 45px;
`;

const ImagePlaceholder = styled(View)`
  width: 70px;
  height: 70px;
  background-color: #ccc;
  border-radius: 45px;
`;

const InfoContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
`;

const TextContainer = styled(View)`
  flex-direction: column;
`;

const StyledText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  margin: 10px 5px;
`;

const LevelText = styled(StyledText)``;

const RankContainer = styled(View)<{ rank: number }>`
  position: absolute;
  z-index: 99;
  top: -10px;
  left: 0;
  right: 0;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${(props) =>
    props.rank === 1 ? "#FFD700" : props.rank === 2 ? "#C0C0C0" : "#CD7F32"};
  border: 2px solid #ccc;
  justify-content: center;
`;

const RankText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const UserAnimalItem: React.FC<Props> = ({ item, index, onPress }) => {
  const [imageUri, setImageUri] = React.useState<string>("");

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

  React.useEffect(() => {
    const fetchImageUri = async () => {
      try {
        const storage = getStorage();
        const level = item.level;
        const animalType = item.animalId;
        const imagelevel = `${animalType}${level <= 10 ? "1" : "2"}`;

        const uri = await fetchCachedImage(animalType, imagelevel, storage);
        setImageUri(uri);
      } catch (error) {
        console.error("Failed to fetch image URI:", error);
      }
    };

    fetchImageUri();
  }, [item.animalId, item.level]);

  return (
    <CardContainer onPress={onPress}>
      {index < 3 && (
        <RankContainer rank={index + 1}>
          <RankText>{index + 1}등</RankText>
        </RankContainer>
      )}
      <ItemContainer>
        {imageUri ? (
          <StyledImage source={{ uri: imageUri }} />
        ) : (
          <ImagePlaceholder />
        )}
        <InfoContainer>
          <TextContainer>
            <StyledText>유저: {item.displayName}</StyledText>
            <StyledText>동물 타입: {item.animalId}</StyledText>
          </TextContainer>
          <TextContainer>
            <LevelText>레벨: {item.level}</LevelText>
            <LevelText>하트: {Object.keys(item.likes).length}</LevelText>
          </TextContainer>
        </InfoContainer>
      </ItemContainer>
    </CardContainer>
  );
};

export default UserAnimalItem;
