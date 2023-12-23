import React, { createContext, useContext, useState } from 'react';

const UserDogsContext = createContext();

export const useUserDogs = () => {
  const context = useContext(UserDogsContext);
  if (!context) {
    throw new Error("useUserDogs must be used within a UserDogsProvider");
  }
  return context;
};

export const UserDogsProvider = ({ children }) => {
  const [userDogs, setUserDogs] = useState([]);
  
  // Ajoutez le setter dans le contexte
  const contextValue = { 
    userDogs,
    setUserDogs,
  };

  return (
    <UserDogsContext.Provider value={contextValue}>
      {children}
    </UserDogsContext.Provider>
  );
};
