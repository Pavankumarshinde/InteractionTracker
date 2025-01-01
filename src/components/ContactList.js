import React from "react";

function ContactList({ contacts, onSelectContact, selectedContactId }) {
    return (
        <div className="mt-4">
            <h4>Your Contacts</h4>
            {contacts.length > 0 ? (
                <ul className="list-group">
                    {contacts.reverse().map((contact) => (
                        <li
                            key={contact.id}
                            className={`list-group-item ${contact.id === selectedContactId ? 'bg-primary text-white' : ''
                                }`}
                            onClick={() => onSelectContact(contact)} // Correct function call
                        >
                            <strong>{contact.name}</strong> - {contact.phone}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No contacts found. Add your first contact!</p>
            )}
        </div>
    );
}

export default ContactList;
