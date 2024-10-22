import React from "react";
import { Dialog } from "primereact/dialog";
import EditProfileForm from "../Forms/EditProfileForm";

const UserModal = ({ singleData, visible, setVisible }) => {
  const closeModal = () => {
    setVisible(false);
  };

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <EditProfileForm singleData={singleData} closeModal={closeModal} />
      </Dialog>
    </div>
  );
};

export default UserModal;
