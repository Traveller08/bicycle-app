import React, { useEffect, useState } from "react";
import { getPendingReturnRequestsAdmin, approveReturnRequest } from "../../api/index";
import { Button, Container, Table } from "react-bootstrap";

const PendingReturns = () => {
  const [pendingReturns, setPendingReturns] = useState([]);

  useEffect(() => {
    // Load admin's pending return requests when the component mounts
    fetchPendingReturns();
  }, []);

  const fetchPendingReturns = async () => {
    try {
      const data = await getPendingReturnRequestsAdmin();
      console.log("pending return requests admin -> ", data.data);
      setPendingReturns(data.data);
    } catch (error) {
      // Handle error
      console.log("Error fetching admin's pending return requests:", error.message);
    }
  };

  const handleApproveReturnRequest = async (returnId) => {
    try {
      await approveReturnRequest(returnId);
      // Update the local state to reflect the change in status
      setPendingReturns((prevPendingReturns) =>
        prevPendingReturns.filter((returnRequest) =>
          returnRequest.return_id !== returnId
        )
      );
    } catch (error) {
      // Handle error
      console.log("Error approving return request:", error.message);
    }
  };

  return (
    <Container>
  
      <Table striped bordered hover>
        <thead>
        <tr>
            <th colSpan="6"><h4 >Pending Return Requests</h4></th>
          </tr>
          <tr>
            <th>Return ID</th>
            <th>Rental ID</th>
            <th>Bicycle ID</th>
            <th>Bicycle Name</th>
            <th>User ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingReturns.map((request) => (
            <tr key={request.return_id}>
              <td>{request.return_id}</td>
              <td>{request.rental_id}</td>
              <td>{request.bicycle_id}</td>
              <td>{request.bicycle_name}</td>
              <td>{request.user_id}</td>
              <td>
                <Button
                  onClick={() => handleApproveReturnRequest(request.return_id)}
                  variant="success"
                >
                  Approve
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PendingReturns;
