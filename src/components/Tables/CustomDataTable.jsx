import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CiSearch } from "react-icons/ci";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button, Form, Image, InputGroup } from "react-bootstrap";
import { RiFilterOffLine } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { GrStatusDisabled, GrStatusGood } from "react-icons/gr";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./CustomDataTable.css"; // Custom CSS
import { useLocation } from "react-router-dom";
import moment from "moment";
import { BsPencilSquare } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { Tooltip } from "@mui/material";

const CustomDataTable = ({
  enableAddBtn = false,
  enableDisBtn = false,
  data,
  excludingColumns = ["__v"],
  openModal = () => {},
  handleDelete = () => {},
  handleDisable = () => {},
}) => {
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const location = useLocation();
  const columns = Object.keys(data[0] || {});

  const dynamicColumns = columns.map((col) => {
    if (!excludingColumns.includes(col)) {
      if (["createdAt", "updatedAt"].includes(col)) {
        return (
          <Column
            key={col}
            field={col}
            header={col.charAt(0).toUpperCase() + col.slice(1)}
            sortable
            sortField={col}
            filter
            filterPlaceholder={`Search by ${
              col.charAt(0).toUpperCase() + col.slice(1)
            }`}
            style={{ minWidth: "fit-content" }}
            body={(rowData) => {
              // Convert the date fields to local date strings
              return moment(new Date(rowData[col])).format(
                "DD/MM/YYYY hh:mm A"
              );
            }}
          />
        );
      } else {
        return (
          <Column
            key={col}
            field={col}
            header={col.charAt(0).toUpperCase() + col.slice(1)}
            sortable
            sortField={col}
            filter
            filterPlaceholder={`Search by ${
              col.charAt(0).toUpperCase() + col.slice(1)
            }`}
            style={{ minWidth: "fit-content" }}
          />
        );
      }
    }
  });

  const initFilters = () => {
    const initialFilters = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

    columns.forEach((col) => {
      initialFilters[col] = {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      };
    });

    setFilters(initialFilters);
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  useEffect(() => {
    initFilters();
  }, [data]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = ({ createBtn = false }) => {
    return (
      <>
        <div className="d-flex flex-column flex-md-row justify-content-between">
          <div className="d-flex justify-content-between w-100 me-md-3">
            <Button
              type="button"
              label="Clear"
              outlined={true}
              className="clear-filter-btn"
              onClick={clearFilter}
            >
              <RiFilterOffLine
                style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
              />
              Clear
            </Button>
            {createBtn && (
              <Button
                type="button"
                label="Add"
                className="add-btn"
                onClick={() => openModal(data, "CREATE")}
              >
                <IoAddCircleOutline
                  style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                />
                Add
              </Button>
            )}
          </div>
          <div className="global-search">
            <Form.Control
              placeholder="Keyword search"
              type="text"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
            />
            <CiSearch
              style={{
                fontSize: "1.5rem",
                top: "7px",
                right: "7px",
                position: "absolute",
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const header = renderHeader({ createBtn: enableAddBtn.current });

  const actionBodyTemplate = (data) => {
    return (
      <div className="d-flex justify-content-around gap-3">
        <Tooltip arrow title="Edit" placement="top">
          <Button
            variant="light"
            className="p-2 rounded-5"
            type="button"
            onClick={() => openModal(data, "EDIT")}
          >
            <BsPencilSquare
              style={{ color: "black", height: "auto", fontSize: "20px" }}
            />
          </Button>
        </Tooltip>

        <Tooltip arrow title="Delete" placement="top">
          <Button
            variant="light"
            className="p-2 rounded-5"
            type="button"
            onClick={() => handleDelete(data?._id)}
          >
            <MdDeleteOutline
              style={{ color: "red", height: "auto", fontSize: "24px" }}
            />
          </Button>
        </Tooltip>

        {enableDisBtn && enableDisBtn.current === true && (
          <>
            {data?.status && data?.status === true ? (
              <Tooltip arrow title="Enable Category" placement="top">
                <Button
                  variant="light"
                  className="p-2 rounded-5"
                  type="button"
                  onClick={() => handleDisable(data?._id, data?.status)}
                >
                  <GrStatusGood
                    style={{ color: "green", height: "auto", fontSize: "24px" }}
                  />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip arrow title="Disable Category" placement="top">
                <Button
                  variant="light"
                  className="p-2 rounded-5"
                  type="button"
                  onClick={() => handleDisable(data?._id, data?.status)}
                >
                  <GrStatusDisabled
                    type="button"
                    style={{ color: "#ffbb00", height: "auto", fontSize: "24px" }}
                    onClick={() => handleDisable(data?._id, data?.status)}
                  />
                </Button>
              </Tooltip>
            )}
          </>
        )}
      </div>
    );
  };

  const imageBodyTemplate = (data) => {
    return (
      <Image
        thumbnail
        roundedCircle
        src={data?.profile}
        className="w-6rem shadow-2 border-round"
        alt={data?.username}
      />
    );
  };

  const dynamicImgColumns = columns.map((col) => {
    if (["profile"].includes(col)) {
      // if (["profile", "images"].includes(col)) {
      return (
        <Column
          key={col}
          field={col}
          header={col.charAt(0).toUpperCase() + col.slice(1)}
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={imageBodyTemplate}
        />
      );
    }
  });

  // const [expandedRows, setExpandedRows] = useState(null);
  // const expandAll = () => {
  //   let _expandedRows = {};

  //   products.forEach((p) => (_expandedRows[`${p.id}`] = true));

  //   setExpandedRows(_expandedRows);
  // };

  // const collapseAll = () => {
  //   setExpandedRows(null);
  // };

  // const rowExpansionTemplate = (data) => {
  //   return (
  //     <div className="p-3">
  //       <h5>Orders for {data.name}</h5>
  //       <DataTable value={data.orders}>
  //         <Column field="id" header="Id" sortable></Column>
  //         <Column field="customer" header="Customer" sortable></Column>
  //         <Column field="date" header="Date" sortable></Column>
  //         <Column
  //           field="amount"
  //           header="Amount"
  //           body={amountBodyTemplate}
  //           sortable
  //         ></Column>
  //         <Column
  //           field="status"
  //           header="Status"
  //           body={statusOrderBodyTemplate}
  //           sortable
  //         ></Column>
  //         <Column
  //           headerStyle={{ width: "4rem" }}
  //           body={searchBodyTemplate}
  //         ></Column>
  //       </DataTable>
  //     </div>
  //   );
  // };

  // const allowExpansion = (rowData) => {
  //   return rowData.orders.length > 0;
  // };

  return (
    <DataTable
      // expandedRows={expandedRows}
      // onRowToggle={(e) => setExpandedRows(e.data)}
      // rowExpansionTemplate={rowExpansionTemplate}
      value={data}
      paginator
      header={header}
      rows={10}
      showGridlines
      removableSort
      rowsPerPageOptions={[5, 10, 20, 50]}
      scrollable
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      dataKey="id"
      filters={filters}
      filterDisplay="menu"
      globalFilterFields={columns}
      onFilter={(e) => setFilters(e.filters)}
      scrollHeight="47vh"
      emptyMessage="No data found."
    >
      {/* <Column expander={allowExpansion} style={{ width: "5rem" }} /> */}
      {dynamicColumns}
      {dynamicImgColumns}
      {/* {!location.pathname.endsWith("item") && (
        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        />
      )} */}
      {!location.pathname.endsWith("swap") && (
        <Column
          field="Action"
          header="Action"
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        />
      )}
    </DataTable>
  );
};

export default CustomDataTable;
