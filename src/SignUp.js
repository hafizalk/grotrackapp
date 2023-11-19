import React, { useState } from "react";
import { Button, Form, FormFeedback, FormGroup, Input } from "reactstrap";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "index";

const SignUp = () => {
  const [signUpForm, setSignUpForm] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const navigate = useNavigate();

  function handleSignUp(e, signUpForm) {
    e.preventDefault();
    axios
      .post(`${serverUrl}/auth/signup`, signUpForm)
      .then((result) => {
        console.log(result);
        if (result.data.success) {
          setFeedbackMessage("Sign up successful");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        setFeedbackMessage(
          "Sign up failed with error: ".concat(
            err.response ? err.response.data.message : err.message
          )
        );
      });
  }

  return (
    <Form>
      <h2 className="form-title">Sign Up</h2>
      <FormGroup>
        <Input
          type="text"
          id="firstName"
          placeholder="First Name"
          onChange={(e) => {
            setSignUpForm({ ...signUpForm, firstName: e.target.value });
          }}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="text"
          id="surname"
          placeholder="Last Name"
          onChange={(e) => {
            setSignUpForm({ ...signUpForm, surname: e.target.value });
          }}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          onChange={(e) => {
            setSignUpForm({ ...signUpForm, email: e.target.value });
          }}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => {
            setSignUpForm({ ...signUpForm, password: e.target.value });
          }}
        />
      </FormGroup>
      <FormGroup>
        <Button type="submit" onClick={(e) => handleSignUp(e, signUpForm)}>
          Sign Up
        </Button>
        {feedbackMessage && (
          <FormFeedback className={"d-block"}>{feedbackMessage}</FormFeedback>
        )}
      </FormGroup>
      <FormGroup>
        <p>
          <Icon icon={faRocket} />
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </FormGroup>
    </Form>
  );
};

export default SignUp;
