import React, { useState, useEffect } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { getAllBicycles, deleteBicycle } from "../../api/index";
import { Link } from "react-router-dom";
import "./index.css"; // Import the same styles used in Home.jsx

function Home() {
  const [bicycles, setBicycles] = useState([]);

  useEffect(() => {
    fetchAllBicycles();
  }, []);

  const fetchAllBicycles = async () => {
    try {
      const response = await getAllBicycles();
      setBicycles(response.data);
      console.log("data of cycles ", bicycles);
    } catch (error) {
      console.error("Error fetching bicycles:", error);
    }
  };

  const handleDelete = async (bicycleId) => {
    try {
      await deleteBicycle(bicycleId);
      // After deletion, fetch the updated list of bicycles
      setBicycles( (bicycles)=>
          bicycles.filter((bicycle)=>bicycle.bicycle_id!==bicycleId)
      );
    } catch (error) {
      console.error("Error deleting bicycle:", error);
    }
  };

  return (
    <Container>
      <Card
        className="text-center p-3 mb-4"
        style={{ boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.10)", borderRadius: "10px",border:"none" }}
      >
        <div className="main-heading">All Bicycles</div>
      </Card>
      <div className="bicycle-list">
        {bicycles.map((bicycle,index) => (
          <Card
            key={bicycle.bicycle_id}
            className={
              (index%4)===0?"mb-3 bicycle-card":"mb-3 bicycle-card ml"
            }
            
            style={{
              width: "24%",
              minWidth: "200px",
              padding: "20px 0px",
              boxShadow: "0 4px 8px 0px rgba(0, 0, 0, 0.10)",
              borderRadius: "8px",
              border: "none",
            }}
          >
            <Card.Body>
              <Card.Title>{bicycle.bicycle_name}</Card.Title>
              <Card.Text>Cost per Hour: {bicycle.cost_per_hour}</Card.Text>
              <Card.Text>Added By: {bicycle.added_by_user_id}</Card.Text>
              <Card.Text>Created Time: {bicycle.created_time}</Card.Text>
              <div style={{ display: "flex" }}>
                
                <Button
                  variant="danger"
                  onClick={() => handleDelete(bicycle.bicycle_id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default Home;
