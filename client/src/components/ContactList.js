import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ContactList({ contacts, onSelectContact, selectedContactId }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
    );

    return (
        <div className="mt-3">
            <h4>Your Contacts</h4>
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Search contacts by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredContacts.length > 0 ? (
                <div
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        maxHeight: "210px",
                        overflowY: "scroll",
                        height: "210px"
                    }}
                >
                    <ul className="list-group">
                        {[...filteredContacts].reverse().map((contact) => (
                            <li
                                key={contact.id}
                                className={`list-group-item ${contact.id === selectedContactId ? 'bg-primary text-white' : ''}`}
                                onClick={() => onSelectContact(contact)}
                            >
                                <strong>{contact.name}</strong> - {contact.phone}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No contacts found. Add your first contact!</p>
            )}
        </div>
    );
}

export default ContactList;
