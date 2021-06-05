import React, { useState } from "react";

function ASM(props) {
  const MAX_COMMANDS = 10000,
    MAX_CELLS = 100; //TODO MAX CELLS
  //TODO commands test for RegEx
  let cmds = [],
    bz,
    commandsTotal,
    acc;
  let [state, setState] = useState({
    debugMode: false,
    debugLine: 0,
    debugIterator: null,
    cells: [0, 0, 0],
    acc: 0,
  });
  function executeCommand(cmdObject) {
    commandsTotal++;
    bz++;

    if (cmdObject.mode !== "command") {
      setState((prev) => ({
        ...prev,
        debugLine: cmdObject.lineNumber,
      }));
      return;
    }
    let cmdName = cmdObject.args[0],
      value = cmdObject.args[1];
    console.debug(`Execute: ${cmdName} ${value} #${bz}`);
    switch (cmdName) {
      case "dload":
        acc = parseInt(value);
        break;
      case "load":
        acc = getValue(value);
        break;
      case "store":
        let tmpCells = state.cells;
        tmpCells[value] = acc;
        setState((prev) => ({ ...prev, cells: tmpCells }));
        break;
      case "add":
        acc = acc + getValue(value);
        break;
      case "sub":
        acc = acc - getValue(value);
        break;
      case "mult":
        acc = acc * getValue(value);
        break;
      case "div":
        acc = acc / getValue(value);
        break;
      case "jeq":
        if (acc === 0) {
          jump(value);
        }
        break;
      case "jle":
        if (acc <= 0) {
          jump(value);
        }
        break;
      case "jlt":
        if (acc < 0) {
          jump(value);
        }
        break;
      case "jge":
        if (acc >= 0) {
          jump(value);
        }
        break;
      case "jgt":
        if (acc > 0) {
          jump(value);
        }
        break;
      case "jne":
        if (acc !== 0) {
          jump(value);
        }
        break;
      case "jump":
        jump(value);
        break;
      /*case "print":
                consoleArea.value += getValue(value);
                break;
            case "ptext":
                consoleArea.value += String.fromCharCode(getValue(value))
                break;*/ default:
        throwError("Could not find command '" + cmdName + "'");
        break;
    }
    setState((prev) => ({
      ...prev,
      acc: Math.floor(acc),
      debugLine: cmdObject.lineNumber,
    }));
  }

  function jump(blockName) {
    let blocks = cmds.filter((item) => blockName === item.blockName);
    if (blocks.length === 0) {
      throwError(`could not find block ${blockName}`);
    } else if (blocks.length === 1) {
      bz = blocks[0].position;
      console.debug(`jumped to command #${blocks[0].position}`);
    } else {
      throwError(`more than one block with the name ${blockName} was found!`);
    }
  }

  function getValue(arg) {
    let value = -1;
    if (arg.startsWith("=")) {
      arg = arg.replace("=", "");
      value = parseInt(arg);
    } else {
      if (arg >= 0) {
        value = state.cells[arg] ? state.cells[arg] : 0;
      } else {
        throwError("specified cell is below 0");
      }
    }
    return parseInt(value);
  }

  function throwError(msg) {
    //consoleArea.value += "line " + bz + ": " + msg +"\n";
    console.error("line " + bz + ": " + msg);
  }

  function loadCommandsFromLines(lines) {
    cmds = [];
    for (let i = 0; i < lines.length; i++) {
      let cmd = lines[i][0].trim().toLowerCase(),
        lineNumber = lines[i][1];

      while (cmd.indexOf("  ") !== -1) {
        cmd = cmd.replace("  ", " ");
      } // remove more than one space
      if (cmd.includes(" ")) {
        let args = cmd.split(" ");
        if (args.length > 2) {
          throwError(`Too many arguments! - ${cmd}`);
        } else {
          let position = cmds.length;
          cmds.push({
            args,
            lineNumber,
            mode: "command",
            position,
          });
        }
      } else {
        if (!cmd.endsWith(":")) {
          throwError(`Command without args passed - ${cmd}`);
        } else {
          let position = cmds.length;
          cmds.push({
            blockName: cmd.replace(":", ""),
            lineNumber,
            mode: "block",
            position,
          });
        }
      }
    }
  }

  function loadLines() {
    let lines = [];
    let cmdLines = props.code.split("\n");
    for (let i = 0; i < cmdLines.length; i++) {
      // check for comments
      if (cmdLines[i].includes("//")) {
        cmdLines[i] = cmdLines[i].split("//")[0].trim();
      }
      // check if line is empty
      if (cmdLines[i].trim().length > 1) {
        lines.push([cmdLines[i], i]);
      }
    }
    return lines;
  }

  function run() {
    reset();
    loadCommandsFromLines(loadLines());
    console.debug(cmds);
    for (; bz < cmds.length; ) {
      if (commandsTotal < MAX_COMMANDS) {
        executeCommand(cmds[bz]);
      } else {
        //sollte es zu lange laufen springt es hier aus der schleife raus
        break;
      }
    }
    console.log(`Executed a total of ${commandsTotal} commands.`);
  }
  function* createDebug() {
    reset();
    loadCommandsFromLines(loadLines());
    console.debug(cmds);
    for (; bz < cmds.length; ) {
      if (commandsTotal < MAX_COMMANDS) {
        executeCommand(cmds[bz]);
      } else {
        break;
      }
      yield bz;
    }
    console.log(`Executed ${commandsTotal} commands.`);
  }
  function debug() {
    if (state.debugIterator) {
      let job = state.debugIterator.next();
      if (job.done) {
        setState((prev) => ({
          ...prev,
          debugMode: false,
          debugIterator: null,
        }));
      }
    } else {
      let debugIterator = createDebug();
      debugIterator.next();
      setState((prev) => ({
        ...prev,
        debugMode: true,
        debugIterator: debugIterator,
        debugLine: 0,
      }));
    }
  }

  function reset() {
    bz = 0;
    commandsTotal = 0;
    setState((prev) => ({ ...prev, acc: 0, cells: [0, 0, 0], debugLine: 0 }));
    console.log("RESET");
  }
  function downloadCode() {
    downloadFile("program.asm", props.code, "text/plain");
  }
  function downloadFile(filename, data, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      // Others
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
  function uploadFile() {
    fileInputElement.click();
  }
  function inputChanged(e) {
    let file = e.target.files[0];
    console.log(file);
    if (file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        props.setCode(e.target.result); //TODO RegEx
      };
      reader.readAsText(file);
    }
  }
  let fileInputElement;
  return (
    <div className={props.className}>
      <input
        type="file"
        style={{ display: "none" }}
        onChange={inputChanged}
        ref={(input) => (fileInputElement = input)}
      ></input>
      {React.Children.map(props.children, (child) => {
        if (child.type === "div") {
          return child;
        }
        return React.cloneElement(
          child,
          {
            ...child.props,
            asmdebugmode: state.debugMode,
            asmcells: state.cells,
            asmacc: state.acc,
            asmdebugline: state.debugLine,
            asmdownload: downloadCode,
            asmupload: uploadFile,
            asmrun: run,
            asmdebug: debug,
          },
          null
        );
      })}
    </div>
  );
}

export default ASM;
