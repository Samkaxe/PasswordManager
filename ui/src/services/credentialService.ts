import api, {getToken} from "./api.service";
import {jwtDecode} from 'jwt-decode';

const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token);
        console.log(decoded)
        return decoded.nameid;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export const credentialService = {
    createCredential: async (credential: { websiteUrl: string, username: string, password: string }) => {
        const userId = getUserIdFromToken();
        if (!userId) throw new Error('User ID not found in token');
        const { data } = await api.post(`/api/Website/create/${userId}`, credential);
        return data;
    },

    getCredentials: async () => {
        const userId = getUserIdFromToken();
        if (!userId) throw new Error('User ID not found in token');
        const { data } = await api.get(`/api/Website/getWebsites/${userId}`);
        return data;
    },

    deleteCredential: async (websiteId: number) => {
        const userId = getUserIdFromToken();
        if (!userId) throw new Error('User ID not found in token');
        const { data } = await api.delete(`/api/Website/delete/${userId}/${websiteId}`);
        return data;
    }
};