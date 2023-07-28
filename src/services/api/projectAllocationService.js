// api/projectAllocationService.js

import axios from 'axios';

const PROJECT_ALLOCATION_SERVICE_BASE_URL = 'http://localhost:9091'; 

export class ProjectAllocationService {
    static getProjectOpenings= async () =>{
        try {
            const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/openings');
            return response.data;
        } catch (error) {
            throw new Error('Unable to get project openings');
        }
    }

    static getAllApplications = async () =>{
        try {
            const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/applications');
            return response.data;
        } catch (error) {
            throw new Error('Unable to get applications');
        }
    }

    static getApplicationDetails = async(applicationId) => {
        try {
            const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/applications/' + applicationId);
            return response.data;
        } catch (error) {
            throw new Error('Unable to get application details');
        }
    }

    static applyForOpening = async(openingId, userId) => {
        try {
            const response = await axios.post(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/openings/' + openingId + '/applications', {
                "candidate": {
                    "id": userId
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Unable to apply for the opening');
        }
    }

    static updateOpening = async (openingId, payload) => {
        try {
            const response = await axios.put(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/openings/' + openingId, payload);
            return response.data;
        } catch (error) {
            throw new Error('Unable to update the opening');
        }
    }

    static getSkills = async () => {
        try {
            const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/skills');
            return response.data;
        } catch (error) {
            throw new Error('Unable to fetch the skills');
        }
    }

    static createOpening = async (projectId, payload) => {
        try {
            const response = await axios.post(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/projects/' + projectId + '/openings', payload);
            return response.data;
        } catch (error) {
            throw new Error('Unable to fetch the skills');
        }
    }

    static getProjects = async  () => {
        try {
            const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/projects');
            return response.data;
        } catch (error) {
            throw new Error('Unable to fetch the projects');
        }
    }
}
