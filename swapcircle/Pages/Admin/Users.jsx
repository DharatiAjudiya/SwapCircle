import React, { useEffect, useState } from "react";
import CustomDataTable from "../../src/components/Tables/CustomDataTable";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserState,
  DeleteUserApi,
  GetUserApi,
} from "../../stores/User/UserSlice";
import UserModal from "../../src/components/Modals/UserModal";
import { useToastContext } from "../../Hooks/ToastContextHook";
import { useSweetAlert } from "../../Hooks/AlertHooks";
import { NODE_APP_URL } from "../../config/app_config";

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [singleData, setSingleData] = useState({});
  const openModal = (data) => {
    setSingleData(data);
    setVisible(true);
  };
  const { status, message, data } = useSelector((state) => state.UserStore);
  const { MySwal } = useToastContext();
  const { toastType, showToast } = useToastContext();
  const { confirmDialog, showCancelledMessage } = useSweetAlert();

  useEffect(() => {
    if (status == true) {
      toastType.current = {
        severity: "success",
        summary: "Success",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearUserState());
    } else if (status == false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearUserState());
    }
  }, [status]);

  useEffect(() => {
    dispatch(GetUserApi());
  }, [dispatch]);

  const handleUserDelete = async (id) => {
    const result = await confirmDialog({});
    if (result.isConfirmed) {
      await dispatch(DeleteUserApi({ id }));
      await dispatch(GetUserApi());
    } else if (result.dismiss === MySwal.DismissReason.cancel) {
      showCancelledMessage();
    }
  };

  const [updatedData, setUpdatedData] = useState([]);

  useEffect(() => {
    let _ = data.map((item, index) => {
      let _item = { ...item };
      if (!_item?.profile) {
        return _item;
      }

      if (
        !(
          _item?.profile.startsWith("https://") ||
          _item?.profile.startsWith("http://")
        )
      ) {
        _item.profile = `${NODE_APP_URL}/uploads/users/${_item?.profile}`;
      }
      return _item;
    });

    setUpdatedData(_);
  }, [data]);

  return (
    <>
      <Card style={{ padding: "1.5rem", width: "100%", height: "93%" }}>
        <h2 className="h3 fw-bold" style={{ color: "rgb(var(--color-black))" }}>
          Users
        </h2>
        <Row style={{ width: "100%" }}>
          <Col xs={12} className="mb-4 pe-0">
            <CustomDataTable
              data={updatedData}
              excludingColumns={[
                "role_id",
                "password",
                "__v",
                "profile",
                "location",
              ]}
              openModal={openModal}
              handleDelete={handleUserDelete}
            />
          </Col>
        </Row>
      </Card>
      <UserModal
        visible={visible}
        setVisible={setVisible}
        singleData={singleData}
      />
    </>
  );
};

export default Users;
