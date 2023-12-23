import React, { useEffect } from "react";
import { useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
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
import { useNavigation } from "@react-navigation/native";
import UserProfileModal from "./UserProfilModal";

const DogInfoModal = ({
  isVisible,
  onClose,
  name,
  gender,
  avatar,
  age,
  race,
  color,
  maitre,
}) => {
  const [pseudo, setPseudo] = useState("");
  const navigation = useNavigation();
  const [isUserProfileModalVisible, setUserProfileModalVisible] =
    useState(false);

  const openUserProfileModal = () => {
    setUserProfileModalVisible(true);
  };

  const closeUserProfileModal = () => {
    setUserProfileModalVisible(false);
  };

  const getPseudo = async () => {
    try {
      const profileDocRef = doc(firestore, "profile", maitre);
      const docSnapshot = await getDoc(profileDocRef);

      if (docSnapshot.exists()) {
        const profileData = docSnapshot.data();
        // Vérifiez si le champ 'pseudo' existe dans profileData avant d'utiliser indexOf
        if (profileData && profileData.pseudo) {
          setPseudo(profileData.pseudo);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    getPseudo();
  }, [maitre]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalContainer,
          gender === "Mâle" ? styles.blueBackground : styles.pinkBackground,
        ]}
      >
        <Text style={styles.modalTitle}>{name}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{race}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{color}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{age}</Text>
        </View>

        <View style={styles.infoContainer}>
          {gender === "Mâle" ? (
            <Image
              source={require("../assets/images/male.png")}
              style={styles.genderIconModal}
            />
          ) : (
            <Image
              source={require("../assets/images/female.png")}
              style={styles.genderIconModal}
            />
          )}
        </View>

        <View style={styles.infoContainer}>
          <Image source={avatar} style={styles.avatarImage} />
        </View>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              navigation.navigate("UserProfil", {
                pseudo,
                maitre,
              });
              onClose(); // Assurez-vous que cette fonction est définie quelque part
            }}
          >
            <Text style={styles.infoTextMaitre}>Chien de </Text>
            <Text
              style={[
                styles.infoTextMaitre,
                { textDecorationLine: "underline", color: "white" },
              ]}
            >
              {pseudo}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
  },
  blueBackground: {
    backgroundColor: "#158FC3",
  },
  pinkBackground: {
    backgroundColor: "pink",
  },
  modalTitle: {
    fontSize: 45,
    fontWeight: "bold",
    color: "black",
    marginTop: 50,
    marginBottom: 40,
    textShadowColor: "red",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  infoTextMaitre: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
    marginVertical: 5,
  },

  genderIconModal: {
    marginTop: 20,
    width: 40,
    height: 40,
  },
  avatarImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 100,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 50,
    width: "60%",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default DogInfoModal;
