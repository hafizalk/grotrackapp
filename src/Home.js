import {
  faCirclePlus,
  faCircleXmark,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "./index";
import {
  Collapse,
  FormGroup,
  Label,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  Progress,
} from "reactstrap";
import AddItemModalContainer from "AddItemModalContainer";
import React, { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtInterceptor from "jwtInterceptor";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "ITEM_BOUGHT":
      return state.map((item) => {
        if (item.id === action.id) {
          return { ...item, itemBought: !item.itemBought };
        } else {
          return item;
        }
      });
    case "NEW_ITEM":
      return [...state, action.item];
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.item.id);
    case "INIT_LIST":
      return [...action.allItems];
    default:
      return [];
  }
};

const Home = ({ server }) => {
  const navigate = useNavigate();

  const { visible, toggle } = useModal();

  const [formValid, setFormValid] = useState(true);

  const [itemList, dispatch] = useReducer(reducer, []);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchAllItemList();
  }, []);

  function fetchAllItemList() {
    jwtInterceptor
      .get(`${server}/shoplist/getshoplistitems`)
      .then((response) => {
        dispatch({ type: "INIT_LIST", allItems: response.data });
      })
      .catch((err) => {
        toast(
          "Failed to fetch shopping list for user: "
            .concat(localStorage.getItem("email"))
            .concat(" Please try again shortly")
        );
        dispatch({ type: "INIT_LIST", allItems: [] });

        if (err.response.status === 401) {
          toast("Access token expired. Redirecting to login page");
          navigate("/login");
        }
      });
  }

  function updateItem(item) {
    jwtInterceptor
      .post(`${server}/shoplist/updateshoplistitem`, item)
      .then((response) => {
        dispatch({ type: "ITEM_BOUGHT", id: item.id });
      })
      .catch((err) => {
        toast(
          "Failed to update shopping item for user: "
            .concat(localStorage.getItem("email"))
            .concat(" Please try again shortly")
        );

        if (err.response.status === 401) {
          toast("Access token expired. Redirecting to login page");
          navigate("/login");
        }
      });
  }

  function removeItem(item) {
    jwtInterceptor
      .delete(`${server}/shoplist/removeshoplistitem/`.concat(item.id))
      .then((response) => {
        dispatch({ type: "REMOVE_ITEM", item });
      })
      .catch((err) => {
        toast(
          "Failed to delete item from shopping list for user: "
            .concat(localStorage.getItem("email"))
            .concat(" Please try again shortly")
        );

        if (err.response.status === 401) {
          toast("Access token expired. Redirecting to login page");
          navigate("/login");
        }
      });
  }

  function calcNow(item) {
    return Math.floor(
      (new Date().getTime() - new Date(item.purchaseDate).getTime()) /
        (24 * 3600 * 1000)
    );
  }

  function calcMax(item) {
    return Math.floor(
      (new Date(item.restockDate).getTime() -
        new Date(item.purchaseDate).getTime()) /
        (24 * 3600 * 1000)
    );
  }

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
      {/* <FormGroup>
        <Input
          id="grocerySearch"
          name="search"
          placeholder="Search items from grocery list"
          type="search"
        />
      </FormGroup> */}
      <FormGroup>
        {itemList.map((item) => (
          <div key={item.id} className="flex-container">
            <div className="flex-item">
              <label>
                <input
                  type="checkbox"
                  checked={item.bought}
                  onChange={() => {
                    let updatedItem = { ...item, itemBought: !item.itemBought };
                    updateItem(updatedItem);
                  }}
                />{" "}
                {item.itemName}
              </label>
            </div>
            <div className="flex-item">
              <FormGroup>
                <Label for="quantityInList">Quantity:</Label> {item.quantity}
              </FormGroup>
            </div>
            <div className="flex-item">
              <span>
                {`${calcMax(item) - calcNow(item)} day(s) to restock`}
              </span>
              <Progress
                max={calcMax(item)}
                value={calcNow(item)}
                style={{ width: "95%" }}
                animated
                color="success"
              ></Progress>
            </div>
            <FontAwesomeIcon
              id="removeItem"
              icon={faCircleXmark}
              onClick={() => removeItem(item)}
              title="Remove Item"
              size="sm"
            />
          </div>
        ))}
      </FormGroup>
      <FormGroup>
        <FontAwesomeIcon
          id="addNewItem"
          icon={faCirclePlus}
          onClick={toggle}
          title="Add new item to grocery list"
          size="xl"
        />
      </FormGroup>
      <AddItemModalContainer
        formValid={formValid}
        setFormValid={setFormValid}
        dispatch={dispatch}
        visible={visible}
        toggle={toggle}
        itemList={itemList}
      />
    </div>
  );
};

export default Home;
