import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

export default function AdminLogin() {
  const navigate = useNavigate();

  const defaultData = {
    login: "",
    password: "",
  };

  const [loginData, setLoginData] = useState(defaultData);
  const [userData, setUserData] = useState();

  let user = Buffer.from(`${loginData.login}`).toString("base64");
  let pass = Buffer.from(`${loginData.password}`).toString("base64");

  // useEffect(() => {
  //   fetch(`http://localhost:3000/login`, {
  //     method: "GET",
  //     headers: { Authorization: `Basic ${user}:${pass}` },
  //   }).then(async (response) => {
  //     const data = await response.json();
  //     if (response.status >= 400) {
  //       setUserData({ state: "error", error: data });
  //     } else {
  //       setUserData({ state: "success", data: data });
  //     }
  //   });
  // }, []);

  const setField = (key, value) => {
    return setLoginData((loginData) => {
      const newData = { ...loginData };
      newData[key] = value;
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    async function check(user, pass) {
      const res = await fetch(`http://localhost:3000/login`, {
        method: "GET",
        headers: { Authorization: `Basic ${user}:${pass}` },
      });

      const data = await res.json();
      if (res.status >= 400) {
        setUserData({ state: "error", error: data });
      } else {
        setUserData({ state: "success", data: data });
        navigate("/AdminApp");
      }
    }

    check(user, pass);

    console.log(userData);
  };

  return (
    <Form
      className={
        "w-50 h-50 d-flex flex-column justify-content-center align-items-center m-5 mx-auto"
      }
    >
      <Form.Group className="mt-3 w-100" controlId="formBasicEmail">
        <Form.Label className={"d-block text-start fs-5"}>
          Přihlašovací jméno
        </Form.Label>
        <Form.Control
          className={"border-success rounded-0 "}
          value={loginData.login}
          onInput={(e) => setField("login", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mt-3 w-100" controlId="formBasicPassword">
        <Form.Label className={"d-block text-start fs-5"}>Heslo</Form.Label>
        <Form.Control
          type="password"
          className={"border-success rounded-0"}
          value={loginData.password}
          onInput={(e) => setField("password", e.target.value)}
        />
      </Form.Group>

      <Button
        size="lg"
        type="submit"
        className={"mt-5 w-100 rounded-0 bg-success border-0"}
        onClick={handleSubmit}
      >
        Přihlásit se
      </Button>
    </Form>
  );
}
