import React from "react";
import { Dialog } from "primereact/dialog";
import EditCategoryForm from "../Forms/EditCategoryForm";
import AddCategoryForm from "../Forms/AddCategoryForm";

const CategoryModal = ({
  singleData,
  modalMode = "EDIT",
  visible,
  setVisible,
}) => {
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
        {modalMode === "CREATE" && (
          <AddCategoryForm closeModal={closeModal} singleData={singleData} />
        )}

        {modalMode === "EDIT" && <EditCategoryForm closeModal={closeModal} />}
      </Dialog>
    </div>
  );
};

export default CategoryModal;
