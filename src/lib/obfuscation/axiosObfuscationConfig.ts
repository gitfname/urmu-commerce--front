// src/lib/obfuscation/axiosObfuscationConfig.ts
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ObfuscationService } from './obfuscationService';

export interface ObfuscationConfig {
    enabled?: boolean;
    excludeEndpoints?: string[];
    includeOnlyEndpoints?: string[];
}

export const setupObfuscationInterceptors = (
    axiosInstance: AxiosInstance,
    config: ObfuscationConfig = { enabled: true }
) => {
    const obfuscationService = ObfuscationService.getInstance();

    const shouldObfuscate = (url?: string): boolean => {
        if (!config.enabled || !url) return false;

        // Check if endpoint should be excluded
        if (config.excludeEndpoints?.some(endpoint => url.includes(endpoint))) {
            return false;
        }

        // If includeOnlyEndpoints is specified, only obfuscate those
        if (config.includeOnlyEndpoints && config.includeOnlyEndpoints.length > 0) {
            return config.includeOnlyEndpoints.some(endpoint => url.includes(endpoint));
        }

        return true;
    };

    // Request interceptor
    axiosInstance.interceptors.request.use(
        (requestConfig: InternalAxiosRequestConfig) => {
            if (shouldObfuscate(requestConfig.url)) {
                // Add obfuscation header
                requestConfig.headers['x-obfuscated'] = 'true';

                // Encrypt request data if present
                if (requestConfig.data) {
                    // console.log('Original request data:', requestConfig.data);
                    const encryptedData = obfuscationService.encrypt(requestConfig.data);
                    requestConfig.data = { data: encryptedData };
                }

                // Handle query parameters for GET requests
                if (requestConfig.params && Object.keys(requestConfig.params).length > 0) {
                    // console.log('Original query params:', requestConfig.params);

                    const encryptedParams = obfuscationService.encrypt(requestConfig.params);
                    // Clear original params and set encrypted one
                    requestConfig.params = { q: encryptedParams };

                    // console.log('Encrypted query params:', requestConfig.params);
                }
            }

            return requestConfig;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            // Check if response is obfuscated
            const isObfuscated = response.config.headers?.['x-obfuscated'] === 'true';

            if (isObfuscated && response.data?.data) {
                try {
                    // console.log('Encrypted response:', response.data.data);
                    const decryptedData = obfuscationService.decrypt(response.data.data);
                    // console.log('Decrypted response:', decryptedData);
                    response.data = decryptedData;
                } catch (error) {
                    console.error('Failed to decrypt response', error);
                    throw new Error('Invalid response data');
                }
            }

            return response;
        },
        (error) => {
            // Handle encrypted error responses
            if (error.response?.data?.data && error.response.config?.headers?.['x-obfuscated'] === 'true') {
                try {
                    const decryptedError = obfuscationService.decrypt(error.response.data.data);
                    error.response.data = decryptedError;
                } catch (decryptError) {
                    console.error('Failed to decrypt error response', decryptError);
                }
            }
            return Promise.reject(error);
        }
    );
};