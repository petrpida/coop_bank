import React, { useState, useMemo, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
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
import styles from "../css/AdminApp.module.css"

const mockup = [
  {
    applicantType: "INDIVIDUAL",
    name: "Lorem",
    surname: "Ipsum",
    birthNum: "801007/5953",
    nationality: "CZ",
    email: "dolor.sit@amet.co",
    phone: "+420555444333",
    IC: null,
    companyName: null,
    amount: 150000,
    numOfMonths: 12,
    position: null,
    address: {
      street: "Accumsan",
      descNumber: 12,
      indicativeNumber: 2,
      city: "Duis",
      postalCode: 11111,
    },
    status: "PENDING",
    id: "Pm8MtixTFX",
    created: "Wed Mar 25 2015 01:00:00 GMT+0100",
  },
  {
    applicantType: "OSVC",
    name: "Lacinia",
    surname: "Fusce",
    birthNum: "006004/2400",
    nationality: "CZ",
    email: "delectus@volutpat.in",
    phone: "+420111222555",
    IC: "1566545987",
    companyName: "Company nameeeeeeeeeeeeee",
    amount: 70000,
    numOfMonths: 18,
    position: null,
    address: {
      street: "Ante",
      descNumber: 13,
      indicativeNumber: 7,
      city: "Totam",
      postalCode: 777777,
    },
    status: "PENDING",
    id: "wiVXhN73Mt",
    created: "Sat Sep 17 2022 19:31:42 GMT+0200",
  },
  {
    applicantType: "OSVC",
    name: "neviem",
    surname: "nevim",
    birthNum: "006004/2400",
    nationality: "CZ",
    email: "delectus@volutpat.in",
    phone: "+420111222555",
    IC: "1566545987",
    companyName: null,
    amount: 850000000,
    numOfMonths: 18,
    position: null,
    address: {
      street: "Ante",
      descNumber: 13,
      indicativeNumber: 7,
      city: "Totam",
      postalCode: 777777,
    },
    status: "PENDING",
    id: "wiVXhN7u3Mt",
    created: "Sat Sep 17 2022 19:31:42 GMT+0200",
  },
];

//console.log(mockup);

export default function AdminApp() {




  const [data, setData] = useState([]);
  const [modalInfo, setModalInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setData(mockup);
  }, [data]);

  //console.log(data);
  const selectOptions = {
    OSVC: "OSVC",
    INDIVIDUAL: "INDIVIDUAL",
    // 2: "Third Option" // ------------------------------opravit
  };

//  const random = data.map((singleUser) => { 
//   return singleUser.amount * 100000
//  })
//  console.log(random)

  const columns = [
    {
      dataField: "surname",
      text: "Surename" ,
      sort: true,
    },
    {
      dataField:"amount",
      text: "Amount",
      sort: true,
      // formatter: (column)
    },
    {
      dataField: "applicantType",
      // text: "Typ osoby",
      formatter: (cell) => selectOptions[cell],
      filter: selectFilter({
        options: selectOptions,
      }),
    },

    {
      dataField: "email",
      text: "Contact",
      sort: true,
    },
    {
      dataField: "status",
      text: "Status",
    },
  ];
  console.log(columns)

  const rowEvents = { 
    onClick: (e, row) => {
        console.log(row)
        setModalInfo(row)
        toggleTrueFalse()
    }
  }

  const toggleTrueFalse = () => {
    setShowModal(handleShow)
  }

  const ModalContent = () => { 
    return ( 
        <Modal show={show} onHide={handleClose} className={styles.modal}>
            <Modal.Header closeButton>
                <Modal.Title>
                {modalInfo.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    <li>Name: {modalInfo.name} {modalInfo.surname}</li>
                    <li>Company Name: {modalInfo.companyName}</li>
                    <li>Surname: {modalInfo.surname}</li>
                    <li>Surname: {modalInfo.surname}</li>
                    <li>Email: {modalInfo.email}</li>
                    <li>Phone: {modalInfo.phone}</li>
                    <li>Surname: {modalInfo.surname}</li>
                    <li>Surname: {modalInfo.surname}</li>
                   
                </ul>
                <div className={styles.buttons}>
                <Button>Potvrdit</Button>
                <Button>Zamitnout</Button>
                <Button>Vymazat</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
  }

  return (
    <>
      <BootstrapTable
        className={styles.table}
        keyField="id" 
        data={data}
        columns={columns}
        striped
        condensed
        filter={filterFactory()}
        pagination={paginationFactory()}
        rowEvents={rowEvents}
      />
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
