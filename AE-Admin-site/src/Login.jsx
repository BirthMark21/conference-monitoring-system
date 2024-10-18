import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useContext(EventContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
    };
    const handleError = (err) => {
      setError("Login failed. Please check your credentials and try again.");
    };

    const handleSuccess = (data) => {
      // Redirect user based on their role
      switch (data.user.role) {
        case "admin":
          navigate("/dashboard");
          break;
        case "event_organizer":
          navigate("/dashboard");
          break;

        default:
          setError("You are not allowed to access this page.");
          navigate("/"); // Default redirect
      }
    };

    // Attempt to log in the user and get their role from the backend
    loginUser(
      userData,
      (data) => {
        if (data.user && data.user.role) {
          handleSuccess(data);
        } else {
          handleError(new Error("Role not found"));
        }
      },
      handleError
    );
  };

  return (
    <div className="position-relative vh-100 d-flex justify-content-center align-items-center">
      <Card style={{ width: '40rem', background: 'linear-gradient(to bottom, #000080, #000000)' }} className="p-4 text-white text-center">
        <Card.Body>
          <div className="d-flex flex-column align-items-center mb-4">
            <h4 className="mt-2">Log In to Event Pulse</h4>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Login</Button>
          </Form>
       
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
