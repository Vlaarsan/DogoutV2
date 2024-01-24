import React, { useState, useEffect } from "react";
import Chien from "../Components/Chien";
import SelectDropdown from "react-native-select-dropdown";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { auth, app, firestore } from "../Config/firebaseconfig";
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../Contexts/UserContext";
import { ages, race, couleur, gender, avatars } from "../Constants/Constants";

export default function ProfilScreen() {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @VARIABLES
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const { user, setUser } = useUser();

  const [pseudo, setPseudo] = useState("Utilisateur");
  const [biographie, setBiographie] = useState("");

  const [tempPseudo, setTempPseudo] = useState("");
  const [tempBiographie, setTempBiographie] = useState("");
  const [monAvatar, setMonAvatar] = useState(
    require("../assets/images/Rottweiler.png")
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isEditPpModalVisible, setEditPpModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };
  const toggleEditPpModal = () => {
    setEditPpModalVisible(!isEditPpModalVisible);
  };

  const [newDogInfo, setNewDogInfo] = useState({
    name: "",
    race: "",
    color: "",
    age: "",
    gender: "",
    avatar: "",
  });

  const [dogs, setDogs] = useState([]);

  const dogImages = {
    "Akita Americain": {
      default: require("../assets/images/AkitaAmericain.png"),
    },
    "Akita Inu": {
      default: require("../assets/images/Akita.png"),
    },

    "American Staffordshire Terrier": {
      default: require("../assets/images/AmericanStaffordshireTerrier.png"),
      Gris: require("../assets/images/AmericanStaffordshireTerriergris.png"),
      Bringé: require("../assets/images/AmericanStaffordshireTerrierBringé.png"),
    },

    Barbet: {
      default: require("../assets/images/Barbet.png"),
      Noir: require("../assets/images/Barbetnoir.png"),
    },

    Basenji: {
      default: require("../assets/images/Basenji.png"),
    },
    Bauceron: {
      default: require("../assets/images/Bauceron.png"),
    },
    "Basset Hound": {
      default: require("../assets/images/Beagle.png"),
    },
    Beagle: {
      default: require("../assets/images/Beagle.png"),
    },
    "Berger Allemand": {
      default: require("../assets/images/BergerAllemand.png"),
    },
    "Braque allemand": {
      default: require("../assets/images/BergerBelge.png"),
    },

    "Berger Australien": {
      default: require("../assets/images/BergerAustralien.png"),
    },
    "Berger Belge": {
      default: require("../assets/images/BergerBelge.png"),
      Noir: require("../assets/images/BergerBelgenoir.png"),
    },
    "Berger Blanc Suisse": {
      default: require("../assets/images/BergerBlancSuisse.png"),
    },
    "Berger des Pyrénées": {
      default: require("../assets/images/BergerBlancSuisse.png"),
    },
    "Bichon Maltais": {
      default: require("../assets/images/BichonMaltais.png"),
    },
    "Border Collie": {
      default: require("../assets/images/BorderCollie.png"),
    },
    "Bouledogue anglais": {
      default: require("../assets/images/BouledogueAnglais.png"),
    },
    "Bouledogue français": {
      default: require("../assets/images/Bouledoguefrançais.png"),
    },
    "Bouledogue américain": {
      default: require("../assets/images/Bouledoguefrançais.png"),
    },
    Boxer: {
      default: require("../assets/images/Boxer.png"),
    },
    "Braque de Weimar": {
      default: require("../assets/images/BraquedeWeimar.png"),
    },
    Bullmastiff: {
      default: require("../assets/images/Bullmastiff.png"),
    },
    "Bull Terrier": {
      default: require("../assets/images/BullTerrier.png"),
    },
    "Cane Corso": {
      default: require("../assets/images/CaneCorso.png"),
    },
    Caniche: {
      default: require("../assets/images/Caniche.png"),
    },
    Carlin: {
      default: require("../assets/images/Carlin.png"),
    },
    "Cavalier King Charles Spaniel": {
      default: require("../assets/images/CavalierKingCharlesSpaniel.png"),
    },
    "Chesapeake Bay Retriever": {
      default: require("../assets/images/LabradorChocolat.png"),
    },
    "Chien de Saint-Hubert": {
      default: require("../assets/images/Beagle.png"),
    },
    "Chien du Groenland": {
      default: require("../assets/images/HuskySibérien.png"),
    },
    "Chien finnois de Laponie": {
      default: require("../assets/images/Malamute.png"),
    },
    "Chien norvégien de Macareux": {
      default: require("../assets/images/Basenji.png"),
    },
    Pékinois: {
      default: require("../assets/images/Yorkshire.png"),
    },

    Chihuahua: {
      default: require("../assets/images/Chihuahua.png"),
    },
    "Chow-Chow": {
      default: require("../assets/images/ChowChow.png"),
      Noir: require("../assets/images/ChowChownoir.png"),
    },

    Cocker: {
      default: require("../assets/images/Cocker.png"),
    },
    Dalmatien: {
      default: require("../assets/images/Dalmatien.png"),
    },
    Doberman: {
      default: require("../assets/images/Doberman.png"),
    },
    "Dogue allemand": {
      default: require("../assets/images/DogueAllemand.png"),
      Blanc: require("../assets/images/DogueAllemandblanc.png"),
    },
    "Golden Retriever": {
      default: require("../assets/images/GoldenRetriever.png"),
      Roux: require("../assets/images/GoldenRetrieverroux.png"),
    },
    "Husky Sibérien": {
      default: require("../assets/images/HuskySibérien.png"),
    },
    "Jack Russell": {
      default: require("../assets/images/JackRussell.png"),
    },
    "Labrador Retriever": {
      default: require("../assets/images/Labrador.png"),
      Chocolat: require("../assets/images/LabradorChocolat.png"),
      Noir: require("../assets/images/Labradornoir.png"),
    },
    Malamute: {
      default: require("../assets/images/Malamute.png"),
    },
    Malinois: {
      default: require("../assets/images/Malinois.png"),
    },
    Pinscher: {
      default: require("../assets/images/Pinscher.png"),
    },
    Pitbull: {
      default: require("../assets/images/Pitbull.png"),
      Brun: require("../assets/images/Pitbullbrun.png"),
    },
    Rottweiler: {
      default: require("../assets/images/Rottweiler.png"),
    },
    "Shiba Inu": {
      default: require("../assets/images/ShibaInu.png"),
    },
    "Shih Tzu": {
      default: require("../assets/images/ShihTzu.png"),
    },
    Teckel: {
      default: require("../assets/images/Teckel.png"),
      Noir: require("../assets/images/Teckelnoir.png"),
    },
    "Terre-Neuve": {
      default: require("../assets/images/TerreNeuve.png"),
    },
    Yorkshire: {
      default: require("../assets/images/Yorkshire.png"),
    },
    "Staffordshire Bull Terrier": {
      default: require("../assets/images/AmericanStaffordshireTerrier.png"),
      Gris: require("../assets/images/AmericanStaffordshireTerriergris.png"),
      Bringé: require("../assets/images/AmericanStaffordshireTerrierBringé.png"),
    },
    "West Highland White Terrier": {
      default: require("../assets/images/Caniche.png"),
    },
  };

  const dogImage =
    dogImages[newDogInfo.race]?.[newDogInfo.color] ||
    dogImages[newDogInfo.race]?.default;

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @FONCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////////////

  // LOAD

  const loadProfileInfo = async () => {
    try {
      if (!user) {
        console.log("User introuvable");
        return;
      }

      const profileDocRef = doc(firestore, "profile", user.uid);
      const chienDocRef = doc(firestore, "chien", user.uid);
      const profileDocSnap = await getDoc(profileDocRef);
      const chienDocSnap = await getDoc(chienDocRef);

      if (profileDocSnap.exists()) {
        const profileData = profileDocSnap.data();
        setPseudo(profileData.pseudo || "");
        setTempPseudo(profileData.pseudo || "");
        setMonAvatar(profileData.profilImage);
        setBiographie(profileData.biographie || "");
        setTempBiographie(profileData.biographie || "");
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
    } catch (error) {
      console.error("Erreur lors du chargement du profil : ", error);
    }
  };

  // SAVE PROFILE

  const handleSaveProfile = async () => {
    try {
      if (!user) {
        console.log("Aucun utilisateur connecté");
        return;
      }

      const profileDocRef = doc(firestore, "profile", user.uid);

      await setDoc(profileDocRef, {
        pseudo: tempPseudo,
        email: user.email,
        profilImage: monAvatar,
        biographie: tempBiographie,
      });

      setEditModalVisible(false);
      setPseudo(tempPseudo);
      setBiographie(tempBiographie);

      console.log("Profil enregistré avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du profil : ", error);
    }
  };

  // Save DOGS

  const handleSaveDogs = async () => {
    try {
      const chienDocRef = doc(firestore, "chien", user.uid);

      await setDoc(chienDocRef, {
        dogs: dogs,
      });
      console.log("Enregistrement du chiens valide");
    } catch (error) {
      console.log("Erreur lors de l'enregistrement des chiens");
    }
  };

  // ADD DOGS

  const addNewDog = async () => {
    try {
      // Vérifiez d'abord si le nom du chien est vide
      if (newDogInfo.name.trim() === "") {
        alert("Veuillez saisir le nom du chien.");
        return;
      }

      // Ensuite, vérifiez si la race du chien est vide
      if (newDogInfo.race.trim() === "") {
        alert("Veuillez choisir la race du chien.");
        return;
      }

      const newDog = {
        name: newDogInfo.name,
        race: newDogInfo.race,
        color: newDogInfo.color,
        gender: newDogInfo.gender,
        age: newDogInfo.age,
        avatar: dogImage || require("../assets/images/Logoapp.png"), // Utilisez une image par défaut si la race n'est pas trouvée
        maitre: user.uid,
      };

      // Ajoutez le nouveau chien à la liste
      dogs.push(newDog);
      handleSaveDogs();

      // Fermez la modal
      toggleModal();
    } catch (error) {
      console.log("Erreur lors de la sauvegarde des chiens : ", error);
    }
  };

  // DELETE DOGS

  const handleDeleteDog = async (dogName) => {
    // Afficher la boîte de dialogue de confirmation
    Alert.alert(
      "Confirmation",
      `Êtes-vous sûr de vouloir supprimer ${dogName} ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const updatedDogs = dogs.filter((dog) => dog.name !== dogName);

            // Mettez à jour le tableau dogs avec le nouveau tableau sans le chien supprimé
            setDogs(updatedDogs);

            try {
              // Obtenez une référence au document utilisateur
              const chienDocRef = doc(firestore, "chien", user.uid);

              // Mettez à jour le document utilisateur avec le nouveau tableau de chiens
              await updateDoc(chienDocRef, { dogs: updatedDogs });

              console.log("Chien supprimé de la base de données avec succès");
            } catch (error) {
              console.error(
                "Erreur lors de la suppression du chien de la base de données",
                error
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // UPDATE DOG AGE
  const handleChangeAge = async (dogName, newAge) => {
    // Mettez à jour l'âge dans la liste des chiens
    const updatedDogs = dogs.map((dog) =>
      dog.name === dogName ? { ...dog, age: newAge } : dog
    );

    // Mettez à jour l'état avec la nouvelle liste de chiens
    setDogs(updatedDogs);

    try {
      // Obtenez une référence au document utilisateur
      const chienDocRef = doc(firestore, "chien", user.uid);

      // Mettez à jour le document utilisateur avec le nouveau tableau de chiens
      await updateDoc(chienDocRef, { dogs: updatedDogs });
    } catch (error) {}
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
    <ScrollView style={styles.container}>
      {/* Titre */}
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      {/* Pseudo */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{pseudo}</Text>
      </View>

      {/* Image de profil */}
      <View>
        <Image
          source={monAvatar} // Remplacez par le chemin de l'image de profil
          style={styles.profileImage}
        />
      </View>

      {/* Biographie */}
      <View style={styles.bioContainer}>
        <Text style={styles.label}>Biographie:</Text>
        <Text style={styles.bioText}>{biographie}</Text>
      </View>

      {/* Bouton "Modifier le profil" */}
      <TouchableOpacity
        style={styles.buttoneditprofil}
        on
        onPress={toggleEditModal}
      >
        <Text style={styles.buttonText}>Modifier le profil</Text>
      </TouchableOpacity>

      {/* "Mes chiens" */}
      <TouchableOpacity style={styles.dogsContainer} onPress={toggleModal}>
        <Image
          source={require("../assets/images/Add.png")}
          style={styles.dogIcon}
        />
        <Text style={styles.dogsText}>Mes chiens</Text>
      </TouchableOpacity>

      {/* Liste des chiens */}
      <View style={styles.dogsList}>
        {dogs.map((dog, index) => (
          <Chien
            key={index}
            name={dog.name}
            gender={dog.gender}
            avatar={dog.avatar}
            race={dog.race}
            age={dog.age}
            color={dog.color}
            onDelete={() => handleDeleteDog(dog.name)}
            onChangeAge={(dogName, newAge) => {
              handleChangeAge(dogName, newAge);
            }}
          />
        ))}
      </View>

      <View style={styles.vide}></View>

      {/* Modal pour ajouter un nouveau chien */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Nouveau chien</Text>
          <TextInput
            placeholder="Nom"
            placeholderTextColor={"white"}
            style={styles.input}
            onChangeText={(text) =>
              setNewDogInfo({ ...newDogInfo, name: text })
            }
          />

          {/* Composant SelectDropdown pour sélectionner la race du chien */}
          <SelectDropdown
            data={race}
            onSelect={(selectedItem, index) => {
              setNewDogInfo({ ...newDogInfo, race: selectedItem });
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdownButton} // Style du bouton de sélection
            buttonTextStyle={[
              styles.dropdownButtonText,
              styles.customDefaultButtonTextStyle,
            ]}
            // Style du texte du bouton de sélection
            rowStyle={styles.dropdownRow} // Style de chaque élément de la liste déroulante
            rowTextStyle={styles.dropdownRowText}
            defaultButtonText="Race" // Style du texte de chaque élément de la liste déroulante
          />

          <SelectDropdown
            data={couleur}
            onSelect={(selectedItem, index) => {
              setNewDogInfo({ ...newDogInfo, color: selectedItem });
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdownButton} // Style du bouton de sélection
            buttonTextStyle={[
              styles.dropdownButtonText,
              styles.customDefaultButtonTextStyle,
            ]}
            // Style du texte du bouton de sélection
            rowStyle={styles.dropdownRow} // Style de chaque élément de la liste déroulante
            rowTextStyle={styles.dropdownRowText}
            defaultButtonText="Couleur" // Style du texte de chaque élément de la liste déroulante
          />
          <SelectDropdown
            data={ages}
            onSelect={(selectedItem, index) => {
              setNewDogInfo({ ...newDogInfo, age: selectedItem });
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdownButton} // Style du bouton de sélection
            buttonTextStyle={[
              styles.dropdownButtonText,
              styles.customDefaultButtonTextStyle,
            ]}
            // Style du texte du bouton de sélection
            rowStyle={styles.dropdownRow} // Style de chaque élément de la liste déroulante
            rowTextStyle={styles.dropdownRowText}
            defaultButtonText="Age" // Style du texte de chaque élément de la liste déroulante
          />

          <SelectDropdown
            data={gender}
            onSelect={(selectedItem, index) => {
              setNewDogInfo({ ...newDogInfo, gender: selectedItem });
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdownButton} // Style du bouton de sélection
            buttonTextStyle={[
              styles.dropdownButtonText,
              styles.customDefaultButtonTextStyle,
            ]}
            // Style du texte du bouton de sélection
            rowStyle={styles.dropdownRow} // Style de chaque élément de la liste déroulante
            rowTextStyle={styles.dropdownRowText}
            defaultButtonText="Sexe" // Style du texte de chaque élément de la liste déroulante
          />
          <Image
            source={dogImage || require("../assets/images/Logoapp.png")} // Utilisez une image par défaut si la race n'est pas trouvée
            style={styles.avatarImage}
          />

          <TouchableOpacity style={styles.button} onPress={addNewDog}>
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleModal}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal pour modifier le profil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={toggleEditModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalEditTitle}>Modifier Profil</Text>

          <Text style={styles.modalEditPseudo}>Pseudo</Text>
          {/* Input pour le pseudo */}
          <TextInput
            placeholder="Nouveau pseudo"
            value={tempPseudo} // Utilisez la valeur temporaire
            onChangeText={(text) => setTempPseudo(text)} // Mettez à jour la valeur temporaire
            style={styles.inputEdit}
            maxLength={20}
            returnKeyType="done"
          />

          <Text style={styles.modalEditPseudo}>Biographie</Text>
          {/* Input pour la biographie */}
          <TextInput
            placeholder="Nouvelle biographie"
            value={tempBiographie}
            onChangeText={(text) => setTempBiographie(text)} // Mettez à jour la valeur temporaire
            style={styles.inputBio}
            maxLength={150} // Limite de 100 caractères
            multiline={true}
            returnKeyType="done" // Ferme le clavier lorsque le bouton "Done" est pressé
            blurOnSubmit={true}
          />

          {/* Image de profil */}
          <Text style={styles.modalEditPseudo}>Avatar de profil</Text>
          <TouchableOpacity onPress={toggleEditPpModal}>
            <Image
              source={monAvatar} // Remplacez par le chemin de l'image de profil
              style={styles.editProfileImage}
            />
          </TouchableOpacity>

          {/* Bouton "Enregistrer" */}
          <TouchableOpacity
            style={styles.buttonEdit}
            onPress={handleSaveProfile}
          >
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>

          {/* Bouton "Annuler" */}
          <TouchableOpacity style={styles.buttonEdit} onPress={toggleEditModal}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal pour modifier l'avatar de profil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditPpModalVisible}
        onRequestClose={toggleEditPpModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalEditTitle}>Choisissez votre avatar</Text>

          <ScrollView contentContainerStyle={styles.avatarGrid}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={styles.avatarItem}
                onPress={() => {
                  setMonAvatar(avatar);
                  // Mettez en œuvre la logique pour définir l'avatar ici
                  // Vous pouvez utiliser l'avatar sélectionné (avatar) pour mettre à jour l'avatar du profil
                  toggleEditPpModal();
                }}
              >
                <Image source={avatar} style={styles.avatarImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Bouton "Annuler" */}
          <TouchableOpacity
            style={styles.buttonEdit}
            onPress={toggleEditPpModal}
          >
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333", // Fond blanc
    padding: 20,
  },
  header: {
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: "#158FC3",
    width: "100%",
    height: 50,
    borderWidth: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "black", // Couleur de l'ombre
    textShadowOffset: { width: 2, height: 3 }, // Décalage de l'ombre (ajustez les valeurs selon vos préférences)
    textShadowRadius: 3, // Rayon de l'ombre (ajustez la valeur selon vos préférences)
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
  },

  vide: {
    marginTop: 50,
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @Pseudo
  ///////////////////////////////////////////////////////////////////////////////////////////////
  label: {
    fontWeight: "bold",
    marginRight: 10,
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  infoText: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @Image Profil
  ///////////////////////////////////////////////////////////////////////////////////////////////
  profileImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: "center", // Pour centrer l'image horizontalement
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @Bio
  ///////////////////////////////////////////////////////////////////////////////////////////////
  bioContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "rgba(21, 143, 195, 0.3)",
    borderRadius: 20,
    maxHeight: 200,
    padding: 10,
  },
  bioText: {
    fontSize: 12,
    color: "white",
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @Mes chiens
  ///////////////////////////////////////////////////////////////////////////////////////////////
  dogsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    justifyContent: "center",
  },
  dogIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  dogsText: {
    fontSize: 25,
    color: "#158FC3",
    textShadowColor: "black", // Couleur de l'ombre
    textShadowOffset: { width: 2, height: 3 }, // Décalage de l'ombre (ajustez les valeurs selon vos préférences)
    textShadowRadius: 3, // Rayon de l'ombre (ajustez la valeur selon vos préférences)
  },
  button: {
    backgroundColor: "#158FC3",
    padding: 10,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 50,
    width: "75%",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @Edit profil
  ///////////////////////////////////////////////////////////////////////////////////////////////

  buttoneditprofil: {
    backgroundColor: "#158FC3",
    padding: 10,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 50,
    width: "75%",
    marginHorizontal: "13%",
    marginBottom: 5,
  },

  editProfileImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center", // Pour centrer l'image horizontalement
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @MODAL Nouveau chien
  ///////////////////////////////////////////////////////////////////////////////////////////////
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#222",
    opacity: 1,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 40,
    color: "white",
    marginBottom: 50,
  },
  input: {
    height: 50,
    width: "80%",
    backgroundColor: "#158FC3",
    marginBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  avatarImage: {
    width: 100,
    height: 100,
    marginTop: 0,
    alignSelf: "center", // Pour centrer l'image horizontalement
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @MODAL EDIT PROFIL
  ///////////////////////////////////////////////////////////////////////////////////////////////

  modalEditTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 40,
    color: "white",
    marginBottom: 40,
  },

  inputEdit: {
    height: 50,
    width: "80%",
    backgroundColor: "#158FC3",
    marginBottom: 40,
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  buttonEdit: {
    backgroundColor: "#158FC3",
    padding: 10,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 50,
    width: "75%",
    marginHorizontal: "13%",
    marginBottom: 10,
  },

  inputBio: {
    height: 150,
    width: "80%",
    backgroundColor: "#158FC3",
    marginBottom: 40,
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  modalEditPseudo: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @MODAL EDIT Profil Picture
  ///////////////////////////////////////////////////////////////////////////////////////////////

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //                                           @DROPDOWN
  ///////////////////////////////////////////////////////////////////////////////////////////////
  dropdownButton: {
    backgroundColor: "#158FC3",
    padding: 10,
    borderRadius: 25,
    width: "80%",
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
    fontSize: 18,
    color: "white", // Couleur du texte des éléments de la liste déroulante
    textAlign: "center",
  },
  customDefaultButtonTextStyle: {
    color: "white",
    fontSize: 16,
    textAlign: "left",
  },
});
