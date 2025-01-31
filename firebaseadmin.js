import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// 🔹 Load Firebase Admin SDK Credentials
const serviceAccount = JSON.parse(fs.readFileSync("firebase-service-account.json", "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const verifyFirebaseToken = async (token) => {
    return admin.auth().verifyIdToken(token);
};
