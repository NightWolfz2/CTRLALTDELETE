//NEW PAGE
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
          // Handling unauthorized access by throwing an error
          // The calling component can catch this error and decide on redirection or other actions
          throw new Error('Unauthorized');
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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