import React, { useState } from "react";
import axios from "axios";

const UploadTest = () => {
    const [image, setImage] = useState(null);
    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Select an image");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const res = await axios.post(
                "http://localhost:5016/items",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setMsg(res.data.message);
        } catch (error) {
            console.error(error);
            setMsg("Upload failed");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>Upload Image</h3>

            <input type="file" accept="image/*" onChange={handleChange} />
            <br /><br />

            <button onClick={handleUpload}>Upload</button>

            {msg && <p>{msg}</p>}
        </div>
    );
};

export default UploadTest;
