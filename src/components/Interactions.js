import React, { useState, useEffect } from "react";
import axios from "axios";

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
            <h4>Interactions</h4>
            {selectedContactId ? (
                <div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={interactionText}
                            onChange={(e) => setInteractionText(e.target.value)}
                            placeholder="Add an interaction"
                        />
                    </div>
                    <button
                        onClick={handleAddInteraction}
                        className="btn btn-primary"
                    >
                        Add Interaction
                    </button>

                    <ul className="list-group mt-3">
                        {interactions.length > 0 ? (
                            interactions.map((interaction, index) => (
                                <li key={index} className="list-group-item">
                                    {interaction.interaction} -{" "}
                                    {new Date(interaction.createdAt).toLocaleString()}
                                </li>
                            ))
                        ) : (
                            <p>No interactions found for this contact.</p>
                        )}
                    </ul>
                </div>
            ) : (
                <p>Select a contact to see interactions.</p>
            )}
        </div>
    );
}

export default Interactions;
