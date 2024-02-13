import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { parseISO } from "date-fns";
import { auth, app, firestore } from "../Config/firebaseconfig";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  exists,
  updateDoc,
} from "firebase/firestore";
import { useUser } from "../Contexts/UserContext";
import Icon from "react-native-vector-icons/Ionicons";
import DogInfoModal from "../Modals/DogInfoModal";
import InfoButtonModal from "./InfoButtonModal";

export default function BaladeDetails({ route }) {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @VABLIABLES
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const { id, name, duration, date, infos, avatar, creator } = route.params;

  const { user, setUser } = useUser();

  // Vérifiez si date est défini avant de le formater
  const formattedDate = date
    ? format(parseISO(date), "d MMMM yyyy", { locale: fr })
    : "";
  const formattedTime = date
    ? format(parseISO(date), "HH:mm", { locale: fr })
    : "";

  const [pseudo, setPseudo] = useState("");

  const [participants, setParticipants] = useState([]);
  const [selectedDogs, setSelectedDogs] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [isParticipating, setIsParticipating] = useState(false);
  const [selectModal, setSelectModal] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const [selectedDogInfo, setSelectedDogInfo] = useState(null);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @FONCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const toggleSelectModal = () => {
    if (!selectModal) {
      setSelectModal(true);
    } else {
      setSelectModal(false);
      setSelectedDogs([]); // Réinitialisez selectedDogs lorsque la modalité est fermée
    }
  };

  const toggleInfoModal = (selectedDog) => {
    setSelectedDogInfo(selectedDog);
    setInfoModalVisible(!infoModalVisible);
  };

  const closeInfoModal = () => {
    if (infoModalVisible) {
      setInfoModalVisible(false);
    }
    // Vous pouvez ajouter d'autres actions ici si nécessaire lors de la fermeture de la modal
  };

  // LOAD CREATOR
  const loadCreator = async () => {
    try {
      const profileDocRef = doc(firestore, "profile", creator);
      const docSnapshot = await getDoc(profileDocRef);

      if (docSnapshot.exists()) {
        const profileData = docSnapshot.data();
        setPseudo(profileData.pseudo);
      }
    } catch (error) {
      console.log("Erreur lors de la récupération du Pseudo :", error);
    }
  };

  const loadDogs = async () => {
    try {
      if (!user) {
        console.log("User introuvable");
        return;
      }

      const chienDocRef = doc(firestore, "chien", user.uid);
      const chienDocSnap = await getDoc(chienDocRef);

      if (chienDocSnap.exists()) {
        const chienData = chienDocSnap.data();
        const loadedDogs = chienData.dogs || [];
        setDogs(loadedDogs);
        console.log("Liste de chiens mise à jour.");
      } else {
        console.log("Erreur lors du chargement du profil.");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil :", error);
    }
  };

  const loadParticipants = async () => {
    try {
      const baladeDocRef = doc(firestore, "balade", id);
      const baladeDocSnap = await getDoc(baladeDocRef);

      if (baladeDocSnap.exists()) {
        const participantsData = baladeDocSnap.data().participants || [];
        setParticipants(participantsData);
      } else {
        console.log("Balade introuvable.");
      }
    } catch (error) {
      console.log("Erreur lors de la récupération des participants :", error);
    }
  };

  /// AJOUTER UN CHIEN A LA LISTE DES PARTICIPANTS
  const handleParticipant = () => {
    setParticipants((prevParticipants) => {
      const updatedParticipants = [...prevParticipants, ...selectedDogs];
      saveParticipant(updatedParticipants); // Enregistrez les participants ici
      return updatedParticipants;
    });
  };

  const saveParticipant = async (updatedParticipants) => {
    try {
      const baladeDocRef = doc(firestore, "balade", id);
      await updateDoc(baladeDocRef, {
        participants: updatedParticipants,
      });
      console.log("Enregistrement des participants réussi");
    } catch (error) {
      console.log("Erreur lors de l'enregistrement des participants :", error);
    }
  };

  const handleDogSelection = (selectedDog) => {
    const isDogSelected = selectedDogs.some(
      (dog) =>
        dog.name === selectedDog.name && dog.maitre === selectedDog.maitre
    );

    if (isDogSelected) {
      setSelectedDogs((prevSelectedDogs) =>
        prevSelectedDogs.filter(
          (dog) =>
            dog.name !== selectedDog.name || dog.maitre !== selectedDog.maitre
        )
      );
    } else {
      setSelectedDogs((prevSelectedDogs) => [...prevSelectedDogs, selectedDog]);
    }
  };

  const checkParticipationStatus = (participants, dogs) => {
    // Vérifie si au moins un chien est présent parmi les participants
    const isParticipating = dogs.some((dog) =>
      participants.some(
        (participant) =>
          participant.name === dog.name && participant.maitre === dog.maitre
      )
    );
    // Met à jour isParticipating en conséquence
    setIsParticipating(isParticipating);
    // Retourne également la valeur pour une utilisation éventuelle
    return isParticipating;
  };

  const handleCancelParticipation = async () => {
    try {
      // Récupérez la référence du document de la balade
      const baladeDocRef = doc(firestore, "balade", id);

      // Obtenez le snapshot du document de la balade
      const baladeDocSnap = await getDoc(baladeDocRef);

      if (baladeDocSnap.exists()) {
        // Obtenez la liste actuelle des participants
        const currentParticipants = baladeDocSnap.data().participants || [];

        // Filtrez les participants pour ne conserver que ceux qui ne sont pas des chiens de l'utilisateur
        const updatedParticipants = currentParticipants.filter(
          (participant) => !isDogParticipant(participant, dogs)
        );

        // Mettez à jour le document de la balade avec la nouvelle liste de participants
        await updateDoc(baladeDocRef, { participants: updatedParticipants });

        // Mettez à jour l'état local
        setParticipants(updatedParticipants);

        console.log("Annulation de la participation réussie.");
      } else {
        console.log("Balade introuvable.");
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de la participation :", error);
    }
  };

  // Fonction utilitaire pour vérifier si un participant est un chien de l'utilisateur
  const isDogParticipant = (participant, userDogs) => {
    return userDogs.some(
      (dog) =>
        participant.name === dog.name && participant.maitre === dog.maitre
    );
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @USE EFFECT
  ///////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    loadCreator();
    loadDogs();
    loadParticipants();

    // Définissez l'intervalle pour recharger les participants
    const intervalId = setInterval(() => {
      loadParticipants();
    }, 10000); // 30000 millisecondes équivalent à 30 sec

    // Nettoyez l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    checkParticipationStatus(participants, dogs);
  }, [participants, dogs]);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @AFFICHAGE
  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={loadParticipants}>
        <Icon name="refresh-outline" size={20} color="#000" />
      </TouchableOpacity>
      <InfoButtonModal />

      <Text style={styles.pseudo}>Balade créee par {pseudo}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.date}>
        Le {formattedDate} à {formattedTime}
      </Text>
      <Text style={styles.duration}>Durée : {duration}</Text>
      <View style={styles.imageContainer}>
        <Image source={avatar} style={styles.image} />
      </View>
      <Text style={styles.infos}>{infos}</Text>
      <View style={styles.buttonContainer}>
        {/* Bouton "Je participe" s'affiche si l'utilisateur ne participe pas encore */}
        {!isParticipating && (
          <TouchableOpacity onPress={toggleSelectModal}>
            <Text style={styles.participationButton}>Je participe</Text>
          </TouchableOpacity>
        )}

        {/* Bouton "Annuler ma participation" s'affiche si l'utilisateur participe déjà */}
        {isParticipating && (
          <TouchableOpacity onPress={() => handleCancelParticipation()}>
            <Text style={styles.participationButton}>
              Annuler ma participation
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.participantsContainer}>
        <Text style={styles.participantsTitle}>Participants :</Text>
        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.participantItem}>
              <TouchableOpacity onPress={() => toggleInfoModal(item)}>
                <Image source={item.avatar} style={styles.participantAvatar} />
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
      </View>

      {/* Modal pour selectionné un chien */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectModal}
        onRequestClose={toggleSelectModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez vos chiens</Text>
            <FlatList
              data={dogs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dogItem}
                  onPress={() => handleDogSelection(item)}
                >
                  <Image source={item.avatar} style={styles.dogAvatar} />
                  <Text style={styles.dogName}>{item.name}</Text>
                  {/* Affichez un indicateur pour les chiens déjà sélectionnés */}
                  {selectedDogs.some((dog) => dog.name === item.name) && (
                    <Icon
                      name="md-checkmark-circle-outline"
                      size={20}
                      color="green"
                      style={styles.selectedIcon}
                    />
                  )}
                </TouchableOpacity>
              )}
              numColumns={3}
            />
            <TouchableOpacity
              style={styles.selectButton}
              onPress={async () => {
                toggleSelectModal();
                handleParticipant();
                console.log(participants);
              }}
            >
              <Text style={{ color: "white" }}>Terminé</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#158FC3",
  },
  name: {
    marginTop: 50,
    marginBottom: 30,
    fontSize: 24,
    fontWeight: "bold",
  },
  date: {
    fontSize: 18,
    marginBottom: 10,
  },
  duration: {
    fontSize: 16,
    marginBottom: 30,
  },
  infos: {
    fontSize: 18,
    paddingHorizontal: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 30,
  },
  pseudo: {
    marginTop: 30,
    fontStyle: "italic",
    fontSize: 15,
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
    marginBottom: 10,
  },
  participantItem: {
    marginRight: 10,
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
  buttonContainer: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  participationButton: {
    backgroundColor: "#333",
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dogList: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  dogItem: {
    alignItems: "center",
  },
  dogAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  dogName: {
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: "#333",
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },

  modalContainer: {
    marginTop: "50%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "50%",
  },
  modalContent: {
    backgroundColor: "skyblue",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  modalTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dogList: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  dogItem: {
    alignItems: "center",
    marginBottom: 10,
  },
  dogAvatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
    marginBottom: 5,
  },
  dogName: {
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  selectedIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  refreshButton: {
    padding: 5,
    backgroundColor: "lightgreen",
    position: "absolute",
    top: 10,
    right: 10,
    borderWidth: 1,
    borderRadius: 25,
    textAlign: "center",
  },
});
