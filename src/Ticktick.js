import { faCopy, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Collapse,
  Form,
  FormGroup,
  Input,
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
import { set } from "lodash";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "react-toastify";

const Ticktick = ({ server }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLetter, setSelectedletter] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [roomCreated, setRoomCreated] = useState(false);
  const [value, copy] = useCopyToClipboard();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [joinedRoom, setJoinedRoom] = useState(false);

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
      if (value.status == "playerExists") {
        toast.error("Player already joined game");
      } else if (value.status == "playerJoined") {
        toast.success("Player successfully joined game");
      }
      navigate("/game");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("roomCreated", onGameStartEvent);
    socket.on(roomId, onJoinedRoomEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("roomCreated", onGameStartEvent);
      socket.off(roomId, onJoinedRoomEvent);
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
      <Banner />

      <div className="d-flex p-5 justify-content-around">
        <Col md={6}>
          <Select
            options={options}
            value={selectedLetter}
            onChange={(e) => {
              setSelectedletter(e);
            }}
            placeholder="Choose letter for Tick tick"
          />
        </Col>
        <Col md={6}>
          {isConnected && selectedLetter && (
            <Button
              color="primary"
              outline
              onClick={(e) => {
                e.preventDefault();
                socket.emit("createRoom", { selectedLetter });
                setRoomCreated(true);
              }}
            >
              Start Game
            </Button>
          )}
        </Col>
      </div>
      {roomCreated && (
        <div className="d-flex p-5 justify-content-around">
          <Col md={9}>
            <Input
              id="roomId"
              placeholder="Room Id"
              value={roomId}
              disabled={true}
              type="text"
            />
          </Col>
          <Col md={3}>
            <FontAwesomeIcon
              id="copyIcon"
              icon={faCopy}
              title={"Copy Room Id"}
              size="lg"
              onClick={() => copy(roomId)}
            />
          </Col>
        </div>
      )}
      <div className="d-flex p-5 justify-content-around">
        <Col md={7}>
          <Input
            id="joinRoom"
            placeholder="Enter Room Id to Join"
            type="text"
            onChange={(e) => setRoomId(e.target.value)}
          />
        </Col>
        <Col md={5}>
          <Button
            color="success"
            onClick={(e) => {
              e.preventDefault();
              localStorage.setItem("roomId", roomId);
              localStorage.setItem("selectedLetter", selectedLetter.value);
              socket.emit("joinGame", {
                roomId,
                email: localStorage.getItem("email"),
              });
              setJoinedRoom(true);
            }}
          >
            Join Game
          </Button>
        </Col>
      </div>
    </div>
  );
};

export default Ticktick;
