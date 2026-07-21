import CryptoJS from 'crypto-js';

const getSharedSecret = (id1, id2) => {
  const secret = import.meta.env.VITE_E2E_SECRET || 'default_secret';
  // Sorting IDs ensures that both user A and user B generate the EXACT same secret key
  const combined = [id1, id2].sort().join('-');
  return `${combined}-${secret}`;
};

export const encryptMessage = (text, senderId, receiverId) => {
  if (!text) return '';
  const secretKey = getSharedSecret(senderId, receiverId);
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decryptMessage = (ciphertext, senderId, receiverId) => {
  if (!ciphertext) return '';
  try {
    const secretKey = getSharedSecret(senderId, receiverId);
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    // If decryption yields empty string but ciphertext wasn't empty, it might be unencrypted legacy text.
    return originalText || ciphertext;
  } catch (error) {
    // If decryption fails (e.g., malformed cipher), fallback to returning the ciphertext (handles legacy plain text)
    return ciphertext;
  }
};
