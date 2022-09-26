import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequestForm() {
  const navigate = useNavigate();

  // let inputCalc = sessionStorage.getItem("userData");
  // inputCalc = { data: JSON.parse(inputCalc) };
  const [addNewRequestCall, setAddNewRequestCall] = useState({
    state: "inactive",
  });
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [typeOfApplicant, setTypeOfApplicant] = useState("default");
  const [typeSelected, setTypeSelected] = useState("default");
  const defaultFormData = {
    name: "",
    surname: "",
    birthNum: "",
    nationality: "",
    email: "",
    phone: "",
    IC: "",
    position: "",
    companyName: "",
    address: {
      street: "",
      descNumber: 0,
      indicativeNumber: 0,
      city: "",
      postalCode: 0,
    },
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleConfirmationClose = () => setShowConfirmation(false);
  const handleConfirmationShow = () => setShowConfirmation(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const companyPositions = [
    "člen/ka představenstva",
    "člen/ka správní rady",
    "člen/ka výboru",
    "ekonom/ka",
    "generální ředitel/ka",
    "jednatel/ka",
    "místopředseda",
    "místopředsedkyně",
    "místostarosta",
    "místostarostka",
    "primátor/ka",
    "prokurista",
    "prokuristka",
    "předseda",
    "přdseda představenstva",
    "předseda správní rady",
    "předsedkyně",
    "předsedkyně představenstva",
    "předsedkyně správní rady",
    "ředitel/ka",
    "společník",
    "starosta",
    "starostka",
    "statutární ředitel/ka",
    "účetní",
    "zástupce",
    "zástupkyně",
    "zplnomocněný",
    "zplnomocněná",
  ];

  const storeInputData = (key, value) => {
    return setFormData((formData) => {
      const newData = { ...formData };
      newData[key] = value;
      return newData;
    });
  };

  const storeAddressData = (key, value) => {
    return setFormData((formData) => {
      const newData = { ...formData };
      newData.address[key] = value;
      return newData;
    });
  };

  const firstLetterCapital = (string) => {
    return string.charAt(0).toLocaleUpperCase("cz") + string.slice(1)
  }

  const formatPhoneNumber = (phoneNumber) => {
    return "+420 " + new Intl.NumberFormat("cs-CZ").format(phoneNumber);
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;

    e.preventDefault();

    const newData = {
      ...formData,
      applicantType: typeSelected,
      amount: parseInt(JSON.parse(sessionStorage.getItem("inputCalc")).amount),
      numOfMonths: parseInt(JSON.parse(sessionStorage.getItem("inputCalc")).numOfMonths),
    };

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    setAddNewRequestCall({ state: "pending" });

    const res = await fetch(`http://localhost:3000/request/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
    const data = await res.json();
    if (res.status >= 400) {
      setAddNewRequestCall({ state: "error", error: data });
      setShowErrorMessage(data.errorMessage);
      handleShow();

    } else {
      setAddNewRequestCall({ state: "success", data });
      navigate(`/${data.id}`);
    }
  };

  const buttons = () => {
    return (
      <div
        className={
          "mt-5 px-0 px-md-5  w-100 d-flex flex-column flex-sm-row" +
          " justify-content-between justify-content-lg-center align-items-center gap-2"
        }
      >
        <Button
          onClick={() => handleConfirmationShow()}
          size="lg"
          variant="light"
          className={"w-100 text-danger fw-bold rounded-0"}
        >
          Zpět
        </Button>
        <Button
          type="submit"
          size="lg"
          variant="light"
          className={"w-100 text-success fw-bold rounded-0"}
        >
          Odeslat
        </Button>
      </div>
    );
  };

  return (
    <>
      <Form
        noValidate
        validated={validated}
        onSubmit={(e) => handleSubmit(e)}
        className={
          " w-100 d-flex flex-column justify-content-between align-items-center" +
          " mt-2 mb-5 mx-auto bg-green text-light p-5"
        }
      >
        {typeOfApplicant === "default" && (
          <div
            className={
              " d-flex flex-column justify-content-center align-items-center"
            }
          >
            <h3 className={"w-100"}>Jste?</h3>
            <Form.Select
              className={"rounded-0"}
              defaultValue=""
              onChange={(e) => setTypeSelected(e.target.value)}
            >
              <option value="" disabled hidden>
                vyberte
              </option>
              <option value="INDIVIDUAL">fyzická osoba</option>
              <option value="OSVC">fyzická osoba - podnikatel</option>
              <option value="LEGAL_ENTITY">právnická osoba</option>
            </Form.Select>
            {typeSelected !== "default" && (
              <Button
                onClick={() => setTypeOfApplicant(typeSelected)}
                size="lg"
                variant="light"
                className={"mt-5 text-success fw-bold rounded-0"}
              >
                Další krok
              </Button>
            )}
          </div>
        )}
        {typeOfApplicant === "default" ? (
          <></>
        ) : typeOfApplicant === "INDIVIDUAL" || typeOfApplicant === "OSVC" ? (
          <>
            <div className={"mt-5 w-100"}>
              <h3>Osobní údaje</h3>
              <div className={"d-flex flex-column flex-lg-row gap-1"}>
                <Form.Group className="mb-2 w-100" controlId={`FormGroupName`}>
                  <Form.Label className={"mb-0"}>Jméno</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeInputData(
                        "name",
                        firstLetterCapital(e.target.value)
                      )
                    }
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte své jméno
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupSurname`}
                >
                  <Form.Label className={"mb-0"}>Příjmení</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeInputData(
                        "surname",
                        e.target.value.toLocaleUpperCase("cz")
                      )
                    }
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte své příjmení
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId="formGroupBirthNum"
                >
                  <Form.Label className={"mb-0"}>
                    {typeOfApplicant === "INDIVIDUAL" ? "Rodné číslo" : "IČO"}
                  </Form.Label>
                  {typeOfApplicant === "INDIVIDUAL" ? (
                    <>
                      <Form.Control
                        onChange={(e) =>
                          storeInputData(
                            "birthNum",
                            e.target.value.replaceAll(/\D/g, "")
                          )
                        }
                        className={"rounded-0"}
                        pattern="[0-9]{2}[0156][0-9][0-3][0-9][ \/-]?[0-9]{3,4}"
                        required
                      />
                      <Form.Control.Feedback
                        className={"ps-1 text-light bg-danger"}
                        type="invalid"
                      >
                        {formData.birthNum
                          ? "Toto rodné číslo není platné"
                          : "Zadejte své rodné číslo"}
                      </Form.Control.Feedback>
                    </>
                  ) : (
                    <>
                      <Form.Control
                        onChange={(e) =>
                          storeInputData(
                            "IC",
                            e.target.value.replaceAll(/\D/g, "")
                          )
                        }
                        className={"rounded-0"}
                        pattern="^\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*$"
                        required
                      />
                      <Form.Control.Feedback
                        className={"ps-1 text-light bg-danger"}
                        type="invalid"
                      >
                        {formData.IC
                          ? "IČO musí být osmimístné číslo"
                          : "Zadejte IČO firmy"}
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>
              </div>
              <div className={"d-flex flex-column flex-lg-row gap-1"}>
                <Form.Group className="mb-2 w-100" controlId={`FormGroupEmail`}>
                  <Form.Label className={"mb-0"}>E-mail</Form.Label>
                  <Form.Control
                    onChange={(e) => storeInputData("email", e.target.value)}
                    className={"rounded-0"}
                    type="email"
                    pattern="^\S+@\S+\.\S+$"
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    {formData.email
                      ? "Uveďte email ve správném tvaru"
                      : "Zadejte svůj email"}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2 w-100" controlId={`FormGroupPhone`}>
                  <Form.Label className={"mb-0"}>Telefonní číslo</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className={"rounded-0"}>
                      +420
                    </InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        storeInputData(
                          "phone",
                          formatPhoneNumber(e.target.value.replaceAll(/\D/g, ""))
                        )
                      }
                      className={"rounded-0"}
                      required
                      pattern="^\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*$"
                    />
                    <Form.Control.Feedback
                      className={"ps-1 text-light bg-danger"}
                      type="invalid"
                    >
                      {formData.phone
                        ? "Telefonní číslo musí být devítimístné"
                        : "Zadejte své telefonní číslo"}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupNationality`}
                >
                  <Form.Label className={"mb-0"}>Národnost</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeInputData("nationality", e.target.value)
                    }
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte svou národnost
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className={"m-5 w-100"}>
              <h3>Adresa</h3>
              <div className={"d-flex flex-column flex-lg-row gap-1"}>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupStreet`}
                >
                  <Form.Label className={"mb-0"}>Ulice</Form.Label>
                  <Form.Control
                    onChange={(e) => storeAddressData("street", firstLetterCapital(e.target.value))}
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte ulici
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupDescNumber`}
                >
                  <Form.Label className={"mb-0"}>Číslo popisné</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeAddressData("descNumber", parseInt(e.target.value))
                    }
                    className={"rounded-0"}
                    type="number"
                    min="1"
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte číslo popisné
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupIndicativeNumber`}
                >
                  <Form.Label className={"mb-0"}>Číslo orientační</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeAddressData(
                        "indicativeNumber",
                        parseInt(e.target.value)
                      )
                    }
                    className={"rounded-0"}
                    type="number"
                    min="1"
                  />
                </Form.Group>
              </div>
              <div className={"d-flex flex-column flex-lg-row gap-1"}>
                <Form.Group className="mb-2 w-100" controlId={`FormGroupCity`}>
                  <Form.Label className={"mb-0"}>Město</Form.Label>
                  <Form.Control
                    onChange={(e) => storeAddressData("city", firstLetterCapital(e.target.value))}
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte město
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupPostalCode`}
                >
                  <Form.Label className={"mb-0"}>PSČ</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeAddressData(
                        "postalCode",
                        parseInt(e.target.value.replaceAll(/\D/g, ""))
                      )
                    }
                    className={"rounded-0"}
                    pattern="^\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*$"
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    {formData.address.postalCode
                      ? "PSČ musí být pětimístné"
                      : "Zadejte PSČ"}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            {buttons()}
          </>
        ) : (
          <>
            <div className={"mt-5 w-100"}>
              <h3>Údaje o firmě</h3>
              <div className={"d-flex flex-column flex-lg-row gap-1"}>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupCompanyName`}
                >
                  <Form.Label className={"mb-0"}>Název firmy</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeInputData("companyName", e.target.value.toLocaleUpperCase("cz"))
                    }
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte název firmy
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2 w-100" controlId={`FormGroupIC`}>
                  <Form.Label className={"mb-0"}>IČO</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeInputData("IC", e.target.value.replaceAll(/\D/g, ""))
                    }
                    className={"rounded-0"}
                    pattern="^\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*$"
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    {formData.IC
                      ? "IČO musí být osmimístné číslo"
                      : "Zadejte IČO firmy"}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className={"w-100"}>
              <div className={"d-flex flex-column flex-lg-row gap-1"}>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupDescStreet`}
                >
                  <Form.Label className={"mb-0"}>Ulice</Form.Label>
                  <Form.Control
                    onChange={(e) => storeAddressData("street", firstLetterCapital(e.target.value))}
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte ulici
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupDescNumber`}
                >
                  <Form.Label className={"mb-0"}>Číslo popisné</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeAddressData("descNumber", parseInt(e.target.value))
                    }
                    className={"rounded-0"}
                    type="number"
                    min="1"
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte číslo popisné
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupIndicativeNumber`}
                >
                  <Form.Label className={"mb-0"}>Číslo orientační</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeAddressData(
                        "indicativeNumber",
                        parseInt(e.target.value)
                      )
                    }
                    className={"rounded-0"}
                    type="number"
                    min="1"
                  />
                </Form.Group>
              </div>
              <div className={"d-flex flex-column flex-lg-row gap-1"}>
                <Form.Group className="mb-2 w-100" controlId={`FormGroupCity`}>
                  <Form.Label className={"mb-0"}>Město</Form.Label>
                  <Form.Control
                    onChange={(e) => storeAddressData("city", firstLetterCapital(e.target.value))}
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte město
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupPostalCode`}
                >
                  <Form.Label className={"mb-0"}>PSČ</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeAddressData(
                        "postalCode",
                        parseInt(e.target.value.replaceAll(/\D/g, ""))
                      )
                    }
                    className={"rounded-0"}
                    pattern="^\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*$"
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    {formData.address.postalCode
                      ? "PSČ musí být pětimístné"
                      : "Zadejte PSČ"}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className={"m-5 w-100"}>
              <h3>Údaje o jednací osobě</h3>
              <div className={"d-flex flex-column flex-lg-row gap-1"}>
                <Form.Group className="mb-2 w-100" controlId={`FormGroupName`}>
                  <Form.Label className={"mb-0"}>Jméno</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeInputData(
                        "name", firstLetterCapital(e.target.value))
                    }
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte své jméno
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupSurname`}
                >
                  <Form.Label className={"mb-0"}>Příjmení</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeInputData(
                        "surname",
                        e.target.value.toLocaleUpperCase("cz")
                      )
                    }
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte své příjmení
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId="formGroupPosition"
                >
                  <Form.Label className={"mb-0"}>Pozice ve firmě</Form.Label>
                  <Form.Select
                    className={"rounded-0"}
                    defaultValue=""
                    onChange={(e) => storeInputData("position", e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>
                      vyberte
                    </option>

                    {companyPositions.map((position) => {
                      return <option value={position}>{position}</option>;
                    })}
                  </Form.Select>
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Vyberte jednu z možností
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className={"d-flex flex-column flex-lg-row gap-1"}>
                <Form.Group className="mb-2 w-100" controlId={`FormGroupEmail`}>
                  <Form.Label className={"mb-0"}>E-mail</Form.Label>
                  <Form.Control
                    onChange={(e) => storeInputData("email", e.target.value)}
                    className={"rounded-0"}
                    type="email"
                    pattern="^\S+@\S+\.\S+$"
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    {formData.email
                      ? "Uveďte email ve správném tvaru"
                      : "Zadejte svůj email"}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2 w-100" controlId={`FormGroupPhone`}>
                  <Form.Label className={"mb-0"}>Telefonní číslo</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className={"rounded-0"}>
                      +420
                    </InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        storeInputData(
                          "phone",
                          formatPhoneNumber(e.target.value.replaceAll(/\D/g, ""))
                        )
                      }
                      className={"rounded-0"}
                      required
                      pattern="^\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*[0-9]\D*$"
                    />
                    <Form.Control.Feedback
                      className={"ps-1 text-light bg-danger"}
                      type="invalid"
                    >
                      {formData.phone
                        ? "Telefonní číslo musí být devítimístné"
                        : "Zadejte své telefonní číslo"}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group
                  className="mb-2 w-100"
                  controlId={`FormGroupNationality`}
                >
                  <Form.Label className={"mb-0"}>Národnost</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      storeInputData("nationality", e.target.value)
                    }
                    className={"rounded-0"}
                    required
                  />
                  <Form.Control.Feedback
                    className={"ps-1 text-light bg-danger"}
                    type="invalid"
                  >
                    Zadejte svou národnost
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            {buttons()}
          </>
        )}
      </Form>

      {addNewRequestCall.error && (
        <Modal centered show={show} onHide={handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body className={"text-center bg-danger text-light fs-4"}>
            {showErrorMessage === "error - even descriptive number"
              ? "Adresa nebyla nenalezena"
              : showErrorMessage}
          </Modal.Body>
          <Modal.Footer className={"justify-content-center"}>
            <Button
              variant="outline-dark"
              onClick={handleClose}
              className={"rounded-0"}
            >
              Opravit
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal centered show={showConfirmation} onHide={handleConfirmationClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className={"text-center bg-dark text-light"}>
          <div>Při návratu budou Vaše dosud vyplněná data ztracena.</div>
        </Modal.Body>
        <Modal.Footer className={"justify-content-center"}>
          <Button
            variant="outline-primary"
            className={"rounded-0"}
            onClick={handleConfirmationClose}
          >
            Zůstat
          </Button>
          <Button
            variant="outline-danger"
            className={"rounded-0"}
            onClick={() => {
              setTypeOfApplicant("default");
              setValidated(false);
              setTypeSelected("default");
              handleConfirmationClose();
            }}
          >
            Vrátit se
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
