import React, { useState } from "react";
import { Button, Form, FormFeedback, FormGroup, Input } from "reactstrap";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faRocket } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [loginForm, setLoginForm] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const navigate = useNavigate();

  function handleLogin(e, loginForm) {
    e.preventDefault();
    axios
      .post("http://localhost:9000/auth/login", loginForm)
      .then((response) => {
        const token = response.data.accessToken;
        const email = response.data.username;
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        setFeedbackMessage("Login successful");
        navigate("/home");
      })
      .catch((err) => {
        setFeedbackMessage(
          "Login failed with error: ".concat(
            err.response ? err.response.data.message : err.message
          )
        );
      });
  }

  return (
    <Form>
      <h2 className="form-title">Log in</h2>
      <FormGroup>
        <Icon icon={faUser} />
        <Input
          type="text"
          id="username"
          placeholder="Username"
          onChange={(e) => {
            setLoginForm({ ...loginForm, email: e.target.value });
          }}
        />
      </FormGroup>
      <FormGroup>
        <Icon icon={faLock} />
        <Input
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => {
            setLoginForm({ ...loginForm, password: e.target.value });
          }}
        />
      </FormGroup>
      <FormGroup>
        <Button type="submit" onClick={(e) => handleLogin(e, loginForm)}>
          Login
        </Button>
        {feedbackMessage && (
          <FormFeedback className={"d-block"}>{feedbackMessage}</FormFeedback>
        )}
      </FormGroup>
      <FormGroup>
        <p>
          <Icon icon={faRocket} />
          New here? <Link to="/signup">Create a new account</Link>
        </p>
      </FormGroup>
    </Form>
  );
};

export default Login;
