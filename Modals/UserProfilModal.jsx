// EN DEVELOPPEMNT

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import Chien from "../Components/Chien";

const UserProfileModal = ({ isVisible, onClose, userID }) => {
  const [pseudo, setPseudo] = useState("");
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
      const profileDocRef = doc(firestore, "profile", userID);
      const chienDocRef = doc(firestore, "chien", userID);
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
    loadProfileInfo();
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @AFFICHAGE
  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Profil de {pseudo}</Text>
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

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>FERMER</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default UserProfileModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#158FC3",
    textAlign: "center",
    marginBottom: 20,
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
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#158FC3",
    textAlign: "center",
    marginBottom: 10,
  },
  dogContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dogAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  dogName: {
    fontSize: 18,
    color: "white",
  },
  closeButton: {
    backgroundColor: "#158FC3",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    alignSelf: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
