import styles from "../css/main.module.css";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.main}>
        <div className="w-50"></div>
        <div className={styles.main_text}>
          <h3>Půjčka na cokoli</h3>
          <p>
            od <span className={styles.percents}>6,5 %</span>
          </p>
          <p className={styles.rpsn}>RPSN</p>
          <button
            onClick={() => {
              sessionStorage.setItem(
                "inputCalc",
                JSON.stringify({ amount: 350000, numOfMonths: 24 })
              );
              navigate("/calculator");
            }}
          >
            Chci půjčku
          </button>{" "}
        </div>
      </div>
      <p className={styles.footer}></p>
    </div>
  );
}

export default Main;
