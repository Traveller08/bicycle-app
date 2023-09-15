import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { getPendingRentRequestsAdmin , approveRentRequest, rejectRentRequest} from "../../api/index";

const PendingRequests =() => {
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await getPendingRentRequestsAdmin();
      setPendingRequests(response.data);
      console.log("pending requests , ", pendingRequests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };
  const convertTimestampToDateTime = (timestamp) => {
    // Create a new Date object from the timestamp (in milliseconds)
    const date = new Date(timestamp);
  
    // Get the year, month, day, hours, minutes, and seconds from the date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1 and pad with leading zero if necessary
    const day = String(date.getDate()).padStart(2, '0'); // Pad with leading zero if necessary
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Combine the year, month, day, hours, minutes, and seconds to form the date-time string in the format "YYYY-MM-DD HH:MM:SS"
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return dateTimeString;
  };

  

    const handleApprove = async (requestId) => {
      try {
        // Make API call to update the request status to 'Approved'
        await approveRentRequest(requestId);
        // Update the local state accordingly (e.g., remove the request from the pending list)
        // For example, if you have a state called 'pendingRequests' that holds the list of pending requests
        setPendingRequests((prevRequests) =>
          prevRequests.filter((request) => request.request_id !== requestId)
        );
      } catch (error) {
        // Handle error
        console.log("Error approving request:", error.message);
      }
    };
  
    const handleReject = async (requestId) => {
      try {
        // Make API call to update the request status to 'Rejected'
        await rejectRentRequest(requestId);
        // Update the local state accordingly (e.g., remove the request from the pending list)
        // For example, if you have a state called 'pendingRequests' that holds the list of pending requests
        setPendingRequests((prevRequests) =>
          prevRequests.filter((request) => request.request_id !== requestId)
        );
      } catch (error) {
        // Handle error
        console.log("Error rejecting request:", error.message);
      }
    };

  return (
    <Container>
    
      <Table striped bordered hover>
        <thead>
        <tr>
            <th colSpan="6"><h4 >Pending Rent Requests</h4></th>
          </tr>
          <tr>
            <th>Request ID</th>
            <th>User ID</th>
            <th>Bicycle ID</th>
            <th>Created Time</th>
            {/* <th>End Time</th> */}
            <th>Bicycle Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.map((request) => (
            <tr key={request.request_id}>
              <td>{request.request_id}</td>
              <td>{request.user_id}</td>
              <td>{request.bicycle_id}</td>
              <td>{convertTimestampToDateTime(request.request_date)}</td>
              {/* <td>{ request.request_approved_time && convertTimestampToDateTime(request.request_approved_time)}</td> */}
              <td>{request.bicycle_name}</td>
              <td>
                <Button variant="success" onClick={() => handleApprove(request.request_id)}>
                  Approve
                </Button>{" "}
                <Button variant="danger" onClick={() => handleReject(request.request_id)}>
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PendingRequests;
