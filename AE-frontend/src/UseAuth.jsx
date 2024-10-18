import { useState, useEffect } from "react";

const useAuth = () => {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      setAuthData(JSON.parse(storedAuthData));
    }
  }, []);

  const updateAuthData = (newAuthData) => {
    setAuthData(newAuthData);
    localStorage.setItem("authData", JSON.stringify(newAuthData));
  };

  const clearAuthData = () => {
    setAuthData(null);
    localStorage.removeItem("authData");
  };

  return { authData, updateAuthData, clearAuthData };
};

export default useAuth;
