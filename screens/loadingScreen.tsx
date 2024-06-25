import React from "react";
import { View, Text, Image } from "react-native";
import styled from "styled-components/native";

const Container = styled(View)`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const LoadingText = styled(Text)`
  color: #000;
  font-size: 20px;
  margin-top: 20px;
`;

const LoadingGif = styled(Image)`
  width: 140px;
  height: 140px;
`;

export default () => {
  return (
    <Container>
      <LoadingGif source={require("../assets/loading.gif")} />
      <LoadingText>불러오고 있어요!</LoadingText>
    </Container>
  );
};
