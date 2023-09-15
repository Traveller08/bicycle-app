import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { login } from "../../api/index.js";
import Cookies from "js-cookie";

import toast from "react-hot-toast";
const successNotify=(message) =>toast.success(message);
const errorNotify = (message) => toast.error(message);

const Login = ({ setIsAuthenticated, setUserType }) => {
  console.log("set ", setIsAuthenticated);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    usertype: "user", // Default usertype is "user"
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(formData);
      console.log(response.message); // For testing purposes
      // Redirect to the home page or dashboard after successful login
      setIsAuthenticated(true);
      successNotify("login successful");
      Cookies.set("usertype", formData.usertype, { expires: 7 });
      Cookies.set("user", formData.username, { expires: 7 });
      setUserType(formData.usertype);
      navigate("/");
    } catch (error) {
      errorNotify("login failed")
      console.error(error.message);
      // Handle login error (e.g., show an error message)
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="mt-4 shadow">
            <Card.Body>
              <h1>Login</h1>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="usertype">
                  <Form.Label>User Type</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="User"
                      name="usertype"
                      value="user"
                      checked={formData.usertype === "user"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Admin"
                      name="usertype"
                      value="admin"
                      checked={formData.usertype === "admin"}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Form>
              <div className="mt-2">
                Don't have an account?{" "}
                <Link to="/register">Create a new account</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
  