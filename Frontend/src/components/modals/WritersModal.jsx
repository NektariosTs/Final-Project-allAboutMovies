import React from "react";
import ModalContainer from "./ModalContainer";
import { AiOutlineClose } from "react-icons/ai";

export default function WritersModal({
  profiles = [],
  visible,
  onClose,
  onRemoveClick,
}) {
  return (
    <ModalContainer ignoreContainer onClose={onClose} visible={visible}>
      <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2">
        {profiles.map(({ id, name, avatar }) => {
          return (
            <div className="flex">
              <img
                className="w-16 h-16 aspect-square rounded object-cover"
                src={avatar}
                alt={name}
              />
              <p className=" w-full font-serif dark:text-white text-primary">
                {name}
              </p>
              <button
                onClick={() => onRemoveClick(id)}
                className="dark:text-white text-primary hover:opacity-80 transition p-2"
              >
                <AiOutlineClose />
              </button>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
}
