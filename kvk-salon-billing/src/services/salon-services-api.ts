import axios from "axios";
import { getEnv } from "@/env";

const { API_URL } = getEnv();
const SALOONS_API_URL = `${API_URL}saloon/saloons/`;

const getToken = () => {
    const cashier = localStorage.getItem("cashier")
        ? JSON.parse(localStorage.getItem("cashier") as string)
        : null;

    return cashier ? cashier.token : null;
};

export const getSaloonBranches = async () => {
    try {
        const response = await axios.get(SALOONS_API_URL, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getServiceItems = async (saloonId: string) => {
    try {
        const response = await axios.get(
            `${SALOONS_API_URL}${saloonId}/service-items`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createServiceItem = async (
    saloonId: string,
    serviceData: FormData,
) => {
    try {
        const response = await axios.post(
            `${SALOONS_API_URL}${saloonId}/service-items`,
            serviceData,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateServiceItem = async (
    saloonId: string,
    id: string,
    serviceData: FormData,
) => {
    try {
        const response = await axios.put(
            `${SALOONS_API_URL}${saloonId}/service-items/${id}`,
            serviceData,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteServiceItem = async (saloonId: string, id: string) => {
    try {
        const response = await axios.delete(
            `${SALOONS_API_URL}${saloonId}/service-items/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
