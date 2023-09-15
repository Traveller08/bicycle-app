import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import './index.css';
import {logout, getUserProfile} from "../../api/index";
import Cookies from "js-cookie";
function Header({ isAuthenticated, setIsAuthenticated }) {
  const handleLogout= () =>{
    setIsAuthenticated(false);
     logout();
  }
  const [userDetails, setUserDetails] = useState(null);
  const getUserDetails = async() =>{
    try {
      const response = await getUserProfile();
      setUserDetails(response.data);
      console.log("profile data -> ",response.data); // For testing purposes
    } catch (error) {
      console.error(error.message);
    }
  }
  useEffect(()=>{
    if(isAuthenticated){
      getUserDetails();
    }
  },[isAuthenticated]);
  return (
    <>
      <Navbar key="lg" expand="lg" className="mb-3 nav" style={{ padding: "15px 30px" }}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            Bicycle Renting App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                Bicycle Renting App
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="ml-auto">
                {!isAuthenticated && (
                  <>
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register">
                      Register
                    </Nav.Link>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <NavDropdown title="Bicycle">
                      <NavDropdown.Item as={Link} to="/add-bicycle">
                        Add Bicycle
                      </NavDropdown.Item>
                      {Cookies.get("usertype") === "user" && (
                        <NavDropdown.Item as={Link} to="/rented-bicycles">
                          Rented Bicycles
                        </NavDropdown.Item>
                      )}
                    </NavDropdown>
                    <NavDropdown title="Requests">
                      <NavDropdown.Item as={Link} to="/pending-requests">
                        Pending Requests
                      </NavDropdown.Item>
                      {Cookies.get("usertype") === "admin" && (
                        <NavDropdown.Item as={Link} to="/approved-requests">
                          Approved requests
                        </NavDropdown.Item>
                      )}
                    </NavDropdown>
                    <NavDropdown title="Returns">
                      <NavDropdown.Item as={Link} to="/pending-returns">
                        Pending Returns
                      </NavDropdown.Item>
                      {Cookies.get("usertype") === "user" ? (
                        <NavDropdown.Item as={Link} to="/rent-complete-info">
                          Returns
                        </NavDropdown.Item>
                      ) : (
                        <NavDropdown.Item as={Link} to="/approved-returns">
                          Approved Returns
                        </NavDropdown.Item>
                      )}
                    </NavDropdown>
                    <Nav.Link>
                    <span className="mr-2">Hello, {userDetails?userDetails.firstName + " " + userDetails.lastName:"John"}</span>
                    </Nav.Link>
                    <NavDropdown title={
                      <>
                        <div className="d-flex align-items-center">
                     
                      <img
                        src="https://via.placeholder.com/30" // Replace this with the URL of the user's profile avatar
                        alt="Profile Avatar"
                        className="rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </div>
                      </>
                    }>
                      <NavDropdown.Item as={Link} to="/profile">
                        My Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/edit/profile">
                        Edit profile
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/report/bug">
                        Report a bug
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Button} variant="outline-success" onClick={handleLogout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
