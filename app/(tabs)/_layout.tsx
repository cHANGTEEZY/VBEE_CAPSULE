import React from "react";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { StatusBar } from "expo-status-bar";

const BottomTabsNavigation = () => {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{ default: "house", selected: "house.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="create">
        <Label>Create</Label>
        <Icon sf={{ default: "plus.app.fill", selected: "plus.app" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="notification">
        <Label>Notification</Label>
        <Icon sf={{ default: "bell.badge", selected: "bell.badge.fill" }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default BottomTabsNavigation;
