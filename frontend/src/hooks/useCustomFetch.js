export const useCustomFetch = () => {

    const customFetch = async (url, method = 'GET', data = null) => {
      const headers = new Headers({
        'Content-Type': 'application/json',
      });
  
      // Assuming the user's token is stored in localStorage
      const userToken = JSON.parse(localStorage.getItem('user'))?.token || null;
      if (userToken) {
        headers.append('Authorization', `Bearer ${userToken}`);
      }
  
      const config = {
        method,
        headers,
        body: method !== 'GET' && data ? JSON.stringify(data) : null,
      };
  
      // Adjusted to handle DELETE requests that typically do not have a body
      if (method === 'GET' || method === 'DELETE') delete config.body;
  
      try {
        const response = await fetch(url, config);
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        if (!response.ok) {
          const errorResponse = await response.json(); // Attempt to parse the error response
          console.log("Raw error response:", errorResponse);
          // Check for an 'errors' array and join the messages into a single string
          const errorMessage = Array.isArray(errorResponse.errors) ? errorResponse.errors.join(' ') : `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        }
        // Checking if the response has content and is of type 'application/json' before parsing
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        // Return an empty object for non-JSON responses or when there's no content
        return {};
      } catch (error) {
        console.error("Fetch error:", error);
        // Rethrow the error so it can be caught and handled by the component using this hook
        throw error;
      }
    };
  
    return customFetch;
  };  