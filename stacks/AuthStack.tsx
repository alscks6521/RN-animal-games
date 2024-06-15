import { createStackNavigator } from "@react-navigation/stack";
import signin from "../screens/login/signinScreen";
import signup from "../screens/login/signupScreen";

// 이동할 스크린 StackNavigator : type 지정
export type AuthStackScreenList = {
  SignIn: undefined;
  SignUp: undefined;
};

// StackNavigator 생성
const Stack = createStackNavigator<AuthStackScreenList>();

export default () => {
  // Stack안에 이동할 페이지 만들어 그룹화
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={signin}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SignUp" component={signup} />
    </Stack.Navigator>
  );
};
