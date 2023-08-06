// api/projectAllocationService.js

import axios from 'axios';

const PROJECT_ALLOCATION_SERVICE_BASE_URL = 'http://localhost:9091'; 

export class ProjectAllocationService {
    // static getProjectOpenings= async (authToken, pageSize, pageNumber, showApplied, ownOpenings) => {
    //     try {
    //         const response = await axios.get(`${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/openings?pageSize=${pageSize}&pageNumber=${pageNumber}`, { headers: {"Authorization" : `Bearer ${authToken}`} });
    //         // console.log(response.data.openings);
    //         return response.data;
    //     } catch (error) {
    //         throw new Error('Unable to get project openings');
    //     }
    // }

    static getProjectOpenings = async (authToken, pageSize, pageNumber, showApplied, ownOpenings) => {
        try {
          let url = `${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/openings?pageSize=${pageSize}&pageNumber=${pageNumber}`;
      
          if (showApplied !== undefined) {
            url += `&appliedBySelf=${showApplied}`;
          }
      
          if (ownOpenings !== undefined) {
            url += `&postedBySelf=${ownOpenings}`;
          }
      
          const response = await axios.get(url, { headers: { "Authorization": `Bearer ${authToken}` } });
          return response.data;
        } catch (error) {
          throw new Error('Unable to get project openings');
        }
      };
      

    static getProjectsForUser = async (authToken, userId) => {
        try {
            const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/projects/users/' + userId, { headers: {"Authorization" : `Bearer ${authToken}`} });
            console.log('response', response);
            return response.data;
        } catch (error) {
            throw new Error('Unable to get projects for user with id' + userId + ': ' + error.message);
        }
    }

    static getAllApplications = async (status, pageSize, pageNumber, authToken) => {
        try {
            const response = await axios.get(`${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/applications?status=${status}&pageSize=${pageSize}&pageNumber=${pageNumber}`, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
        } catch (error) {
            throw new Error('Unable to get applications');
        }
    }

    static getApplicationDetails = async(applicationId, authToken) => {
        try {
            const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/applications/' + applicationId, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
        } catch (error) {
            throw new Error('Unable to get application details');
        }
    }

    static fetchApplicationDetails = async (openingId, userId, authToken) => {
        console.log('Fetching application details')
        try {
            const response = await axios.get(`${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/applications/details?openingId=${openingId}&candidateId=${userId}`, { headers: {"Authorization" : `Bearer ${authToken}`} });
            console.log('response', response);
;            return response.data;
        } catch (error) {
            console.error(error);
        }
    };

    static applyForOpening = async(openingId, userId, authToken) => {
        try {
            const response = await axios.post(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/openings/' + openingId + '/applications', {
                "candidate": {
                    "id": userId
                }
            }, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
        } catch (error) {
            throw new Error('Unable to apply for the opening');
        }
    }

    static updateOpening = async (openingId, payload, authToken) => {
        try {
            const response = await axios.put(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/openings/' + openingId, payload, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
        } catch (error) {
            throw new Error('Unable to update the opening');
        }
    }

    static getSkills = async (authToken) => {
        try {
            const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/skills', { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
        } catch (error) {
            throw new Error('Unable to fetch the skills');
        }
    }

    static createOpening = async (projectId, payload, authToken) => {
        try {
            const response = await axios.post(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/projects/' + projectId + '/openings', payload, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response;
        } catch (error) {
            throw new Error('Unable to create the opening');
        }
    }

    static getProjects = async (authToken) => {
        try {
            const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/projects', { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
        } catch (error) {
            throw new Error('Unable to fetch the projects');
        }
    }

    static getAllActivityLogs = async (authToken, pageSize, pageNumber) => {
        try {
          const response = await axios.get(`${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/audit-logs?pageSize=${pageSize}&pageNumber=${pageNumber}`, { headers: {"Authorization" : `Bearer ${authToken}`} });
          return response.data;
        } catch (error) {
          throw new Error('Unable to get activity logs');
        }
      };
    
      static getActivityLogComments = async (logId, authToken) => {
        try {
          const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/audit-logs/' + logId + '/comments', { headers: {"Authorization" : `Bearer ${authToken}`} });
          return response.data;
        } catch (error) {
          throw new Error('Unable to get activity log comments');
        }
      };

      static scheduleInterview = async (applicationId, interviewData, authToken) => {
        try {
            const response = await axios.post(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/applications/' + applicationId + '/interviews', interviewData, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
          } catch (error) {
            throw new Error('Unable to get activity log comments');
          }
      };

      static updateInterviewStatus = async (interviewId, newInterviewStatus, authToken) => {
        try {
            const response = await axios.patch(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/interviews/' + interviewId + '/status?newStatus=' + newInterviewStatus, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.status;
          } catch (error) {
            throw new Error('Unable to update the interview status');
          }
      }

      static fetchFreePoolUsers = async (authToken, pageSize, pageNumber) => {
        try {
            const response = await axios.get(`${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/reports/users/free?pageSize=${pageSize}&pageNumber=${pageNumber}`, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
          } catch (error) {
            throw new Error('Unable to fetch the free pool users data');
          }
      }

      // `http://localhost:9091/api/v1/reports/users/allocated?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      static fetchAllocatedUsers = async (startDate, endDate, authToken) => {
        try {
            const response = await axios.get(`${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/reports/users/allocated?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
          } catch (error) {
            throw new Error('Unable to fetch the allocated users data');
          }
      }
}
