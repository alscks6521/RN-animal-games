import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./stacks/AuthStack";
import { createStackNavigator } from "@react-navigation/stack";
import * as Firebase from "firebase/auth";
import { auth } from "./firebaseConfig";
import LoadingScreen from "./screens/loadingScreen";
import MainStack from "./stacks/MainStack";

const Stack = createStackNavigator();

//. 가상 반려동물 앱
// 설명: 사용자가 가상의 반려동물을 선택하고, 그들과 상호작용하며 키울 수 있는 앱입니다. 사용자는 반려동물을 먹이고, 씻기고, 놀아주면서 그들의 성장을 관찰할 수 있습니다.
// 파이어베이스 활용: 사용자의 반려동물 관리 데이터를 저장하고, 반려동물의 성장 단계나 건강 상태를 실시간으로 업데이트합니다.
export default function App() {
  // userState 타입 설정.
  const [user, setUser] = useState<Firebase.User | null>();

  // loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("1. 로그인이 되었는지 확인 중이에요!");
    // userState 타입 설정.
    // user가 로그인 되었는지 안되었는지, 항시 체크
    auth.onAuthStateChanged((userState: Firebase.User | null) => {
      // 로그인 여부에 따라 그룹으로 각각 보여줌.
      // a. 로그인 되어 있음
      if (userState) {
        console.log("2-a. 로그인이 되었어요!");
        setUser(userState);
      }
      // b. 로그인 안되어있음
      else {
        console.log("2-b. 로그인이 안되어있어요 or 로그아웃!");
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  const LoadingProcess = <LoadingScreen />;
  const AuthProcess = auth.currentUser ? <MainStack /> : <AuthStack />;

  return (
    <NavigationContainer>
      {/* 방법 1 */}
      {/* {loading ? LoadingProcess : AuthProcess} */}
      {loading ? (
        <LoadingScreen />
      ) : auth.currentUser ? (
        <MainStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
