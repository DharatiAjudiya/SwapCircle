import React, { useEffect, useState } from "react";
import CustomDataTable from "../../src/components/Tables/CustomDataTable";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GetSwapApi } from "../../stores/Swap/SwapSlice";
const Swaps = () => {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.SwapStore);

  useEffect(() => {
    dispatch(GetSwapApi());
  }, [dispatch]);

  const [updatedData, setUpdatedData] = useState([]);
  useEffect(() => {
    let _ = data.map((swap) => {
      let items = swap?.items.map((i, index) => {
        let _item = {};
        _item[`username ${index + 1}`] = i?.user_id?.username;
        _item[`item ${index + 1}`] = i?.name;
        return _item;
      });

      return {
        _id: swap?._id,
        ...items[0],
        ...items[1],
        createdAt: swap?.createdAt,
        updatedAt: swap?.updatedAt,
      };
    });

    setUpdatedData(_);
  }, [data]);

  return (
    <>
      <Card style={{ padding: "1.5rem", width: "100%", height: "93%" }}>
        <h2 className="h3 fw-bold" style={{ color: "rgb(var(--color-black))" }}>
          Swaps
        </h2>
        <Row style={{ width: "100%" }}>
          <Col xs={12} className="mb-4 pe-0">
            <CustomDataTable data={updatedData} excludingColumns={["__v"]} />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Swaps;
