import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { getPendingReturnRequests } from "../../api/index";

function PendingReturns() {
  const [returnRequests, setReturnRequests] = useState([]);

  useEffect(() => {
    fetchPendingReturnRequests();
  }, []);

  const fetchPendingReturnRequests = async () => {
    try {
      const response = await getPendingReturnRequests();
      console.log("pending requests data", response.data);
      setReturnRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending return requests:", error);
    }
  };

  return (
    <Container>
     
      <Table striped bordered hover>
        <thead>
        <tr>
            <th colSpan="5"><h4 >Pending Return Requests</h4></th>
          </tr>
          <tr>
            <th>Return ID</th>
            <th>Rental ID</th>
            {/* <th>Return Date</th> */}
            <th>Bicycle Name</th>
            <th>Cost per hour</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {returnRequests.map((returnRequest) => (
            <tr key={returnRequest.return_id}>
              <td>{returnRequest.return_id}</td>
              <td>{returnRequest.rental_id}</td>
              {/* <td>{returnRequest.return_date}</td> */}
              <td>{returnRequest.bicycle_name}</td>
              <td>{returnRequest.cost_per_hour}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default PendingReturns;
