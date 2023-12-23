import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Balade from "../Components/Balade";
import { firestore, app, auth } from "../config/firebaseconfig";
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc } from "firebase/firestore";
import { useUser } from "../Contexts/UserContext";
import { useUserDogs } from "../Contexts/UserDogs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { NavigationContainer } from "@react-navigation/native";
import BaladeDetails from "../Components/BaladeDetails";

export default function MapScreen({ navigation }) {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @VABLIABLES
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const { user, setUser } = useUser();
  const { userDogs, setUserDogs } = useUserDogs();
  const [userLocation, setUserLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [baladeName, setBaladeName] = useState("");
  const [baladeInfos, setBaladeInfos] = useState("");
  const [balades, setBalades] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [longPressLocation, setLongPressLocation] = useState();
  const [baladeAvatar, setBaladeAvatar] = useState(
    require("../assets/images/Logoapp.png")
  );

  const [region, setRegion] = useState(null);

  const [isTextVisible, setTextVisible] = useState(false);

  const [loading, setLoading] = useState();

  const avatarImages = [
    require("../assets/images/Logoapp.png"),
    require("../assets/images/AkitaAmericain.png"),
    require("../assets/images/Akita.png"),
    require("../assets/images/AmericanStaffordshireTerrier.png"),
    require("../assets/images/AmericanStaffordshireTerriergris.png"),
    require("../assets/images/AmericanStaffordshireTerrierBringé.png"),
    require("../assets/images/Barbet.png"),
    require("../assets/images/Barbetnoir.png"),
    require("../assets/images/Basenji.png"),
    require("../assets/images/Bauceron.png"),
    require("../assets/images/Beagle.png"),
    require("../assets/images/BergerAllemand.png"),
    require("../assets/images/BergerAustralien.png"),
    require("../assets/images/BergerBelge.png"),
    require("../assets/images/BergerBelgenoir.png"),
    require("../assets/images/BergerBlancSuisse.png"),
    require("../assets/images/BichonMaltais.png"),
    require("../assets/images/BorderCollie.png"),
    require("../assets/images/BouledogueAnglais.png"),
    require("../assets/images/Bouledoguefrançais.png"),
    require("../assets/images/Boxer.png"),
    require("../assets/images/BraquedeWeimar.png"),
    require("../assets/images/Bullmastiff.png"),
    require("../assets/images/BullTerrier.png"),
    require("../assets/images/CaneCorso.png"),
    require("../assets/images/Caniche.png"),
    require("../assets/images/Carlin.png"),
    require("../assets/images/CavalierKingCharlesSpaniel.png"),
    require("../assets/images/LabradorChocolat.png"),
    require("../assets/images/Beagle.png"),
    require("../assets/images/HuskySibérien.png"),
    require("../assets/images/Malamute.png"),
    require("../assets/images/Basenji.png"),
    require("../assets/images/Yorkshire.png"),
    require("../assets/images/Chihuahua.png"),
    require("../assets/images/ChowChow.png"),
    require("../assets/images/ChowChownoir.png"),
    require("../assets/images/Cocker.png"),
    require("../assets/images/Dalmatien.png"),
    require("../assets/images/Doberman.png"),
    require("../assets/images/DogueAllemand.png"),
    require("../assets/images/DogueAllemandblanc.png"),
    require("../assets/images/GoldenRetriever.png"),
    require("../assets/images/GoldenRetrieverroux.png"),
    require("../assets/images/HuskySibérien.png"),
    require("../assets/images/JackRussell.png"),
    require("../assets/images/Labrador.png"),
    require("../assets/images/LabradorChocolat.png"),
    require("../assets/images/Labradornoir.png"),
    require("../assets/images/Malamute.png"),
    require("../assets/images/Malinois.png"),
    require("../assets/images/Pinscher.png"),
    require("../assets/images/Pitbull.png"),
    require("../assets/images/Pitbullbrun.png"),
    require("../assets/images/Rottweiler.png"),
    require("../assets/images/ShibaInu.png"),
    require("../assets/images/ShihTzu.png"),
    require("../assets/images/Teckel.png"),
    require("../assets/images/Teckelnoir.png"),
    require("../assets/images/TerreNeuve.png"),
    require("../assets/images/Yorkshire.png"),
    require("../assets/images/AmericanStaffordshireTerrier.png"),
    require("../assets/images/AmericanStaffordshireTerriergris.png"),
    require("../assets/images/AmericanStaffordshireTerrierBringé.png"),
    require("../assets/images/Caniche.png"),
  ];

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

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @FONCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } else {
        console.log("Autorisation refusée");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la position :", error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleLongPress = (e) => {
    setModalVisible(true);
    const { nativeEvent } = e;
    const longPressLocation = nativeEvent.coordinate;
    setLongPressLocation(longPressLocation);
  };

  // Choisir l'avatar de la balade
  const handleImagePress = (imageUrl) => {
    setBaladeAvatar(imageUrl);
    setTextVisible(true);
    setTimeout(hideText, 2000);
  };

  // Fonction pour masquer le texte après 2 secondes
  const hideText = () => {
    setTextVisible(false);
  };

  const handleCreateBalade = async () => {
    if (!baladeName || !selectedDate) {
      // Afficher une alerte demandant de remplir les informations manquantes
      Alert.alert(
        "Attention",
        "Veuillez remplir tous les champs avant de créer la balade."
      );
      return;
    }

    // Vérifier si la date est déjà passée
    if (selectedDate.getTime() < Date.now()) {
      // Afficher une alerte indiquant que la date est déjà passée
      Alert.alert("Attention", "La date sélectionnée est déjà passée.");
      return;
    }

    const baladeCreator = user.uid;

    await SaveBalade(
      baladeName,
      longPressLocation,
      selectedDuration,
      selectedDate,
      baladeInfos,
      baladeAvatar,
      baladeCreator
    );

    setSelectedDuration(null);
    setBaladeName("");
    setModalVisible(false);
    setSelectedDate(null);
    setLongPressLocation(null);
    setBaladeInfos("");

    loadBalades();
  };

  // CHECK
  const checkUserToken = async () => {
    try {
      const userTokenString = await AsyncStorage.getItem("userData");

      if (userTokenString) {
        const userTokenObject = JSON.parse(userTokenString);
        setUser(userTokenObject);
      } else {
        console.log("pas de user data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecenterMap = () => {
    const newRegion = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setRegion(newRegion);

    // Ajoutez un délai de 2 secondes avant de réinitialiser la région à null
    setTimeout(() => {
      setRegion(null);
    }, 2000);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @BASE DE DONNEES
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const loadBalades = async () => {
    try {
      setLoading(true); // Activer le chargement
      const baladesCollection = collection(firestore, "balade");
      const baladesSnapshot = await getDocs(baladesCollection);
      const loadedBalades = [];

      const currentTime = new Date();

      baladesSnapshot.forEach(async (doc) => {
        const baladeData = doc.data();
        baladeData.date = baladeData.date.toDate(); // Convertir le Timestamp en objet Date
        baladeData.id = doc.id;

        // Vérifier si la date est dépassée de plus de 3 heures
        const timeDifference = currentTime - baladeData.date;
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference <= 3) {
          loadedBalades.push(baladeData);
        } else {
          // Si la date est dépassée de plus de 3 heures, supprimer la balade de la base de données
          await deleteDoc(doc.ref);
          console.log(
            `Balade ${doc.id} supprimée car la date est dépassée de plus de 3 heures.`
          );
        }
      });

      setBalades(loadedBalades);
    } catch (error) {
      console.error("Erreur lors du chargement des balades : ", error);
    } finally {
      setTimeout(() => {
        setLoading(false); // Désactiver le chargement, que l'opération réussisse ou échoue
      }, 100);
    }
  };

  const SaveBalade = async (
    name,
    position,
    duration,
    date,
    infos,
    avatar,
    creator
  ) => {
    try {
      const BaladeCollection = collection(firestore, "balade");

      await addDoc(BaladeCollection, {
        name: name,
        position: position,
        duration: duration,
        date: date,
        infos: infos,
        avatar: avatar,
        createur: creator,
        participants: "",
      });

      console.log("Données enregistrées avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données : ", error);
    }
  };

  const loadUserDogs = async () => {
    if (!user) {
      console.log("User introuvable");
      return;
    }
    try {
      const chienDocRef = doc(firestore, "chien", user.uid);
      const chienDocSnap = await getDoc(chienDocRef);

      if (chienDocSnap.exists()) {
        const chienData = chienDocSnap.data();
        // Charger les chiens depuis le document du profil
        const loadedDogs = chienData.dogs || [];
        setUserDogs(loadedDogs);
        console.log("Liste de chiens mis à jour.");
      } else {
        console.log("erreur.");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil : ", error);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @USE EFFECT
  ///////////////////////////////////////////////////////////////////////////////////////////////

  // Chargez les balades lors de l'initialisation du composant
  useEffect(() => {
    getLocation();
    checkUserToken();
    loadBalades();
    // Définissez l'intervalle pour recharger les balades toutes les minutes
    const intervalId = setInterval(() => {
      loadBalades();
    }, 30000); // 30000 millisecondes équivalent à 30 sec

    // Nettoyez l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    loadUserDogs();
  }, [user]);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @AFFICHAGE
  ///////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="black" />

      {/* Indicateur de chargement */}
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color="#158FC3" />
        </View>
      )}

      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={region}
          onLongPress={handleLongPress}
        >
          {/* Marqueur sur la carte */}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Votre position"
            pinColor="blue"
          />
          {/* Marqueurs des balades */}
          {balades.map((balade, index) => (
            <Balade
              key={index}
              id={balade.id}
              position={balade.position}
              name={balade.name}
              date={balade.date}
              duration={balade.duration}
              infos={balade.infos}
              avatar={balade.avatar}
              creator={balade.createur}
            />
          ))}
        </MapView>
      )}

      {/* Bouton "Créer une balade" */}
      {modalVisible && (
        <View style={styles.modalContainer}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle} onPress={handleCreateBalade}>
                Créer une balade
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Nom de la balade"
                placeholderTextColor={"grey"}
                value={baladeName}
                onChangeText={setBaladeName}
              />
              <TextInput
                style={styles.inputInfo}
                placeholder="Description de la balade"
                placeholderTextColor={"grey"}
                value={baladeInfos}
                onChangeText={setBaladeInfos}
                multiline={true} // Définit la possibilité de plusieurs lignes
                numberOfLines={4} // Facultatif : définir le nombre de lignes visibles
                returnKeyType="done" // Ferme le clavier lorsque le bouton "Done" est pressé
                blurOnSubmit={true}
              />

              <SelectDropdown
                data={durations}
                onSelect={(selectedItem) => setSelectedDuration(selectedItem)}
                defaultButtonText="Sélectionnez la durée"
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => item}
                buttonStyle={styles.dropdownButton} // Style du bouton de sélection
                buttonTextStyle={[
                  styles.dropdownButtonText,
                  styles.customDefaultButtonTextStyle,
                ]}
                // Style du texte du bouton de sélection
                rowStyle={styles.dropdownRow} // Style de chaque élément de la liste déroulante
                rowTextStyle={styles.dropdownRowText}
              />

              {/* Bouton pour ouvrir le sélecteur de date/heure */}
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={showDatePicker}
              >
                <Text style={styles.buttonText}>
                  {selectedDate
                    ? format(selectedDate, "dd MMMM yyyy HH:mm", { locale: fr })
                    : "Sélectionner la date et l'heure"}
                </Text>
              </TouchableOpacity>

              {/* Composant DateTimePickerModal */}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={(date) => {
                  setSelectedDate(date);
                  hideDatePicker();
                }}
                onCancel={hideDatePicker}
                locale="fr-FR"
              />

              {/* Carrousel horizontal d'images */}
              <FlatList
                data={avatarImages}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleImagePress(item)}>
                    <Image source={item} style={styles.imageCarouselItem} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <View style={styles.containerText}>
                {/* Affichez le texte uniquement s'il est visible */}
                {isTextVisible && (
                  <Text style={styles.selectedImageText}>
                    Avatar sélectionné !
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateBalade}
              >
                <Text style={styles.buttonText}>Créer la balade</Text>
              </TouchableOpacity>

              {/* Bouton "Annuler" pour fermer la modale */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}

      {/* Bouton de rafraîchissement */}
      <TouchableOpacity style={styles.refreshButton} onPress={loadBalades}>
        <AntDesign name="reload1" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mesBaladesButton}
        onPress={() => navigation.navigate("Mes Balades")}
      >
        <FontAwesome name="map" size={24} color="white" />
        <Text style={styles.mesBaladesButtonText}>Mes Balades</Text>
      </TouchableOpacity>

      {/* Bouton de recentrage */}
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={handleRecenterMap}
      >
        <FontAwesome name="crosshairs" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  loadingIndicator: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 9,
  },

  refreshButton: {
    width: 45,
    height: 45,
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#158FC3",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Ajoute une légère ombre
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  refreshButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  mesBaladesButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "#158FC3",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  mesBaladesButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },

  recenterButton: {
    width: 45,
    height: 45,
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#158FC3",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @MODAL
  ///////////////////////////////////////////////////////////////////////////////////////////////
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Fond semi-transparent noir
    paddingHorizontal: 20,
    position: "absolute",
  },
  modalContent: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 30,
    textAlign: "center",
    color: "white",
  },
  input: {
    color: "white",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#158FC3",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  inputInfo: {
    color: "white",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#158FC3",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 100,
  },
  createButton: {
    backgroundColor: "#158FC3",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 35,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  datePickerButton: {
    backgroundColor: "#158FC3",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#158FC3",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "50%",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Style pour le carrousel horizontal d'images
  imageCarouselItem: {
    width: 100, // Largeur de chaque élément de l'image
    height: 100, // Hauteur de chaque élément de l'image
    marginHorizontal: 0, // Marge horizontale entre les éléments de l'image
    borderRadius: 10, // Bord arrondi pour chaque élément de l'image
  },

  containerText: {
    alignItems: "center",
  },

  selectedImageText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    position: "absolute",
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @DROPDOWN
  ///////////////////////////////////////////////////////////////////////////////////////////////
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
});
