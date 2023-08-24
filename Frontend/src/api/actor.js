import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createActor = async (formData) => {
    const token = getToken();
    try {
        const { data } = await client.post("/actor/create", formData,//inside the formData we have files
            {
                headers: {
                    authorization: "Bearer " + token,
                    "content-type": "multipart/form-data"//so we send content type inside this (multi) we can send the files from formDAta
                },
            });
        return data;
    } catch (error) {
        return catchError();// optimazing the code to be more readable
    }
};

export const updateActor = async (id, formData) => {
    const token = getToken();
    try {
        const { data } = await client.post("/actor/update/" + id, formData,//inside the formData we have files
            {
                headers: {
                    authorization: "Bearer " + token,
                    "content-type": "multipart/form-data"//so we send content type inside this (multi) we can send the files from formDAta
                },
            });
        return data;
    } catch (error) {
        return catchError();// optimazing the code to be more readable
    }
};

export const deleteActor = async (id) => {
    const token = getToken();
    try {
        const { data } = await client.delete("/actor/" + id,//inside the formData we have files
            {
                headers: {
                    authorization: "Bearer " + token,
                },
            });
        return data;
    } catch (error) {
        return catchError();// optimazing the code to be more readable
    }
};

export const searchActor = async (query) => {
    const token = getToken();
    try {
        const { data } = await client.get(`/actor/search?name=${query}`, //inside the formData we have files
            {
                headers: {
                    authorization: "Bearer " + token,
                },
            });
        return data;
    } catch (error) {
        return catchError();// optimazing the code to be more readable
    }
};

export const getActors = async (pageNo, limit) => {
    const token = getToken();
    try {
        const { data } = await client(
            `/actor/actors?pageNo=${pageNo}&limit=${limit}`,
            {
                headers: {
                    authorization: "Bearer " + token,
                    "content-type": "multipart/form-data",
                },
            }
        );
        return data;
    } catch (error) {
        return catchError(error);
    }
};


