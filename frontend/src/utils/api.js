// API utility for backend communication
const API_BASE_URL = "http://localhost:3000/api";

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Get user from localStorage
const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Set token and user in localStorage
const setAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Clear auth data
const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("passwords");
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (email, password) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data;
  },

  login: async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data;
  },

  verify: async () => {
    const data = await apiRequest("/auth/verify");
    return data;
  },

  verifyPassword: async (password) => {
    const data = await apiRequest("/auth/verify-password", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    return data;
  },
};

// Password API
export const passwordAPI = {
  getAll: async () => {
    const data = await apiRequest("/passwords");
    return data;
  },

  create: async (site, username, password) => {
    const data = await apiRequest("/passwords", {
      method: "POST",
      body: JSON.stringify({ site, username, password }),
    });
    return data;
  },

  update: async (id, site, username, password) => {
    const data = await apiRequest(`/passwords/${id}`, {
      method: "PUT",
      body: JSON.stringify({ site, username, password }),
    });
    return data;
  },

  delete: async (id) => {
    const data = await apiRequest(`/passwords/${id}`, {
      method: "DELETE",
    });
    return data;
  },

  getCount: async () => {
    const data = await apiRequest("/passwords/count");
    return data;
  },
};

export { getToken, getUser, setAuth, clearAuth };
