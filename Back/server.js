const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const db = require("./database");
const { google } = require('googleapis');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Google OAuth configuration
const GOOGLE_CLIENT_ID = "192146573225-s6ln6e0vu4jp5htq5qo75hndl7a9d1fu.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);



// Fetch Google contacts route
app.get("/api/google-contacts", async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token is required" });

    try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });

        const people = google.people({ version: 'v1', auth: oauth2Client });
        const response = await people.people.connections.list({
            resourceName: 'people/me',
            personFields: 'names,phoneNumbers',
        });

        const contacts = response.data.connections.map(contact => ({
            name: contact.names?.[0]?.displayName || 'No Name',
            phone: contact.phoneNumbers?.[0]?.value || 'No Phone',
        }));

        res.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
});

// Simplified Database initialization
async function initializeDatabase() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS accounts (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                google_id VARCHAR(255) UNIQUE
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES accounts(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(15) NOT NULL
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS interactions (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES accounts(id) ON DELETE CASCADE,
                contact_id INT REFERENCES contacts(id) ON DELETE CASCADE,
                interaction TEXT NOT NULL,
                interactionType VARCHAR(50) NOT NULL, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);


        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Database initialization error:", error);
    }
}

initializeDatabase();

// Google login route
app.post("/auth/google-login", async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });

        const { email, sub: googleId } = ticket.getPayload();
        let result = await db.query(
            "SELECT id, email FROM accounts WHERE google_id = $1",
            [googleId]
        );

        if (result.rows.length === 0) {
            result = await db.query(
                "INSERT INTO accounts (email, google_id) VALUES ($1, $2) RETURNING id, email",
                [email, googleId]
            );
        }

        res.json({
            userId: result.rows[0].id,
            email: result.rows[0].email,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
});

// Add contact
app.post("/api/add-contact", async (req, res) => {
    const { userId, name, phone } = req.body;

    if (!userId || !name || !phone) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await db.query(
            "INSERT INTO contacts (user_id, name, phone) VALUES ($1, $2, $3) RETURNING id",
            [userId, name, phone]
        );
        res.json({
            id: result.rows[0].id,
            message: "Contact added successfully",
        });
    } catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get contacts
app.get("/api/get-contacts/:userId", async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const result = await db.query("SELECT id, name, phone FROM contacts WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Add interaction
app.post("/api/add-interaction", async (req, res) => {
    const { contactId, interaction, interactionType } = req.body;

    if (!contactId || !interaction || !interactionType) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const { userId, contactId, interaction, interactionType } = req.body;
        const result = await db.query(
            `INSERT INTO interactions (user_id, contact_id, interaction, interactionType)
             VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
            [userId, contactId, interaction, interactionType]


        );
        res.json({
            id: result.rows[0].id,
            createdAt: result.rows[0].created_at,
            message: "Interaction added successfully"
        });
    } catch (error) {
        console.error("Error adding interaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/get-interactions/:contactId", async (req, res) => {
    const { contactId } = req.params;

    if (!contactId) {
        return res.status(400).json({ error: "Contact ID is required" });
    }

    try {
        const result = await db.query(
            "SELECT interaction, interactionType, created_at FROM interactions WHERE contact_id = $1",
            [contactId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching interactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Server setup
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
