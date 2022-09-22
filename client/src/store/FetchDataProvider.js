import React, { createContext, useEffect, useState } from "react";

const FetchDataContext = createContext();

export function FetchDataProvider(props) {
  // fetch data calculator
  const [inputCalc, setInputCalc] = useState();
  const [calculatedData, setCalculatedData] = useState({});
  // fetch data create applicant
  const [enteredApplicantData, setEnteredApplicantData] = useState({});
  // fetch data applicant by id
  const [applicantData, setApplicantData] = useState({});

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
      }
    });
  }, [inputCalc]);

  // fetch data create applicant
  // useEffect(() => {
  //   fetch(`http://localhost:3000/request/create`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(enteredApplicantData),
  //   }).then(async (response) => {
  //     const data = await response.json();
  //     if (response.status >= 400) {
  //       setEnteredApplicantData({ state: "error", error: data });
  //     } else {
  //       setEnteredApplicantData({ state: "success", data: data });
  //     }
  //   });
  // }, [enteredApplicantData]);

  // // fetch data applicant by id
  // useEffect(() => {
  //   fetch(`http://localhost:3000/request/${""}`, { method: "GET" }).then(
  //     async (response) => {
  //       const data = await response.json();
  //       if (response.status >= 400) {
  //         setApplicantData({ state: "error", error: data });
  //       } else {
  //         setApplicantData({ state: "success", data: data });
  //       }
  //     }
  //   );
  // }, []);

  const value = {
    inputCalc,
    setInputCalc,
    calculatedData,
    enteredApplicantData,
    setEnteredApplicantData,
    applicantData,
  };

  return (
    <FetchDataContext.Provider value={value}>
      {props.children}
    </FetchDataContext.Provider>
  );
}

export default FetchDataContext;
