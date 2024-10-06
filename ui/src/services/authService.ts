import api from "./api.service";
import {LoginDto, SignUpDto} from "../dtos/SignUpDto";

const authService = {

    login: async (credentials: LoginDto) => {
        try {
            const response = await api.post('/api/User/login', credentials);
            // Store the token in local storage (replace with your preferred storage mechanism)
            localStorage.setItem('token', response.data.token);
            console.log('Login successful:', response.data);
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw the error to be handled in the component
        }
    },
    register: async (credentials: SignUpDto) => {
        try {
            const response = await api.post('/api/User/register', credentials);
            console.log('Registration successful:', response.data);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },
};

export default authService;