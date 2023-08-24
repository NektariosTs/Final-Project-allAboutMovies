import React, { useEffect } from "react";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import { useState } from "react";
import Selector from "../Selector";
import { useNotification } from "../../hooks";
import { ImSpinner3 } from "react-icons/im";

const defaultActorInfo = {
  name: "",
  about: "",
  avatar: null,
  gender: "",
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

const validateActor = ({ avatar, name, about, gender }) => {
  if (!name.trim()) return { error: "Actor name is missing" };
  if (!about.trim()) return { error: "Actor section is missing" };
  if (!gender.trim()) return { error: "Actor gender is missing" };
  if (avatar && !avatar.type?.startsWith("image"))
    return { error: "invalid image file!" };

  return { error: null };
};

export default function ActorForm({
  title,
  btnTitle,
  busy,
  onSubmit,
  initialState,
}) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");

  const { updateNotification } = useNotification();

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedAvatarForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, files, name } = target;
    if (name === "avatar") {
      const file = files[0];
      updatePosterForUI(file);
      return setActorInfo({ ...actorInfo, avatar: file });
    }
    setActorInfo({ ...actorInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateActor(actorInfo);
    if (error) return updateNotification("error", error);

    //submit form
    const formData = new FormData();
    for (let key in actorInfo) {
      if (key) formData.append(key, actorInfo[key]);
    }
    onSubmit(formData);
  };

  useEffect(() => {
    if (initialState) {
      setActorInfo({ ...initialState, avatar: null });
      setSelectedAvatarForUI(initialState.avatar);
    }
  }, [initialState]);

  const { name, about, gender } = actorInfo;

  return (
    <form
      className="dark:bg-primary bg-white p-3 w-[35rem] rounded"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-white text-primary">
          {title}
        </h1>
        <button
          className="h-8 w-24 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded flex items-center justify-center"
          type="submit"
        >
          {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
        </button>
      </div>

      <div className="flex space-x-2">
        <PosterSelector
          selectedPoster={selectedAvatarForUI}
          className="w-36 h-36 aspect-square object-cover"
          name="avatar"
          onChange={handleChange}
          label="Select avatar"
          accept="image/jpg, image/jpeg, image/png"
        />
        <div className="flex-grow flex flex-col space-y-2">
          <input
            placeholder="Enter name"
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="name"
            value={name}
            onChange={handleChange}
          />
          <textarea
            name="about"
            value={about}
            onChange={handleChange}
            placeholder="About"
            className={commonInputClasses + " border-b-2 resize-none h-full"}
          ></textarea>
        </div>
      </div>
      <Selector
        options={genderOptions}
        label="gender"
        value={gender}
        onChange={handleChange}
        name="gender"
      />
    </form>
  );
}
