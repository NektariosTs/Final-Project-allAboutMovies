import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files"; //is package for drag and drop from npm
import { FiUploadCloud } from "react-icons/fi";
import { useNotification } from "../../hooks";
import { uploadMovie, uploadTrailer } from "../../api/movie";
import MovieForm from "./MovieForm";
import ModalContainer from "../modals/ModalContainer";

export default function MovieUpload({ visible, onClose }) {
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); //uploading progress bar
  const [videoInfo, setVideoInfo] = useState({});

  const { updateNotification } = useNotification(); //notification error from notification context
  const handleTypeError = (error) => {
    updateNotification("error", error);
  };
  // if the uploder part is finished we are creating this object {url, public_id}
  const handleUploadTrailer = async (data) => {
    const { error, url, public_id } = await uploadTrailer(
      data,
      setUploadProgress
    );
    if (error) return updateNotification("error", error);
    setVideoUploaded(true);
    setVideoInfo({ url, public_id }); //coming for backend
  };
  // console.log(videoInfo);
  const handleChange = (file) => {
    const formData = new FormData(); //creating formData FormData()A=is abuilding api inside the javascript
    formData.append("video", file); //same name with the backend

    setVideoSelected(true);
    handleUploadTrailer(formData);
  };

  const getUploadProgressValue = () => {
    if (!videoUploaded && uploadProgress >= 100) {
      return "processing";
    }
    return `Upload progress ${uploadProgress}%`;
  };
  const handleSubmit = async (data) => {
    if (!videoInfo.url && !videoInfo.public_id)
      return updateNotification("error", "trailer is missing");
    data.append("trailer", JSON.stringify(videoInfo)); //we are attaching them inside with this string form
    const res = await uploadMovie(data);
    console.log(res);

    onClose()
  };

  //the uploader interface
  return (
    <ModalContainer visible={visible}>
      <UploadProgress
        visible={!videoUploaded && videoSelected}
        message={getUploadProgressValue()}
        width={uploadProgress}
      />
      {!videoSelected ? (//if this video is not selected we render the trailerSelector
        <TrailerSelector
          visible={!videoSelected}
          onTypeError={handleTypeError}
          handleChange={handleChange}
        />
      ) : (//otherwise we render the movieform its self
        <MovieForm btnTitle="upload" onSubmit={handleSubmit} />
      )}
    </ModalContainer>
  );
}

const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
  if (!visible) return null;

  return (
    <div className="h-full flex items-center justify-center">
      <FileUploader
        handleChange={handleChange}
        onTypeError={onTypeError}
        types={["mp4", "avi"]}
      >
        <div
          className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full
              flex flex-col items-center justify-center dark:text-dark-subtle text-secondary"
        >
          <FiUploadCloud size={90} />
          <p>Drop your file here!</p>
        </div>
      </FileUploader>
    </div>
  );
};

const UploadProgress = ({ width, message, visible }) => {
  if (!visible) return null;
  return (
    <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
      <div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden">
        <div
          style={{ width: width + "%" }}
          className="h-full absolute left-0 dark:bg-white bg-danger"
        />
      </div>
      <p className="font-serif dark:text-dark-subtle text-light-subtle animate-pulse">
        {message}
      </p>
    </div>
  );
};
