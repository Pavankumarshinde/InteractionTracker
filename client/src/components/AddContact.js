import React, { useState } from "react";
import axios from "axios";

function AddContact({ userId, addNewContact }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleAddContact = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/add-contact", {
                userId,
                name,
                phone,
            });

            // Add the new contact to the list immediately
            addNewContact({ id: response.data.id, name, phone });

            setName("");
            setPhone("");
        } catch (error) {
            console.error("Error adding contact:", error.response?.data || error.message);
            alert("Failed to add contact");
        }
    };

    return (
        <div className="mt-2" style={{ maxWidth: "500px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h5 className="text-center mb-2" style={{ color: "#333", fontWeight: "bold", fontSize: "1.2rem" }}>
                Add Contact
            </h5>
            <form onSubmit={handleAddContact}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            borderRadius: "5px",
                            padding: "8px 12px",
                            fontSize: "0.9rem",
                            width: "48%",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                        }}
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Contact Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={{
                            borderRadius: "5px",
                            padding: "8px 12px",
                            fontSize: "0.9rem",
                            width: "48%",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-success ms-2"
                        style={{
                            padding: "8px 12px",
                            borderRadius: "5px",
                            fontSize: "0.9rem",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                    >
                        ✓
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddContact;
