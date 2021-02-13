import "./App.css";
import React from "react";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-assembly_x86";
import "ace-builds/src-noconflict/theme-monokai";

import CellsContainer from "./cells";
import Head from "./Head";

import ASM from "./asm"

/*  https://github.com/securingsincity/react-ace  */


function App() {
  let [debugModus, setDebugModus] = React.useState(false);
  let [code, setCode] = React.useState("");
  function run(){
    
  }
  function debug(){
    
  }

  return (
    <ASM className="app">
      <Head debugModus={false} run={run} debug={debug}/>
      <div className="body">
        <AceEditor
          mode="assembly_x86"
          theme="monokai"
          width="60vw"
          height="calc(100vh - 80px)"
          fontSize={20}
          onChange={setCode}
          name="codeEditor"
          placeholder="Type your code here..."
          editorProps={{ $blockScrolling: true }}
          markers={[
            {
              startRow: 0,
              startCol: 0,
              endRow: 1,
              endCol: 0,
              className: "debug-marker",
              type: "background",
            },
          ]}
        />
        <CellsContainer cells={[0,0]} />
      </div>
    </ASM>
  );
}

export default App;
