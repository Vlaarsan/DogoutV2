import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useUser } from "../Contexts/UserContext";
import { auth, app, firestore } from "../Config/firebaseconfig";
import { toDate, format } from "date-fns";
import { fr } from "date-fns/locale";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Assurez-vous d'avoir installé cette dépendance
import DogInfoModal from "../Modals/DogInfoModal";

const MesBaladesScreen = ({ navigation }) => {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @VABLIABLES
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const { user, setUser } = useUser();
  const [userBalades, setUserBalades] = useState([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBalade, setSelectedBalade] = useState({
    id: "",
    name: "",
    date: null,
    duration: "",
    infos: "",
  });
  const durations = [
    "Indéterminée",
    "10 min",
    "20 min",
    "30 min",
    "40 min",
    "50 min",
    "1h",
    "1h30",
    "2h",
    "2h30",
    "3h",
    "3h30",
    "4h",
    "Journée",
  ];

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [participants, setparticipants] = useState([]);
  const [selectedDogInfo, setSelectedDogInfo] = useState(null);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @FONCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const toggleInfoModal = (selectedDog) => {
    setSelectedDogInfo(selectedDog);
    setInfoModalVisible(!infoModalVisible);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @BASE DE DONNEES
  ///////////////////////////////////////////////////////////////////////////////////////////////

  // Fonction pour récupérer les balades de l'utilisateur
  const getBaladesUtilisateur = async () => {
    try {
      const baladesCollection = collection(firestore, "balade");
      const baladesSnapshot = await getDocs(baladesCollection);
      const loadedBalades = [];

      baladesSnapshot.docs.forEach((doc) => {
        const baladeData = doc.data();
        baladeData.id = doc.id;
        // Filtrer les balades où le champ "createur" est égal à user.uid
        if (baladeData.createur === user.uid) {
          loadedBalades.push({
            ...baladeData,
            participants: baladeData.participants || [], // Utilisez la liste existante ou une liste vide si elle n'existe pas
          });
        }
      });

      // Mettez à jour l'état avec la liste filtrée des balades chargées
      setUserBalades(loadedBalades);
      return loadedBalades;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des balades de l'utilisateur :",
        error
      );
      return [];
    }
  };

  // Fonction pour supprimer une balade de la base de données
  const deleteBaladeUtilisateur = async (baladeId) => {
    try {
      // Créez une référence au document de la balade que vous souhaitez supprimer
      const baladeRef = doc(firestore, "balade", baladeId);

      // Supprimez le document
      await deleteDoc(baladeRef);
      getBaladesUtilisateur();
      console.log("Balade supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de la balade :", error);
    }
  };

  const updateBalade = async () => {
    try {
      // Mettez à jour les détails de la balade dans la base de données
      const baladeRef = doc(firestore, "balade", selectedBalade.id);
      await updateDoc(baladeRef, {
        name: selectedBalade.name,
        date: selectedBalade.date,
        duration: selectedBalade.duration,
        infos: selectedBalade.infos,
      });

      // Fermez la modal après la mise à jour
      closeModal();

      // Mettez à jour la liste des balades affichées
      getBaladesUtilisateur();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la balade :", error);
    }
  };

  const openModal = (balade) => {
    setSelectedBalade(balade);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedBalade(null);
    setModalVisible(false);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @USE EFFECT
  ///////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    getBaladesUtilisateur();
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @AFFICHAGE
  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        {userBalades.length === 0 ? (
          <Text style={styles.noBaladesText}>
            Vous n'avez pas encore de balade.
          </Text>
        ) : (
          userBalades.map((balade, index) => (
            <TouchableOpacity
              key={index}
              style={styles.baladeItem}
              onLongPress={() => {
                // Ajouter une boîte de dialogue de confirmation avant la suppression
                Alert.alert(
                  "Supprimer la balade",
                  "Êtes-vous sûr de vouloir supprimer cette balade ?",
                  [
                    {
                      text: "Annuler",
                      style: "cancel",
                    },
                    {
                      text: "Supprimer",
                      onPress: () => deleteBaladeUtilisateur(balade.id),
                    },
                  ]
                );
              }}
              onPress={() => openModal(balade)}
            >
              <Text style={styles.baladeName}>{balade.name}</Text>
              <Text style={styles.baladeText}>
                Date :{" "}
                {balade.date &&
                  format(balade.date.toDate(), "dd MMMM yyyy", {
                    locale: fr,
                  })}{" "}
                à{" "}
                {balade.date &&
                  format(balade.date.toDate(), "HH:mm", { locale: fr })}
              </Text>

              <Text style={styles.baladeText}>Durée : {balade.duration}</Text>
              <Text style={styles.baladeText}>{balade.infos}</Text>
              <Text style={styles.participantsTitle}>Participants :</Text>
              <FlatList
                data={balade.participants}
                keyExtractor={(item) => item.id}
                horizontal
                renderItem={({ item }) => (
                  <View style={styles.participantItem}>
                    <TouchableOpacity onPress={() => toggleInfoModal(item)}>
                      <Image
                        source={item.avatar}
                        style={styles.participantAvatar}
                      />
                    </TouchableOpacity>
                    <Text style={styles.participantName}>{item.name}</Text>
                  </View>
                )}
              />

              {selectedDogInfo && (
                <DogInfoModal
                  isVisible={infoModalVisible}
                  onClose={toggleInfoModal}
                  name={selectedDogInfo.name}
                  gender={selectedDogInfo.gender}
                  avatar={selectedDogInfo.avatar}
                  age={selectedDogInfo.age}
                  race={selectedDogInfo.race}
                  color={selectedDogInfo.color}
                  maitre={selectedDogInfo.maitre}
                />
              )}
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Modal pour modifier la balade */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier la balade</Text>
            <Text style={styles.topText}>Nom</Text>

            {/* Champ pour modifier le nom de la balade */}
            <TextInput
              placeholder="Nouveau nom de la balade"
              value={selectedBalade?.name}
              onChangeText={(text) =>
                setSelectedBalade({ ...selectedBalade, name: text })
              }
              style={[styles.input, styles.inputTop]}
            />

            <Text style={styles.topText}>Description</Text>

            {/* Champ pour modifier les informations de la balade */}
            <TextInput
              placeholder="Informations sur la balade"
              value={selectedBalade?.infos}
              onChangeText={(text) =>
                setSelectedBalade({ ...selectedBalade, infos: text })
              }
              multiline={true}
              numberOfLines={4}
              style={[styles.input, styles.inputBottom]}
            />
            {/* Champ pour modifier la durée de la balade */}
            <SelectDropdown
              data={durations}
              onSelect={(selectedItem) =>
                setSelectedBalade({ ...selectedBalade, duration: selectedItem })
              }
              defaultButtonText="Sélectionnez la durée"
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => item}
              buttonStyle={[styles.dropdownButton, styles.input]}
              buttonTextStyle={[
                styles.dropdownButtonText,
                styles.customDefaultButtonTextStyle,
              ]}
              rowStyle={styles.dropdownRow}
              rowTextStyle={styles.dropdownRowText}
            />

            {/* Bouton pour ouvrir le sélecteur de date/heure */}
            <TouchableOpacity
              style={[styles.datePickerButton, styles.input]}
              onPress={showDatePicker}
            >
              <Text style={styles.buttonText}>
                {selectedBalade && selectedBalade.date instanceof Date
                  ? format(selectedBalade.date, "dd MMMM yyyy", {
                      locale: fr,
                    })
                  : "Sélectionner la date et l'heure"}
              </Text>
            </TouchableOpacity>

            {/* Composant DateTimePickerModal */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={(date) => {
                setSelectedBalade({ ...selectedBalade, date: date });

                // Cacher le sélecteur de date
                hideDatePicker();
              }}
              onCancel={hideDatePicker}
              locale="fr-FR"
            />

            {/* Boutons pour annuler et sauvegarder la modification */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={closeModal}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={updateBalade}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.buttonText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  sectionContainer: {
    marginTop: 50,
  },
  baladeItem: {
    backgroundColor: "#158FC3",
    borderRadius: 10,
    marginBottom: 20,
    padding: 5,
    width: "90%",
    alignSelf: "center",
  },
  baladeName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  baladeText: {
    fontSize: 13,
    marginBottom: 15,
    marginHorizontal: 10,
    color: "#fff",
  },
  noBaladesText: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    marginTop: 20,
    fontWeight: "bold",
  },

  // Styles pour la modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(3, 3, 3, 0.5)",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 15,
    padding: 50,
    width: "95%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: "center",
    color: "#158FC3",
  },

  topText: {
    textAlign: "center",
    color: "#158FC3",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#158FC3",
    marginBottom: 50,
    paddingLeft: 10,
    color: "#fff",
  },
  inputTop: {
    borderBottomWidth: 1,
    borderTopColor: "#158FC3",
  },
  inputBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#158FC3",
  },
  multilineInput: {
    height: 80, // ajustez la hauteur en conséquence
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    borderRadius: 5,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  datePickerButton: {
    backgroundColor: "#158FC3",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  saveButton: {
    backgroundColor: "#158FC3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dropdownButton: {
    backgroundColor: "#158FC3",
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
    marginBottom: 20, // Personnalisez la largeur du bouton selon vos besoins
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  dropdownRow: {
    backgroundColor: "#158FC3", // Couleur de fond des éléments de la liste déroulante
    padding: 10,
  },
  dropdownRowText: {
    fontSize: 16,
    color: "white", // Couleur du texte des éléments de la liste déroulante
    textAlign: "center",
  },
  customDefaultButtonTextStyle: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
  participantsContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    alignSelf: "flex-start",
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  participantItem: {
    margin: 10,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  participantName: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default MesBaladesScreen;
