import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/home/homeScreen"; // 올바른 경로와 대문자 사용
import ProfileScreen from "../screens/profile"; // 올바른 경로와 대문자 사용
import CommunityScreen from "../screens/community"; // 잘못된 철자 수정

type TabStackList = {
  Community: undefined;
  Main: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabStackList>();

export default function TabNavigator() {
  const getIconName = (pageName: keyof TabStackList) => {
    switch (pageName) {
      case "Community":
        return "people";
      case "Main":
        return "home";
      case "Profile":
        return "person";
      default:
        return "alert-circle-sharp";
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#D2B48C",
        tabBarInactiveTintColor: "darkgray",
        tabBarIcon: ({ color, size }) => {
          const iconName = getIconName(route.name);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      initialRouteName="Main"
    >
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Main"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
