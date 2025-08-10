import React from "react";
import ReactDOM from "react-dom";

export default function ModalAvis({ children, onClose }) {
  return ReactDOM.createPortal(
    <>
      <div
        className="modal-backdrop-custom"
        onClick={onClose}
      />
      <div
        className="modal-custom"
      >
        {children}
      </div>
    </>,
    document.body
  );
} 