// src/lib/obfuscation/obfuscationService.ts
import CryptoJS from 'crypto-js';

export class ObfuscationService {
    private static instance: ObfuscationService;
    private readonly secretKey: string;
    private readonly salt = 'your-salt-here';

    private constructor() {
        const secret = import.meta.env.VITE_APP_OBFUSCATION_SECRET;
        this.secretKey = this.deriveKey(secret);
        // console.log('Derived key:', this.secretKey);
    }

    static getInstance(): ObfuscationService {
        if (!ObfuscationService.instance) {
            ObfuscationService.instance = new ObfuscationService();
        }
        return ObfuscationService.instance;
    }

    private deriveKey(secret: string): string {
        return CryptoJS.SHA256(secret + this.salt).toString();
    }

    encrypt(data: any): string {
        try {
            const jsonString = JSON.stringify(data);
            // console.log('Encrypting:', jsonString);

            const encrypted = CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
            // console.log('Encrypted result:', encrypted);

            return encrypted;
        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('Encryption failed');
        }
    }

    decrypt(encryptedData: string): any {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
            const jsonString = decrypted.toString(CryptoJS.enc.Utf8);

            if (!jsonString) {
                throw new Error('Decryption resulted in empty string');
            }

            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Decryption failed:', error);
            throw new Error('Decryption failed');
        }
    }
}