const API = "https://dummyjson.com";

// This function fetches the list of users from the dummyjson API
export const fetchUsers = async (url) => {
    const response = await fetch(`${API}${url}`);
  
    // Check if the response was successful
    if (!response.ok) {
      // If not, throw an error to be caught by the caller
      console.error('Failed to fetch users');
    }
  
    // Convert the response to JSON and return it
    return response.json();
  };