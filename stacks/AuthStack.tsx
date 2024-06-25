import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../screens/login/signinScreen"; // 대문자 'S'로 수정
import SignUpScreen from "../screens/login/signupScreen"; // 대문자 'S'로 수정

// 이동할 스크린 StackNavigator : type 지정
export type AuthStackScreenList = {
  SignIn: undefined;
  SignUp: undefined;
};

// StackNavigator 생성
const Stack = createStackNavigator<AuthStackScreenList>();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: "Pick Mate",
          headerTransparent: true,
          headerTintColor: "black",
        }}
      />
    </Stack.Navigator>
  );
}
