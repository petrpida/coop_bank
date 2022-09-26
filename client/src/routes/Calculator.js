import React, { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../css/Calculator.module.css";
import Button from "react-bootstrap/Button";
import { Card, FormGroup } from "react-bootstrap";
// import FetchDataContext from "../store/FetchDataProvider";
import { useNavigate } from "react-router-dom";

const Calculator = () => {
  const [amount, setAmount] = useState(
    parseInt(JSON.parse(sessionStorage.getItem("inputCalc")).amount)
  );
  const [months, setMonths] = useState(
    parseInt(JSON.parse(sessionStorage.getItem("inputCalc")).numOfMonths)
  );

  // set data to storage
  function setStorage(amount, months) {
    sessionStorage.setItem(
      "inputCalc",
      JSON.stringify({ amount: amount, numOfMonths: months })
    );
  }

  // set data to fetch
  const [inputCalc, setInputCalc] = useState({
    amount: amount,
    numOfMonths: months,
  });
  const [calculatedData, setCalculatedData] = useState({});

  const navigate = useNavigate();

  function set(amount, months) {
    setInputCalc({
      amount: parseInt(amount),
      numOfMonths: parseInt(months),
    });
  }

  // fetch data calculator
  useEffect(() => {
    fetch(`http://localhost:3000/request/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputCalc),
    }).then(async (response) => {
      const data = await response.json();
      if (response.status >= 400) {
        setCalculatedData({ state: "error", error: data });
      } else {
        setCalculatedData({ state: "success", data: data });
        sessionStorage.setItem("calculatedData", JSON.stringify(data));
      }
    });
  }, [inputCalc]);

  // format months/years
  function getYearsAndMonths(mths) {
    let yearsOut = Math.floor(mths / 12);
    let monthsOut = mths % 12;

    let m = `a ${monthsOut} ${
      monthsOut === 0
        ? ""
        : monthsOut === 1
        ? "měsíc"
        : monthsOut >= 2 && monthsOut <= 4
        ? "měsíce"
        : monthsOut > 4
        ? "měsíců"
        : ""
    }`;

    if (yearsOut < 1) {
      return monthsOut + " měsíců";
    } else if (yearsOut === 1 || 2 || 3 || 4 || 5) {
      return `${yearsOut} ${
        yearsOut === 1
          ? "rok"
          : yearsOut >= 2 && yearsOut <= 4
          ? "roky"
          : yearsOut >= 5
          ? "let"
          : ""
      } ${monthsOut === 0 ? "" : m}`;
    }
  }

  return (
    <div>
      <h2 className={styles.heading}>Sjednejte si rychlou online půjčku</h2>
      <div className={styles.calcContainer}>
        <div className={styles.inputContainer}>
          <div>
            <FormGroup>
              <div className={styles.values}>
                <Form.Label>Kolik si chcete půjčit?</Form.Label>
                <span className={styles.outputsValue}>
                  {new Intl.NumberFormat("cs-CZ").format(amount) + " Kč"}
                </span>
              </div>
              <input
                defaultValue={parseInt(
                  JSON.parse(sessionStorage.getItem("inputCalc")).amount
                )}
                type="range"
                className="form-range"
                min="5000"
                max="1200000"
                step={amount < 100000 ? "1000" : "5000"}
                id="customRange3"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                onMouseUp={(event) => {
                  setAmount(event.target.value);
                  set(amount, months);
                  setStorage(amount, months);
                }}
                onTouchEnd={(event) => {
                  setAmount(event.target.value);
                  set(amount, months);
                  setStorage(amount, months);
                }}
              />
              <div className={styles.values}>
                <p>5 000 Kč</p>
                <p>1 200 000 Kč</p>
              </div>
            </FormGroup>
          </div>
          <div>
            <FormGroup>
              <div className={styles.values}>
                <Form.Label>Jak dlouho chcete splácet?</Form.Label>
                <span className={styles.outputsValue}>
                  {getYearsAndMonths(months)}
                </span>
              </div>
              <input
                defaultValue={parseInt(
                  JSON.parse(sessionStorage.getItem("inputCalc")).numOfMonths
                )}
                type="range"
                className="form-range"
                min="6"
                max="60"
                step="1"
                id="customRange3"
                onChange={(e) => {
                  setMonths(e.target.value);
                }}
                onMouseUp={(event) => {
                  setMonths(event.target.value);
                  set(amount, months);
                  setStorage(amount, months);
                }}
                onTouchEnd={(event) => {
                  setMonths(event.target.value);
                  set(amount, months);
                  setStorage(amount, months);
                }}
              />
              <div className={styles.values}>
                <p>6 měsíců</p>
                <p>5 let</p>
              </div>
            </FormGroup>
            <div className={styles.outputCard}></div>
          </div>
        </div>
        <div>
          <Card className={"text-center rounded-0 " + styles.card}>
            <Card.Header className={styles.header}>
              Vaše výhodná půjčka
            </Card.Header>
            {calculatedData.state === "success" && (
              <Card.Body>
                <Card.Title
                  className={styles.title}
                >{`Měsíční splátka ${new Intl.NumberFormat("cs-CZ").format(
                  calculatedData.data.monthlyPayment
                )} Kč`}</Card.Title>
                <Card.Text
                  className={styles.text}
                >{`Roční úroková sazba ${calculatedData.data.yearlyInterest} %`}</Card.Text>
                <Card.Text
                  className={styles.text}
                >{`RPSN ${calculatedData.data.RPSN} %`}</Card.Text>
                <Card.Text
                  className={styles.text}
                >{`Celkově zaplatíte ${new Intl.NumberFormat("cs-CZ").format(
                  calculatedData.data.overallAmount
                )} Kč`}</Card.Text>
                {amount > 200000 && (
                  <p className={styles.fee}>
                    {`Poplatek za sjednání smlouvy ${new Intl.NumberFormat(
                      "cs-CZ"
                    ).format(calculatedData.data.fixedFee)} Kč`}
                  </p>
                )}
                <Button
                  onClick={() => {
                    setTimeout(() => {
                      navigate("/requestForm");
                    }, 500);
                  }}
                  className="rounded-0"
                  variant="primary"
                >
                  Sjednat online
                </Button>
              </Card.Body>
            )}
            <Card.Footer className="text-muted"></Card.Footer>
          </Card>
        </div>
      </div>
      <p className={styles.footer}></p>
    </div>
  );
};

export default Calculator;
