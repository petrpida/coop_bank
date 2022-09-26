import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

export default function AdminLogin() {
  const navigate = useNavigate();

  // login data
  const defaultData = {
    login: "",
    password: "",
  };

  const [loginData, setLoginData] = useState(defaultData);
  const [userData, setUserData] = useState({});

  const [validated, setValidated] = useState(false);

  // format login inputs to fetch
  let user = Buffer.from(`${loginData.login}:${loginData.password}`).toString(
    "base64"
  );

  const setField = (key, value) => {
    return setLoginData((loginData) => {
      const newData = { ...loginData };
      newData[key] = value;
      return newData;
    });
  };

  // login submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    async function checkUser(user) {
      const res = await fetch(`http://localhost:3000/login`, {
        method: "GET",
        headers: { Authorization: `Basic ${user}` },
      });

      const data = await res.json();
      if (res.status >= 400) {
        setUserData({ state: "error", error: data });
      } else {
        setUserData({ state: "success", data: data });
        sessionStorage.setItem("userData", JSON.stringify(data));
        navigate("/AdminApp");
      }
    }
    checkUser(user);
  };

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      className={
        "w-50 h-50 d-flex flex-column justify-content-center align-items-center m-5 mx-auto"
      }
    >
      <Form.Group className="mt-3 w-100" controlId="formBasicEmail">
        <Form.Label className={"d-block text-start fs-5"}>
          Přihlašovací jméno
        </Form.Label>
        <Form.Control
          isInvalid={userData.error}
          required
          className={"border-success rounded-0 "}
          value={loginData.login}
          onInput={(e) => setField("login", e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {userData.error
            ? "Uživatelské jméno nebo heslo není správné!"
            : "Zadání uživatelského jména je povinné!"}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mt-3 w-100" controlId="formBasicPassword">
        <Form.Label className={"d-block text-start fs-5"}>Heslo</Form.Label>
        <Form.Control
          isInvalid={userData.error}
          required
          type="password"
          className={"border-success rounded-0"}
          value={loginData.password}
          onInput={(e) => setField("password", e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {userData.error ? "" : "Zadání hesla je povinné!"}
        </Form.Control.Feedback>
        <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
      </Form.Group>

      <Button
        type="submit"
        size="lg"
        className={"mt-5 w-100 rounded-0 bg-success border-0"}
      >
        Přihlásit se
      </Button>
    </Form>
  );
}
