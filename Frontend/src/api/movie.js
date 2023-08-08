import client from "./client";

export const uploadTrailer = async (formData) => {
    const token = localStorage.getItem("auth-token");
    try {
        const { data } = await client.post("/movie/upload-trailer", formData,//inside the formData we have files
            {
                headers: {
                    authorization: "Bearer " + token,
                    "content-type": "multipart/form-data"//so we send content type inside this (multi) we can send the files from formDAta
                }
            });
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;//if this is undifined will throw an error we use ?

        return { error: error.message || error };
    }
}