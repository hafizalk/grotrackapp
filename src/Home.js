import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "./index";
import { FormGroup, Input, Label, Progress } from "reactstrap";
import AddItemModalContainer from "AddItemModalContainer";
import React, { useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "ITEM_BOUGHT":
      return state.map((item) => {
        if (item.id === action.id) {
          return { ...item, bought: !item.bought };
        } else {
          return item;
        }
      });
    case "NEW_ITEM":
      return [...state, action.item];
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.item.id);
    default:
      return [];
  }
};
const Home = () => {
  const { visible, toggle } = useModal();

  const [formValid, setFormValid] = useState(true);

  const [itemList, dispatch] = useReducer(reducer, []);

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
  return (
    <>
      <FormGroup>
        <Input
          id="grocerySearch"
          name="search"
          placeholder="Search items from grocery list"
          type="search"
        />
      </FormGroup>
      <FormGroup>
        {itemList.map((item) => (
          <div key={item.id} className="flex-container">
            <div className="flex-item">
              <label>
                <input
                  type="checkbox"
                  checked={item.bought}
                  onChange={() =>
                    dispatch({ type: "ITEM_BOUGHT", id: item.id })
                  }
                />{" "}
                {item.name}
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
                style={{
                  width: "95%",
                }}
                animated
                color="success"
              ></Progress>
            </div>
            <FontAwesomeIcon
              id="removeItem"
              icon={faCircleXmark}
              onClick={() => dispatch({ type: "REMOVE_ITEM", item })}
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
    </>
  );
};

export default Home;
