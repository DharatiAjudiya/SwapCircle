import React, { useEffect, useState } from "react";
import CustomDataTable from "../../src/components/Tables/CustomDataTable";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteItemApi,
  GetItemApi,
  clearItemState,
} from "../../stores/Item/ItemSlice";
import { useToastContext } from "../../Hooks/ToastContextHook";
import { useSweetAlert } from "../../Hooks/AlertHooks";
import ItemModal from "../../src/components/Modals/ItemModal";

const Items = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [singleData, setSingleData] = useState({});

  const openModal = (data) => {
    setSingleData(data);
    setVisible(true);
  };

  const { status, message, data } = useSelector((state) => state.ItemStore);
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
      dispatch(clearItemState());
    } else if (status == false) {
      toastType.current = {
        severity: "error",
        summary: "Error",
        detail: message,
      };
      showToast("top-right");
      dispatch(clearItemState());
    }
  }, [status]);

  useEffect(() => {
    dispatch(GetItemApi());
  }, [dispatch]);

  const handleItemDelete = async (id) => {
    const result = await confirmDialog({});
    if (result.isConfirmed) {
      await dispatch(DeleteItemApi({ id }));
      await dispatch(GetItemApi());
    } else if (result.dismiss === MySwal.DismissReason.cancel) {
      showCancelledMessage();
    }
  };

  const [updatedData, setUpdatedData] = useState([]);
  useEffect(() => {
    let _ = data.map((item) => {
      let _item = { ...item };
      let { _id, name } = _item;
      let username = _item?.user_id?.username;
      let category = _item?.category_id?.category;
      let user_id = _item?.user_id?._id;
      let category_id = _item?.category_id?._id;

      delete _item._id;
      delete _item.name;
      delete _item.user_id;
      delete _item.category_id;

      _item = {
        _id,
        name,
        user: username,
        category,
        ..._item,
        user_id,
        category_id,
      };

      return _item;
    });

    setUpdatedData(_);
  }, [data]);

  return (
    <>
      <Card style={{ padding: "1.5rem", width: "100%", height: "93%" }}>
        <h2 className="h3 fw-bold" style={{ color: "rgb(var(--color-black))" }}>
          Items
        </h2>
        <Row style={{ width: "100%" }}>
          <Col xs={12} className="mb-4 pe-0">
            <CustomDataTable
              data={updatedData}
              excludingColumns={[
                "tags",
                "price",
                "__v",
                "location",
                "images",
                "user_id",
                "category_id",
              ]}
              openModal={openModal}
              handleDelete={handleItemDelete}
            />
          </Col>
        </Row>
      </Card>
      <ItemModal
        visible={visible}
        setVisible={setVisible}
        singleData={singleData}
      />
    </>
  );
};

export default Items;
