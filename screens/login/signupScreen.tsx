import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
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
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackScreenList } from "../../stacks/AuthStack";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// `` 백틱, image
const Container = styled(ImageBackground)`
  justify-content: center;
  align-items: center;
  background-color: #fff;
  flex: 1;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 25px;
  font-weight: 700;
  color: #1a74e8;
  margin-bottom: 10px;
`;

const SignBox = styled(View)`
  background-color: rgb(255, 255, 255);
  margin-top: 60%;
  width: 88%;
  height: 40%;
  border-radius: 15px;
  padding: 20px;
`;

// Footer (Signin Btn, Create Account)
const Footer = styled(View)`
  margin-top: 15px;
`;
const SignUpButton = styled(TouchableOpacity)`
  background-color: #4fadff;
  padding: 10px;
  align-items: center;
`;
const SignUpTitle = styled(Text)`
  color: white;
  font-size: 15px;
`;

const CreateAccount = styled(Text)`
  color: #4fadff;
  text-decoration: underline;
  text-align: center;
  margin-bottom: 10px;
`;

// Text Input (ID / PW)
const InputField = styled(View)`
  padding: 3px;
`;

const UserId = styled(TextInput)`
  background-color: #efeded;
  margin-bottom: 10px;
  font-size: 17px;
  padding: 5px 12px;
`;

const UserPw = styled(UserId)`
  /* 재사용 */
`;

const UserName = styled(UserId)``;

// Error Message
const ErrorMessage = styled(Text)`
  color: #f02d2d;
  font-size: 15px;
`;
const db = getFirestore();

const BGImgDir = require("../../assets/splash.png");

//------------------------------------------------------------------------

export default () => {
  // Email(ID), PW ==> state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error Message
  const [error, setError] = useState("");

  // Loading State
  const [loading, setLoading] = useState(false);

  // use navigation Hook
  // NativeStackNavigationProp은 React Navigation의 useNavigation 훅이나 withNavigation 고차 컴포넌트와 함께 사용된다.
  // 이를 통해 컴포넌트에서 네비게이션 관련 메서드를 호출
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackScreenList>>();

  // moving screen to signin page.
  const goToSignIn = () => {
    // 로그인 성공
    // navigation.goBack();
    // navigation.navigate("SignIn");
  };

  // onChange  Text ( 사용자 입력에 따라 변경된 Input Text )
  const onChangeText = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    type: String
  ) => {
    // 1. 'e'의 담겨있는 사용자의 입력 텍스트를 가져온다.
    const value = event.nativeEvent.text;
    console.log(value);

    // 2. 입력 텍스트를 email, password state에 저장한다.
    switch (type) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  // Send Account Info to Server 서버통신
  const onSubmit = async () => {
    try {
      //invalid case check
      if (email === "" || name === "" || password === "") {
        setError("please input user info");
        alert(error);
        return;
      }
      // loading on
      setLoading(true);

      // error message reset
      setError("");

      // 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      // 업데이트 유저 프로필 이름
      await updateProfile(user, { displayName: name });

      // Firestore에 사용자 문서 생성
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: name,
        lastLogin: new Date().toISOString(),
        currentAnimal: null,
      });

      Alert.alert("가입 완료", "", [
        {
          onPress: () => goToSignIn(),
        },
      ]);

      return;
    } catch (error) {
      if (error instanceof FirebaseError) setError(error.message);
    } finally {
      // loading off
      setLoading(false);
      return;
    }
  };

  // Screen Design
  return (
    <Container source={BGImgDir}>
      <SignBox>
        {/* resize = 영역안 크기에 맞게 */}

        <Title>회원가입을 위해{"\n"}정보를 입력해주세요.</Title>

        <InputField>
          <UserName
            placeholder="이름"
            value={name}
            onChange={(e) => onChangeText(e, "name")}
          />
          <UserId
            placeholder="이메일"
            keyboardType="email-address"
            returnKeyType="next"
            value={email}
            onChange={(e) => onChangeText(e, "email")}
          />
          <UserPw
            placeholder="패스워드"
            secureTextEntry={true}
            keyboardType="visible-password"
            returnKeyType="done"
            value={password}
            onChange={(e) => onChangeText(e, "password")}
          />
        </InputField>
        <ErrorMessage>{error}</ErrorMessage>

        <Footer>
          {/* <SignUpButton onPress={onSubmit}> */}
          <SignUpButton onPress={() => onSubmit()} disabled={loading}>
            <SignUpTitle>{loading ? "loading..." : "완료"}</SignUpTitle>
          </SignUpButton>
        </Footer>
      </SignBox>
    </Container>
  );
};
