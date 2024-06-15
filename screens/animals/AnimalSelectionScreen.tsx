import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, Alert } from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Image } from "expo-image";
import { auth } from "../../firebaseConfig";

import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";

export type Animal = {
  id: string;
  imageUrl: string;
  type: string;
};

const db = getFirestore();
const storage = getStorage();

export default () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("동물 선택 스크린");
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    const querySnapshot = await getDocs(collection(db, "animals"));

    const fetchedAnimals: Animal[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const defaultImagePath = doc.data().images["0-10"];
        console.log(defaultImagePath);
        const imageRef = ref(storage, defaultImagePath);
        const imageUrl = await getDownloadURL(imageRef);
        return {
          id: doc.id,
          imageUrl,
          type: doc.data().type,
        };
      })
    );
    setAnimals(fetchedAnimals);
  };

  const handleSelectAnimal = async (animal: Animal) => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(db, "users", userId);
      const userAnimalRef = doc(db, "user_animals", userId + "_" + animal.id);

      await updateDoc(userDocRef, {
        selectedAnimalId: animal.id,
      });

      await setDoc(
        userAnimalRef,
        {
          userId: userId,
          animalId: animal.id,
          level: 0,
          experience: 0,
        },
        { merge: true }
      );

      Alert.alert("Animal Selected", `You have selected the ${animal.type}`);
      navigation.goBack();
    } else {
      Alert.alert("Error", "No user is signed in.");
    }
  };

  const renderAnimalItem = ({ item }: { item: Animal }) => (
    <TouchableOpacity
      onPress={() => handleSelectAnimal(item)}
      style={{ margin: 10, alignItems: "center" }}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 150, height: 150, borderRadius: 75 }}
      />
      <Text>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <FlatList
        data={animals}
        keyExtractor={(item) => item.id}
        renderItem={renderAnimalItem}
      />
    </View>
  );
};
