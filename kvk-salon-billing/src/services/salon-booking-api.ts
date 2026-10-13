import axios from "axios";
import { getEnv } from "@/env";

const { API_URL } = getEnv();
const BOOKINGS_API_URL = `${API_URL}saloon/bookings`;
const BOOKINGS_LIST_API_URL = `${API_URL}saloon/saloons/bookings`;

export const getSalonBusinessHours = async () => {
    const response = await axios.get(`${API_URL}saloon/business-hours`);
    return response.data;
};

const getToken = () => {
    const cashier = localStorage.getItem("cashier")
        ? JSON.parse(localStorage.getItem("cashier") as string)
        : null;

    return cashier ? cashier.token : null;
};

export const checkDayAvailability = async (
    date: string,
    serviceIds: string[],
) => {
    try {
        const params = new URLSearchParams();
        params.append("Date", date);
        serviceIds.forEach((id) => params.append("SaloonServiceIds", id));

        const response = await axios.get(
            `${BOOKINGS_API_URL}/day-availability?${params.toString()}`,
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

export const getSaloonBookingsList = async (params: {
    fromDate?: string;
    toDate?: string;
    status?: number;
    searchTerm?: string;
    pageSize?: number;
}) => {
    try {
        const query = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    acc[key] = String(value);
                }
                return acc;
            }, {} as Record<string, string>),
        ).toString();

        const response = await axios.get(`${BOOKINGS_LIST_API_URL}?${query}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createSalonBooking = async (payload: any, isWalkIn = false) => {
    try {
        const url = isWalkIn ? `${BOOKINGS_API_URL}/walk-in` : BOOKINGS_API_URL;
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
