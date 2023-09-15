import dotenv from "dotenv";
dotenv.config();

const db = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

// USER ------------------------------------------

const createUsersTable = () => {
  return `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    usertype ENUM('user', 'admin') NOT NULL,
    photourl VARCHAR(255) 
  )`;
};

const insertIntoUsers = (firstname, lastname, username, password, usertype) => {
  return `INSERT INTO users 
    (firstName, lastName, username, password, usertype ) 
    VALUES 
    ('${firstname}', '${lastname}', '${username}', '${password}', '${usertype}')`;
};

const getUserDetails = (userid) => {
  return `SELECT username, firstName, lastName, photourl FROM users WHERE id ='${userid}'`;
};

// BICYCLES ------------------------------------------

const createBicyclesTable = () => {
  return `CREATE TABLE IF NOT EXISTS bicycles (
    bicycle_id VARCHAR(255) PRIMARY KEY NOT NULL,
    bicycle_name VARCHAR(255) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    added_by_user_id INT,
    cost_per_hour DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_time BIGINT NOT NULL,
    FOREIGN KEY (added_by_user_id) REFERENCES users (id)
  )`;
};

const insertIntoBicyclesTable = (
  bicycleId,
  bicycleName,
  addedByUserId,
  costPerHour,
  createdTime
) => {
  return `INSERT INTO bicycles 
    (bicycle_id, bicycle_name, added_by_user_id, cost_per_hour, created_time) 
    VALUES 
    ('${bicycleId}', '${bicycleName}', ${addedByUserId}, ${costPerHour}, ${createdTime})`;
};

const getAllBicyclesData = () => {
  return "SELECT * FROM bicycles ORDER BY created_time DESC";
};

// RENT REQUESTS ------------------------------------------

const createRentRequestsTable = () => {
  return `CREATE TABLE IF NOT EXISTS rent_requests (
    request_id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id INT,
    bicycle_id VARCHAR(255),
    request_status ENUM('Pending', 'Approved', 'Rejected') NOT NULL,
    request_date BIGINT NOT NULL,
    request_approved_time BIGINT,
    approved_by_admin_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (bicycle_id) REFERENCES bicycles (bicycle_id),
    FOREIGN KEY (approved_by_admin_id) REFERENCES users (id)
  )`;
};

const insertIntoRentRequestsTable = (
  requestId,
  userId,
  bicycleId,
  requestStatus,
  requestDate
) => {
  return `INSERT INTO rent_requests 
    (request_id, user_id, bicycle_id, request_status, request_date) 
    VALUES 
    ('${requestId}', ${userId}, '${bicycleId}', '${requestStatus}', ${requestDate})`;
};

const updateRentRequestStatus = (
  requestId,
  requestStatus,
  approvedByAdminId,
  requestApprovedTime
) => {
  return `UPDATE rent_requests 
    SET request_status = '${requestStatus}', approved_by_admin_id = ${approvedByAdminId}, request_approved_time = ${requestApprovedTime}
    WHERE request_id = '${requestId}'`;
};

// const getRentRequestsDataPending = () => {
//   return 'SELECT * FROM rent_requests WHERE request_status="Pending" ORDER BY request_date DESC';
// };

// RENTALS ------------------------------------------

const createRentalsTable = () => {
  return `CREATE TABLE IF NOT EXISTS rentals (
    rental_id VARCHAR(255) PRIMARY KEY NOT NULL,
    user_id INT,
    bicycle_id VARCHAR(255),

    request_id VARCHAR(255), 

    rental_start_date BIGINT,
    rental_end_date BIGINT,
    rental_cost DECIMAL(10, 2) DEFAULT 0,
    status ENUM('rented', 'completed') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (bicycle_id) REFERENCES bicycles (bicycle_id),

    FOREIGN KEY (request_id) REFERENCES rent_requests (request_id)

  )`;
};

const insertIntoRentalsTable = (
  rentalId,
  userId,
  bicycleId,

  requestId, 

  rentalStartDate,
  rentalEndDate,
  rentalCost,
  rentalStatus
) => {
//   return `INSERT INTO rentals 
//     (rental_id, user_id, bicycle_id, rental_start_date, rental_end_date, rental_cost, status) 
//     VALUES 
//     ('${rentalId}', ${userId}, '${bicycleId}', ${rentalStartDate}, ${rentalEndDate}, ${rentalCost}, '${rentalStatus}')`;
// };
return `INSERT INTO rentals 
    (rental_id, user_id, bicycle_id, request_id, rental_start_date, rental_end_date, rental_cost, status) 
    VALUES 
    ('${rentalId}', ${userId}, '${bicycleId}', '${requestId}', ${rentalStartDate}, ${rentalEndDate}, ${rentalCost}, '${rentalStatus}')`;
};


const updateRentalEndDateAndCost = (rentalId, rentalEndDate, rentalCost) => {
  return `UPDATE rentals 
    SET rental_end_date = ${rentalEndDate}, rental_cost = ${rentalCost}, status = 'completed'
    WHERE rental_id = '${rentalId}'`;
};

// RETURN REQUESTS -------------------------------------

const createReturnRequestsTable = () => {
  return `CREATE TABLE IF NOT EXISTS return_requests (
    return_id VARCHAR(255) PRIMARY KEY NOT NULL,
    rental_id VARCHAR(255),
    return_status ENUM('Pending', 'Approved') NOT NULL,
    request_created_time BIGINT NOT NULL,
    request_approved_time BIGINT,
    approved_by_admin_id INT,
    FOREIGN KEY (rental_id) REFERENCES rentals (rental_id),
    FOREIGN KEY (approved_by_admin_id) REFERENCES users (id)
  )`;
};

const insertIntoReturnRequestsTable = (
  returnId,
  rentalId,
  returnStatus,
  requestCreatedTime,
  requestApprovedTime,
  approvedByAdminId
) => {
  return `INSERT INTO return_requests 
    (return_id, rental_id, return_status, request_created_time, request_approved_time, approved_by_admin_id) 
    VALUES 
    ('${returnId}', '${rentalId}', '${returnStatus}', ${requestCreatedTime}, ${requestApprovedTime}, ${approvedByAdminId})`;
};

const updateReturnRequestStatus = (
  returnId,
  returnStatus,
  approvedByAdminId,
  requestApprovedTime
) => {
  return `UPDATE return_requests 
    SET return_status = '${returnStatus}', approved_by_admin_id = ${approvedByAdminId}, request_approved_time = ${requestApprovedTime}
    WHERE return_id = '${returnId}'`;
};

export {
  db,
  createUsersTable,
  insertIntoUsers,
  getUserDetails,

  createBicyclesTable,
  insertIntoBicyclesTable,
  getAllBicyclesData,

  createRentRequestsTable,
  insertIntoRentRequestsTable,
  updateRentRequestStatus,
  // getRentRequestsDataPending,

  createRentalsTable,
  insertIntoRentalsTable,
  updateRentalEndDateAndCost,

  createReturnRequestsTable,
  insertIntoReturnRequestsTable,
  updateReturnRequestStatus,
};
