// api/projectAllocationService.js

import axios from 'axios';

const PROJECT_ALLOCATION_SERVICE_BASE_URL = 'http://localhost:9091'; 

export class ProjectAllocationService {
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
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };

    static handleAllocateApplicant = async (applicationId, authToken) => {
      try {
        const response = await axios.patch(
          `${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/applications/${applicationId}/status?newStatus=ALLOCATED`,
          null,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (response.status === 200) {
          return true; // Indicates success
        } else {
          throw new Error(
            response.data.message || 'Failed to update application status'
          );
        }
      } catch (error) {
        throw error; // Rethrow the error to handle it in the component
      }
    };

    static handleRejectApplicant = async (applicationId, authToken) => {
      try {
        const response = await axios.patch(
          `${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/applications/${applicationId}/status?newStatus=REJECTED`,
          null,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (response.status === 200) {
          return true; // Indicates success
        } else {
          throw new Error(
            response.data.message || 'Failed to update application status'
          );
        }
      } catch (error) {
        throw error; // Rethrow the error to handle it in the component
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
          console.log('error', error);
          if (error.response && error.response.data) {
            throw new Error(error.response.data);
          } else {
            throw new Error('Unable to apply for the opening');
          }
        }
    }

    static updateOpening = async (openingId, payload, authToken) => {
      try {
        const response = await axios.put(
          `${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/openings/${openingId}`,
          payload,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Unable to update the opening';
        throw new Error(errorMessage);
      }
    }

    static updateOpeningStatus = async (openingId, newOpeningStatus, authToken) => {
      try {
          const response = await axios.patch(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/openings/' + openingId + '/status?newStatus=' + newOpeningStatus, { headers: {"Authorization" : `Bearer ${authToken}`} });
          return response.status;
        } catch (error) {
          throw new Error('Unable to update the opening status');
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
          return response.data; // Return the data instead of the entire response object
      } catch (error) {
          if (error.response) {
              const errorData = error.response.data;
              if (errorData) {
                  throw new Error(errorData);
              }
          }
          throw new Error('Unable to create the opening at the moment. Please try again later');
      }
  }

    static createProject = async (payload, authToken) => {
      try {
          const response = await axios.post(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/projects', payload, { headers: {"Authorization" : `Bearer ${authToken}`} });
          return response;
      } catch (error) {
          throw new Error('Unable to create the project');
      }
    }

    static getProjects = async (pageSize, pageNumber, authToken) => {
        try {
            const response = await axios.get(`${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/projects?pageSize=${pageSize}&pageNumber=${pageNumber}`, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
        } catch (error) {
            throw new Error('Unable to fetch the projects');
        }
    }

    static getAllProjects = async (authToken) => {
      try {
          const response = await axios.get(PROJECT_ALLOCATION_SERVICE_BASE_URL + '/api/v1/projects/all', { headers: {"Authorization" : `Bearer ${authToken}`} });
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
          const response = await axios.post(
            `${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/applications/${applicationId}/interviews`,
            interviewData,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
      
          return response.data;
        } catch (error) {
          if (error.response) {
            // Response was received, but it's an error response
            if (error.response.status === 403) {
              throw new Error("You don't have permission to schedule an interview.");
            } else if (error.response.status === 404) {
              throw new Error("Application not found with the specified ID.");
            } else {
              throw new Error('An error occurred while scheduling the interview.');
            }
          } else if (error.request) {
            // Request was made, but no response received
            throw new Error('No response received from the server.');
          } else {
            // Something happened while setting up the request
            throw new Error('An error occurred while sending the request.');
          }
        }
      };
      

      static updateInterviewStatus = async (interviewId, newInterviewStatus, authToken) => {
        try {
          const response = await axios.patch(
            `${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/interviews/${interviewId}/status?newStatus=${newInterviewStatus}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
      
          if (response.status === 200) {
            // Interview status updated successfully
            return null; // No error, so return null
          } else {
            return 'Failed to update interview status';
          }
        } catch (error) {
          console.error('Error updating interview status:', error);
          if (error.response && error.response.data && error.response.data.message) {
            console.error('API error:', error.response.data.message);
            return error.response.data.message; // Return the API error message
          } else {
            return 'Error updating interview status';
          }
        }
      };

      static fetchFreePoolUsers = async (authToken, pageSize, pageNumber) => {
        try {
            const response = await axios.get(`${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/reports/users/free?pageSize=${pageSize}&pageNumber=${pageNumber}`, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
          } catch (error) {
            throw new Error('Unable to fetch the free pool users data');
          }
      }

      // `http://localhost:9091/api/v1/reports/users/allocated?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      static fetchAllocatedUsers = async (startDate, endDate, authToken, pageSize, pageNumber) => {
        try {
            const response = await axios.get(`${PROJECT_ALLOCATION_SERVICE_BASE_URL}/api/v1/reports/users/allocated?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&pageSize=${pageSize}&pageNumber=${pageNumber}`, { headers: {"Authorization" : `Bearer ${authToken}`} });
            return response.data;
          } catch (error) {
            throw new Error('Unable to fetch the allocated users data');
          }
      }
}
