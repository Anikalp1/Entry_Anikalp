const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const { validationResult } = require("express-validator");
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const app = express();

const allowedOrigins = [
  "https://anikalp-submission.vercel.app/",
  "http://localhost:3000", 
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 8080;


// MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL!");
});

// Middleware for handling MySQL query errors
const handleQueryError = (res, err) => {
  console.error("MySQL query error:", err);
  res.status(500).json({ error: "Internal server error" });
};

// GET all users
app.get("/", (req, res) => {
  const query =
    'SELECT *, DATE_FORMAT(DATE_ADD(date_of_birth, INTERVAL 330 MINUTE), "%d/%m/%Y") AS formatted_date FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      handleQueryError(res, err);
      return;
    }
    res.json({ success: true, data: results });
  });
});

// CREATE a new user
app.post("/create", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, mobile, date_of_birth } = req.body;
  const dateParts = date_of_birth.split("/");
  const formattedDateOfBirth = new Date(
    Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0])
  )
    .toISOString()
    .slice(0, 10);
  const query = "INSERT INTO users (name, email, mobile, date_of_birth) VALUES (?, ?, ?, ?)";
  connection.query(
    query,
    [name, email, mobile, formattedDateOfBirth],
    (err, result) => {
      if (err) {
        handleQueryError(res, err);
        return;
      }
      res.json({ success: true, message: "Data saved successfully!", data: result });
    }
  );
});

// UPDATE a user
app.put("/update", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id, name, email, mobile, date_of_birth } = req.body;
  const dateParts = date_of_birth.split("/");
  const formattedDateOfBirth = new Date(
    Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0])
  )
    .toISOString()
    .slice(0, 10);
  const query = "UPDATE users SET name = ?, email = ?, mobile = ?, date_of_birth = ? WHERE id = ?";
  connection.query(
    query,
    [name, email, mobile, formattedDateOfBirth, id],
    (err, result) => {
      if (err) {
        handleQueryError(res, err);
        return;
      }
      res.json({ success: true, message: "Data updated successfully!", data: result });
    }
  );
});

// DELETE a user
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";
  connection.query(query, [id], (err, result) => {
    if (err) {
      handleQueryError(res, err);
      return;
    }
    res.json({ success: true, message: "Data deleted successfully!", data: result });
  });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));