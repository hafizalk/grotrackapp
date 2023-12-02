import {
  faCirclePlus,
  faCircleXmark,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, FormGroup, Input, Table } from "reactstrap";
import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Banner from "Banner";
import { socket } from "index";

const Gamepage = ({ server }) => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(localStorage.getItem("roomId"));
  const [doesGameStop, setGameStop] = useState(false);
  const [animalName, setAnimalName] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [objectName, setObjectName] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedLetter, setSelectedletter] = useState(
    localStorage.getItem("selectedLetter")
  );

  useEffect(() => {
    function onGameStopEvent(value) {
      console.log(value);
      socket.emit("collateResults", {
        roomId,
        email: localStorage.getItem("email"),
        gameEntries: { animalName, countryName, objectName },
        selectedLetter: localStorage.getItem("selectedLetter"),
      });
    }

    socket.on("stopGame", onGameStopEvent);

    return () => {
      socket.off("stopGame", onGameStopEvent);
    };
  }, [roomId, animalName, countryName, objectName, localStorage]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinGame", {
      roomId,
      email: localStorage.getItem("email"),
    });
    function onGameResultEvent(value) {
      console.log(value);
      setResult(value.result);
    }

    socket.on(roomId.concat("result"), onGameResultEvent);

    return () => {
      socket.off(roomId.concat("result"), onGameResultEvent);
    };
  }, [roomId, localStorage]);

  const DisplayData = ({ result }) =>
    result.map((res) => {
      return (
        <tr key={res.key}>
          <td>{res.email}</td>
          <td>{res.score}</td>
        </tr>
      );
    });

  return (
    <div>
      <Banner />
      <div className="d-flex p-5 justify-content-around">
        <Col md={5}>
          <span>Selected Letter: </span>
        </Col>
        <Col md={5}>
          <Input value={selectedLetter} disabled />
        </Col>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Animal Name</th>
            <th>Country Name</th>
            <th>Object Name</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-primary">
            <td>
              <Input
                value={animalName}
                onChange={(e) => setAnimalName(e.target.value)}
              />
            </td>
            <td>
              <Input
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
              />
            </td>
            <td>
              <Input
                value={objectName}
                onChange={(e) => setObjectName(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </Table>
      <Button
        color="danger"
        outline
        onClick={(e) => {
          e.preventDefault();
          socket.emit("stopGame", { roomId });
          setGameStop(true);
        }}
      >
        Stop Game
      </Button>
      {result && (
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Player</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>{DisplayData({ result })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Gamepage;
