import "./theme.sass";
import "./App.css";
import styles from "./css/app.module.css";
import React from "react";
import {Nav, Navbar, Dropdown, DropdownButton} from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return (
    <div className="App">
      <Navbar
        bg="white"
        expand="sm"
        className={styles.navbar + "d-flex justify-content-between"}
      >
        <div>
          <Navbar.Brand className={"btn"} onClick={() => navigate("/")}>
            <img
              className={styles.logo_img}
              alt="logo"
              src={require("./Img/CoopBankLogo.png")}
            />
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {currentPath === "/adminLogin" || currentPath === "/AdminApp" ? (
              <div className={"d-flex flex-column"}>
                <h2 className={""}>Aplikace pro bankéře</h2>
              </div>
            ) : (
                <DropdownButton
                    align="end"
                    title="Půjčky"
                    id="dropdown-menu-align-end"
                >
                    <Dropdown.Item
                        onClick={() => {
                            sessionStorage.setItem(
                                "inputCalc",
                                JSON.stringify({ amount: 350000, numOfMonths: 24 })
                            );
                            navigate("/calculator");
                        }}
                        eventKey="1">Půjčka na cokoli</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Mikropůjčky</Dropdown.Item>
                    <Dropdown.Item eventKey="3">Hotovostní půjčka</Dropdown.Item>
                </DropdownButton>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default App;
