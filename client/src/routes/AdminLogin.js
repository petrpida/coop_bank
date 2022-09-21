import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useState} from "react";

export default function AdminLogin () {
    const defaultData = {
        login: "",
        password: ""
    }

    const [loginData, setLoginData] = useState(defaultData)

    const setField = (key, value) => {
        return setLoginData((loginData) => {
            const newData = {...loginData};
            newData[key] = value;
            return newData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(loginData)
        setLoginData(defaultData)
    }

        return (
            <Form className={"w-50 h-50 d-flex flex-column justify-content-center align-items-center m-5 mx-auto"}>
                <Form.Group className="mt-3 w-100" controlId="formBasicEmail">
                    <Form.Label className={"d-block text-start fs-5"}>Přihlašovací jméno</Form.Label>
                    <Form.Control className={"border-success rounded-0 "}
                                  value={loginData.login}
                                  onChange={(e) => setField("login", e.target.value)} />
                </Form.Group>

                <Form.Group className="mt-3 w-100" controlId="formBasicPassword">
                    <Form.Label className={"d-block text-start fs-5"}>Heslo</Form.Label>
                    <Form.Control type="password"
                                  className={"border-success rounded-0"}
                                  value={loginData.password}
                                  onChange={(e) => setField("password", e.target.value)}  />
                </Form.Group>

                <Button size="lg"
                        type="submit"
                        className={"mt-5 w-100 rounded-0 bg-success border-0"}
                        onClick={handleSubmit}>
                    Přihlásit se
                </Button>
            </Form>
        );
    }
