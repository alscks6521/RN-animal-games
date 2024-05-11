import { User } from "firebase/auth";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components";

const Container = styled(View)``;

const Info = styled(View)`
  flex-direction: row;
`;

const Data = styled(View)`
  flex-direction: column;
  justify-content: center;
`;

const Name = styled(Text)`
  font-size: 35px;
  font-weight: bold;
`;

const Email = styled(Text)`
  font-size: 27px;
  color: grey;
`;

const JoinDate = styled(Text)`
  font-size: 20px;
  font-weight: 400;
  color: grey;
`;

const ProfileImg = styled(Image)`
  width: 100px;
  height: 150px;
  background-color: white;
  margin-right: 10px;
  border-radius: 5px;
`;

type Props = {
  user: User | null;
};

export default ({ user }: Props) => {
  // const [email, setEmail] = useState(user?.email);
  return (
    <Container>
      <Info>
        <ProfileImg source={require("../assets/splash.png")} />

        <Data>
          <Name>{user?.displayName}</Name>
          <Email>{user?.email}</Email>
          <JoinDate>{user?.metadata.creationTime}</JoinDate>
        </Data>
      </Info>
    </Container>
  );
};
