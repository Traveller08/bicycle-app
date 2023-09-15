import React, { useEffect, useState } from "react";
import { getAdminRequests } from "../../api/index";
import { Container, Table } from "react-bootstrap";

const AdminRequests = () => {
  const [adminRequests, setAdminRequests] = useState([]);

  useEffect(() => {
    // Load admin's approved requests when the component mounts
    fetchAdminRequests();
  }, []);

  const fetchAdminRequests = async () => {
    try {
      const data = await getAdminRequests();
      console.log("approved rent requests ", data.data);
      setAdminRequests(data.data);
    } catch (error) {
      // Handle error
      console.log("Error fetching admin's approved requests:", error.message);
    }
  };

  return (
    <Container>
      
      <Table striped bordered hover>
        <thead>
        <tr>
            <th colSpan="4"><h4 >Approved Requests</h4></th>
          </tr>
          <tr>
            <th>Request ID</th>
            <th>Bicycle Name</th>
            <th>User ID</th>
            <th>Request ID</th>
          </tr>
        </thead>
        <tbody>
          {adminRequests.map((request) => (
            <tr key={request.request_id}>
              <td>{request.request_id}</td>
              <td>{request.bicycle_name}</td>
              <td>{request.user_id}</td>
              <td>{request.request_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminRequests;
