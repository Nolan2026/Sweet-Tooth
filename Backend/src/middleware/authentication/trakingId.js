function generateTrackingId() {
    const prefix = "ST";

    const timestamp = Date.now().toString().slice(-9); // unique part

    const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // random 4 chars
    return `${prefix}${timestamp}${random}`;
}

export default generateTrackingId;