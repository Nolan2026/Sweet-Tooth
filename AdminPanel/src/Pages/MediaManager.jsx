import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../Context/ToastContext';
import { useConfirm } from '../Context/ConfirmContext';
import '../styles/Media.css';

const MediaManager = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const confirm = useConfirm();

    const fetchImages = async () => {
        try {
            const res = await api.get('/admin/media');
            setImages(res.data);
        } catch (err) {
            showToast("Failed to fetch images", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleDelete = async (filename) => {
        const isConfirmed = await confirm(
            "Delete Image",
            "Are you sure you want to delete this image? Any items using this image will show a placeholder."
        );

        if (!isConfirmed) return;

        try {
            await api.delete(`/admin/media/${filename}`);
            showToast("Image deleted successfully", "success");
            setImages(images.filter(img => img.filename !== filename));
        } catch (err) {
            showToast("Delete failed", "error");
        }
    };

    const handleReplace = async (oldFilename, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            await api.post(`/admin/media/replace/${oldFilename}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast("Image replaced successfully", "success");
            fetchImages();
        } catch (err) {
            showToast("Replace failed", "error");
        }
    };

    return (
        <div className="media-manager-container">
            <div className="media-header">
                <h1>Media Gallery</h1>
                <p>Manage and organize all your business images in one place</p>
            </div>

            {loading ? (
                <div className="media-loading">
                    <div className="loader-spinner"></div>
                    <p>Fetching your gallery items...</p>
                </div>
            ) : (
                <div className="media-grid">
                    {images.map((img) => (
                        <div key={img.filename} className="media-card">
                            <div className="media-img-wrapper">
                                <img
                                    src={`${api.defaults.baseURL}${img.url}`}
                                    alt={img.filename}
                                />
                            </div>
                            <div className="media-info">
                                <h4 className="media-filename" title={img.filename}>
                                    {img.filename}
                                </h4>
                                <div className="media-details">
                                    <span>{(img.size / 1024).toFixed(1)} KB</span>
                                    <span>{new Date(img.mtime).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="media-actions">
                                <label className="replace-btn-label">
                                    Change
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => handleReplace(img.filename, e)}
                                    />
                                </label>
                                <button
                                    className="delete-media-btn"
                                    onClick={() => handleDelete(img.filename)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {images.length === 0 && (
                        <div className="empty-state" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '20px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🖼️</div>
                            <h3>Your gallery is empty</h3>
                            <p style={{ color: '#888' }}>Upload images in Inventory or Profile to see them here.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MediaManager;
