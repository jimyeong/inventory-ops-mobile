import axios from "axios";
let API_URL = 'https://sp6mobileserver-production.up.railway.app';

// Use a local emulator in development
if (__DEV__) {
    // If you are running on a physical device, replace http://localhost with the local ip of your PC. (http://192.168.x.x)
    API_URL = 'http://192.168.0.18:8080';
    //  API_URL = 'https://sp6mobilestaging-production.up.railway.app';
}


// Create axios instances with default config
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 20000, // 10 seconds,

});



export interface V1ApiResponse<T> {
    payload: T;
    success: boolean;
    message: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalPages: number;
}

export interface PaginatedResponse<T> extends V1ApiResponse<T> {
    pagination: PaginationInfo;
}
