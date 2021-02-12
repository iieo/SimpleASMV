import "./App.css";
import React from "react";

import AceEditor from "react-ace";
import CellsContainer from "./cells";
import "ace-builds/src-noconflict/mode-assembly_x86";
import "ace-builds/src-noconflict/theme-monokai";

/*  https://github.com/securingsincity/react-ace  */

function onChange(newValue) {}

function App() {
  let [cells, setCells] = React.useState([0, 0, 0, 0]);

  return (
    <div className="app">
      <header className="header">
        <h1 className="heading">Simple ASMR</h1>
      </header>
      <body className="body">
        <AceEditor
          mode="assembly_x86"
          theme="monokai"
          width="60vw"
          height="calc(100vh - 80px)"
          fontSize={20}
          onChange={onChange}
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
        <CellsContainer cells={cells} />
      </body>
    </div>
  );
}

export default App;
