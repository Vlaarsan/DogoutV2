import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Ionicons";

const InfoButtonModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="information-outline" size={20} color="#000" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>
                Vous participez à cette balade si vous voyez cet icône sur la
                carte :
              </Text>
              <FontAwesome
                name="paw"
                size={20}
                color="black"
                style={styles.icon}
              />
              <Text>
                Vous avez créé cette balade si vous voyez cet icône sur la carte
                :
              </Text>
              <FontAwesome
                name="star"
                size={20}
                color="black"
                style={styles.icon}
              />

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "95%",
    backgroundColor: "#158FC3",
    padding: 20,
    borderRadius: 15,
  },
  icon: {
    marginVertical: 10,
    textAlign: "center",
  },
  closeButton: {
    padding: 8,
    marginTop: 10,
    alignSelf: "center",
    backgroundColor: "#D4D4D4",
    borderRadius: 15,
  },
  infoButton: {
    padding: 5,
    backgroundColor: "lightgreen",
    position: "absolute",
    top: 10,
    left: -190,
    borderWidth: 1,
    borderRadius: 25,
    textAlign: "center",
  },
});

export default InfoButtonModal;
