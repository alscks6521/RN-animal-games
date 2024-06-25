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

const ProfileImg = styled(Image)`
  width: 100px;
  aspect-ratio: 2/3;
  background-color: white;
  margin-right: 10px;
  border-radius: 20px;
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
        </Data>
      </Info>
    </Container>
  );
};
