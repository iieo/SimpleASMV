import React from "react";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-assembly_x86";
import "ace-builds/src-noconflict/theme-monokai";

export default function Editor(props) {
  let editor = (
    <AceEditor
      value={props.code}
      mode="assembly_x86"
      theme="monokai"
      width="60vw"
      height="calc(100vh - 80px)"
      fontSize={20}
      onChange={props.setCode}
      name="codeEditor"
      placeholder="Type your code here..."
      editorProps={{ $blockScrolling: true }}
      markers={
        props.asmdebugmode
          ? [
              {
                startRow: props.asmdebugline, //TODO überspringt Zeile 2
                startCol: 0,
                endRow: props.asmdebugline + 1,
                endCol: 0,
                className: "debug-marker",
                type: "background",
              },
            ]
          : []
      }
    />
  );
  return editor;
}
