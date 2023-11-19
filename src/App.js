import "./App.css";
import Login from "Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "SignUp";
import React from "react";
import Home from "Home";
import RouteGuard from "RouteGuard";
import Ticktick from "Ticktick";
import Gamepage from "Gamepage";

function App({server}) {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/home"
            element={
              <RouteGuard>
                <Home server={server}/>
              </RouteGuard>
            }
          />
          <Route
            path="/ticktick"
            element={
              <RouteGuard>
                <Ticktick server={server} />
              </RouteGuard>
            }
          />
          <Route
            path="/game"
            element={
              <RouteGuard>
                <Gamepage server={server}/>
              </RouteGuard>
            }
          />
          <Route path="/" element={<Login server={server}/>} />
          <Route path="/login/*" element={<Login server={server}/>} />
          <Route path="/signup/*" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
