import React, { useEffect, useState } from "react";
import { Route } from "react-router";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import NotificationToaster from "./components/toast/NotificationToaster";
import Header from "./components/common/Header";
import NotFound from "./components/common/NotFound";
import Profile from "./components/common/Profile";
import AddBicycle from "./components/common/AddBicycle";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import UserHome from "./components/user/Home";
import PendingRequests from "./components/user/PendingRequests";
import RentedBicycles from "./components/user/RentedBicycles";
import PendingReturns from "./components/user/PendingReturns";
import RentCompleteInfo from "./components/user/RentCompleteInfo";

import AdminHome from "./components/admin/Home";
import PendingAdminRequests from "./components/admin/PendingRequests";
import PendingAdminReturns from "./components/admin/PendingReturns";
import AdminRequests from "./components/admin/AdminRequests";
import ApprovedRequests from "./components/admin/ApprovedRequests";
import Cookies from "js-cookie";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  useEffect(()=>{
    if(Cookies.get("token")){
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false);
    }
    if(Cookies.get("usertype")){
      setUserType(Cookies.get("usertype"));
    }
  },[]);
  
  const handleUserChange =(user, type)=>{
    setUserType(type);
    setIsAuthenticated(user);
  }
  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={handleUserChange}/>
      <Routes>
        {/* Public Routes */}
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login"  element={<Login setIsAuthenticated={handleUserChange} setUserType={setUserType}/>} />
        <Route exact path="/add-bicycle" element={<AddBicycle/>} />
        <Route exact path="/profile" element={<Profile/>} />

        {
          userType && userType==="user" && <>
            <Route exact path="/" element={<UserHome/>} />
            <Route exact path="/pending-requests" element={<PendingRequests/>} />
            <Route exact path="/rented-bicycles" element={<RentedBicycles/>} />
            <Route exact path="/pending-returns" element={<PendingReturns/>} />
            <Route exact path="/rent-complete-info" element={<RentCompleteInfo/>} />
            </>
        }

        {
          userType && userType==="admin" && <>
          <Route exact path="/" element={<AdminHome/>} />
          <Route exact path="/pending-requests" element={<PendingAdminRequests/>} />
          <Route exact path="/pending-returns" element={<PendingAdminReturns/>} />
          <Route exact path="/approved-requests" element={<AdminRequests/>} />
          <Route exact path="/approved-returns" element={<ApprovedRequests/>} />  
          </>
        }
        {/* Not Found Route */}
        <Route element={NotFound} />
      </Routes>
      <NotificationToaster />
    </Router>
  );
}

export default App;
