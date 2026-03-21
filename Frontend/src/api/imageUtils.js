export const getImageUrl = (imagePath, apiBaseURL = "") => {
    if (!imagePath) return null;
    
    // If it's already a full URL (Cloudinary or others), return it
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    
    // If it starts with /uploads, it's an old local file from the backend
    if (imagePath.startsWith("/uploads/")) {
        return `${apiBaseURL}${imagePath}`;
    }
    
    // If it's just a filename (possibly saved without/with leading slash but no /uploads)
    let cleanPath = imagePath;
    if (cleanPath.startsWith("/")) {
        cleanPath = cleanPath.substring(1);
    }
    
    return `${apiBaseURL}/uploads/${cleanPath}`;
};
