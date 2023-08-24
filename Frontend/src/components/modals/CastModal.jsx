import React from "react";
import ModalContainer from "./ModalContainer";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export default function CastModal({
  casts = [],
  visible,
  onClose,
  onRemoveClick,
}) {
  return (
    <ModalContainer ignoreContainer onClose={onClose} visible={visible}>
      <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2">
        {casts.map(({ profile, roleAs, leadActor }) => {
          const { name, avatar, id } = profile;

          return (
            <div key={id} className="flex">
              <img
                className="w-16 h-16 aspect-square rounded object-cover"
                src={avatar}
                alt={name}
              />
              <div className=" w-full flex flex-col justify-between">
                <div>
                  <p className=" w-full font-serif dark:text-white text-primary">
                    {name}
                  </p>
                </div>
                <p className="text-sm dark:text-dark-subtle text-light-subtle">
                  {roleAs}
                </p>
              </div>
              {leadActor && <AiOutlineCheck className="text-light-subtle dark:text-dark-subtle" />}
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
