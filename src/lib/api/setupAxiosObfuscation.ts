// src/lib/api/setupAxiosObfuscation.ts
import axios from 'axios';
import { setupObfuscationInterceptors } from '../obfuscation/axiosObfuscationConfig';

export const initializeAxiosObfuscation = () => {
    // Setup obfuscation on the default axios instance
    setupObfuscationInterceptors(axios, {
        enabled: false
    });
};