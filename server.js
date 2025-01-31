import express from "express";
import cors from "cors";
import { db } from "./db.js";
import { verifyFirebaseToken } from "./firebaseAdmin.js";

const app = express();
app.use(express.json());
app.use(cors());

// 🟢 Login or Sign Up: Verify Firebase Token & Store User in MySQL
app.post("/login", async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await verifyFirebaseToken(token);
        const { uid, email } = decodedToken;

        // Check if the user exists
        db.query("SELECT * FROM users WHERE uid = ?", [uid], (err, results) => {
            if (err) return res.status(500).json({ error: err });

            if (results.length === 0) {
                // Insert new user
                db.query("INSERT INTO users (uid, email) VALUES (?, ?)", [uid, email], (err) => {
                    if (err) return res.status(500).json({ error: err });
                    return res.json({ message: "User registered successfully", user: { uid, email } });
                });
            } else {
                return res.json({ message: "User logged in successfully", user: results[0] });
            }
        });

    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
