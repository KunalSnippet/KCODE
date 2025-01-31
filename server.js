const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static("uploads"));

// Storage Configuration
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Upload Endpoint
app.post("/upload", upload.single("pdf"), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");
    res.json({ filePath: `/${req.file.filename}` });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
