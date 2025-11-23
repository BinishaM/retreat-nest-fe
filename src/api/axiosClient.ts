// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const axiosClient = axios.create({
//   baseURL: API_BASE_URL,
// });

// // Automatically attach token to every request
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem("access_token");

//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosClient;


import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) return null;

  try {
    const response = await axios.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    console.log(response)
    const newToken = response.data.access_token;
    sessionStorage.setItem("access_token", newToken);

    return newToken;
  } catch (err) {
    console.error("Failed to refresh token");
    return null;
  }
}


// Request interceptor — Attach token
axiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — Auto refresh & retry
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
}

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If token expired (401) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue requests while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (!newToken) {
          sessionStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/signin"; // Force login
          return Promise.reject(error);
        }

        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

