import React, { useState, useEffect } from "react";
import { Card, Button, Container } from "react-bootstrap";
import { getAllBicycles, rentBicycle, getAvailableBicycles } from "../../api/index"; // Import the API functions
import "./index.css";
function Home() {
  // Function to fetch all bicycles from the server
  const [bicycles, setBicycles] = useState([]);

  // Function to fetch all bicycles from the server
  const fetchAvailableBicycles = async () => {
    try {
      const response = await getAvailableBicycles();
      setBicycles(response.data);
    } catch (error) {
      console.log("Error fetching bicycles: ", error);
    }
  };

  // Function to handle renting a bicycle
  const handleRent = async (bicycleId) => {
    try {
      await rentBicycle(bicycleId);
      // After renting the bicycle, fetch the updated list of bicycles
      fetchAvailableBicycles();
    } catch (error) {
      console.log("Error renting bicycle: ", error);
    }
  };

  useEffect(() => {
    // Fetch the list of bicycles when the component mounts
    fetchAvailableBicycles();
  }, []);

  return (
    <Container>
     <Card
        className="text-center p-3 mb-4"
        style={{ boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.10)", borderRadius: "10px",border:"none" }}
      >
        <div className="main-heading">Available Bicycles</div>
      </Card>
      <div className="bicycle-list" >

        {bicycles.map((bicycle,index) => (
          <Card
          key={bicycle.bicycle_id}
          className={
            (index%4)===0?"mb-3 bicycle-card":"mb-3 bicycle-card ml"
          }
          
          style={{ width: "24%",minWidth:"200px",padding:"20px 0px", boxShadow: "0 4px 8px 0px rgba(0, 0, 0, 0.10)", borderRadius: "8px", border:"none" }}
          >
            {
              console.log("index", index , (index%4)===0?"mb-3 bicycle-card":"mb-3 bicycle-card ml")
            }
            <Card.Body>
              <Card.Title>{bicycle.bicycle_name}</Card.Title>
              <Card.Text>Cost per Hour: {bicycle.cost_per_hour}</Card.Text>
              <Button
                variant="primary"
                onClick={() => handleRent(bicycle.bicycle_id)}
                className="mx-auto d-block"
                style={{ width: "120px" }}
              >
                Borrow
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default Home;
