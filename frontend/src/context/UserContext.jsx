import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Load user, partner, and sharing settings from localStorage if available
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [partner, setPartner] = useState(
    JSON.parse(localStorage.getItem("partner")) || null
  );
  const [sharingSettings, setSharingSettings] = useState(
    JSON.parse(localStorage.getItem("sharingSettings")) || {
      enabled: false,
      options: {
        nextPeriod: true,
        fertileWindow: true,
        currentPhase: true,
        historicalData: false,
        symptoms: false,
        notifications: false,
      },
      links: [],
    }
  );

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("partner", JSON.stringify(partner));
  }, [partner]);

  useEffect(() => {
    localStorage.setItem("sharingSettings", JSON.stringify(sharingSettings));
  }, [sharingSettings]);

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

  // New functions for partner sharing functionality
  const updateSharingOptions = (options) => {
    setSharingSettings((prev) => ({
      ...prev,
      options: { ...prev.options, ...options },
    }));
  };

  const createSharingLink = (password) => {
    // Generate a unique ID for the link
    const sharingId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const newLink = {
      id: sharingId,
      url: `${window.location.origin}/shared/${sharingId}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      options: { ...sharingSettings.options },
      isActive: true,
    };

    // Store the hashed password in a real implementation
    // This is a simplified version for demonstration
    const passwordHash = password; // In a real app, hash this password

    // Save the password hash securely (in a real app this would be server-side)
    localStorage.setItem(`share_${sharingId}_pass`, passwordHash);

    // Update sharing settings
    setSharingSettings((prev) => ({
      ...prev,
      enabled: true,
      links: [...prev.links, newLink],
    }));

    return newLink;
  };

  const deactivateLink = (linkId) => {
    setSharingSettings((prev) => ({
      ...prev,
      links: prev.links.map((link) =>
        link.id === linkId ? { ...link, isActive: false } : link
      ),
    }));
  };

  const deleteLink = (linkId) => {
    // Remove the password from storage
    localStorage.removeItem(`share_${linkId}_pass`);

    // Remove the link from sharing settings
    setSharingSettings((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== linkId),
      enabled: prev.links
        .filter((link) => link.id !== linkId)
        .some((link) => link.isActive),
    }));
  };

  const disableAllSharing = () => {
    setSharingSettings((prev) => ({
      ...prev,
      enabled: false,
      links: prev.links.map((link) => ({ ...link, isActive: false })),
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        partner,
        sharingSettings,
        login,
        logout,
        shareWithPartner,
        updateSharingOptions,
        createSharingLink,
        deactivateLink,
        deleteLink,
        disableAllSharing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
