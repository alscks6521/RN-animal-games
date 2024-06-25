import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components";

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

// function : function & arrow func
export default () => {
  return (
    <ScrollBox>
      <Header></Header>
      <Body></Body>
      <SignoutButton></SignoutButton>
    </ScrollBox>
  );
};
