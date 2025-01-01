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

            // alert(response.data.message);
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
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Contact</button>
            </form>
        </div>
    );
}

export default AddContact;
