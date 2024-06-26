// communityContainer.tsx
import React from "react";
import { FlatList } from "react-native";
import { UserAnimal } from "./communityScreen";
import UserAnimalItem from "./userAnimalItem";

type Props = {
  userAnimals: UserAnimal[];
};

const CommunityContainer: React.FC<Props> = ({ userAnimals }) => {
  const renderItem = ({ item, index }: { item: UserAnimal; index: number }) => (
    <UserAnimalItem item={item} index={index} />
  );

  return (
    <FlatList
      data={userAnimals}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default CommunityContainer;
