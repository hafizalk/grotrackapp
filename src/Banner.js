import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">GroTrack</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="container-fluid" navbar>
            <NavItem className="mr-auto">
              <NavLink href="/home">GroTrack Cart</NavLink>
            </NavItem>
            <NavItem className="mr-auto">
              <NavLink href="/ticktick">Tick Tick Game</NavLink>
            </NavItem>
            <NavItem className="ms-auto">
              <FontAwesomeIcon
                id="userDetails"
                icon={faUser}
                title={localStorage.getItem("username")}
                size="sm"
              />{" "}
              <FontAwesomeIcon
                id="signOut"
                icon={faSignOut}
                onClick={() => logout()}
                title="Sign Out"
                size="sm"
              />
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Banner;
