import React, { useState, useMemo, useContext, useEffect } from "react";
// import Table from "react-bootstrap/Table";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import Icon from "@mdi/react";
// import { mdiMagnify } from "@mdi/js";
// import FetchDataContext from "../store/FetchDataProvider";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal, Button } from "react-bootstrap";
import styles from "../css/AdminApp.module.css";
import Icon from "@mdi/react";
import { mdiLoading, mdiSwapVerticalBold } from "@mdi/js";
import AdminContext from "../store/AdminDataProvider";
import { useNavigate } from "react-router-dom";

//console.log(mockup);

export default function AdminApp() {
  const { userData } = useContext(AdminContext);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({});
  const [data, setData] = useState([]);
  const [modalInfo, setModalInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetch(`http://localhost:3000/request/list`, {
      method: "GET",
      headers: { Authorization: `Bearer ${userData.data.token}` },
    }).then(async (response) => {
      const data = await response.json();
      if (response.status >= 400) {
        setAdminData({ state: "error", error: data });
      } else {
        console.log(data);
        setAdminData({ state: "success", data: data });
      }
    });
  }, []);

  // console.log(userData);
  // console.log(adminData);

  const selectOptionsType = {
    OSVC: "Podnikatel fyzická osoba",
    INDIVIDUAL: "Fyzická osoba",
    LEGAL_ENTITY: "Právnická osoba",
  };

  const selectOptionsStatus = {
    PENDING: "Čeká na schválení",
    APPROVED: "Potvrzeno",
    DECLINED: "Zamítnuto",
  };

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
 // Display company name if it exist, otherwise display name of the person 
  const nameFormatter = (company, row) => {
    for (let i = 0; i < adminData.data.length; i++) {
      return company ? row.companyName : `${row.name} ${row.surname}`;
    }
  };

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
        console.log(data);
        setSingleRequest({ state: "success", data: data });
      }
    });
  };

  const rowStyle = (row) => {
    if (row === row.companyName) {
      return { color: "#FD0303" };
    }
  };

  console.log(singleRequest);

  //buttons for editing
  const editBtn = (e, row) => {
    return (
      <Button
        className={styles.edit_btn}
        onClick={() => {
          editBtnFetch(row.id);
          toggleTrueFalse();
        }}
      >
        Upravit
      </Button>
    );
  };

  const columns = [
    {
      dataField: "companyName",
      // text: "Surename",
      sort: true,
      headerFormatter: (cell) => sortNames,
      formatter: nameFormatter,
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
      }),
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell) => selectOptionsStatus[cell],
      filter: selectFilter({
        options: selectOptionsStatus,
      }),
    },
    {
      formatter: editBtn,
    },
  ];

  console.log(columns);

  const toggleTrueFalse = () => {
    setShowModal(handleShow);
  };
  // console.log(singleRequest.state)
  const ModalContent = () => {
    return (
      <>
        {singleRequest.data ? (
          <Modal show={show} onHide={handleClose} className="rounded-0">
            <Modal.Header closeButton>
              <Modal.Title>
                {singleRequest.data.companyName
                  ? singleRequest.data.companyName
                  : `${singleRequest.data.name} ${singleRequest.data.surname}`}
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
                    Jméno: {singleRequest.data.name}{" "}
                    {singleRequest.data.surname}
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
                <ul>
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
                {/* <li>{singleRequest.data}</li>
                <li>{singleRequest.data}</li> */}
              </ul>
              <div className={styles.modal_buttons}>
                {singleRequest.data.status === "PENDING" && (
                  <div className={styles.approval_btn}>
                    <Button>Potvrdit</Button>
                    <Button>Zamitnout</Button>
                  </div>
                )}
                <Button className={styles.delete_btn}>Vymazat</Button>
              </div>
            </Modal.Body>
          </Modal>
        ) : (
          <Modal>
            <Modal.Body>
              <Icon size={2} path={mdiLoading} spin={true} />
            </Modal.Body>
          </Modal>
        )}
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
          // rowEvents={rowEvents}
          rowStyle={rowStyle}
        />
      )}
      {show ? <ModalContent /> : null}
    </>
  );
}

// new Intl.NumberFormat('cs-CZ').format({})

// <div>
//   <Table striped bordered hover size="sm">
//     <thead>
//       <tr>
//         <th>meno</th>
//         <th>Vyse uveru</th>
//         <th>Typ osoby</th>
//         <th>Stav schvaleni</th>
//       </tr>
//       <tr>
//         <th>Jmeno Prijmeni</th>
//         <th>Vyse uveru</th>
//         <th>Typ osoby</th>
//         <th>Stav schvaleni</th>
//         <th>Kontakt</th>
//       </tr>
//     </thead>
//     <tbody>
//       {mockup.map((user) => {
//         return (
//           <>
//             <tr>
//               <td>{user.companyName ?? user.surname}</td>
//               <td>{user.amount}kč</td>
//               <td>{user.applicantType}</td>
//               <td>{user.status}</td>
//             </tr>
//           </>
//         );
//       })}
//     </tbody>
//   </Table>
// </div>
//   );
// }

//     const {enteredApplicantData} = useContext(FetchDataContext)
//   // =========================== Filter by surname or companyName
//   const [searchBy, setSearchBy] = useState("");
// console.log(enteredApplicantData)
//   const filteredUsers = useMemo(() => {
//     return mockup.filter((item) => {
//       if (item.companyName) {
//         return item.companyName
//           .toLocaleLowerCase()
//           .includes(searchBy.toLocaleLowerCase);
//       } else {
//         return (
//           item.name
//             .toLocaleLowerCase()
//             .includes(searchBy.toLocaleLowerCase()) ||
//           item.surname
//             .toLocaleLowerCase()
//             .includes(searchBy.toLocaleLowerCase())
//         );
//       }
//     });
//   }, [searchBy]);

//   function handleSearch(event) {
//     event.preventDefault();
//     setSearchBy(event.target["searchInput"].value);
//   }
//   function handleSearchDelete(event) {
//     if (!event.target.value) setSearchBy("");
//   }

//   //============================== Sorting by amount
//   const [sortedAscending, setSortedAScending] = useState(true);

//   const sortedByAmount = filteredUsers.sort((a, b) => {
//     if (a.amount > b.amount) {
//       return -1;
//     }
//     if (a.amount < b.amount) {
//       return 1;
//     }
//     return 0;
//   });
//   // console.log(sortedByAmount)
//   sortedByAmount.map((amount) => {
//     return console.log(amount);
//   });

//   const searchFieldForm = () => {
//     return (
//       <Form className="d-flex" >
//         <Form.Control
//           id={"searchInput"}
//           style={{ maxWidth: "150px" }}
//           type="search"
//           placeholder="Search"
//           aria-label="Search"

//         />
//         <Button
//           style={{ marginRight: "8px" }}
//           variant="outline-success"
//           type="submit"
//         >
//           <Icon size={1} path={mdiMagnify} />
//         </Button>
//       </Form>
//     );
//   };
