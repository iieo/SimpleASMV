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
  function executeCommand(args) {
    let cmdName = args[0],
      value = args[1];
    console.log(`Execute: ${cmdName} ${value} #${bz}`);
    switch (cmdName) {
      case "dload":
        acc = value;
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
        acc += getValue(value);
        break;
      case "mult":
        acc *= getValue(value);
        break;
      case "div":
        acc /= getValue(value);
        break;
      case "sub":
        acc -= getValue(value);
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
        return; //TODO print
      /*case "print":
                consoleArea.value += getValue(value);
                break;
            case "ptext":
                consoleArea.value += String.fromCharCode(getValue(value))
                break;*/ default:
        throwError("Could not find command '" + cmdName + "'");
        break;
    }
    setState((prev) => ({ ...prev, acc: Math.floor(acc) }));
    bz++;
    commandsTotal++;
    console.log(state);
  }

  function jump(blockName) {
    for (let i = 0; i < state.cmds.length; i++) {
      if (state.cmds[i] === blockName + ":") {
        bz = 1;
        return;
      }
    }

    throwError("could not find block " + blockName);
  }

  function getCommand(index) {
    let cmd = cmds[index];

    cmd = cmd.trim().toLowerCase();
    console.log(cmd);
    while (cmd.indexOf("  ") !== -1) {
      cmd = cmd.replace("  ", " ");
    } // remove more than one space

    let args = cmd.split(" ");

    if (args.length > 2) {
      throwError("more than 1 argument");
    }

    if (args[0].length > 0) {
      args[0] = args[0].trim(); //TODO zb'    efdasd'
    }
    if (args[1].length > 1) {
      args[1] = args[1].trim();
    }

    if (args.length <= 1) {
      if (!cmd[cmd.length - 1] === ":") {
        throwError("No command passed");
      }
    }
    return args;
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

  function loadCommands() {
    cmds = [];
    let cmdLines = props.code.split("\n");
    for (let i = 0; i < cmdLines.length; i++) {
      // check for comments
      if (cmdLines[i].includes("//")) {
        cmdLines[i] = cmdLines[i].split("//")[0].trim();
      }
      // check if line is empty
      if (cmdLines[i].trim().length > 1) {
        cmds.push(cmdLines[i]);
      }
    }
  }

  function run() {
    loadCommands();
    reset();
    for (; bz < cmds.length; ) {
      if (commandsTotal < MAX_COMMANDS) {
        executeCommand(getCommand(bz));
      }
    }
  }
  function debug() {
    if (state.debugIterator) {
      state.debugIterator.next();
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
    loadCommands();
    reset();
    for (; bz < cmds.length; ) {
      if (commandsTotal < MAX_COMMANDS) {
        console.log(bz);
        setState((prev) => ({
          ...prev,
          debugLine: bz,
        }));
        executeCommand(getCommand(bz));
      }
      yield null;
    }
  }

  function reset() {
    bz = 0;
    commandsTotal = 0;
    setState((prev) => ({ ...prev, acc: 0, cells: [0, 0, 0], debugLine: 0 }));
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
