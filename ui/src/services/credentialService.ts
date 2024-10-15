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
        const { data } = await api.post(`/api/Website/create`, credential);
        return data;
    },

    getCredentials: async () => {
        const { data } = await api.get(`/api/Website/getWebsites/`);
        return data;
    },

    deleteCredential: async (websiteId: number) => {
        const { data } = await api.delete(`/api/Website/delete/${websiteId}`);
        return data;
    }
};