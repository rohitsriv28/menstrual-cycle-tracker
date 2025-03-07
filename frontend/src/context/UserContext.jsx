import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Load user and partner data from localStorage if available
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [partner, setPartner] = useState(
    JSON.parse(localStorage.getItem("partner")) || null
  );

  // Save user and partner data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("partner", JSON.stringify(partner));
  }, [partner]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setPartner(null);
  };

  const shareWithPartner = (partnerData) => {
    setPartner(partnerData);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        partner,
        login,
        logout,
        shareWithPartner,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
