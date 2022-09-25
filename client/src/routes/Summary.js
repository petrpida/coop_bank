import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import styles from "../css/Summary.module.css";

function Summary() {
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

  console.log(applicantData);

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
    <div className={styles.container}>
      {applicantData.data && (
        <div>
          <ListGroup variant="flush">
            <ListGroup.Item className={styles.title}>
              Osobní údaje:
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
            <ListGroup.Item>Jméno: {applicantData.data.name}</ListGroup.Item>
            <ListGroup.Item>
              Příjmení: {applicantData.data.surname}
            </ListGroup.Item>
            <ListGroup.Item>
              Rodné číslo: {applicantData.data.birthNum}
            </ListGroup.Item>
            <ListGroup.Item>E-mail: {applicantData.data.email}</ListGroup.Item>
            <ListGroup.Item>
              Tel. číslo: +420{applicantData.data.phone}
            </ListGroup.Item>
            <ListGroup.Item>
              Adresa: {applicantData.data.address.street}{" "}
              {applicantData.data.address.descNumber}/
              {applicantData.data.address.indicativeNumber},{" "}
              {applicantData.data.address.postalCode}{" "}
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
          <ListGroup className="rounded-0">
            <ListGroup.Item className={styles.title}>
              Shrnutí žádosti:
            </ListGroup.Item>
            <ListGroup.Item>
              Požadovaná částka:{" "}
              {new Intl.NumberFormat("cs-CZ").format(applicantData.data.amount)}{" "}
              Kč
            </ListGroup.Item>
            <ListGroup.Item>
              Doba splácení: {getYearsAndMonths(applicantData.data.numOfMonths)}
            </ListGroup.Item>
            <ListGroup.Item>
              Stav žádosti: {applicantData.data.status}
            </ListGroup.Item>
            <ListGroup.Item>
              Žádost vytvořena: {applicantData.data.created}
            </ListGroup.Item>
            <ListGroup.Item>Vaše ID: {applicantData.data.id}</ListGroup.Item>
          </ListGroup>
        </div>
      )}
    </div>
  );
}

export default Summary;
