console.log("start");
let cmdArea = document.getElementById("cmdArea"); 
let outputArea = document.getElementById("outputArea"); 
let cells = [];
let acc = 0;
let bz = 0;
let commandsTotal = 0;
const MAX_COMMANDS = 10000
let iterator
let cmds = ["dload 0", "jeq end", "store 1", "end:", "load 1"];

function executeCommand(cmd){
	cmd = cmd.trim().toLowerCase();
	let args = cmd.split(" ")
	if(args.length <= 1){
		if(!cmd[cmd.length-1]===":"){
			console.error("No command passed");
		}
	}else{
		let cmdName = args[0].trim();
		let value = args[1].trim();
		
		switch(cmdName){
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
			default:
				console.error("Could not find command '" + cmdName + "'");
				break;
		}
		acc = Math.floor(acc);
	}
	bz++;
	commandsTotal++;
}
function loadCommands(){
	cmds = []
	let cmdLines = cmdArea.value.split('\n');
	for(let i = 0; i < cmdLines.length; i++){
		if(cmdLines[i]){
			cmds.push(cmdLines[i]);
		}
	}
}
function jump(x) {
	for (let i=0; i<cmds.length;i++) {
		if (cmds[i]===x+":") {
			bz = i;
			return;
		}
	}
	
	console.error("could not find block " + x);
}

function run(){
	loadCommands();
	for(bz = 0; bz < cmds.length;){
		if(commandsTotal < MAX_COMMANDS){
			executeCommand(cmds[bz]);
		}
	}
	log("ACC::"+acc);
	log(cells);
	log("runs::"+commandsTotal)
}

function* debugRun(){
	loadCommands();
	for(bz = 0; bz < cmds.length;){
		if(commandsTotal < MAX_COMMANDS){
			executeCommand(cmds[bz]);
		}
		log("ACC::"+acc);
		log(cells);
		yield acc;
	}
}

function getValue(val){
	let value = -1;
	if(val.startsWith("=")){
		value = val[1];
	}else{
		if(val >= 0){			
			value = cells[val] ? cells[val] : 0;
		}else{
			console.error("specified cell is below 0");			
		}
	}
	return parseInt(value);
}
function log(msg){
	if (Array.isArray(msg)) {
		log("Cells:");
		for (let i = 0; i < msg.length; i++) {
			outputArea.value += "  "+i+": "+(msg[i]||0)+"\n";
		}
	} else {		
		outputArea.value += msg+"\n";
	}
}
function btnStart(){
	reset();
	run();
}
function btnDebug(){
	reset();
	iterator = debugRun();
	btnNextStep();
}
function btnNextStep(){
	if(iterator){
		outputArea.value = "";
		iterator.next().value;
	}else{
		btnDebug();
	}
}
function reset(){
	for(let i  = 0; i < cells.length; i++){
		cells[i] = 0;
	}
	acc = 0;
	bz = 0;
    commandsTotal = 0;
	outputArea.value = "";
}