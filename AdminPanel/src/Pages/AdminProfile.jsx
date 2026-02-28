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
        facebook_url: "",
        smtp_email: "",
        smtp_password: "",
        order_receiver: "",
        cod_limit: "",
        upi_id: "",
        upi_message: ""
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
                    facebook_url: res.data.facebook_url || "",
                    smtp_email: res.data.smtp_email || "",
                    smtp_password: "", // Always clear password field for security
                    order_receiver: res.data.order_receiver || "",
                    cod_limit: res.data.cod_limit || "",
                    upi_id: res.data.upi_id || "",
                    upi_message: res.data.upi_message || ""
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
        fd.append("smtp_email", form.smtp_email);
        fd.append("order_receiver", form.order_receiver);
        fd.append("cod_limit", form.cod_limit);
        fd.append("upi_id", form.upi_id);
        fd.append("upi_message", form.upi_message);


        if (form.smtp_password) {
            fd.append("smtp_password", form.smtp_password);
        }

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

                    <div className="input-group">
                        <label>Company Email (Sender)</label>
                        <input
                            type="email"
                            placeholder="Email to send OTP/Orders"
                            value={form.smtp_email}
                            onChange={e => setForm({ ...form, smtp_email: e.target.value })}
                            autoComplete="off"
                        />
                    </div>

                    <div className="input-group">
                        <label>Company Email Password</label>
                        <input
                            type="password"
                            placeholder="App Password for Gmail"
                            value={form.smtp_password}
                            onChange={e => setForm({ ...form, smtp_password: e.target.value })}
                            autoComplete="new-password"
                        />
                        <small style={{ color: '#666', fontSize: '11px' }}>Only enter if you want to update it. This is secured.</small>
                    </div>

                    <div className="input-group">
                        <label>Order Receiver Email</label>
                        <input
                            type="email"
                            placeholder="Email to receive order data"
                            value={form.order_receiver}
                            onChange={e => setForm({ ...form, order_receiver: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>COD Order Limit (₹)</label>
                        <input
                            type="number"
                            placeholder="e.g. 1000"
                            value={form.cod_limit}
                            onChange={e => setForm({ ...form, cod_limit: e.target.value })}
                        />
                        <small style={{ color: '#666', fontSize: '11px' }}>Maximum amount allowed for Cash on Delivery</small>
                    </div>

                    <div className="input-group">
                        <label>UPI ID (for payments)</label>
                        <input
                            placeholder="e.g. yourname@upi"
                            value={form.upi_id}
                            onChange={e => setForm({ ...form, upi_id: e.target.value })}
                        />
                        <small style={{ color: '#666', fontSize: '11px' }}>Used for QR code generation on bills</small>
                    </div>

                    <div className="input-group">
                        <label>UPI Message / Note</label>
                        <input
                            placeholder="e.g. Thanks for shopping"
                            value={form.upi_message}
                            onChange={e => setForm({ ...form, upi_message: e.target.value })}
                        />
                        <small style={{ color: '#666', fontSize: '11px' }}>Short note that appears in the QR payment</small>
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


