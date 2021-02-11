console.log("start");

let cells = [];
let acc = 0;
let bz = 0;
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
	for(bz = 0; bz < cmds.length;){
		executeCommand(cmds[bz]);
		console.log(bz);
	}
	console.log("ACC::"+acc);
	console.log(cells);
}

function* debugRun(){
	for(bz = 0; bz < cmds.length;){
		executeCommand(cmds[bz]);
		console.log("ACC::"+acc);
		console.log(cells);
		yield acc;
	}
}

function getValue(val){
	let value = -1;
	if(val.startsWith("=")){
		value = val[1];
	}else{
		value = cells[val] ? cells[val] : 0;
	}
	return value;
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
		console.log(iterator.next().value);
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
}