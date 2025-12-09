import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      {!loggedIn && null}

      {!loggedIn ? (
        <Login onLogin={setLoggedIn} />
      ) : (
        <>
          <Navbar />
          <Manager />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
