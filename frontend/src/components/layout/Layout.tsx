import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log(token ? "🟢 LOGGED IN" : "🔴 LOGGED OUT");
  }, [location]);

  return children;
};

export default Layout;