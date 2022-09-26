import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import styles from "../css/Summary.module.css";

function Summary() {
  // fetch data
  const [applicantData, setApplicantData] = useState({});
  const params = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/request/${params.id}`, { method: "GET" }).then(
      async (response) => {
        const data = await response.json();
        if (response.status >= 400) {
          setApplicantData({ state: "error", error: data });
        } else {
          setApplicantData({ state: "success", data: data });
        }
      }
    );
  }, []);

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
    <div>
      <h2 className={styles.heading}>Shrnutí žádosti</h2>
      <div className={styles.container}>
        {applicantData.data && (
          <div>
            <ListGroup variant="flush" className={styles.infoCard}>
              <ListGroup.Item className={styles.title}>
                Vyplněné údaje:
              </ListGroup.Item>
              <ListGroup.Item>
                {applicantData.data.applicantType === "OSVC"
                  ? "Podnikatel"
                  : applicantData.data.applicantType === "INDIVIDUAL"
                  ? "Fyzická osoba"
                  : applicantData.data.applicantType === "LEGAL_ENTITY"
                  ? "Právnická osoba"
                  : applicantData.data.applicantType}
              </ListGroup.Item>
              <ListGroup.Item>
                {applicantData.data.applicantType === "LEGAL_ENTITY"
                  ? "Firma: " + applicantData.data.companyName
                  : "Jméno: " +
                    applicantData.data.name +
                    " " +
                    applicantData.data.surname}
              </ListGroup.Item>
              {applicantData.data.applicantType === "LEGAL_ENTITY" ? (
                <ListGroup.Item>
                  {applicantData.data.name +
                    " " +
                    applicantData.data.surname +
                    ", " +
                    applicantData.data.position}
                </ListGroup.Item>
              ) : (
                ""
              )}
              <ListGroup.Item>
                {applicantData.data.applicantType === "INDIVIDUAL"
                  ? "Rodné číslo: " + applicantData.data.birthNum
                  : "IČO: " + applicantData.data.IC}
              </ListGroup.Item>
              <ListGroup.Item>
                E-mail: {applicantData.data.email}
              </ListGroup.Item>
              <ListGroup.Item>
                Tel. číslo: {applicantData.data.phone}
              </ListGroup.Item>
              <ListGroup.Item>
                Adresa: {applicantData.data.address.street}{" "}
                {applicantData.data.address.descNumber}
                {applicantData.data.address.indicativeNumber !== 0
                  ? "/" + applicantData.data.address.indicativeNumber
                  : ""}
                , {applicantData.data.address.postalCode}{" "}
                {applicantData.data.address.city}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                Národnost: {applicantData.data.nationality}
              </ListGroup.Item>
            </ListGroup>
          </div>
        )}
        {applicantData.data && (
          <div>
            <ListGroup className={"rounded-0 " + styles.sumCard}>
              <ListGroup.Item className={styles.title}>Žádost:</ListGroup.Item>
              <ListGroup.Item>
                Požadovaná částka:{" "}
                {new Intl.NumberFormat("cs-CZ").format(
                  applicantData.data.amount
                )}{" "}
                Kč
              </ListGroup.Item>
              <ListGroup.Item>
                Doba splácení:{" "}
                {getYearsAndMonths(applicantData.data.numOfMonths)}
              </ListGroup.Item>
              <ListGroup.Item>
                Stav žádosti:{" "}
                {applicantData.data.status === "PENDING"
                  ? "Čeká na schválení"
                  : applicantData.data.status === "CANCELLED"
                  ? "Zamítnuta"
                  : applicantData.data.status === "APPROVED"
                  ? "Schválena"
                  : ""}
              </ListGroup.Item>
              <ListGroup.Item>
                Žádost vytvořena:{" "}
                {new Date(applicantData.data.created).toLocaleDateString("cz")}
              </ListGroup.Item>
              <ListGroup.Item>Vaše ID: {applicantData.data.id}</ListGroup.Item>
            </ListGroup>
          </div>
        )}
      </div>
      <p className={styles.url}>
        Uschovejte si prosím pečlivě tento odkaz{" "}
        <span>
          <a href={`http://localhost:3000/${params.id}`}>
            http://localhost:3000/{params.id}
          </a>
        </span>
        , přes který se můžete k výše uvedenému shrnutí kdykoli vrátit.
      </p>
    </div>
  );
}

export default Summary;
