import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import AddContact from "./components/AddContact";
import ContactList from "./components/ContactList";
import Interactions from "./components/Interactions";
import "bootstrap/dist/css/bootstrap.min.css";
import contactImage from "C:/Users/shind/Reactjs/InteractionTracker/client/client/src/components/contactimage.webp";

const imageSrc = contactImage;
function App() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

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
    setContacts([]);
  };

  const addNewContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  return (
    <div className="container mt-4">
      <header className="d-flex align-items-center justify-content-between mb-4">
        {user && (
          <div className="d-flex align-items-center">
            <img
              src={imageSrc || "default-avatar.png"}
              alt="User Avatar"
              className="rounded-circle"
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
            />
            <span>{user.name || user.email}</span>
          </div>
        )}

        <h1
          className="text-center flex-grow-1"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "500",
            fontSize: "1.8rem",
            margin: 0,
          }}
        >
          Person Centralized Interaction Tracker
        </h1>

        {user && (
          <button
            className="btn btn-outline-danger"
            style={{ fontSize: "0.9rem", padding: "6px 12px" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </header>

      {!user ? (
        <div className="text-center">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.error("Login Failed")}
            theme="outline"
            text="signin_with"
            shape="rectangular"
            width="250"
            logo_alignment="center"
          />
        </div>
      ) : (
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card p-3 shadow-sm mb-3">
              <AddContact userId={user.userId} addNewContact={addNewContact} />
            </div>
            <div className="card mt-3 p-3 shadow-sm">
              <ContactList
                contacts={contacts}
                onSelectContact={setSelectedContact}
                selectedContactId={selectedContact?.id}
              />
            </div>
          </div>
          <div className="col-md-6">
            {selectedContact && (
              <div className="card p-3 shadow-sm">
                <Interactions selectedContactId={selectedContact.id} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
