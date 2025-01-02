import React, { useState, useEffect } from "react";
import axios from "axios";
// import "bootstrap-icons/font/bootstrap-icons.css";

function Interactions({ selectedContactId }) {
    const [interactions, setInteractions] = useState([]);
    const [interactionText, setInteractionText] = useState("");

    // Fetch interactions for the selected contact
    useEffect(() => {
        if (selectedContactId) {
            const fetchInteractions = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/get-interactions/${selectedContactId}`
                    );
                    setInteractions(response.data);
                } catch (error) {
                    console.error("Error fetching interactions:", error);
                }
            };

            fetchInteractions();
        }
    }, [selectedContactId]);

    const handleAddInteraction = async () => {
        if (!interactionText) return;

        try {
            await axios.post("http://localhost:5000/api/add-interaction", {
                contactId: selectedContactId,
                interaction: interactionText,
            });

            // Refresh interactions after adding a new one
            setInteractionText("");
            setInteractions((prev) => [
                ...prev,
                { interaction: interactionText, createdAt: new Date() },
            ]);
        } catch (error) {
            console.error("Error adding interaction:", error);
        }
    };

    return (
        <div className="mt-4">
            <h4 className="text-primary">
                <i className="bi bi-chat-dots"></i> Interactions
            </h4>
            {selectedContactId ? (
                <>
                    {/* Input for adding interactions */}
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={interactionText}
                            onChange={(e) => setInteractionText(e.target.value)}
                            placeholder="Add an interaction"
                        />
                        <button
                            onClick={handleAddInteraction}
                            className="btn btn-success"
                            title="Add Interaction"
                        >
                            Add <i className="bi bi-plus-circle"></i>
                        </button>
                    </div>

                    {/* Scrollable box for interactions */}
                    <div
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            height: "320px", // Adjust height as needed
                            overflowY: "scroll",
                            padding: "10px",
                        }}
                    >
                        {interactions.length > 0 ? (
                            [...interactions].reverse().map((interaction, index) => (
                                <div key={index} className="list-group-item list-group-item-action">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="bi bi-person-circle text-secondary me-2"></i>
                                            {interaction.interaction || "No details provided"}
                                        </div>
                                        <small className="text-muted">
                                            {interaction.createdAt
                                                ? new Date(interaction.createdAt).toLocaleString()
                                                : "Date unavailable"}
                                        </small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No interactions found for this contact.</p>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-muted">Select a contact to see interactions.</p>
            )}
        </div>
    );
}

export default Interactions;
