import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../Contexts/UserContext";

export default function SettingsScreen({ navigation }) {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @VABLIABLES
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const [userData, setUserData] = useState(null);
  const { user, setUser } = useUser();

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @FONCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleLogout = async () => {
    // Affichez une boîte de dialogue de confirmation
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Se déconnecter",
          onPress: async () => {
            try {
              // Effacez le jeton d'utilisateur de AsyncStorage
              await AsyncStorage.removeItem("userData");
              // Redirigez l'utilisateur vers l'écran de connexion
              navigation.replace("Login");
            } catch (error) {
              // Gérez les erreurs liées à AsyncStorage ici
              console.error(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // ...

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @USE EFFECT
  ///////////////////////////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @AFFICHAGE
  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    /* Titre */
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <View style={styles.pseudoContainer}>
        <Text style={styles.pseudoText}>
          Connecté en tant que : {user.email}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Déconnexion" onPress={handleLogout} color="#158FC3" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#333",
    padding: 20,
  },
  header: {
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 30,
    borderRadius: 15,
    backgroundColor: "#158FC3",
    width: "100%",
    height: 50,
    borderWidth: 3,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 3,
  },

  pseudoContainer:{
    width: 500,
    alignItems: "center",
  },
  
  pseudoText: {
    padding: 10,
    borderRadius: 25,
    borderColor: "black",
    borderWidth: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#999",
  },
  buttonContainer: {
    width: "90%",
    position: "absolute",
    bottom: 50,
  },
});
