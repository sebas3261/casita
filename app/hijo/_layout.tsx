import TabButtonHover from "@/components/TabButtonHover";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "black",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          paddingBottom: 30,
        },
      }}
    >
      <Tabs.Screen
        name="family/index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabButtonHover focused={focused}>
              <Ionicons
                name="people"
                size={24}
                color={focused ? "white" : "grey"}
              />
            </TabButtonHover>
          ),
        }}
      />
      <Tabs.Screen
        name="home/index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabButtonHover focused={focused}>
              <Foundation
                name="home"
                size={24}
                color={focused ? "white" : "grey"}
              />
            </TabButtonHover>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabButtonHover focused={focused}>
              <Ionicons
                name="settings-sharp"
                size={24}
                color={focused ? "white" : "grey"}
              />
            </TabButtonHover> 
          ),
        }}
      />
    </Tabs>
  );
}
