import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, Nav, Navbar, NavbarToggler, NavItem } from "reactstrap";
import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarToggler
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="container-fluid" navbar>
            <NavItem className="mr-auto">GroTrack</NavItem>
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
