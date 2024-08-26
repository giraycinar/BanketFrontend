import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
 
const url = import.meta.env.VITE_APP_BACKEND;

const AxiosInstance = () => {
  
  const instance = axios.create({
    baseURL: "http://localhost:8081",
  });
 
  instance.interceptors.request.use(
    (config) => {
      //const {isAuthenticated, logout} = useContext(AuthContext);
      const ia = JSON.parse(sessionStorage.getItem("user"));
      const token = ia.token;
      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        return Promise.reject(new Error('Not authenticated'));
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
 
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
     
      return Promise.reject(error);
    }
  );
 
  return instance;
};
 
const axiosInstance = AxiosInstance(
  
);
 
export { axiosInstance };