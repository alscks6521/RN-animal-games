import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import home from "../screens/home/homeScreen";
import profile from "../screens/profile";

type TabStackList = {
  Main: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabStackList>();

export default () => {
  const getIconName = (pageName: keyof TabStackList) => {
    switch (pageName) {
      case "Main":
        return "apps-sharp";
      case "Profile":
        return "person";
      default:
        return "alert-circle-sharp";
    }
  };

  return (
    <Tab.Navigator
      screenOptions={(route) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#43a7ff",
        tabBarInactiveTintColor: "darkgray",
        tabBarIcon: ({ color, size }) => {
          return (
            <Ionicons
              name={getIconName(route.route.name)}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Main" component={home} />
      <Tab.Screen name="Profile" component={profile} />
    </Tab.Navigator>
  );
};
