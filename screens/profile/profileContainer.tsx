import { useEffect, useState } from "react";
import ProfileScreen from "./profileScreen";
import { auth } from "../../firebaseConfig";
import { User, signOut } from "firebase/auth";
import { Alert, Linking } from "react-native";

export default () => {
  // 1. 데이터를 불러오고, 가공하고, 수정한다
  const [user, setUser] = useState<User | null>(null);
  const [image, setImage] = useState(null);

  // profile 페이지가 실행될 때, 딱 1번 실행되는 함수
  useEffect(() => {
    getUserData();
  }, []);

  // 로그아웃 기능 함수
  const onSignout = () => {
    signOut(auth);
  };

  // firebase(server) 에서 User의 정보를 불러오는 함수.
  const getUserData = () => {
    // 1. firebase의 유저 정보 가져온다.
    const user = auth.currentUser;

    // 2. User 정보가 있는지 setUser를 호출.
    if (user) {
      // User의 정보를 저장
      setUser(user);
    }
  };

  // 2. 가공한 데이터를 Presenter에 넘겨준다.
  return <ProfileScreen user={user} onSignout={onSignout} />;
};
