import {
  faCirclePlus,
  faCircleXmark,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal, { socket } from "./index";
import { Button, FormGroup, Input, Table } from "reactstrap";
import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Banner from "Banner";

const Gamepage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(localStorage.getItem("roomId"));
  const [doesGameStop, setGameStop] = useState(false);

  useEffect(() => {
    function onGameStopEvent(value) {
      console.log(value);
      setGameStop(value.stopGame);
    }

    socket.on("stopGame", onGameStopEvent);

    return () => {
      socket.off("stopGame", onGameStopEvent);
    };
  }, [roomId]);

  useEffect(() => {
    if (doesGameStop) {
      navigate("/");
    }
  }, [doesGameStop]);

  return (
    <div>
      <Banner />
      <Table>
        <thead>
          <tr>
            <th>Animal</th>
            <th>Place</th>
            <th>Thing</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-primary">
            <td>
              <Input />
            </td>
            <td>
              <Input />
            </td>
            <td>
              <Input />
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
        }}
      >
        Stop Game
      </Button>
    </div>
  );
};

export default Gamepage;
