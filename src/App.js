import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import AddContact from "./components/AddContact";
import ContactList from "./components/ContactList";
import Interactions from "./components/Interactions";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch user's contacts
  const fetchContacts = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-contacts/${userId}`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error.response?.data || error.message);
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    if (token) {
      try {
        const response = await axios.post("http://localhost:5000/auth/google-login", { token });
        setUser(response.data);

        // Fetch contacts immediately after login
        fetchContacts(response.data.userId);
      } catch (error) {
        console.error("Error sending token to server:", error.response?.data || error.message);
      }
    } else {
      console.error("No credential received from Google.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setContacts([]); // Clear contacts on logout
  };

  // Add a new contact and update the state
  const addNewContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Person Centralized Interaction Tracker</h1>
      <div className="text-center">
        {!user ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.error("Login Failed");
            }}
          />
        ) : (
          <div>
            <h3>Welcome, {user.email}!</h3>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
              Logout
            </button>
            <AddContact userId={user.userId} addNewContact={addNewContact} />
            <ContactList
              contacts={contacts}
              onSelectContact={setSelectedContact} // Correctly passing the function here
              selectedContactId={selectedContact?.id}
            />
            {selectedContact && (
              <Interactions selectedContactId={selectedContact.id} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
