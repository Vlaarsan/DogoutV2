import React, { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { ages } from "../Constants/Constants";

export default function Chien({
  name,
  gender,
  avatar,
  age,
  race,
  color,
  onDelete,
  onChangeAge,
  onPress,
}) {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @VARIABLES
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @FONCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleAgeChange = (newAge) => {
    onChangeAge(name, newAge);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @AFFICHAGE
  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (onPress) {
            onPress(); // Appel de la fonction onPress si elle est définie
          } else {
            toggleModal(); // Sinon, déclencher toggleModal
          }
        }}
        onLongPress={onDelete}
      >
        <View style={styles.container}>
          {/* Image de l'avatar du chien */}
          <Image source={avatar} style={styles.avatar} />

          {/* Nom du chien */}
          <Text style={styles.name}>{name}</Text>

          {/* Image représentant le sexe du chien */}
          {gender === "Mâle" ? (
            <Image
              source={require("../assets/images/male.png")} // Remplacez par l'icône de mâle
              style={styles.genderIcon}
            />
          ) : (
            <Image
              source={require("../assets/images/female.png")} // Remplacez par l'icône de femelle
              style={styles.genderIcon}
            />
          )}
        </View>
      </TouchableOpacity>
      {/* Modal pour afficher les informations du chien */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
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

          <SelectDropdown
            data={ages}
            onSelect={(selectedItem, index) => {
              handleAgeChange(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdownButton}
            buttonTextStyle={[
              styles.dropdownButtonText,
              styles.customDefaultButtonTextStyle,
            ]}
            rowStyle={styles.dropdownRow}
            rowTextStyle={styles.dropdownRowText}
            defaultButtonText={age}
          />

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
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginBottom: 10,
    borderBottomWidth: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 25,
  },
  genderIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 0,
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @MODAL chien
  ///////////////////////////////////////////////////////////////////////////////////////////////
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
  dropdownButton: {
    backgroundColor: "rgba(9, 0, 0, 0)",
    borderWidth: 0.2,
    padding: 10,
    borderRadius: 25,
    width: "50%",
    marginBottom: 20,
  },
  dropdownButtonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
    textAlign: "center",
  },
  dropdownRow: {
    backgroundColor: "#158FC3",
    padding: 10,
  },
  dropdownRowText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});
