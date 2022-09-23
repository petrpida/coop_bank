import "./App.css";
import styles from "./css/app.module.css";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
// import { Nav, Navbar, NavDropdown } from "react-bootstrap"
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import Main from "./bricks/Main";
import { Outlet } from "react-router-dom";

function App() {
 
  return (
    <div className="App">
      <Navbar bg="white" expand="sm" className={styles.navbar + "d-flex justify-content-between" }>
       <div> 
        <Navbar.Brand href="#home">
          {" "}
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
           
            <Nav.Link href="#link">Prihlasit</Nav.Link>
            <NavDropdown title="Pujčky" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
                Půjčka bez dokládání účelu
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Mikropůjčky
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                {" "}
                Hotovostní půjčka
              </NavDropdown.Item>
            </NavDropdown>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default App;
