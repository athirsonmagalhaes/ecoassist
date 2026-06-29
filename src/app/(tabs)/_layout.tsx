import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#10B981",
        tabBarInactiveTintColor: "#5C6356",
        tabBarStyle: {
          backgroundColor: "#F8F7F2",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
        },
      }}
    >
      <Tabs.Screen
        name="plantas/index"
        options={{
          title: "Plantas",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "flower" : "flower-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="canteiros"
        options={{
          title: "Canteiros",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "leaf" : "leaf-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
