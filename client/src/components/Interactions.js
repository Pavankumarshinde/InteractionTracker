import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function Interactions({ selectedContactId }) {
    const [interactions, setInteractions] = useState([]);
    const [interactionText, setInteractionText] = useState("");
    const [interactionType, setInteractionType] = useState("notes");
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentType, setPaymentType] = useState("given");
    const [filterType, setFilterType] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showDateInputs, setShowDateInputs] = useState(false); // New state variable

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
                    setInteractions(transformedData.reverse());
                } catch (error) {
                    console.error("Error fetching interactions:", error);
                }
            };

            fetchInteractions();
        }
    }, [selectedContactId]);

    const getInteractionStyle = (type) => {
        switch (type) {
            case "meetings":
                return { background: "#fbfdf7", borderLeft: "5px solid #0f5132" };
            case "payments":
                return { background: "#fdf7f7", borderLeft: "5px solid #842029" };
            case "notes":
            default:
                return { background: "#f9fdfd", borderLeft: "5px solid #055160" };
        }
    };

    const handleAddInteraction = async () => {
        if (!interactionText && interactionType === "notes") return;
        if (interactionType === "meetings" && (!meetingDate || !meetingTime || !interactionText)) return;
        if (interactionType === "payments" && (!paymentAmount || !interactionText)) return;

        let interactionDescription = "";

        if (interactionType === "meetings") {
            interactionDescription = `Meeting on ${meetingDate} at ${meetingTime}. Description: ${interactionText}`;
        } else if (interactionType === "payments") {
            interactionDescription = `Payment of ${paymentAmount} INR, Type: ${paymentType}. Description: ${interactionText}`;
        } else {
            interactionDescription = interactionText;
        }

        try {
            await axios.post("http://localhost:5000/api/add-interaction", {
                contactId: selectedContactId,
                interaction: interactionDescription,
                interactionType,
            });

            setInteractions((prev) => [
                { interactionType, interaction: interactionDescription, createdAt: new Date() },
                ...prev,
            ]);
            setInteractionText("");
            setMeetingDate("");
            setMeetingTime("");
            setPaymentAmount("");
            setPaymentType("given");
        } catch (error) {
            console.error("Error adding interaction:", error);
        }
    };

    const generatePDF = () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const filteredInteractions = interactions.filter((interaction) => {
            const interactionDate = new Date(interaction.createdAt);
            return interactionDate >= start && interactionDate <= end;
        });

        if (filteredInteractions.length === 0) {
            alert("No interactions found for the selected date range.");
            return;
        }

        const doc = new jsPDF();

        // Title and Date Range
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`Interactions for Contact ${selectedContactId}`, 10, 10);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Date Range: ${startDate} to ${endDate}`, 10, 20);

        // Start content generation
        let yPosition = 30;
        const lineSpacing = 8; // Space between each interaction
        const fontSize = 10;

        filteredInteractions.forEach((interaction) => {
            const interactionDate = new Date(interaction.createdAt);
            const formattedDate = interactionDate.toLocaleDateString();
            const formattedTime = interactionDate.toLocaleTimeString();

            if (yPosition > 270) {
                // If nearing the bottom of the page, add a new page
                doc.addPage();
                yPosition = 20; // Reset position
            }

            // Date and Time
            doc.setFontSize(fontSize);
            doc.setFont("Helvetica", "italic");
            doc.text(`${formattedDate}, ${formattedTime}`, 10, yPosition);

            // Interaction Type and Description
            doc.setFont("Helvetica", "normal");
            const interactionContent = `${interaction.interactionType}: ${interaction.interaction}`;
            const splitText = doc.splitTextToSize(interactionContent, 180); // Wrap text at 180mm width
            doc.text(splitText, 10, yPosition + 5);

            yPosition += lineSpacing + (splitText.length * 5); // Adjust position based on text height
        });

        // Save the PDF
        doc.save(`Contact_${selectedContactId}_Interactions_${startDate}_to_${endDate}.pdf`);

        // Reset state after PDF is generated
        setShowDateInputs(false);
        setStartDate("");
        setEndDate("");
    };

    const filteredInteractions =
        filterType === "all"
            ? interactions
            : interactions.filter((interaction) => interaction.interactionType === filterType);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Interactions for Contact {selectedContactId}</h4>
                <div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="form-select d-inline-block w-auto"
                    >
                        {["all", "notes", "payments", "meetings"].map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div
                className="list-group"
                style={{
                    height: "350px",
                    overflowY: "auto",
                    borderRadius: "12px",
                    border: "1px solid #ddd",
                }}
            >
                {filteredInteractions.length > 0 ? (
                    [...filteredInteractions].reverse().map((interaction, index) => (
                        <div
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                            style={{
                                borderRadius: "12px",
                                padding: "12px",
                                marginBottom: "8px",
                                ...getInteractionStyle(interaction.interactionType),
                            }}
                        >
                            <div>
                                <strong className="text-primary">{interaction.interactionType}:</strong>{" "}
                                {interaction.interaction}
                            </div>
                            <span
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}
                            >
                                {interaction.createdAt
                                    ? new Date(interaction.createdAt).toLocaleString()
                                    : "Date Unavailable"}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No interactions found for this contact.</p>
                )}
            </div>

            <div className="d-flex mt-3">
                {showDateInputs && ( // Conditionally render the date inputs
                    <>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="form-control me-2"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="form-control me-2"
                        />
                    </>
                )}
                <button
                    onClick={() => {
                        if (!showDateInputs) setShowDateInputs(true);
                        else generatePDF();
                    }}
                    className="btn btn-primary"
                >
                    {showDateInputs ? "Generate PDF" : "Share as PDF"}
                </button>
            </div>
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

                {interactionType === "meetings" && (
                    <>
                        <input
                            type="date"
                            value={meetingDate}
                            onChange={(e) => setMeetingDate(e.target.value)}
                            className="form-control"
                        />
                        <input
                            type="time"
                            value={meetingTime}
                            onChange={(e) => setMeetingTime(e.target.value)}
                            className="form-control"
                        />
                    </>
                )}

                {interactionType === "payments" && (
                    <>
                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Amount"
                            className="form-control"
                        />
                        <select
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            className="form-select"
                        >
                            <option value="given">Given</option>
                            <option value="taken">Taken</option>
                        </select>
                    </>
                )}

                <input
                    type="text"
                    value={interactionText}
                    onChange={(e) => setInteractionText(e.target.value)}
                    placeholder="Add a description"
                    className="form-control"
                />
                <button
                    onClick={handleAddInteraction}
                    type="submit"
                    className="btn btn-success ms-2"
                >
                    ✓
                </button>
            </div>
        </div>
    );
}

export default Interactions;
