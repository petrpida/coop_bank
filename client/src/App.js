import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Outlet} from "react-router-dom";

function App() {
  return (
    <div className="App">
       <div className={"d-flex bg-secondary text-light p-5 justify-content-center"}>NAVBAR</div>
      <Outlet/>
    </div>
  );
}

export default App;
