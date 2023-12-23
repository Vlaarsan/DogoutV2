import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { firestore, app, auth } from "../config/firebaseconfig";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  exists,
  updateDoc,
} from "firebase/firestore";
import Chien from "./Chien";
import { useNavigation } from "@react-navigation/native";

///////////////////////////////////////////////////////////////////////////////////////////////
//                                           @VARIABLES
///////////////////////////////////////////////////////////////////////////////////////////////

const UserProfil = ({ route }) => {
  const navigation = useNavigation();
  const [pseudo, setPseudo] = useState("");
  const [userId, setUserId] = useState("");
  const [biographie, setBiographie] = useState("");
  const [dogs, setDogs] = useState([]);
  const [avatar, setAvatar] = useState(
    require("../assets/images/Rottweiler.png")
  );

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @FONCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const loadProfileInfo = async () => {
    try {
      const profileDocRef = doc(firestore, "profile", userId);
      const chienDocRef = doc(firestore, "chien", userId);
      const profileDocSnap = await getDoc(profileDocRef);
      const chienDocSnap = await getDoc(chienDocRef);

      if (profileDocSnap.exists()) {
        const profileData = profileDocSnap.data();
        setPseudo(profileData.pseudo || "");
        setAvatar(profileData.profilImage);
        setBiographie(profileData.biographie || "");
        console.log("Profil mis à jour.");
      }
      if (chienDocSnap.exists()) {
        const chienData = chienDocSnap.data();
        // Charger les chiens depuis le document du profil
        const loadedDogs = chienData.dogs || [];
        setDogs(loadedDogs);
        console.log("Liste de chiens mis à jour.");
      } else {
        console.log("erreur.");
      }
    } catch (error) {}
  };

  const handleDogPress = (dogName) => {
    // Logique à exécuter lorsqu'un chien est pressé
    console.log(`Chien pressé : ${dogName}`);
    // Ajoutez votre logique personnalisée ici
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @USE EFFECT
  ///////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (route.params && route.params.pseudo) {
      setPseudo(route.params.pseudo);
      setUserId(route.params.maitre);
    }
  }, [route.params]);

  useEffect(() => {
    loadProfileInfo();
  }, [pseudo, userId]);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @AFFICHAGE
  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profil de {pseudo}</Text>
        <Image source={avatar} style={styles.avatarImage} />
        <Text style={styles.text}>{biographie}</Text>

        <Text style={styles.title}>Ses chiens</Text>
        {dogs.map((dog, index) => (
          <Chien
            key={index}
            name={dog.name}
            gender={dog.gender}
            avatar={dog.avatar}
            age={dog.age}
            race={dog.race}
            color={dog.color}
            onPress={() => handleDogPress(dog.name)}
          />
        ))}
      </View>
      <TouchableOpacity
    onPress={() => navigation.pop()}
    style={styles.closeButton}
>
    <Text style={styles.closeButtonText}>
        FERMER
    </Text>
</TouchableOpacity>

    </SafeAreaView>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////////
//                                           @STYLES
///////////////////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111", // Fond noir
    padding: 10,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#158FC3", // Couleur bleue
    textAlign: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#158FC3",
  },
  content: {
    backgroundColor: "#444", // Fond gris foncé
    padding: 5,
    borderRadius: 15,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 25,
  },
  closeButton: {
    backgroundColor: "#158FC3",
    padding: 15,
    borderRadius: 10,
    marginTop: 50,
    alignSelf: "center",
  },

  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default UserProfil;
