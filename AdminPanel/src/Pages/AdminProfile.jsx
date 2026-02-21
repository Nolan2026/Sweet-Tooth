import { useEffect, useState } from "react";
import api from "../api/axios.js";
import "../styles/AdminProfile.css";
import { useToast } from "../Context/ToastContext";
import { useConfirm } from "../Context/ConfirmContext";
import { Link } from "react-router-dom";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5016";

export default function AdminProfile() {
    const { showToast } = useToast();
    const confirm = useConfirm();
    const [profile, setProfile] = useState(null);
    const [images, setImages] = useState({});
    const [preview, setPreview] = useState({});
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        business_name: "",
        address: "",
        gstin: "",
        phone: "",
        whatsapp: "",
        business_email: "",
        instagram_url: "",
        facebook_url: ""
    });

    const DEFAULT_IMAGES = {
        frontend_logo: "https://placehold.co/200x200?text=Frontend+Logo",
        backend_logo: "https://placehold.co/200x200?text=Backend+Logo",
        business_logo: "https://placehold.co/200x200?text=Business+Logo",
        Collections_image: "https://placehold.co/600x400?text=Collections",
        OurStory_image: "https://placehold.co/600x400?text=Our+Story"
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get(`/admin/admin-profile`);
            setProfile(res.data);
            if (res.data) {
                setForm({
                    business_name: res.data.business_name || "",
                    address: res.data.address || "",
                    gstin: res.data.gstin || "",
                    phone: res.data.phone || "",
                    whatsapp: res.data.whatsapp || "",
                    business_email: res.data.business_email || "",
                    instagram_url: res.data.instagram_url || "",
                    facebook_url: res.data.facebook_url || ""
                });
            }
        } catch (err) {
            console.error("Failed to load profile", err);
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        const name = e.target.name;
        if (!file) return;

        setImages(prev => ({ ...prev, [name]: file }));
        setPreview(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const fd = new FormData();
        fd.append("business_name", form.business_name);
        fd.append("address", form.address);
        fd.append("gstin", form.gstin);
        fd.append("phone", form.phone);
        fd.append("whatsapp", form.whatsapp);
        fd.append("business_email", form.business_email);
        fd.append("instagram_url", form.instagram_url);
        fd.append("facebook_url", form.facebook_url);

        Object.keys(images).forEach(k => fd.append(k, images[k]));

        try {
            await api.post(`/admin/admin-profile`, fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            showToast("Profile updated successfully!", "success");
            loadProfile();
            setImages({});
        } catch (err) {
            showToast("Error saving profile", "error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteImage = async (field) => {
        const isConfirmed = await confirm("Remove Image", "Are you sure you want to delete this image? This cannot be undone.");
        if (!isConfirmed) return;

        try {
            await api.delete(`/admin/admin-profile/image/${field}`);
            showToast("Image removed", "success");
            loadProfile();
            setPreview(prev => ({ ...prev, [field]: null }));
        } catch (err) {
            showToast("Failed to delete image", "error");
            console.error(err);
        }
    };


    const showImage = (field) => {
        if (preview[field]) return preview[field];
        if (profile?.[field]) return `${BASE}/uploads/${profile[field]}`;
        return DEFAULT_IMAGES[field];
    };

    return (
        <div className="admin-container">
            <form onSubmit={submit}>
                <div className="heads">
                    <h2>Admin Profile Settings</h2>
                    <div className="nav-btn">
                        <Link to={"/admin/messages"} > <span className="nav-admin">Message</span></Link>
                        <Link to={"/admin/attend"} > <span className="nav-admin">Attendence</span></Link>
                        <Link to={"/admin/label"} > <span className="nav-admin">Labels</span></Link>
                        <Link to={"/admin/media"} > <span className="nav-admin">Media</span></Link>
                    </div>
                </div>

                <div className="form-grid">
                    <div className="input-group">
                        <label>Business Name</label>
                        <input
                            placeholder="Business Name"
                            value={form.business_name}
                            onChange={e => setForm({ ...form, business_name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>GSTIN</label>
                        <input
                            placeholder="GSTIN"
                            value={form.gstin}
                            onChange={e => setForm({ ...form, gstin: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Phone Number</label>
                        <input
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>WhatsApp Number</label>
                        <input
                            placeholder="WhatsApp Number"
                            value={form.whatsapp}
                            onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Business Email</label>
                        <input
                            type="email"
                            placeholder="Business Email"
                            value={form.business_email}
                            onChange={e => setForm({ ...form, business_email: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Instagram URL</label>
                        <input
                            placeholder="Instagram URL"
                            value={form.instagram_url}
                            onChange={e => setForm({ ...form, instagram_url: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Facebook URL</label>
                        <input
                            placeholder="Facebook URL"
                            value={form.facebook_url}
                            onChange={e => setForm({ ...form, facebook_url: e.target.value })}
                        />
                    </div>
                </div>


                <div className="input-group">
                    <label>Address</label>
                    <textarea
                        placeholder="Business Address"
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                        required
                    />
                </div>

                <div className="images-grid">
                    {[
                        "frontend_logo",
                        "backend_logo",
                        "business_logo",
                        "Collections_image",
                        "OurStory_image"
                    ].map((f) => (
                        <div key={f} className="upload-box">
                            <label>{f.replace("_", " ")}</label>
                            <div className="img-preview-container">
                                {showImage(f) && <img src={showImage(f)} alt={f} />}
                                {profile?.[f] && !preview[f] && (
                                    <button
                                        type="button"
                                        className="delete-img-btn"
                                        onClick={() => handleDeleteImage(f)}
                                        title="Remove Image"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <input type="file" name={f} onChange={onFileChange} accept="image/*" />
                        </div>
                    ))}
                </div>

                <button disabled={loading} className="save-btn">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}


