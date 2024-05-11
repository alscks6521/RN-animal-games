import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components";
import ProfileInfo from "../../components/ProfileInfo";
import { User } from "firebase/auth";

const ScrollBox = styled(ScrollView)`
  flex: 1;
  background-color: white;
`;
const Header = styled(View)`
  padding: 0px 30px;
  height: 300px;
  justify-content: flex-end;
  bottom: -20px;
  z-index: 99;
`;
const Body = styled(View)`
  height: 500px;
  background-color: lightgray;
`;

const SignoutButton = styled(TouchableOpacity)`
  background-color: #e1e1e1;
  border-radius: 4px;
  padding: 5px 15px;
`;

const SignoutTtitle = styled(Text)`
  color: #7c7c7c;
  text-align: center;
`;

type Props = {
  user: User | null;
  // user2: string; ...;
  onSignout: () => void;
};

// function : function & arrow func
export default ({ user, onSignout }: Props) => {
  return (
    <ScrollBox>
      <Header>
        <ProfileInfo user={user} />
      </Header>
      <Body></Body>
      <SignoutButton onPress={onSignout}>
        <SignoutTtitle>로그아웃</SignoutTtitle>
      </SignoutButton>
    </ScrollBox>
  );
};
// 함수 Call -> Container
// Declare -> Screen

// const props = {
//   onPress:() => {},
//   style:{},
//   id: "1234",
//   user: "aaa"
// }

// export default(props) =>{
//   return null;
// }

// const Add = ({a, b}:{a:number, b:string) =>{
//   return a + b;
// }
