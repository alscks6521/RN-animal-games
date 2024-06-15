import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Alert,
  Image,
  ImageBackground,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components";
import { AuthStackScreenList } from "../../stacks/AuthStack";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { FirebaseError } from "firebase/app";

const SignInView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled(View)`
  /* justify-content: center; */
  align-items: center;
  background-color: #fbf0d0;
  flex: 1;
`;

const CreateAccount = styled(Text)`
  color: #4fadff;
  text-decoration: underline;
  text-align: center;
  font-size: 16px;
  margin-bottom: 10px;
`;

const TitleImg = styled(Image)`
  background-color: transparent;
  width: 100%;
  height: 25%;
`;

const Title = styled(Text)`
  font-size: 50px;
  font-weight: bold;
  color: #5a5757;
`;

const LoginImg = styled(Image)`
  background-color: transparent;
  position: absolute;
  top: -80px;
  width: 80%;
  height: 80%;
  align-items: center;
  z-index: 0;
`;

const LoginContainer = styled(View)`
  background-color: rgb(255, 255, 255);
  margin-top: 80%;
  width: 88%;
  height: 50%;
  align-items: start;
  border-radius: 15px;
  padding: 20px;
`;

const LoginTitle = styled(Text)`
  font-size: 16px;
  font-weight: 300;
  margin-top: 30px;
  margin-bottom: 15px;
`;

const LoginInput = styled(TextInput)`
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
`;

const LoginBtnContainer = styled(View)`
  align-items: center;
  width: 100%;
`;

const LoginButton = styled(TouchableOpacity)`
  border: 1px solid #ccc;
  background-color: #4888f4;
  border-radius: 10px;
  width: 70%;
  padding: 10px;
  margin-top: 10px;
  align-items: center;
`;

const LoginButtonText = styled(Text)`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const ErrorMessage = styled(Text)`
  color: #f02d2d;
  font-size: 15px;
`;

const SubImgDir = require("../../assets/login_background.png");
const TitleImgDir = require("../../assets/app-title.png");

export default () => {
  // Email(ID), PW ==> state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error Message
  const [error, setError] = useState("");

  // Loaing State...
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackScreenList>>();

  const goToSignUp = () => {
    navigation.navigate("SignUp");

    // navigation.goBack(); // 뒤로가기
  };

  const onChangeText = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    type: String
  ) => {
    // 1. 'e'의 담겨있는 사용자의 입력 텍스트를 가져온다.
    const value = event.nativeEvent.text;
    // console.log(value);

    // 2. 입력 텍스트를 email, password state에 저장한다.
    switch (type) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const onSubmit = async () => {
    try {
      if (email === "" || password === "") {
        setError("please input user info");
        alert(error);
        return;
      }
      setLoading(true);

      // error message reset
      setError("");

      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success Login");
    } catch (error) {
      if (error instanceof FirebaseError) setError(error.message);
    } finally {
      setLoading(false);
      return;
    }
  };

  return (
    <Container>
      {/* <CreateAccount onPress={() => goToSignUp()} disabled={loading}>
        {loading ? "Loading..." : "Create Account"}
      </CreateAccount> */}
      <LoginImg source={SubImgDir} />
      <LoginContainer>
        <TitleImg source={TitleImgDir} resizeMode="contain" />
        {/* <Title>Viutual</Title>
        <Title>Pet Pal</Title> */}
        <LoginTitle>LOGIN</LoginTitle>
        <LoginInput
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="next"
          value={email}
          onChange={(e) => onChangeText(e, "email")}
        ></LoginInput>
        <LoginInput
          placeholder="PW"
          secureTextEntry={true}
          keyboardType="visible-password"
          returnKeyType="none"
          value={password}
          onChange={(e) => onChangeText(e, "password")}
        />
        <LoginBtnContainer>
          <LoginButton onPress={() => onSubmit()} disabled={loading}>
            <LoginButtonText>
              {loading ? "loading..." : "Login"}
            </LoginButtonText>
          </LoginButton>
          <ErrorMessage>{error}</ErrorMessage>
          <CreateAccount onPress={goToSignUp}>회원가입</CreateAccount>
        </LoginBtnContainer>
      </LoginContainer>
    </Container>
  );
};
