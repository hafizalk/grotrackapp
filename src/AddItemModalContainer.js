import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

const AddItemModalContainer = ({
  formValid,
  setFormValid,
  dispatch,
  visible,
  toggle,
  itemList,
}) => {
  const [newItemForm, setNewItemForm] = useState({});
  const [restockDateValid, setRestockDateValid] = useState(true);
  const [itemNameValid, setItemNameValid] = useState(true);

  function isRestockDateValid(restockDate, purchaseDate) {
    return (
      Math.floor(
        (new Date(restockDate).getTime() - new Date().getTime()) /
          (24 * 3600 * 1000)
      ) >= 0 &&
      (purchaseDate
        ? Math.floor(
            (new Date(restockDate).getTime() -
              new Date(purchaseDate).getTime()) /
              (24 * 3600 * 1000)
          ) > 0
        : true)
    );
  }
  return (
    <Modal isOpen={visible} toggle={toggle} backdrop={"static"}>
      <ModalHeader
        toggle={toggle}
        close={
          <FontAwesomeIcon
            icon={faClose}
            onClick={() => {
              setNewItemForm({});
              setRestockDateValid(true);
              setItemNameValid(true);
              toggle();
            }}
          />
        }
      >
        Add Item to Shopping List
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Item Name"
              onChange={(e) => {
                setNewItemForm({ ...newItemForm, name: e.target.value });
                setItemNameValid(
                  itemList.find((item) => item.name === e.target.value) ===
                    undefined
                );
                setFormValid(
                  itemList.find((item) => item.name === e.target.value) ===
                    undefined
                );
              }}
              invalid={!itemNameValid}
            />
            {!itemNameValid && (
              <FormFeedback>Item already added to list!</FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="date">Purchase Date</Label>
            <Input
              type="date"
              id="date"
              placeholder="Date of purchase"
              onChange={(e) => {
                setNewItemForm({
                  ...newItemForm,
                  purchaseDate: e.target.value,
                });
                setRestockDateValid(
                  newItemForm.restockDate
                    ? isRestockDateValid(
                        newItemForm.restockDate,
                        e.target.value
                      )
                    : restockDateValid
                );
                setFormValid(
                  newItemForm.restockDate
                    ? isRestockDateValid(
                        newItemForm.restockDate,
                        e.target.value
                      )
                    : formValid
                );
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="date">Restock Date</Label>
            <Input
              type="date"
              id="date"
              placeholder="Date of restock"
              onChange={(e) => {
                setNewItemForm({
                  ...newItemForm,
                  restockDate: e.target.value,
                });
                setRestockDateValid(
                  isRestockDateValid(e.target.value, newItemForm.purchaseDate)
                );
                setFormValid(
                  isRestockDateValid(e.target.value, newItemForm.purchaseDate)
                );
              }}
              invalid={!restockDateValid}
            />
            {!restockDateValid && (
              <FormFeedback>
                Restock date must be in the future and after the purchase date!
              </FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="quant">Quantity</Label>
            <Input
              type="number"
              id="quant"
              placeholder="Quantity"
              min="0"
              onChange={(e) =>
                setNewItemForm({
                  ...newItemForm,
                  quantity: e.target.value,
                })
              }
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={() => {
            dispatch({
              type: "NEW_ITEM",
              item: { ...newItemForm, id: uuidv4(), bought: false },
            });
            setNewItemForm({});
            setRestockDateValid(true);
            setItemNameValid(true);
            toggle();
          }}
          disabled={!formValid}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddItemModalContainer;
