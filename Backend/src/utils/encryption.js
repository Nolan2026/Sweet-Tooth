import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('FATAL: ENCRYPTION_KEY is required in production!');
    }
    console.warn('WARNING: ENCRYPTION_KEY is not set. Using dev fallback.');
}

const FINAL_KEY = ENCRYPTION_KEY || 'v6yB$E&H+MbQeThWmZq4t7w!z%C*F-Ja';
const IV_LENGTH = 16;

export function encrypt(text) {
    if (!text) return null;
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(FINAL_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text) {
    if (!text) return null;
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(FINAL_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}
