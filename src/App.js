import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import AddContact from "./components/AddContact";
import ContactList from "./components/ContactList";
import Interactions from "./components/Interactions";
import "bootstrap/dist/css/bootstrap.min.css";
// import { FaUserPlus, FaSignOutAlt } from "react-icons/fa";

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
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>
          Person Centralized Interaction Tracker
        </h1>
        {!user ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.error("Login Failed")}
          />
        ) : (
          <div>
            <h3>Welcome, {user.email}!</h3>
            <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>
              {/* <FaSignOutAlt className="me-2" /> */}
              Logout
            </button>

            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card p-3 shadow-sm">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
