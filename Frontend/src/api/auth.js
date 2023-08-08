import client from "./client"

export const createUser = async (userInfo) => {
    try {
        const { data } = await client.post("/user-create", userInfo);//so i use only the end point ("/user-create") of the url to post the method because the other is the client that importing it inside in this file.
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;//if this is undifined will throw an error we use ?

        return { error: error.message || error };
    }

}

export const verifyUserEmail = async (userInfo) => {
    try {
        const { data } = await client.post("/verify-email", userInfo);//so i use only the end point ("/user-create") of the url to post the method because the other is the client that importing it inside in this file.
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;//if this is undifined will throw an error we use ?

        return { error: error.message || error };
    }

}

export const signInUser = async (userInfo) => {
    try {
        const { data } = await client.post("/sign-in", userInfo);//so i use only the end point ("/user-create") of the url to post the method because the other is the client that importing it inside in this file.
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;//if this is undifined will throw an error we use ?

        return { error: error.message || error };
    }

};

export const getIsAuth = async (token) => {
    try {
        const { data } = await client.get("/is-auth", {
            headers: {
                Authorization: "Bearer " + token,
                accept: "application/json",
            }
        });
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;//if this is undifined will throw an error we use ?

        return { error: error.message || error };
    }

}

export const forgetPassword = async (email) => {
    try {
        const { data } = await client.post("/forget-password", { email });
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;//if this is undifined will throw an error we use ?

        return { error: error.message || error };
    }

}
export const verifyPasswordResetToken = async (token, userId) => {
    try {
        const { data } = await client.post("/verify-pass-reset-token", { token, userId });
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;//if this is undifined will throw an error we use ?

        return { error: error.message || error };
    }

};

export const resetPassword = async (passwordInfo) => {
    try {
        const { data } = await client.post("/reset-password", passwordInfo);
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;

        return { error: error.message || error };
    }
};

export const resendEmailVerificationToken = async (userId) => {
    try {
        const { data } = await client.post("/resend-email-verification-token", {userId});
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;

        return { error: error.message || error };
    }
};




