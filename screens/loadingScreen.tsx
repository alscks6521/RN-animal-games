import { View, Text, ActivityIndicator } from "react-native";
import styled from "styled-components";

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: black;
`;

const LoadingText = styled(Text)`
  color: white;
  font-size: 26px;
  font-weight: bold;
`;

export default () => {
  return (
    <Container>
      <ActivityIndicator size={"large"} color={"white"} />
      <LoadingText>Loading...</LoadingText>
    </Container>
  );
};
