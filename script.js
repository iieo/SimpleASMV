console.log("start");
let cmdArea = document.getElementById("cmdArea");
let outputArea = document.getElementById("outputArea");
let infoArea = document.getElementById("infoArea");
let consoleArea = document.getElementById("consoleArea");
let cells = [];
let acc = 0;
let bz = 0;
let commandsTotal = 0;
const MAX_COMMANDS = 10000
let iterator
let cmds = ["dload 0", "jeq end", "store 1", "end:", "load 1"];

function executeCommand(args) {
    let cmdName = args[0];
    let value = args[1];

    switch (cmdName) {
        case "dload":
            acc = value;
            break;
        case "load":
            acc = getValue(value);
            break;
        case "store":
            cells[value] = acc;
            break;
        case "add":
            acc += getValue(value)
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
            if (acc != 0) {
                jump(value);
            }
            break;
        case "jump":
            jump(value);
            return;
        case "print":
            consoleArea.value += getValue(value);
            break;
        case "ptext":
            consoleArea.value += String.fromCharCode(getValue(value))
            break;
        default:
            throwError("Could not find command '" + cmdName + "'");
            break;
    }

    acc = Math.floor(acc);
    bz++;
    commandsTotal++;
}

function loadCommands() {
    cmds = []
    let cmdLines = cmdArea.value.split('\n');
    for (let i = 0; i < cmdLines.length; i++) {
        // check for comments
        if (cmdLines[i].includes("//")) {
            cmdLines[i] = cmdLines[i].split("//")[0].trim()
        }
        // check if line is empty
        if (cmdLines[i].trim().length > 1) {
            cmds.push(cmdLines[i]);
        }
    }
}

function jump(x) {
    for (let i = 0; i < cmds.length; i++) {
        if (cmds[i] === x + ":") {
            bz = i;
            return;
        }
    }

    throwError("could not find block " + x);
}

function getCommand(index) {
    cmd = cmds[index];

    cmd = cmd.trim().toLowerCase();
    while(cmd.indexOf('  ')!=-1) { cmd = cmd.replace('  ',' '); }; // remove more than one space

    let args = cmd.split(" ")
    
    if (args.length>2) {
        throwError("more than 1 argument");
    }

    if (args[0].length > 0) { args[0] = args[0].trim(); }
    if (args[1].length > 1) { args[1] = args[1].trim(); }

    if (args.length <= 1) {
        if (!cmd[cmd.length - 1] === ":") {
            throwError("No command passed");
        }
    }

    return args;
}

function run() {
    loadCommands();
    for (bz = 0; bz < cmds.length;) {
        if (commandsTotal < MAX_COMMANDS) {
            executeCommand(getCommand(bz));
        }
    }
    log("ACC::" + acc);
    log(cells);
    log("runs::" + commandsTotal)
}

function* debugRun() {
    loadCommands();
    for (bz = 0; bz < cmds.length;) {
        if (commandsTotal < MAX_COMMANDS) {
            executeCommand(cmds[bz]);
        }
        log("ACC::" + acc);
        log(cells);
        yield acc;
    }
}

function getValue(val) {
    let value = -1;
    if (val.startsWith("=")) {
        val = val.replace('=', '');
        value = parseInt(val)
    } else {
        if (val >= 0) {
            value = cells[val] ? cells[val] : 0;
        } else {
            throwError("specified cell is below 0");
        }
    }
    return parseInt(value);
}
function log(msg) {
    if (Array.isArray(msg)) {
        log("Cells:");
        for (let i = 0; i < msg.length; i++) {
            outputArea.value += "  " + i + ": " + (msg[i] || 0) + "\n";
        }
    } else {
        outputArea.value += msg + "\n";
    }
}
function throwError(msg) {
    consoleArea.value += "line " + bz + ": " + msg +"\n";
    console.error(msg);
}
function btnStart() {
    reset();
    run();
}
function btnDebug() {
    reset();
    iterator = debugRun();
    btnNextStep();
}
function btnNextStep() {
    if (iterator) {
        outputArea.value = "";
        iterator.next().value;
    } else {
        btnDebug();
    }
}
function reset() {
    for (let i = 0; i < cells.length; i++) {
        cells[i] = 0;
    }
    acc = 0;
    bz = 0;
    commandsTotal = 0;
    outputArea.value = "";
    consoleArea.value = "";
}
function writeInfo() {
    infoArea.value += "\nAll Commands: \n\n";
    infoArea.value += "dload X -> loads X into the accumulator (acc) \n";
    infoArea.value += "command =X -> use X insted of register X  \n";
    infoArea.value += "load X -> loads register (reg) X to the accumulator \n";
    infoArea.value += "store X -> stores the acc in reg X \n";
    infoArea.value += "\n";

    infoArea.value += "add/sub/mult/div X -> acc = acc (add/sub/mult/div) reg X \n";
    infoArea.value += "\n";

    infoArea.value += "abc: -> defines a new block with \n";
    infoArea.value += "\n";

    infoArea.value += "jump abc -> jumps to the specified block \n";
    infoArea.value += "jeq abc -> jump to abc if acc == 0 \n";
    infoArea.value += "jle abc -> jump to abc if acc <= 0 \n";
    infoArea.value += "jlt abc -> jump to abc if acc < 0 \n";
    infoArea.value += "jge abc -> jump to abc if acc >= 0 \n";
    infoArea.value += "jgt abc -> jump to abc if acc > 0 \n";
    infoArea.value += "jne abc -> jump to abc if acc != 0 \n";
    infoArea.value += "\n";

    infoArea.value += "print X -> print the number of reg X \n";
    infoArea.value += "ptext X -> print ascii of reg X \n";
}

writeInfo()