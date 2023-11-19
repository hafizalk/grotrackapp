import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Collapse,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { io } from "socket.io-client";
import { serverUrl, socket } from "index";
import Banner from "Banner";

const Ticktick = ({server}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLetter, setSelectedletter] = useState("A");
  const [roomId, setRoomId] = useState(null);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();
    socket.emit("message", "Hello, server!");
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGameStartEvent(value) {
      console.log(value);
      setRoomId(value.room);
      setSelectedletter(value.selectedLetter);
    }

    function onJoinedRoomEvent(value) {
      console.log("room joined");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("roomCreated", onGameStartEvent);
    if (roomId) {
      socket.on(roomId, onJoinedRoomEvent);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("roomCreated", onGameStartEvent);
      socket.off("roomId", onJoinedRoomEvent);
    };
  }, [roomId]);

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  var alphabet = [...Array(26)].map((e, i) =>
    (i + 10).toString(36).toUpperCase()
  );

  const options = alphabet.map((letter) => {
    return { value: letter, label: letter };
  });

  return (
    <div>
      <Banner/>
      <div className="d-flex p-5 justify-content-center">
        <Select
          options={options}
          value={selectedLetter}
          onChange={(e) => {
            setSelectedletter(e);
          }}
          placeholder="Choose letter for Tick tick"
        />
      </div>
      <div className="d-flex p-5 justify-content-around">
        {isConnected && (
          <Button
            color="primary"
            outline
            onClick={(e) => {
              e.preventDefault();
              socket.emit("createRoom", { selectedLetter });
            }}
          >
            Start Game
          </Button>
        )}
        {roomId && (
          <Button
            color="success"
            onClick={(e) => {
              e.preventDefault();
              localStorage.setItem("roomId", roomId);
              socket.emit("joinGame", { roomId });
              navigate("/game");
            }}
          >
            Join Game
          </Button>
        )}
      </div>
    </div>
  );
};

export default Ticktick;
