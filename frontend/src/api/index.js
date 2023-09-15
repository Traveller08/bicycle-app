import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:6001/api"; // Replace this with your backend URL

// Function to set the authorization header with the JWT token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Function to create an instance of Axios for authorized requests
export const authorizedApiClient = axios.create({
  baseURL: BASE_URL,
});

// Function to create an instance of Axios for unauthorized requests
export const unauthorizedApiClient = axios.create({
  baseURL: BASE_URL,
});
authorizedApiClient.interceptors.request.use(
  (config) => {
    // Get the JWT token from cookies or local storage (you can use whichever storage you are using)
    const token = Cookies.get("token"); // Replace "token" with the actual name of your token key
    
    if (token) {
      // Attach the token to the request's Authorization header
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  return config;
},
(error) => {
  // If there's an error with the request, handle it here
  return Promise.reject(error);
}
);


authorizedApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        logout();
        window.location.href = "/login"; // Redirect to the login page
      }
      return Promise.reject(error);
    }
  );

  export const setTokenInCookies = (token) => {
    Cookies.set("token", token, { expires: 7 }); // Token will expire in 7 days
  };
  
  // Function to get the token from cookies
  export const getTokenFromCookies = () => {
    return Cookies.get("token");
  };

// Function to perform the login API call
export const login = async (formData) => {
  try {
    const response = await unauthorizedApiClient.post("/user/login", formData);
    const { token } = response.data;
    setTokenInCookies(token);
    setAuthToken(token); // Set the JWT token in the axios headers
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to perform the register API call
export const register = async (formData) => {
  try {
    const response = await unauthorizedApiClient.post("/user/register", formData);
    console.log("response of register  " , response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to perform the logout
export const logout = () => {
  setAuthToken(null); // Remove the JWT token from the axios headers
  if(Cookies.get("token")){Cookies.remove("token");}
  if(Cookies.get("user")){Cookies.remove("user");}
  if(Cookies.get("usertype")){Cookies.remove("usertype");}
  window.location.href = "/";
};

// Function to get the user profile details
export const getUserProfile = async () => {
  try {
    const response = await authorizedApiClient.get("/user/profile");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addBicycle = async (bicycleData) => {
  try {
    const response = await authorizedApiClient.post("/bicycle/add", bicycleData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteBicycle = async (bicycleId) => {
  try {
    const response = await authorizedApiClient.get("/bicycle/delete",{params:{bicycleId:bicycleId}});
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllBicycles = async () => {
  try {
    const response = await authorizedApiClient.get("/bicycle/all");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAvailableBicycles = async () => {
  try {
    const response = await authorizedApiClient.get("/bicycle/available");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to perform the API call to rent a bicycle
export const rentBicycle = async (bicycleId) => {
  try {
    const response = await authorizedApiClient.post("/rentRequest/addRentRequest", { bicycleId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPendingRentRequestsUser = async () => {
  try {
    const response = await authorizedApiClient.get("/rentRequest/getPendingRentRequestUser");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getRentedBicycles = async () => {
  try {
    const response = await authorizedApiClient.get("/rental/getRentedBicycleUser");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const returnBicycle = async (rentalId) => {
  try {
    const response = await authorizedApiClient.post(
      "/returnRequest/addReturnRequest",
      { rentalId }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getPendingReturnRequests = async () => {
  try {
    const response = await authorizedApiClient.get("/returnRequest/getPendingReturnRequestUser");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCompletedRentsInfo = async () => {
  try {
    const response = await authorizedApiClient.get("/rental/getCompletedRentsInfo");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getPendingRentRequestsAdmin = async () => {
  try {
    const response = await authorizedApiClient.get("/rentRequest/getPendingRentRequestAdmin");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to update the rent request status as 'Approved'
export const approveRentRequest = async (requestId) => {
  try {
    const response = await authorizedApiClient.post("/rentRequest/updateRentRequest", {
      requestId: requestId,
      requestStatus: "Approved",
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to update the rent request status as 'Rejected'
export const rejectRentRequest = async (requestId) => {
  try {
    const response = await authorizedApiClient.post("/rentRequest/updateRentRequest", {
      requestId: requestId,
      requestStatus: "Rejected",
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAdminRequests = async () => {
  try {
    const response = await authorizedApiClient.get("/rentRequest/adminRequests");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPendingReturnRequestsAdmin = async () => {
  try {
    const response = await authorizedApiClient.get("/returnRequest/getPendingReturnRequestAdmin");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// api.js
// Add this function to make an API call to approve a return request
export const approveReturnRequest = async (returnId) => {
  try {
    const response = await authorizedApiClient.post("/returnRequest/validateReturnRequest", { returnId, requestStatus: "Approved" });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getApprovedReturnRequests = async () => {
  try {
    const response = await authorizedApiClient.get("/returnRequest/getApprovedReturnRequests");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


// getPendingReturnRequestAdmin


//          /updateRentRequest
//         /getPendingRentRequestUser