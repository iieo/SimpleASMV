import React, {useState} from 'react';

function ASM (props) {
    const MAX_COMMANDS = 10000, MAX_CELLS = 100; //TODO MAX CELLS
    //TODO commands test for RegEx
    let cmds = [];
    let [state, setState] = useState({
        debugIterator: null,
        cells: [],
        acc: 0,
        bz: 0,
        commandsTotal: 0,
    });
    function executeCommand(args) {
        let cmdName = args[0], value = args[1];    
        switch (cmdName) {
            case "dload":
                setState({acc: value});
                break;
            case "load":
                setState({acc: getValue(value)});
                break;
            case "store":
                let tmpCells = state.cells;
                tmpCells[value] = state.acc;
                setState({cells: tmpCells});
                break;
            case "add":
                setState((prev)=>({acc: prev.acc+getValue(value)}));
                break;
            case "mult":
                setState((prev)=>({acc: prev.acc*getValue(value)}));
                break;
            case "div":
                setState((prev)=>({acc: prev.acc/getValue(value)}));
                break;
            case "sub":
                setState((prev)=>({acc: prev.acc-getValue(value)}));
                break;
            case "jeq":
                if (state.acc === 0) {
                    jump(value);
                }
                break;
            case "jle":
                if (state.acc <= 0) {
                    jump(value);
                }
                break;
            case "jlt":
                if (state.acc < 0) {
                    jump(value);
                }
                break;
            case "jge":
                if (state.acc >= 0) {
                    jump(value);
                }
                break;
            case "jgt":
                if (state.acc > 0) {
                    jump(value);
                }
                break;
            case "jne":
                if (state.acc !== 0) {
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
                break;*/ //TODO print
            default:
                throwError("Could not find command '" + cmdName + "'");
                break;
        }
        setState((prev)=>({acc: Math.floor(prev.acc), bz: prev.bz+1, commandsTotal: prev.commandsTotal+1}))
    }
    
    function jump(blockName) {
        for (let i = 0; i < state.cmds.length; i++) {
            if (state.cmds[i] === blockName + ":") {
                setState({bz: i})
                return;
            }
        }

        throwError("could not find block " + blockName);
    }

    function getCommand(index) {
        let cmd = cmds[index];

        cmd = cmd.trim().toLowerCase();
        while(cmd.indexOf('  ')!==-1) { cmd = cmd.replace('  ',' '); }; // remove more than one space

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
    
    function getValue(arg) {
        let value = -1;
        if (arg.startsWith("=")) {
            arg = arg.replace('=', '');
            value = parseInt(arg)
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
        console.error("line " + state.bz + ": " + msg );
    }
        
    function loadCommands() {
        cmds = []
        let cmdLines = props.code.split('\n');
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

    function run(){
        loadCommands();
        reset();
        for (; state.bz < cmds.length;) {
            if (state.commandsTotal < MAX_COMMANDS) {
                executeCommand(getCommand(state.bz));
            }
        }
    }
    function debug(){ // former btnNextStep
        if (state.debugIterator) {
            state.debugIterator.next();
        } else {
            setState({debugIterator: createDebug()});
        }
    }
    function* createDebug() {
        loadCommands();
        reset();
        for (; state.bz < cmds.length;) {
            if (state.commandsTotal < MAX_COMMANDS) {
                executeCommand(cmds[state.bz]);
            }
            yield null; //hattest Recht, is unnötig iwas zurückzugeben
        }
    }
    
    function reset() {
        setState({bz: 0, commandsTotal: 0, acc: 0, cells: [0,0]});
    }
    return(
        <div className={props.className}>
            {React.Children.map(props.children, child => {
                return React.cloneElement(child, 
                    {   ...child.props, 
                        asmdebugmode: state.debugIterator, 
                        asmrun: run, asmdebug: debug
                    }, null);
            })}
        </div>
    )
}

export default ASM;
