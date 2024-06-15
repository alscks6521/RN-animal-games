import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "../../stacks/MainStack";

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;
