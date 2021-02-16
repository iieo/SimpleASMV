import "./App.css";
import React from "react";

import CellsContainer from "./Cells";
import Head from "./Head";
import Editor from "./Editor";

import ASM from "./asm";

/*  https://github.com/securingsincity/react-ace  */
function BodyWrapper(props) {
  return (
    <div className="body">
      <Editor {...props} />
      <CellsContainer {...props} />
    </div>
  );
}

function App() {
  let [code, setCode] = React.useState("testst ");
  function changeCode(text) {
    setCode(text);
    //editor.session.setValue(text);
  }
  return (
    <ASM className="app" code={code} setCode={changeCode}>
      <Head debugModus={false} />
      <BodyWrapper setCode={setCode} />
    </ASM>
  );
}

export default App;
