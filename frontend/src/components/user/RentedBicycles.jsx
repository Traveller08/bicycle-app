// import React, { useState, useEffect } from "react";
// import { Container, Table, Button } from "react-bootstrap";
// import { getRentedBicycles, returnBicycle } from "../../api/index";

// function RentedBicycles() {
//   const [rentedBicycles, setRentedBicycles] = useState([]);

//   useEffect(() => {
//     fetchRentedBicycles();
//   }, []);

//   const fetchRentedBicycles = async () => {
//     try {
//       const response = await getRentedBicycles();
//       console.log("rented bicycles -> ", response.data);
//       setRentedBicycles(response.data);
//     } catch (error) {
//       console.log("Error fetching rented bicycles", error);
//     }
//   };

//   const handleReturnBicycle = async (rentalId) => {
//     try {
//       await returnBicycle(rentalId);
//       // After successfully returning the bicycle, fetch the updated list of rented bicycles
//       fetchRentedBicycles();
//     } 
//     catch (error) {
//       console.log("Error returning the bicycle", error);
//     }
//   };

//   return (
//     <Container>
//       <h1>Rented Bicycles</h1>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Bicycle Name</th>
//             <th>Cost per Hour</th>
//             <th>Return</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rentedBicycles.map((bicycle) => (
//             <tr key={bicycle.rental_id}>
//               <td>{bicycle.bicycle_name}</td>
//               <td>{bicycle.cost_per_hour}</td>
//               <td>
//                 <Button
//                   variant="primary"
//                   onClick={() => handleReturnBicycle(bicycle.rental_id)}
//                 >
//                   Return
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }

// export default RentedBicycles;
import React, { useState, useEffect } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { getRentedBicycles, returnBicycle } from "../../api/index";
import "./index.css"; // Import the same styles used in Home.jsx

function RentedBicycles() {
  const [rentedBicycles, setRentedBicycles] = useState([]);

  useEffect(() => {
    fetchRentedBicycles();
  }, []);

  const fetchRentedBicycles = async () => {
    try {
      const response = await getRentedBicycles();
      console.log("rented bicycles -> ", response.data);
      setRentedBicycles(response.data);
    } catch (error) {
      console.log("Error fetching rented bicycles", error);
    }
  };

  const handleReturnBicycle = async (rentalId) => {
    try {
      await returnBicycle(rentalId);
      // After successfully returning the bicycle, fetch the updated list of rented bicycles
      fetchRentedBicycles();
    } 
    catch (error) {
      console.log("Error returning the bicycle", error);
    }
  };

  return (
    <Container>
      <Card
        className="text-center p-3 mb-4"
        style={{ boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.10)", borderRadius: "10px",border:"none" }}
      >
        <div className="main-heading">Rented Bicycles</div>
      </Card>
      <div className="bicycle-list">
        {rentedBicycles.map((bicycle) => (
          <Card
            key={bicycle.rental_id}
            className="mb-3 bicycle-card"
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
              <Button
                variant="primary"
                onClick={() => handleReturnBicycle(bicycle.rental_id)}
                className="mx-auto d-block"
                style={{ width: "120px" }}
              >
                Return
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default RentedBicycles;
