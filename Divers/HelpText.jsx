import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";

const HelpText = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 30000);
  }, []);

  return isVisible ? (
    <Text style={styles.text}>Appuyez longuement sur la carte pour créer une balade</Text>
  ) : (
    <Text></Text>
  );
};

const styles = StyleSheet.create({
  text: {
    padding: 8,
    borderRadius: 5,
    position: "absolute",
    top: 150,
    left: "9%",
    fontSize: 13,
    fontWeight: "bold",
    backgroundColor: "#158FC3",
    color: '#fff',
    borderWidth:1,
    borderColor: "black",
  },
  hiddenText: {
    opacity: 0,
  },
});

export default HelpText;
