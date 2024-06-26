import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components";
import ProfileInfo from "../../components/ProfileInfo";
import { User } from "firebase/auth";

const ScrollBox = styled(ScrollView)`
  flex: 1;
  background-color: white;
`;

const TopBox = styled(View)`
  height: 20px;
  margin: 0 auto;
`;

const TopBoxTitle = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: #000;
`;

const Header = styled(View)`
  padding: 0px 20px;
  height: 250px;
  justify-content: flex-end;
  bottom: -10px;
  z-index: 99;
`;
const Body = styled(View)`
  height: 500px;
  padding: 20px 20px;
  background-color: #fff4e6;
`;
const JoinDateName = styled(Text)`
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
  color: #454545;
`;
const JoinDate = styled(Text)`
  font-size: 20px;
  font-weight: 400;
  color: grey;
`;

const PetData = styled(JoinDateName)``;

const SignoutButton = styled(TouchableOpacity)`
  background-color: #ededed;
  border-radius: 4px;
  padding: 20px 15px;
`;

const SignoutTtitle = styled(Text)`
  color: #7c7c7c;
  text-align: center;
`;

type Props = {
  user: User | null;
  // user2: string; ...;
  onSignout: () => void;
  isAnimalSelected: any;
};

export default ({ user, onSignout, isAnimalSelected }: Props) => {
  return (
    <ScrollBox>
      <SafeAreaView>
        <TopBox>
          <TopBoxTitle>내 정보</TopBoxTitle>
        </TopBox>
        <Header>
          <ProfileInfo user={user} />
        </Header>
        <Body>
          <JoinDateName>가입 날짜 :</JoinDateName>
          <JoinDate>{user?.metadata.creationTime}</JoinDate>
          <PetData>나의 동물 타입</PetData>
          <PetData>{isAnimalSelected}</PetData>
        </Body>
        <SignoutButton onPress={onSignout}>
          <SignoutTtitle>로그아웃</SignoutTtitle>
        </SignoutButton>
      </SafeAreaView>
    </ScrollBox>
  );
};
