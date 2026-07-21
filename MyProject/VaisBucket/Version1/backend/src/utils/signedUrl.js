import jwt from "jsonwebtoken";

/**
 * Generate a signed URL for private file access
 * @param {string} fileId - The file ID
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {string} - Signed token
 */
export const generateSignedUrl = (fileId, expiresIn = 3600) => {
    const token = jwt.sign(
        {
            fileId,
            type: "file-access",
        },
        process.env.JWT_SECRET,
        {
            expiresIn,
        }
    );

    return token;
};

/**
 * Verify a signed URL token
 * @param {string} token - The signed token
 * @returns {object|null} - Decoded token or null if invalid
 */
export const verifySignedUrl = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== "file-access") {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error("Error verifying signed URL:", error.message);
        return null;
    }
};

/**
 * Generate a complete signed URL with base URL
 * @param {string} fileId - The file ID
 * @param {object} req - Express request object
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {string} - Complete signed URL
 */
export const generateCompleteSignedUrl = (fileId, req, expiresIn = 3600) => {
    const token = generateSignedUrl(fileId, expiresIn);
    const protocol = req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}/api/v1/files/${fileId}/access?token=${token}`;
};
