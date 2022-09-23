import React from "react";
import styles from "../css/main.module.css";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate()
  
  return (
    <div className={styles.main}>
      <div className="w-50"></div>
      <div className={styles.main_text}>
        <h3>Pujčka na cokoli</h3>
        <p>
          od <span className={styles.percents}>6,5 %</span>
        </p>
        <p className={styles.rpsn}>RPSN</p>
        <button onClick={() => navigate("/calculator")}>Chci pujčku</button>{" "}
      </div>
    </div>
  );
}

export default Main;
