import {Button, Form, InputGroup} from "react-bootstrap";
import {useState, useContext, useEffect} from "react";
import FetchDataContext from "../store/FetchDataProvider";
import Summary from "../bricks/Summary";

export default function RequestForm() {
    const {inputCalc, setEnteredApplicantData} = useContext(FetchDataContext)
    const [dataToSend, setDataToSend] = useState({})
    const [newRequestRecived, setNewRequestRecived] = useState({})
    const [showErrorMessage, setShowErrorMessage] = useState("")
    const [validated, setValidated] = useState(false)
    const [typeOfApplicant, setTypeOfApplicant] = useState("default")
    const [typeSelected, setTypeSelected] = useState("default")
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
            postalCode: 0
        }
    }
    const [formData, setFormData] = useState(defaultFormData)
    const [dataSent, setDataSent] = useState(false)

    const storeInputData = (key, value) => {
        return setFormData((formData) => {
            const newData = {...formData}
            newData[key] = value
            return newData
        })
    }

    const storeAddressData = (key, value) => {
        return setFormData((formData) => {
            const newData = {...formData}
            newData.address[key] = value
            return newData
        })
    }

    // sent created request data to server
    useEffect(() => {
          fetch(`http://localhost:3000/request/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
          }).then(async (response) => {
            const data = await response.json();
            if (response.status >= 400) {
                setNewRequestRecived({ state: "error", error: data });
            } else {
                setNewRequestRecived({ state: "success", data: data });
            }
          });
        }, [dataToSend]);

    console.log(newRequestRecived)

    const handleSubmit = (e) => {
        const form = e.currentTarget;

        e.preventDefault()

        const newData = {
            ...formData,
            applicantType: typeOfApplicant,
            amount: inputCalc.amount,
            numOfMonths: inputCalc.numOfMonths
        }
        console.log(newData)

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        if (newRequestRecived.errorMessage) {
            setShowErrorMessage(newRequestRecived.errorMessage)
        } else {
            setDataToSend(newData)
        }

            setDataSent(true)
    }

    const createFormGroup = (label, name, type = "text") => {
        return (
            <Form.Group className="mb-2 w-100" controlId={`FormGroup${name}`}>
                <Form.Label className={"mb-0"}>{label}</Form.Label>
                <Form.Control
                    onChange={(e) => storeInputData(name, e.target.value)}
                    className={"rounded-0"}
                    type={type}
                />
            </Form.Group>
        )
    }

    const createAddressFormGroup = (label, name, type) => {
        return (
            <Form.Group className="mb-2 w-100" controlId={`FormGroup${name}`}>
                <Form.Label className={"mb-0"}>{label}</Form.Label>
                <Form.Control
                    onChange={(e) => storeAddressData(name, e.target.value)}
                    className={"rounded-0"}
                    type={type}
                />
            </Form.Group>
        )
    }

    const buttons = () => {
        return (
            <div className={"mt-5 px-0 px-md-5  w-100 d-flex flex-column flex-sm-row" +
                " justify-content-between justify-content-lg-center align-items-center gap-2"}>
                <Button
                    onClick={() => setTypeOfApplicant("default")}
                    size="lg"
                    variant="light"
                    className={"w-100 text-secondary fw-bold rounded-0"}>
                    Zpět
                </Button>
                <Button type="submit"
                        size="lg"
                        variant="light"
                        className={"w-100 text-success fw-bold rounded-0"}
                >
                    Odeslat
                </Button>
            </div>
        )
    }

    return (
        <>
            {dataSent ?
                <div>
                    <Summary/>
                    {showErrorMessage ? <div>{showErrorMessage}</div> :
                        <div>{`id request ${newRequestRecived.state}`}</div>
                    }

                </div>
                :
                <Form noValidate validated={validated}
                      onSubmit={(e) => handleSubmit(e)}
                      className={" w-100 d-flex flex-column justify-content-between align-items-center mt-2 mb-5 mx-auto bg-green text-light p-5"}>
                    {typeOfApplicant === "default" &&
                        <div className={" d-flex flex-column justify-content-center align-items-center"}>
                            <h3 className={"w-100"}>
                                Jste?
                            </h3>
                            <Form.Select className={"rounded-0"} defaultValue=""
                                         onChange={(e) => setTypeSelected(e.target.value)}>
                                <option value="" disabled hidden>vyberte jednu z možností</option>
                                <option value="INDIVIDUAL">fyzická osoba</option>
                                <option value="OSVC">fyzická osoba - podnikatel</option>
                                <option value="LEGAL_ENTITY">právnická osoba</option>
                            </Form.Select>
                            {typeSelected !== "default" && <Button
                                onClick={() => setTypeOfApplicant(typeSelected)}
                                size="lg"
                                variant="light"
                                className={"mt-5 text-success fw-bold rounded-0"}
                            >
                                Další krok
                            </Button>}
                        </div>}
                    {typeOfApplicant === "default" ? <></> :
                        typeOfApplicant === "INDIVIDUAL" || typeOfApplicant === "OSVC" ?
                            <>
                                <div className={"mt-5 w-100"}>
                                    <h3>Osobní údaje</h3>
                                    <div className={"d-flex flex-column flex-lg-row gap-1"}>
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupName`}>
                                            <Form.Label className={"mb-0"}>Jméno</Form.Label>
                                            <Form.Control
                                                onChange={(e) => storeInputData("name", e.target.value)}
                                                className={"rounded-0"}
                                                required
                                            />
                                            <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                   type="invalid">
                                                Povinné pole
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupSurname`}>
                                            <Form.Label className={"mb-0"}>Příjmení</Form.Label>
                                            <Form.Control
                                                onChange={(e) => storeInputData("surname", e.target.value)}
                                                className={"rounded-0"}
                                                required
                                            />
                                            <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                   type="invalid">
                                                Povinné pole
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-2 w-100" controlId="formGroupBirthNum">
                                            <Form.Label
                                                className={"mb-0"}>{typeOfApplicant === "INDIVIDUAL" ? "Rodné číslo" : "IČO"}</Form.Label>
                                            {typeOfApplicant === "INDIVIDUAL" ?
                                                <>
                                                    <Form.Control
                                                        onChange={(e) => storeInputData("birthNum", e.target.value)}
                                                        className={"rounded-0"}
                                                        placeholder="ve tvaru 751231/0123"
                                                        pattern="[0-9]{2}[0156][0-9][0-3][0-9][ \/][0-9]{3,4}"
                                                    />
                                                    <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                           type="invalid">
                                                        Uveďte platné RČ
                                                    </Form.Control.Feedback>
                                                </>
                                                :
                                                <>
                                                    <Form.Control
                                                        onChange={(e) => storeInputData("IC", e.target.value)}
                                                        className={"rounded-0"}
                                                        pattern="[0-9]{8}"
                                                        required
                                                    />
                                                    <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                           type="invalid">
                                                        Povinné pole, IČO musí být osmimístné číslo
                                                    </Form.Control.Feedback>
                                                </>
                                            }
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
                                            <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                   type="invalid">
                                                Uveďte email ve správném tvaru
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupPhone`}>
                                            <Form.Label className={"mb-0"}>Telefonní číslo</Form.Label>
                                            <InputGroup hasValidation className={"mb-3"}>
                                                <InputGroup.Text className={"rounded-0"}>+420</InputGroup.Text>
                                                <Form.Control
                                                    placeholder="např. 602123456"
                                                    onChange={(e) => storeInputData("phone", e.target.value)}
                                                    className={"rounded-0"}
                                                    type="tel"
                                                    pattern="[0-9]{9}"
                                                />
                                            <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                   type="invalid">
                                                Zadejte devítimísné číslo bez mezer
                                            </Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                        {createFormGroup("Národnost", "nationality")}
                                    </div>
                                </div>
                                <div className={"m-5 w-100"}>
                                    <h3>Adresa</h3>
                                    <div className={"d-flex flex-column flex-lg-row gap-1"}>
                                        {createAddressFormGroup("Ulice", "street")}
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupDescNumber`}>
                                            <Form.Label className={"mb-0"}>Číslo popisné</Form.Label>
                                            <Form.Control
                                                onChange={(e) => storeAddressData("descNumber", parseInt(e.target.value))}
                                                className={"rounded-0"}
                                                type="number"
                                                min="1"
                                                step="2"
                                            />
                                            <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                   type="invalid">
                                                Číslo popisné musí být liché
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupIndicativeNumber`}>
                                            <Form.Label className={"mb-0"}>Číslo orientační</Form.Label>
                                            <Form.Control
                                                onChange={(e) => storeAddressData("indicativeNumber", parseInt(e.target.value))}
                                                className={"rounded-0"}
                                                type="number"
                                                min="1"
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className={"d-flex flex-column flex-lg-row gap-1"}>
                                        {createAddressFormGroup("Město", "city")}
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupPostalCode`}>
                                            <Form.Label className={"mb-0"}>PSČ</Form.Label>
                                            <Form.Control
                                                onChange={(e) => storeAddressData("postalCode", parseInt(e.target.value))}
                                                className={"rounded-0"}
                                                type="number"
                                                min="1"
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                {buttons()}
                            </>
                            :
                            <>
                                <div className={"mt-5 w-100"}>
                                    <h3>Údaje o firmě</h3>
                                    <div className={"d-flex flex-column flex-lg-row gap-1"}>
                                        {createFormGroup("Název firmy", "companyName")}
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupIC`}>
                                            <Form.Label className={"mb-0"}>IČO</Form.Label>
                                            <Form.Control
                                                onChange={(e) => storeInputData("IC", e.target.value)}
                                                className={"rounded-0"}
                                                pattern="[0-9]{8}"
                                                required
                                            />
                                            <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                   type="invalid">
                                                Povinné pole, IČO musí být osmimístné číslo
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className={"w-100"}>
                                    <div className={"d-flex flex-column flex-lg-row gap-1"}>
                                        {createAddressFormGroup("Ulice", "street")}
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupDescNumber`}>
                                            <Form.Label className={"mb-0"}>Číslo popisné</Form.Label>
                                            <Form.Control
                                                onChange={(e) => storeAddressData("descNumber", parseInt(e.target.value))}
                                                className={"rounded-0"}
                                                type="number"
                                                min="1"
                                                step="2"
                                            />
                                            <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                   type="invalid">
                                                Číslo popisné musí být liché
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupIndicativeNumber`}>
                                            <Form.Label className={"mb-0"}>Číslo orientační</Form.Label>
                                            <Form.Control
                                                onChange={(e) => storeAddressData("indicativeNumber", parseInt(e.target.value))}
                                                className={"rounded-0"}
                                                type="number"
                                                min="1"
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className={"d-flex flex-column flex-lg-row gap-1"}>
                                        {createAddressFormGroup("Město", "city")}
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupPostalCode`}>
                                            <Form.Label className={"mb-0"}>PSČ</Form.Label>
                                            <Form.Control
                                                onChange={(e) => storeAddressData("postalCode", parseInt(e.target.value))}
                                                className={"rounded-0"}
                                                type="number"
                                                min="1"
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className={"m-5 w-100"}>
                                    <h3>Údaje o jednací osobě</h3>
                                    <div className={"d-flex flex-column flex-lg-row gap-1"}>
                                        {createFormGroup("Jméno", "name")}
                                        {createFormGroup("Příjmení", "surname")}
                                        <Form.Group className="mb-2 w-100" controlId="formGroupPosition">
                                            <Form.Label
                                                className={"mb-0"}>Pozice ve firmě</Form.Label>
                                            <Form.Select
                                                className={"rounded-0"} defaultValue=""
                                                onChange={(e) => storeInputData("position", e.target.value)}
                                                required>

                                                <option value="" disabled hidden>vyberte</option>
                                                <option value="majitel">majitel</option>
                                                <option value="jednatel">jednatel</option>
                                                <option value="pověřená osoba">pověřená osoba</option>
                                            </Form.Select>
                                            <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                   type="invalid">
                                                Povinné pole
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
                                            <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                   type="invalid">
                                                Povinné pole
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-2 w-100" controlId={`FormGroupPhone`}>
                                            <Form.Label className={"mb-0"}>Telefonní číslo</Form.Label>
                                            <InputGroup hasValidation className={"mb-3"}>
                                                <InputGroup.Text className={"rounded-0"}>+420</InputGroup.Text>
                                                <Form.Control
                                                    placeholder="např. 602123456"
                                                    onChange={(e) => storeInputData("phone", e.target.value)}
                                                    className={"rounded-0"}
                                                    type="tel"
                                                    pattern="[0-9]{9}"
                                                />
                                                <Form.Control.Feedback className={"ps-1 text-light bg-danger"}
                                                                       type="invalid">
                                                    Zadejte devítimísné číslo bez mezer
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                        {createFormGroup("Národnost", "nationality")}
                                    </div>
                                </div>
                                {buttons()}
                            </>
                    }
                </Form>}
        </>
    )
}