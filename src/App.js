import "./App.css";
import React from "react";

import CellsContainer from "./Cells";
import Head from "./Head";
import Editor from "./Editor";
import InfoButton from "./InfoButton";

import ASM from "./asm";
const CODE_STORAGE_KEY = "code";

/*  https://github.com/securingsincity/react-ace  */
function BodyWrapper(props) {
  return (
    <div className="body">
      <Editor {...props} />
      <div>
        <CellsContainer {...props} />
        <InfoButton />
      </div>
    </div>
  );
}

function App() {
  let [code, setCode] = React.useState(
    localStorage.getItem(CODE_STORAGE_KEY) || ""
  );
  let changeCode = (code) => {
    localStorage.setItem(CODE_STORAGE_KEY, code);
    setCode(code);
  };
  return (
    <ASM className="app" code={code} setCode={changeCode}>
      <Head debugModus={false} />
      <BodyWrapper code={code} setCode={changeCode} />
    </ASM>
  );
}

export default App;
