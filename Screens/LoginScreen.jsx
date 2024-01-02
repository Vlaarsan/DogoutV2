import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../Config/firebaseconfig";

export default function LoginScreen() {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @VABLIABLES
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @FONCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const checkUserToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userData");
      if (userToken) {
        // L'utilisateur est connecté, redirigez-le vers l'écran approprié (par exemple, MainTabs)
        navigation.replace("MainTabs");
      } else {
        // L'utilisateur n'est pas connecté, laissez-le sur l'écran de connexion
      }
    } catch (error) {
      // Gérez les erreurs liées à AsyncStorage ici
      console.error(error);
    }
  };

  const handleSignIn = () => {
    setError(""); // Réinitialisez les erreurs
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Utilisateur connecté avec succès!");

        AsyncStorage.setItem(
          "userData",
          JSON.stringify(userCredential.user)
        ).then(() => {
          navigation.replace("MainTabs");
        });
      })
      .catch((error) => {
        console.error(error);
        handleError(error.code);
      });
  };

  const handleError = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        setError("Aucun utilisateur trouvé avec cette adresse e-mail.");
        break;
      case "auth/wrong-password":
        setError("Mot de passe incorrect. Veuillez réessayer.");
        break;
      case "auth/invalid-email":
        setError("Veuillez entrer une adresse e-mail valide.");
        break;
      case "auth/invalid-login-credentials":
        setError("Informations connexion invalides.");
        break;
      case "auth/too-many-requests":
        setError(
          "Trop de tentatives de connexion infructueuses. Veuillez réessayer plus tard."
        );
        break;
      default:
        setError("Erreur de connexion. Veuillez réessayer plus tard.");
    }
  };

  const handleGoToMapScreen = () => {
    navigation.navigate("MainTabs", { screen: "Map" });
  };

  const handleGoToSignScreen = () => {
    navigation.navigate("Inscription");
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @USE EFFECT
  ///////////////////////////////////////////////////////////////////////////////////////////////

  // Appelez checkUserToken dans useEffect ou dans le composant où vous en avez besoin
  useEffect(() => {
    checkUserToken();
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @AFFICHAGE
  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={"padding"}
      keyboardVerticalOffset= {200}
    >
      {/* Titre */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Dogout</Text>
      </View>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/Logoapp.png")}
          style={styles.image}
        />
      </View>

      {/* Champs d'identifiant et de mot de passe */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#158FC3"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry // Pour masquer le texte du mot de passe
          placeholderTextColor="#158FC3"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {/* Affichage des erreurs */}
        <Text style={styles.errorText}>{error}</Text>
      </View>

      {/* Bouton Connexion */}
      <TouchableOpacity style={styles.buttonlog} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      {/* Bouton Inscription */}
      <TouchableOpacity
        style={styles.buttonsign}
        onPress={handleGoToSignScreen}
      >
        <Text style={styles.buttonText}>Inscription</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#333",
    margin: 0,
    padding: 0,
  },
  titleContainer: {
    backgroundColor: "#158FC3",
    width: "85%",
    padding: 10,
    marginTop: 40,
    borderRadius: 15,
    borderWidth: 4,
  },
  titleText: {
    padding: 3,
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "black", // Couleur de l'ombre
    textShadowOffset: { width: 4, height: 4 }, // Décalage de l'ombre (ajustez les valeurs selon vos préférences)
    textShadowRadius: 3, // Rayon de l'ombre (ajustez la valeur selon vos préférences)
  },
  imageContainer: {
    marginTop: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    height: 40,
    borderColor: "#158FC3",
    borderBottomWidth: 1,
    marginBottom: 30,
    paddingLeft: 10,
    color: "white",
  },
  buttonlog: {
    backgroundColor: "#158FC3", // Fond bleu
    borderRadius: 50, // Coins arrondis
    padding: 10, // Espacement interne
    width: 250,
    height: 40, // Largeur du bouton
    alignItems: "center",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsign: {
    backgroundColor: "#158FC3", // Fond bleu
    borderRadius: 50, // Coins arrondis
    padding: 10, // Espacement interne
    width: 150, // Largeur du bouton
    alignItems: "center", // Alignement horizontal au centre
    marginTop: 10,
    color: "black", // Espacement supérieur
  },
  buttonText: {
    color: "white", // Texte en noir
    fontWeight: "bold", // Texte en gras
  },
  errorText: {
    color: "red",
    fontSize: 15,
    marginBottom: 20,
  },
});
