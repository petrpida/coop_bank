import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import AdminLogin from "./routes/AdminLogin";
import AdminApp from "./routes/AdminApp";
import Calculator from "./routes/Calculator";
import Form from "./routes/Form";
import Summary from "./routes/Summary";
import Home from "./routes/Home";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<App/>}>
                  <Route path="" element={<Home/>} />
                  <Route path="adminLogin" element={<AdminLogin/>} />
                  <Route path="adminApp" element={<AdminApp/>} />
                  <Route path="calculator" element={<Calculator/>} />
                  <Route path="form" element={<Form/>} />
                  <Route path="summary" element={<Summary/>} />
              </Route>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
