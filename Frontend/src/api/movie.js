import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/upload-trailer", formData,//inside the formData we have files
      {
        headers: {
          authorization: "Bearer " + token,
          "content-type": "multipart/form-data"//so we send content type inside this (multi) we can send the files from formDAta
        },
        onUploadProgress: ({ loaded, total }) => {
          if (onUploadProgress)
            onUploadProgress(Math.floor((loaded / total) * 100));//this method for percentage
        }
      });
    return data;
  } catch (error) {
    return catchError(error);
  }
}

export const uploadMovie = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/create", formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovieForUpdate = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.get("/movie/for-update/" + id, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const updateMovie = async (id, formData) => {
  const token = getToken();
  try {
    const { data } = await client.patch("/movie/update/" + id, formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//get movies with pagination
export const getMovies = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client.get(`/movie/movies?pageNo=${pageNo}&limit=${limit}`, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteMovie = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/movie/${id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchMovieForAdmin = async (title) => {
  const token = getToken();
  try {
    const { data } = await client.get(`/movie/search?title=${title}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
//fetching movies
export const getTopRatedMovies = async (type) => {
  try {
    let endpoint = "/movie/top-rated";
    if (type) endpoint = endpoint + "?type=" + type;

    const { data } = await client(endpoint);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getLatestUploads = async (type) => {
  try {
    const { data } = await client.get("/movie/latest-uploads");
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getSingleMovie = async (id) => {
  try {
    const { data } = await client.get("/movie/single/" + id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getRelatedMovie = async (id) => {
  try {
    const { data } = await client.get("/movie/related/" + id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchPublicMovies = async (title) => {
  try {
    const { data } = await client.get("/movie/search-public?title=" + title);
    return data;
  } catch (error) {
    return catchError(error);
  }
};