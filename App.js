import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./Screens/LoginScreen";
import MapScreen from "./Screens/MapScreen";
import ProfilScreen from "./Screens/ProfilScreen";
import SignScreen from "./Screens/SignScreen";
import SettingsScreen from "./Screens/SettingsScreen";
import MesBaladesScreen from "./Screens/MesBaladesScreen";
import BaladeDetails from "./Components/BaladeDetails";
import { UserProvider } from "./Contexts/UserContext";
import Icon from "react-native-vector-icons/Ionicons";
import UserProfil from "./Components/UserProfil";
import { UserDogsProvider } from "./Contexts/UserDogs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Map") {
          iconName = focused ? "map" : "map-outline";
        } else if (route.name === "Profil") {
          iconName = focused ? "person" : "person-outline";
        } else if (route.name === "Settings") {
          iconName = focused ? "aperture" : "aperture-outline";
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarStyle: { backgroundColor: "black" },
      tabBarActiveTintColor: "#158FC3",
      tabBarInactiveTintColor: "#fff",
    })}
  >
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{ title: "Carte", headerShown: false }}
    />
    <Tab.Screen
      name="Profil"
      component={ProfilScreen}
      options={{ title: "Profil", headerShown: false }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "Paramètres", headerShown: false }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <UserProvider>
      <UserDogsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="BaladeDetails"
            component={BaladeDetails}
            options={{
              title: "Informations sur la balade",
              headerStyle: {
                backgroundColor: "#333",
              },
              headerTintColor: "white",
            }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Inscription"
            component={SignScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Mes Balades"
            component={MesBaladesScreen}
            options={{
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: "#158FC3",
                fontSize: 18,
                fontWeight: "bold",
              },
              headerStyle: {
                backgroundColor: "#000",
              },
              headerTintColor: "#158FC3",
            }}
          />
          <Stack.Screen
            name="UserProfil"
            component={UserProfil}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </UserDogsProvider>
    </UserProvider>
  );
}
