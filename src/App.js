//import logo from "./logo.svg";
import "./App.css";
import Login from "Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "SignUp";
import React from "react";
import Home from "Home";
import RouteGuard from "RouteGuard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/home"
            element={
              <RouteGuard>
                <Home />
              </RouteGuard>
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/signup/*" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
