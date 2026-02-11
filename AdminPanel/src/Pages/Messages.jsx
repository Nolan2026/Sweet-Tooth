import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Messages.css";
import { useToast } from '../Context/ToastContext';
import { useConfirm } from "../Context/ConfirmContext";

export default function Messages() {
    const { showToast } = useToast();
    const confirm = useConfirm();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/messages");
            setMessages(res.data);
        } catch (err) {
            console.error("Fetch messages error:", err);
            showToast("Failed to fetch messages", 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        const isConfirmed = await confirm("Delete Message", "Are you sure you want to permanently delete this contact message?");
        if (!isConfirmed) return;

        try {
            await api.delete(`/admin/messages/${id}`);
            fetchMessages(); // Refresh the list
            setSelectedMessage(null);
            showToast("Message deleted successfully", 'success');
        } catch (err) {
            console.error("Delete error:", err);
            showToast("Failed to delete message", 'success');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="messages-container">
            <h1>Contact Messages</h1>

            {loading ? (
                <div className="loading">Loading messages...</div>
            ) : (
                <div className="messages-layout">
                    {/* Messages List */}
                    <div className="messages-list">
                        {messages.length === 0 ? (
                            <p className="no-messages">No messages found</p>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message-item ${selectedMessage?.id === message.id ? 'active' : ''}`}
                                    onClick={() => setSelectedMessage(message)}
                                >
                                    <div className="message-header">
                                        <strong>{message.name}</strong>
                                        <span className="message-date">{formatDate(message.createdAt)}</span>
                                    </div>
                                    <div className="message-subject">
                                        {message.subject || 'No Subject'}
                                    </div>
                                    <div className="message-preview">
                                        {message.message.substring(0, 60)}...
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Message Detail */}
                    <div className="message-detail">
                        {selectedMessage ? (
                            <>
                                <div className="detail-header">
                                    <h2>{selectedMessage.subject || 'No Subject'}</h2>
                                    <button
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="detail-info">
                                    <div className="info-row">
                                        <strong>From:</strong> {selectedMessage.name}
                                    </div>
                                    <div className="info-row">
                                        <strong>Email:</strong> {selectedMessage.email}
                                    </div>
                                    <div className="info-row">
                                        <strong>Date:</strong> {formatDate(selectedMessage.createdAt)}
                                    </div>
                                </div>

                                <div className="detail-message">
                                    <strong>Message:</strong>
                                    <p>{selectedMessage.message}</p>
                                </div>

                                <div className="detail-actions">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your inquiry'}`}
                                        className="reply-btn"
                                    >
                                        Reply via Email
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <p>Select a message to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
