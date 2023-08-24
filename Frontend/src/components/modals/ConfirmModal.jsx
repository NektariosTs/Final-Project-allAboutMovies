import React from "react";
import ModalContainer from "./ModalContainer";
import { ImSpinner3 } from "react-icons/im";

export default function ConfirmModal({
  visible,
  busy,
  onConfirm,
  onCancel,
  title,
  subTitle,
}) {
  const commonClass = "px-3 py-1 text-white";
  return (
    <ModalContainer visible={visible} ignoreContainer>
      <div className="dark:bg-primary bg-white rounded p-3">
        <h1 className="text-red-400 font-serif text-lg">{title}</h1>
        <p className="text-secondary dark:text-white text-sm">{subTitle}</p>

        <div className="flex items-center space-x-3 mt-3">
          {busy ? (
            <p className="flex items-center space-x-2 text-primary dark:text-white ">
              <ImSpinner3 className="animate-spin" />
              <span>please wait</span>
            </p>
          ) : (
            <>
              <button
                onClick={onConfirm}
                type="button"
                className={commonClass + " bg-red-500"}
              >
                confirm
              </button>
              <button
                onClick={onCancel}
                type="button"
                className={commonClass + " bg-blue-500"}
              >
                cancel
              </button>
            </>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
