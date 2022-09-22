import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../css/Calculator.module.css";
import Button from "react-bootstrap/Button";
import { Card, FormGroup } from "react-bootstrap";
import FetchDataContext from "../store/FetchDataProvider";

const Calculator = React.memo(() => {
  const [amount, setAmount] = useState(350000);
  const [months, setMonths] = useState(24);

  // send and get data to/from server
  const { setInputCalc, calculatedData } = useContext(FetchDataContext);

  function set(amount, months) {
    setInputCalc({
      amount: parseInt(amount),
      numOfMonths: parseInt(months),
    });
  }

  console.log(calculatedData);

  // format months
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
    <div className={styles.inputContainer}>
      <div>
        <FormGroup>
          <Form.Label>Kolik si chcete půjčit?</Form.Label>
          <input
            defaultValue={350000}
            type="range"
            className="form-range"
            min="5000"
            max="1200000"
            step="1000"
            id="customRange3"
            onChange={(event) => {
              setAmount(event.target.value);
              set(amount, months);
            }}
          />
          <div className={styles.outputs}>
            <span className={styles.outputsValue}>
              {new Intl.NumberFormat("cs-CZ").format(amount) + " Kč"}
            </span>
          </div>
        </FormGroup>
      </div>
      <div>
        <FormGroup>
          <Form.Label>Jak dlouho chcete splácet?</Form.Label>
          <input
            defaultValue={24}
            type="range"
            className="form-range"
            min="6"
            max="60"
            step="1"
            id="customRange3"
            onChange={(event) => {
              setMonths(event.target.value);
              set(amount, months);
            }}
          />
          <div className={styles.outputs}>
            <span className={styles.outputsValue}>
              {getYearsAndMonths(months)}
            </span>
          </div>
        </FormGroup>
      </div>
      <div className={styles.outputCard}>
        <Card className="text-center rounded-0">
          <Card.Header>Vaše výhodná půjčka</Card.Header>
          {calculatedData.state === "success" && (
            <Card.Body>
              <Card.Title>{`Měsíční splátka ${new Intl.NumberFormat(
                "cs-CZ"
              ).format(calculatedData.data.monthlyPayment)} Kč`}</Card.Title>
              <Card.Text>{`Roční úroková sazba ${calculatedData.data.yearlyInterest}%`}</Card.Text>
              <Card.Text>{`RPSN ${calculatedData.data.RPSN}%`}</Card.Text>
              <Card.Text>{`Celkově zaplatíte ${new Intl.NumberFormat(
                "cs-CZ"
              ).format(calculatedData.data.overallAmount)} Kč`}</Card.Text>
              {amount > 200000 && (
                <p className={styles.fee}>
                  {`Poplatek za sjednání smlouvy ${new Intl.NumberFormat(
                    "cs-CZ"
                  ).format(calculatedData.data.fixedFee)} Kč`}
                </p>
              )}
              <Button
                style={{
                  backgroundColor: "#00843D",
                  border: "none",
                  borderRadius: "0",
                }}
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
  );
});

export default Calculator;
