import React, { useEffect, useRef, useState } from "react";
import CustomDataTable from "../../src/components/Tables/CustomDataTable";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCategoryState,
  GetCategoryApi,
  EditCategoryApi,
  DeleteCategoryApi,
  DisableCategoryApi,
} from "../../stores/Category/CategorySlice";
import CategoryModal from "../../src/components/Modals/CategoryModal";
import { useToastContext } from "../../Hooks/ToastContextHook";
import { useSweetAlert } from "../../Hooks/AlertHooks";

const Category = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [singleData, setSingleData] = useState({});
  const openModal = (data, mode = "EDIT") => {
    setModalMode(mode);
    setSingleData(data);
    setVisible(true);
  };
  const { status, message, data } = useSelector((state) => state.CategoryStore);
  const { MySwal } = useToastContext();
  const { toastType, showToast } = useToastContext();
  const { confirmDialog, showCancelledMessage } = useSweetAlert();

  const enableAddBtn = useRef(true);
  const enableDisBtn = useRef(true);
  const [modalMode, setModalMode] = useState("EDIT");

  useEffect(() => {
    if (status == true) {
      toastType.current = {
        severity: "success",
        summary: "Success",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearCategoryState());
    } else if (status == false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearCategoryState());
    }
  }, [status]);

  useEffect(() => {
    dispatch(GetCategoryApi());
  }, [dispatch]);

  const handleCategoryDelete = async (id) => {
    const result = await confirmDialog({});
    if (result.isConfirmed) {
      await dispatch(DeleteCategoryApi({ id }));
      await dispatch(GetCategoryApi());
    } else if (result.dismiss === MySwal.DismissReason.cancel) {
      showCancelledMessage();
    }
  };

  const handleCategoryDisable = async (id, status) => {
    const result = await confirmDialog({
      message: "Are you sure you want to disable this category?",
    });
    if (result.isConfirmed) {
      await dispatch(DisableCategoryApi({ id, values: { status: !status } }));
      await dispatch(GetCategoryApi());
    } else if (result.dismiss === MySwal.DismissReason.cancel) {
      showCancelledMessage();
    }
  };

  return (
    <>
      <Card
        className="p-2 p-md-4"
        style={{ padding: "1.5rem", width: "100%", height: "93%" }}
      >
        <h2 className="h3 fw-bold" style={{ color: "rgb(var(--color-black))" }}>
          Category
        </h2>
        <Row style={{ width: "100%" }}>
          <Col xs={12} className="mb-4 pe-0">
            <CustomDataTable
              data={data}
              excludingColumns={["__v"]}
              enableAddBtn={enableAddBtn}
              openModal={openModal}
              handleDelete={handleCategoryDelete}
              enableDisBtn={enableDisBtn}
              handleDisable={handleCategoryDisable}
            />
          </Col>
        </Row>
      </Card>
      <CategoryModal
        modalMode={modalMode}
        visible={visible}
        setVisible={setVisible}
        singleData={singleData}
      />
    </>
  );
};

export default Category;
