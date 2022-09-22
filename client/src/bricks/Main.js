import React from "react";
import styles from "../css/main.module.css";

function Main() {
  return (
    <div className={styles.main}>
      <div className="w-50"></div>
      <div className={styles.main_text}>
        <div className="h-25 w-100 d-flex">
          {" "}
          <h3>Pujčka na cokoli</h3>
        </div>

        <div className="h-50 w-100">
          {" "}
          <p>
            od <span>6,5 %</span>
          </p>
          <p>RPSN</p>
        </div>
        <div className="h-25 w-100">
          {" "}
          <button>chci pujčku</button>{" "}
        </div>
      </div>
    </div>
  );
}

export default Main;
