import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";
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
    setAnimals([]); // 초기화
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

    console.log("Fetched Animals:", fetchedAnimals.length, fetchedAnimals);
    fetchedAnimals.reverse();
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
          displayName: user.displayName,
          likes: 0,
        },
        { merge: true }
      );

      Alert.alert("선택하셨네요!", `${animal.type.toUpperCase()}와 함께해요!`);
      navigation.goBack();
    } else {
      Alert.alert("Error", "No user is signed in.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {animals.length > 0 ? (
        <Swiper showsButtons={true} loop={false} showsPagination={true}>
          {animals.map((animal) => (
            <View
              key={animal.id}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: animal.imageUrl }}
                style={{ width: 300, height: 300, resizeMode: "contain" }}
              />
              <Text style={{ marginTop: 20, fontSize: 24, fontWeight: "800" }}>
                {animal.type.toUpperCase()}
              </Text>
              <TouchableOpacity
                onPress={() => handleSelectAnimal(animal)}
                style={{
                  marginTop: 20,
                  padding: 20,
                  width: 200,
                  alignItems: "center",
                  borderRadius: 12,
                  backgroundColor: "#2097ff",
                }}
              >
                <Text style={{ color: "white", fontSize: 24 }}>선택</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Swiper>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};
