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

    static updateUserDetails = async (userId, updatedUserDetails, authToken) => {
        try {
          const response = await fetch(`${USER_SERVICE_BASE_URL}/api/v1/users/${userId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json', // Make sure to set the content type
            },
            body: JSON.stringify(updatedUserDetails), // Include the updated user details in the request body
          });
      
          if (response.ok) {
            console.log('User details updated successfully');
          } else {
            console.error('Failed to update user details');
          }
        } catch (error) {
          console.error('Error updating user details:', error);
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
            console.log('error', error);
            if (error.response) {
                // Server responded with an error
                const errorMessage = error.response.data;
                throw new Error(errorMessage);
            } else if (error.request) {
                // The request was made but no response was received
                throw new Error('No response from the server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an error
                throw new Error('An error occurred while processing your request. Please try again.');
            }
        }
    };

    static getAllUsers = async (tokenStr, pageSize, pageNumber) => {

        try {
            const response = await axios.get(`${USER_SERVICE_BASE_URL}/api/v1/users?pageSize=${pageSize}&pageNumber=${pageNumber}`, { headers: {"Authorization" : `Bearer ${tokenStr}`} });
            return response.data;
        } catch (error) {
            throw new Error('Invalid credentials. Please try again.');
        }
    };

    static getAllUsersWithoutPagination = async (tokenStr) => {

        try {
            const response = await axios.get(`${USER_SERVICE_BASE_URL}/api/v1/users/interviewers`, { headers: {"Authorization" : `Bearer ${tokenStr}`} });
            return response.data;
        } catch (error) {
            throw new Error('Invalid credentials. Please try again.');
        }
    };

    static updateUser = async (tokenStr, userId, updatedUser) => {
        try {
            const response = await axios.patch(`${USER_SERVICE_BASE_URL}/api/v1/users/${userId}/admin`, updatedUser, { headers: {"Authorization" : `Bearer ${tokenStr}`} });
            return response.data;
        } catch (error) {
            throw new Error('Invalid request. Please try again.');
        }
    }

    static deleteUser = async (tokenStr, userId) => {
        try {
          const response = await axios.delete(`${USER_SERVICE_BASE_URL}/api/v1/users/${userId}`, {
            headers: { Authorization: `Bearer ${tokenStr}` },
          });
          return response.data;
        } catch (error) {
          if (error.response && error.response.status === 400) {
            throw new Error('Cannot delete this user. This user is scheduled to conduct interviews.');
          } else {
            throw new Error('Invalid request. Please try again.');
          }
        }
      };

    static logout = async (tokenStr) => {
        try {
            const response = await axios.delete(`${USER_SERVICE_BASE_URL}/api/v1/auth/logout`, { headers: {"Authorization" : `Bearer ${tokenStr}`} });
            return response.status;
        } catch (error) {
            throw new Error('Unable to logout. Please try again.');
        }
    }
}
