import { Image } from "react-native";
import React, { useState, useEffect } from "react";
import { Marker } from "react-native-maps";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { auth, app, firestore } from "../Config/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../Contexts/UserContext";
import { useUserDogs } from "../Contexts/UserDogs";

export default function Balade({
  id,
  position,
  name,
  duration,
  date,
  infos,
  avatar,
  creator,
}) {
  const formattedDate = date ? format(date, "d MMMM yyyy", { locale: fr }) : "";
  const formattedTime = date ? format(date, "HH:mm", { locale: fr }) : "";
  const description = `${formattedDate} à ${formattedTime} `;
  const navigation = useNavigation();
  const dateISO = date.toISOString();
  const { user } = useUser();
  const { userDogs } = useUserDogs();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    loadParticipants();
  }, [participants]);

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
  const commonDogs = userDogs.filter((dog) =>
    participants.some(
      (participant) =>
        participant.name === dog.name && participant.maitre === dog.maitre
    )
  );

  const handleMarkerPress = () => {
    navigation.navigate("BaladeDetails", {
      id,
      position,
      name,
      duration,
      date: dateISO,
      infos,
      avatar,
      creator,
    });
  };

  return (
    <>
      <Marker
        onPress={handleMarkerPress}
        coordinate={position}
        title={name}
        description={description}
      >
        <Image source={avatar} style={{ width: 60, height: 60 }} />
        {creator === user.uid && (
          <FontAwesome
            name="star"
            size={16}
            color="black"
            style={{ position: "absolute", top: -1, left: 0 }}
          />
        )}
        {commonDogs.length > 0 && (
          <FontAwesome
            name="paw"
            size={16}
            color="black"
            style={{ position: "absolute", top: -1, right: -1 }}
          />
        )}
      </Marker>
    </>
  );
}
