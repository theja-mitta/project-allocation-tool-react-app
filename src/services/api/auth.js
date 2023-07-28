// api/auth.js

import axios from 'axios';

const USER_SERVICE_BASE_URL = 'http://localhost:9092'; 

export class AuthService {
    static login = async (email, password) => {
        const requestBody = { email, password };

        try {
            const response = await axios.post(`${USER_SERVICE_BASE_URL}/api/v1/auth/authenticate`, requestBody);
            return response.data;
        } catch (error) {
            throw new Error('Invalid credentials. Please try again.');
        }
    };

    static getUserPermissions = async (tokenStr) => {

        try {
            const response = await axios.get(`${USER_SERVICE_BASE_URL}/api/v1/authorization/permissions`, { headers: {"Authorization" : `Bearer ${tokenStr}`} });
            return response.data;
        } catch (error) {
            throw new Error('Invalid request. Please try again.');
        }
    }

    static getUserRole = async (tokenStr) => {

        try {
            const response = await axios.get(`${USER_SERVICE_BASE_URL}/api/v1/authorization/role`, { headers: {"Authorization" : `Bearer ${tokenStr}`} });
            return response.data;
        } catch (error) {
            throw new Error('Invalid request. Please try again.');
        }
    }

    static getUser = async (tokenStr) => {
        try {
            const response = await axios.get(`${USER_SERVICE_BASE_URL}/api/v1/authorization/user`, { headers: {"Authorization" : `Bearer ${tokenStr}`} });
            return response.data;
        } catch (error) {
            throw new Error('Invalid request. Please try again.');
        }
    }

    static register = async (name, email, password, role) => {
        const requestBody = { name, email, password, role };

        try {
            const response = await axios.post(`${USER_SERVICE_BASE_URL}/api/v1/auth/register`, requestBody);
            return response.data;
        } catch (error) {
            throw new Error('Invalid credentials. Please try again.');
        }
    };
}
