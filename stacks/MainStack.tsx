// MainStack.tsx 파일
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "../stacks/Tabs";
import AnimalSelect from "../screens/animals/AnimalSelectionScreen";

export type MainStackScreenList = {
  Tabs: undefined;
  AnimalSelectionScreen: undefined; // AnimalSelectionScreen을 추가
};

const Stack = createStackNavigator<MainStackScreenList>();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AnimalSelectionScreen"
        component={AnimalSelect}
        options={{
          headerBackTitleVisible: false,
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "black",
        }}
      />
    </Stack.Navigator>
  );
};
