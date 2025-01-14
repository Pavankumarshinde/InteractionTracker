import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import contactImage from "C:/Users/shind/Reactjs/InteractionTracker/client/client/src/components/contactimage.webp";

const imageSrc = contactImage;
function ContactList({ contacts, onSelectContact, selectedContactId }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
    );

    return (
        <div className="mt-1" style={{ width: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h4 className="mb-1 text-center" style={{ color: "#333", fontWeight: "bold" }}>Your Contacts</h4>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search contacts by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRadius: "20px", padding: "10px 15px" }}
                />
            </div>
            {filteredContacts.length > 0 ? (
                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "15px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#f9f9f9"
                    }}
                >
                    <ul className="list-group list-group-flush">
                        {[...filteredContacts].reverse().map((contact) => (
                            <li
                                key={contact.id}
                                className={`list-group-item d-flex align-items-center ${contact.id === selectedContactId ? 'bg-primary text-white' : ''}`}
                                style={{ cursor: "pointer", padding: "10px 15px", borderRadius: "10px", margin: "5px 10px", backgroundColor: contact.id === selectedContactId ? "#007bff" : "#fff", color: contact.id === selectedContactId ? "#fff" : "#000" }}
                                onClick={() => onSelectContact(contact)}
                            >
                                <div
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        backgroundColor: "#ddd",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "15px",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        color: "#555"
                                    }}
                                >
                                    <img
                                        src={imageSrc || "default-avatar.png"} // Set image or fallback
                                        alt={contact.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "50%",
                                            objectFit: "cover"
                                        }}
                                    />
                                </div>
                                <div>
                                    <strong style={{ fontSize: "16px" }}>{contact.name}</strong>
                                    <br />
                                    <small className="text-muted" style={{ fontSize: "14px" }}>{contact.phone}</small>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-center text-muted" style={{ fontStyle: "italic" }}>No contacts found. Add your first contact!</p>
            )}
        </div>
    );
}

export default ContactList;
