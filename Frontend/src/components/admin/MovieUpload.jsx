import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files"; //is package for drag and drop from npm
import { FiUploadCloud } from "react-icons/fi";
import { useNotification } from "../../hooks";
import { uploadTrailer } from "../../api/movie";

export default function MovieUpload() {
  const [videoSelected, setVideoSelected] = useState(true);
  const { updateNotification } = useNotification(); //notification error from notification context
  const handleTypeError = (error) => {
    updateNotification("error", error);
  };

  const handleChange = async (file) => {
    const formData = new FormData(); //creating formData FormData()A=is abuilding api inside the javascript
    formData.append("video", file); //same name with the backend

    const res = await uploadTrailer(formData);
    console.log(res);
  };

  return (
    <div className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto">
        <TrailerSelector
          visible={!videoSelected}
          onTypeError={handleTypeError}
          handleChange={handleChange}
        />
      </div>
    </div>
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
