import './theme.sass'
import "./App.css";
import styles from "./css/app.module.css";
import React from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Outlet, useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate()
    const currentPath = window.location.pathname
    console.log(currentPath)

    return (
        <div className="App">
            <Navbar bg="white" expand="sm" className={styles.navbar + "d-flex justify-content-between"}>
                <div>
                    <Navbar.Brand className={"btn"} onClick={() => navigate("/")}>
                        <img
                            className={styles.logo_img}
                            alt="logo"
                            src={require("./Img/CoopBankLogo.png")}
                        />
                    </Navbar.Brand>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        {currentPath === "/adminlogin" || currentPath === "/AdminApp" ?
                            <div className={"d-flex flex-column"}>
                                <h2 className={""}>Aplikace pro bankéře</h2>
                                {false && <h6>`Přihlášen: dulik, ADMIN`</h6>}
                            </div>
                            :
                            <NavDropdown title="Pujčky" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate("/calculator")}>
                                    Půjčka na cokoli
                                </NavDropdown.Item>
                                <NavDropdown.Item>
                                    Mikropůjčky
                                </NavDropdown.Item>
                                <NavDropdown.Item>
                                    {" "}
                                    Hotovostní půjčka
                                </NavDropdown.Item>
                            </NavDropdown>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Outlet/>
        </div>
    );
}

export default App;
