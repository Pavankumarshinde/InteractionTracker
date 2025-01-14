import React, { useEffect, useState } from "react";
import axios from "axios";

function GoogleContacts({ token }) {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if (token) {
            axios.get(`http://localhost:5000/api/google-contacts?token=${token}`)
                .then((response) => {
                    setContacts(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching contacts:", error);
                });
        }
    }, [token]);

    return (
        <div>
            <h3>Your Google Contacts</h3>
            {contacts.length > 0 ? (
                <ul>
                    {contacts.map((contact, index) => (
                        <li key={index}>{contact.name} - {contact.phone}</li>
                    ))}
                </ul>
            ) : (
                <p>No contacts found.</p>
            )}
        </div>
    );
}

export default GoogleContacts;
