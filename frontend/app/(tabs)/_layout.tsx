import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#67AE6E",
      }}
    >
      <Tabs.Screen
        name="library"
        options={{
          title: "Biblioteca Plante",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "library" : "library-outline"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Acasa",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      
    </Tabs>
  );
}
