import React, { useState, useEffect } from "react";
import axios from "axios";

function Interactions({ selectedContactId }) {
    const [interactions, setInteractions] = useState([]);
    const [interactionText, setInteractionText] = useState("");
    const [interactionType, setInteractionType] = useState("notes");

    useEffect(() => {
        if (selectedContactId) {
            const fetchInteractions = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/get-interactions/${selectedContactId}`
                    );
                    const transformedData = response.data.map((item) => ({
                        ...item,
                        createdAt: item.created_at || null,
                        interactionType: item.interactiontype || "Unknown",
                    }));
                    setInteractions(transformedData);
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
            const response = await axios.post("http://localhost:5000/api/add-interaction", {
                contactId: selectedContactId,
                interaction: interactionText,
                interactionType
            });

            setInteractions((prev) => [
                ...prev,
                { interactionType, interaction: interactionText, createdAt: new Date() }
            ]);
            setInteractionText("");
        } catch (error) {
            console.error("Error adding interaction:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Interactions for Contact {selectedContactId}</h4>

            {/* Input Group */}
            <div className="input-group mb-3">
                <select
                    value={interactionType}
                    onChange={(e) => setInteractionType(e.target.value)}
                    className="form-select"
                >
                    <option value="notes">Notes</option>
                    <option value="payments">Payments</option>
                    <option value="meetings">Meetings</option>
                </select>
                <input
                    type="text"
                    value={interactionText}
                    onChange={(e) => setInteractionText(e.target.value)}
                    placeholder="Add an interaction"
                    className="form-control"
                />
                <button className="btn btn-primary" onClick={handleAddInteraction}>Add</button>
            </div>

            {/* Interactions Display */}
            <div className="list-group">
                {interactions.length > 0 ? (
                    interactions.map((interaction, index) => (
                        <div key={index} className="list-group-item">
                            <strong className="text-primary">{interaction.interactionType}:</strong> {interaction.interaction}
                            <span className="text-muted ms-3">
                                {interaction.createdAt ? new Date(interaction.createdAt).toLocaleString() : "Date Unavailable"}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No interactions found for this contact.</p>
                )}
            </div>
        </div>
    );
}

export default Interactions;
