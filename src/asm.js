import React, { useState } from "react";

function ASM(props) {
  const MAX_COMMANDS = 100,
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
    }
    let cmdName = cmdObject.args[0],
      value = cmdObject.args[1];
    console.log(`Execute: ${cmdName} ${value} #${bz}`);
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
        return;
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
    for (let i = 0; i < cmds.length; i++) {
      if (cmds[i] === blockName + ":") {
        bz = i;
        return;
      }
    }
    throwError("could not find block " + blockName);
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
        args = null,
        lineNumber = lines[i][1];

      while (cmd.indexOf("  ") !== -1) {
        cmd = cmd.replace("  ", " ");
      } // remove more than one space
      if (cmd.includes(" ")) {
        args = cmd.split(" ");
        if (args.length > 2) {
          throwError(`Too many arguments! - ${cmd}`);
        } else {
          cmds.push({ args, lineNumber, mode: "command" });
        }
      } else {
        if (!cmd.endsWith(":")) {
          throwError(`Command without args passed - ${cmd}`);
        } else {
          cmds.push({ args, lineNumber, mode: "block" });
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
    for (; bz < cmds.length; ) {
      if (commandsTotal < MAX_COMMANDS) {
        executeCommand(cmds[bz]);
      } else {
        //sollte es zu lange laufen springt es hier aus der schleife raus
        break;
      }
    }
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
  function* createDebug() {
    reset();
    loadCommandsFromLines(loadLines());
    for (; bz < cmds.length; ) {
      if (commandsTotal < MAX_COMMANDS) {
        executeCommand(cmds[bz]);
      } else {
        break;
      }
      yield bz;
    }
  }

  function reset() {
    bz = 0;
    commandsTotal = 0;
    setState((prev) => ({ ...prev, acc: 0, cells: [0, 0, 0], debugLine: 0 }));
    console.log("RESET");
    console.log(state);
  }
  return (
    <div className={props.className}>
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
