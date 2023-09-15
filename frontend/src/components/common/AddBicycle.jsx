import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addBicycle } from "../../api/index";
import toast from "react-hot-toast";
const successNotify=(message) =>toast.success(message);
const errorNotify = (message) => toast.error(message);

const  AddBicycle= () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bicycleName: "",
    costPerHour: "",
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
      const response = await addBicycle(formData);
      console.log(response.message); // For testing purposes
      // Show success toast
      successNotify("Bicycle added successfully!");
      // Redirect to the home page after successful bicycle addition
      navigate("/");
    } catch (error) {
      console.error(error.message);
      // Show error toast
      errorNotify("Failed to add bicycle. Please try again.");
      // Handle bicycle addition error (e.g., show an error message)
    }
  };

  return (
    <Container>
      <Card className="mt-4 shadow">
        <Card.Body>
          <h1>Add Bicycle</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="bicycleName">
              <Form.Label>Bicycle Name</Form.Label>
              <Form.Control
                type="text"
                name="bicycleName"
                value={formData.bicycleName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="costPerHour">
              <Form.Label>Cost Per Hour</Form.Label>
              <Form.Control
                type="number"
                name="costPerHour"
                value={formData.costPerHour}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Bicycle
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddBicycle;
