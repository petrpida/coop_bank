import React, { useState, useMemo, useContext, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal, Button } from "react-bootstrap";
import styles from "../css/AdminApp.module.css";
import Icon from "@mdi/react";
import { mdiLoading, mdiSwapVerticalBold } from "@mdi/js";
import AdminContext from "../store/AdminDataProvider";
import { useNavigate } from "react-router-dom";

export default function AdminApp() {
  const { userData } = useContext(AdminContext);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({});
  const [isApproved, setIsApproved] = useState({});
  const [isCanceled, setIsCanceled] = useState({});
  const [isDeleted, setIsDeleted] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [dataUpdate, setDataUpdate] = useState(false);

  const role = userData.data.roles[0];

  useEffect(() => {
    fetch(`http://localhost:3000/request/list`, {
      method: "GET",
      headers: { Authorization: `Bearer ${userData.data.token}` },
    }).then(async (response) => {
      const data = await response.json();
      if (response.status >= 400) {
        setAdminData({ state: "error", error: data });
      } else {
        setAdminData({ state: "success", data: data });
      }
    });
  }, [dataUpdate]);

  const newData = { ...adminData };
  if (newData.state === "success") {
    newData.data.map((x, index) => {
      if (x.companyName) {
        newData.data[index].surname = x.companyName;
      }
      return newData;
    });
  }

  // console.log(newData)

  //  Sorting buttons in table header
  const sortNames = (
    <span>
      Řadit dle jména
      <Button className={styles.sort_btn + " outline-primary"}>
        <Icon size={1} path={mdiSwapVerticalBold} />
      </Button>
    </span>
  );
  const sortNumbers = (
    <span>
      Řadit dle výšky ůveru
      <Button className={styles.sort_btn}>
        <Icon size={1} path={mdiSwapVerticalBold} />
      </Button>
    </span>
  );

  // Select inputs in table header
  const selectOptionsType = {
    OSVC: "Podnikatel fyzická osoba",
    INDIVIDUAL: "Fyzická osoba",
    LEGAL_ENTITY: "Právnická osoba",
  };
  const selectOptionsStatus = {
    PENDING: "Čeká na schválení",
    APPROVED: "Schváleno",
    CANCELLED: "Zamítnuto",
  };

  // Display company name if it exist, otherwise display persons name
  // const nameFormatter = (company, row) => {
  //   for (let i = 0; i < adminData.data.length; i++) {
  //     return company ? row.companyName : `${row.surname} ${row.name}`;
  //   }
  // };

  //Numbers Formatter
  const numberFormatter = (number) => {
    return new Intl.NumberFormat("cs-CZ").format(number) + ` Kč`;
  };

  const [singleRequest, setSingleRequest] = useState({});
  const editBtnFetch = (id) => {
    fetch(`http://localhost:3000/request/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      const data = await response.json();
      if (response.status >= 400) {
        setSingleRequest({ state: "error", error: data });
      } else {
        setSingleRequest({ state: "success", data: data });
        setShowModal(true);
      }
    });
  };

  const approveBtn = () => {
    fetch(`http://localhost:3000/request/${singleRequest.data.id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${userData.data.token}` },
    }).then(async (response) => {
      const data = await response.json();
      if (response.status >= 400) {
        setIsApproved({ state: "error", error: data });
      } else {
        setIsApproved({ state: "success", data: data });
      }
    });
  };

  const cancelBtn = () => {
    fetch(`http://localhost:3000/request/${singleRequest.data.id}/cancel`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${userData.data.token}` },
    }).then(async (response) => {
      const data = await response.json();
      if (response.status >= 400) {
        setIsCanceled({ state: "error", error: data });
      } else {
        console.log(isCanceled);
        setIsCanceled({ state: "success", data: data });
      }
    });
  };

  const deleteBtn = () => {
    fetch(`http://localhost:3000/request/${singleRequest.data.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${userData.data.token}` },
    }).then(async (response) => {
      const data = await response.json();
      if (response.status >= 400) {
        setIsDeleted({ state: "error", error: data });
      } else {
        console.log(isCanceled);
        setIsDeleted({ state: "success", data: data });
      }
    });
  };

  // Edit buttons for single row in table
  const editBtn = (e, row) => {
    return (
      <Button
        className={styles.edit_btn}
        onClick={() => {
          editBtnFetch(row.id);
        }}
      >
        Upravit
      </Button>
    );
  };

  const columns = [
    {
      dataField: "surname",
      sort: true,
      headerFormatter: (cell) => sortNames,
      // formatter: nameFormatter,
    },
    {
      // dataField:  ,
      dataField: "amount",
      // text: "Amount",
      sort: true,
      headerFormatter: (cell) => sortNumbers,
      formatter: numberFormatter,
    },
    {
      dataField: "applicantType",
      text: "Typ osoby",
      formatter: (cell) => selectOptionsType[cell],
      filter: selectFilter({
        options: selectOptionsType,
        placeholder: "Zobrazit vše",
      }),
    },
    {
      dataField: "status",
      text: "Stav",
      formatter: (cell) => selectOptionsStatus[cell],
      filter: selectFilter({
        options: selectOptionsStatus,
        placeholder: "Zobrazit vše",
      }),
    },
    {
      formatter: editBtn,
    },
  ];

  const ModalContent = () => {
    return (
      <>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <div className={styles.modal_title}>
                <p className={styles.modal_status_pen}>
                  {singleRequest.data.status === "PENDING" &&
                    `Čeká na schválení`}
                </p>
                <p className={styles.modal_status_app}>
                  {singleRequest.data.status === "APPROVED" && `Schváleno`}
                </p>
                <p className={styles.modal_status_can}>
                  {singleRequest.data.status === "CANCELLED" && `Zamítnuto`}
                </p>

                {singleRequest.data.companyName
                  ? singleRequest.data.companyName
                  : `${singleRequest.data.name} ${singleRequest.data.surname}`}
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {singleRequest.data.companyName ? (
                <>
                  <li>Společnost: {singleRequest.data.companyName}</li>
                  <li>
                    Jednatel:{" "}
                    {`${singleRequest.data.name} ${singleRequest.data.surname}`}
                  </li>
                </>
              ) : (
                <li>
                  Jméno: {singleRequest.data.name} {singleRequest.data.surname}
                </li>
              )}

              <li>
                Typ osoby:
                {singleRequest.data.applicantType === "INDIVIDUAL" &&
                  ` fyzická osoba`}
                {singleRequest.data.applicantType === "OSVC" &&
                  ` podnikatel fyzická osoba`}
                {singleRequest.data.applicantType === "LEGAL_ENTITY" &&
                  ` právnická osoba`}
              </li>
              <li>
                Výše ůveru:{" "}
                {new Intl.NumberFormat("cs-CZ").format(
                  singleRequest.data.amount
                ) + ` Kč`}
              </li>
              <li>{`Délka splácení: ${singleRequest.data.numOfMonths} měsíců`}</li>
              <li>{`Rodné číslo: ${singleRequest.data.birthNum}`}</li>
              <li>{`Státní příslušnost: ${singleRequest.data.nationality}`}</li>

              <li>{`Telefonní číslo: ${singleRequest.data.phone}`}</li>
              <li>{`E-mailová adresa: ${singleRequest.data.email}`}</li>
              <li>Adresa:</li>
              <ul className={styles.address_ul}>
                <li>{`Ulice: ${singleRequest.data.address.street}`}</li>
                <li>
                  {`Číslo popisné: ${singleRequest.data.address.descNumber}`}
                </li>
                <li>
                  {`Číslo orientační: ${singleRequest.data.address.indicativeNumber}`}
                </li>
                <li>{`Město: ${singleRequest.data.address.city}`}</li>
                <li>{`PSČ: ${singleRequest.data.address.postalCode}`}</li>
              </ul>
            </ul>
            <div className={styles.modal_buttons}>
              {singleRequest.data.status === "PENDING" &&
                (role === "ADMIN" || role === "SUPERVIZOR") && (
                  <div className={styles.approval_btn}>
                    <Button
                      onClick={() => {
                        approveBtn();
                        setDataUpdate(!dataUpdate);
                      }}
                      className="rounded-0"
                    >
                      Potvrdit
                    </Button>
                    <Button
                      onClick={() => cancelBtn()}
                      variant="secondary"
                      className="rounded-0"
                    >
                      Zamitnout
                    </Button>
                  </div>
                )}
              {role === "SUPERVIZOR" && (
                <Button
                  onClick={() => deleteBtn()}
                  // className={styles.delete_btn}
                  variant="danger"
                  className="rounded-0"
                >
                  Vymazat
                </Button>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  return (
    <>
      {adminData.data && (
        <BootstrapTable
          className={styles.table}
          keyField="id"
          data={adminData.data}
          columns={columns}
          striped
          condensed
          filter={filterFactory()}
          pagination={paginationFactory()}
        />
      )}
      {showModal && <ModalContent />}
    </>
  );
}
