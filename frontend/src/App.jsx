import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { useState, useEffect } from "react";
import { getToken, getUser, authAPI, setUser } from "./utils/api";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const token = getToken();
    const user = getUser();

    if (token && user) {
      
      authAPI
        .verify()
        .then((data) => {
          setLoggedIn(true);
          if (data?.user) {
            setUser(data.user);
          }
        })
        .catch(() => {
          
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
