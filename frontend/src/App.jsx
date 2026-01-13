import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { useState, useEffect } from "react";
import { getToken, getUser, authAPI } from "./utils/api";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = getToken();
    const user = getUser();

    if (token && user) {
      // Verify token with backend
      authAPI
        .verify()
        .then(() => {
          setLoggedIn(true);
        })
        .catch(() => {
          // Token invalid, clear auth
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <div className="text-green-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {!loggedIn ? (
        <Login onLogin={setLoggedIn} />
      ) : (
        <>
          <Navbar onLogout={() => setLoggedIn(false)} />
          <Manager />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
