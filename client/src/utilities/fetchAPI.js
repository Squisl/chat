const fetchAPI = async (url, method = "GET", body) => {
  const options = { method, headers: {}, credentials: "include" };
  // If we have a token set as 'Authorization' header
  const token = localStorage.getItem("token");
  if (token) {
    options.headers = {
      Authorization: token
    };
  }
  // If the HTTP request method is either 'POST' or 'PUT', we add a body with the json header
  if (method === "POST" || method === "PUT") {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json"
    };
    options.body = JSON.stringify(body);
  }
  // Send the request and wait for response
  const response = await fetch(url, options);
  // Convert response to json
  const data = await response.json();
  // If the response was successful, return the data
  if (response.ok) {
    return data;
  } else if (response.status > 300) {
    // Otherwise, throw the data
    throw data;
  }
};

export default fetchAPI;
