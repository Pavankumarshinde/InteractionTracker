import React from "react";

function ContactList({ contacts, onSelectContact, selectedContactId }) {
    return (
        <div className="mt-1">
            <h4>Your Contacts</h4>
            {contacts.length > 0 ? (
                <div
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        maxHeight: "210px", // Adjust height as needed
                        overflowY: "scroll",
                        height: "210px"
                        // padding: "10px",
                    }}
                >
                    <ul className="list-group">
                        {[...contacts].reverse().map((contact) => (
                            <li
                                key={contact.id}
                                className={`list-group-item ${contact.id === selectedContactId ? 'bg-primary text-white' : ''
                                    }`}
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
