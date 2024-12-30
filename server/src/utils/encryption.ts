// encryption.ts
import crypto from 'crypto';

const secretKey = process.env.CRYPTO_SECRET_KEY;
const secretIV = process.env.CRYPTO_SECRET_IV;
const encryptionMethod = process.env.CRYPTO_ENCRYPTION_METHOD || 'aes-256-cbc';

if (!secretKey || !secretIV || !encryptionMethod) {
  throw new Error('Env variable for crypto missing.');
}

const key = crypto.createHash('sha256').update(secretKey).digest('base64').substring(0, 32);
const iv = crypto.createHash('md5').update(secretIV).digest('base64').substring(0, 16);

export function encryptData(data: string): string {
  try {
    const cipher = crypto.createCipheriv(encryptionMethod, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    if (!encrypted) {
      throw new Error('Encryption failed: Unable to encrypt data.');
    }
    return Buffer.from(encrypted, 'hex').toString('base64');
  } catch (error: any) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

export function decryptData(encryptedData: string): string {
  try {
    const encryptedHex = Buffer.from(encryptedData, 'base64').toString('hex');
    const decipher = crypto.createDecipheriv(encryptionMethod, key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    if (!decrypted) {
      throw new Error('Decryption failed: Data is corrupted or tampered.');
    }
    return decrypted;
  } catch (error: any) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

