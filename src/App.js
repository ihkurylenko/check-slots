import logo from "./logo.svg";
import "./App.css";

import { CheckSlots } from "./CheckSlots/CheckSlots";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <CheckSlots />
      </header>
    </div>
  );
}

export default App;
