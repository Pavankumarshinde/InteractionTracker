import React, { useState } from "react";
import axios from "axios";
import ContactList from "./ContactList";
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
        <div className="mt-4">
            <h4>Add New Contact</h4>
            <form onSubmit={handleAddContact}>
                <div className="d-flex align-items-center mb-3">
                    <div className="me-3 flex-grow-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="me-3 flex-grow-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Contact Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success">
                        Save
                    </button>
                </div>
            </form>
        </div>


    );
}

export default AddContact;
