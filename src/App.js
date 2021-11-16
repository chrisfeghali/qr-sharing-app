import logo from "./logo.svg";
import "./App.css";
import { getApps } from "firebase/app";

function App() {
  const firebaseApp = getApps()[0];
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {JSON.stringify(firebaseApp.options)}
          {console.log(`Firebase options are ${firebaseApp.options}`)}
          <br></br>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;