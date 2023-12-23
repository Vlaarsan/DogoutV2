import React, { useState } from "react";
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
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import app from "../config/firebaseconfig";

export default function SignUpScreen() {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @VABLIABLES
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @FONCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleSignUp = () => {
    if (password === confirmPassword) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // L'utilisateur est créé avec succès, envoyez l'e-mail de confirmation
          // sendEmailVerification(auth.currentUser).then(() => {
          //   console.log("E-mail de confirmation envoyé avec succès!");
          // });

          // Affichez le message à l'intérieur du bloc .then
          console.log("Utilisateur créé avec succès!");
          setError(""); // Effacez les erreurs précédentes
          // Informez l'utilisateur de l'inscription réussie
          setConfirmation(
            "Inscription réussie ! Vous pouvez maintenant vous connecter."
          );

          // Naviguez vers l'écran de connexion après un court délai
          setTimeout(() => {
            navigation.navigate("Login");
          }, 3000);
        })
        .catch((error) => {
          // Gérer les erreurs ici
          console.error(error);

          // Mettre à jour le message d'erreur en fonction du code d'erreur
          if (error.code === "auth/user-not-found") {
            setError("Aucun utilisateur trouvé avec cette adresse e-mail.");
          } else if (error.code === "auth/wrong-password") {
            setError("Mot de passe incorrect. Veuillez réessayer.");
          } else if (error.code === "auth/invalid-email") {
            setError("Veuillez entrer une adresse e-mail valide.");
          } else if (error.code === "auth/invalid-login-credentials") {
            setError("Informations connexion invalides.");
          } else if (error.code === "auth/too-many-requests") {
            setError(
              "Trop de tentatives de connexion infructueuses. Veuillez réessayer plus tard."
            );
          } else if (error.code === "auth/email-already-in-use") {
            setError("Cette adresse email est déjà utilisée");
          } else {
            setError("Erreur de connexion. Veuillez réessayer plus tard.");
          }
        });
    } else {
      setError("Les deux mots de passe ne sont pas identiques");
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @AFFICHAGE
  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          style={styles.innerContainer}
        >
          {/* Titre */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>S'inscrire</Text>
          </View>

          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/Logoapp.png")}
              style={styles.image}
            />
          </View>

          {/* Champs d'email et de mot de passe */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#158FC3"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
              placeholderTextColor="#158FC3"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              placeholderTextColor="#158FC3"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            {/* Affichage des erreurs */}
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.confirmationText}>{confirmation}</Text>
          </View>

          {/* Bouton Valider */}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    textShadowColor: "black",
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 3,
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
  button: {
    backgroundColor: "#158FC3",
    borderRadius: 50,
    padding: 10,
    width: 250,
    height: 40,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 17,
    marginBottom: 20,
  },
  confirmationText: {
    textAlign: "center",
    color: "green",
    fontSize: 17,
    marginBottom: 20,
  },
});
