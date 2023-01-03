// Global varibles
let memoryArray;
let instructionPointer;
let dataPointer;
let strOutput;
const memorySize = 30000;
const cellSize = 127; //in decimal

// Parent function to call all other functions
function decode() {
    const input = document.getElementById('input').value;
    const output = bfInrpreter(input);
    document.getElementById('output').value = output;
}

function encode() {
    let output1 = document.getElementById('output').value;
    let output = "";
    for (let i = 0 ; i < output1.length ; i++) {
        if (output1.charCodeAt(i) >= 127) {
            output += "";
           // console.log("replacemnet")
        } else {
            output += output1.charAt(i);
        }
    }
    //console.log(output);
    document.getElementById('input').value = output;

    const encodeType = document.getElementById('encoderType').value;
    let input;
    if (encodeType == "compressed") {
        input = compressedEncoder(output);
    } else if (encodeType == "simple") { 
        input = simpleEncoder(output);
    } else if (encodeType == "lazy") { 
        input = lazyEncoder(output);
    } 
    let x = compressedEncoder(output).length;
    let y = simpleEncoder(output).length;
    let z = lazyEncoder(output).length;
    console.log(`${x} ${x/z} ${y} ${y/z} ${z} ${z/z}`);

    document.getElementById('input').value = input;
}
function bfInrpreter(bfString) {
    // To mark the code as read-only
    const bfStringConst = bfString;

    // Parses bf code to check bracket balancing
    if (!bracketChecker(bfString)) {
        return "Unbalanced number of brackets."; 
    }

    // Allocates the memory space for the array of 0s
    memoryArray = [];
    memoryArray.length = memorySize;
    memoryArray.fill(0);

    // Intilaize the pointers
    instructionPointer = 0; 
    dataPointer = 0; 

    //Stores output
    strOutput = "";

    // Start the program
    //let temp = 0;
    while (true) {
        // Ends program when reaching end of the code
        if (instructionPointer >= bfStringConst.length ) {
            console.log("Reached end of program.");
            break;
        }

        // Get next instruction
        let currentInstruction = bfStringConst.charAt(instructionPointer);
        //console.log(`Current instruction ${temp}: ${currentInstruction}`);
        //temp++;
        // Instruction handler
        if (currentInstruction == '>') { // '>' moves dp to the right one memory space
            dataPointer = boundChecker(dataPointer + 1);
        } else if (currentInstruction == '<') {  // '<' moves dp to the left one memory space
            dataPointer = boundChecker(dataPointer - 1);
        } else if (currentInstruction == '+') { // increments memory space pointed by dp by 1
            memoryArray[dataPointer] = flowProtection(memoryArray[dataPointer] + 1);
        } else if (currentInstruction == '-') { // decrements memory space pointed by dp by 1
            memoryArray[dataPointer] = flowProtection(memoryArray[dataPointer] - 1);
        } else if (currentInstruction == '.') { // prints memory space pointed by dp
            printHandler(memoryArray[dataPointer]);
            // return `${bfString} ${memoryArray[dataPointer]}`;
        } else if (currentInstruction == ',') { // Accepts input
            memoryArray[dataPointer] = getChar();
        } else if (currentInstruction == '[') { // Begins loop, if dp points to memory that is 0, jumps to after next ']'
            if (memoryArray[dataPointer] == 0) {
                instructionPointer = bracketMatchingRight(bfString,instructionPointer) + 1; 
                // console.log(instructionPointer);
                continue;
            }
        } else if (currentInstruction == ']') { // Can end loop, if dp points to memory that is non-0 jumps back to previous ']'
            if (memoryArray[dataPointer] != 0) {
                instructionPointer = bracketMatchingLeft(bfString,instructionPointer); 
                // console.log(instructionPointer);
                continue;
            }            
        } else { // Other then <>+-.,[] all other charcters are ignored.
            // console.log("Ignored as comment.")
        }

        // Step to next instruction
        instructionPointer++;
    }

    // printDebug(strOutput); 
    console.log(memoryArray);  
    return strOutput; 
}

// Checking to ensure data pointer is not moved outside array
function boundChecker(newDataPointer) {
    if (newDataPointer >= memorySize || newDataPointer < 0 ) {
        console.log("Warning: Pointer moved outside of memory, ignored.");
        return dataPointer;
    } else {
        return newDataPointer;
    }
}

// Checks to make sure cell size stays between 0 and the max cell size
function flowProtection(newCellValue) {
    if (newCellValue > cellSize || newCellValue < 0 ) {
        console.log("Warning: Instruction would cause overflow/underflow, ignored.");
        return memoryArray[dataPointer];
    } else {
        return newCellValue;
    } 
}

// Prints out the cell by appending the strOutput
function printHandler(cellValue) {
    if (cellValue < 0 || cellValue > cellSize) {
        console.log("Error: Encounted unexpected memory value");
    } else if (cellValue < 32) {
        strOutput += String.fromCharCode(cellValue);
        //console.log(String.fromCharCode(memoryArray[dataPointer]));
        //console.log("Warning: Encounted whitespace ASCII, may cause error.");
    } else {
        strOutput += String.fromCharCode(cellValue);
        // console.log(String.fromCharCode(memoryArray[dataPointer]));
    }
}

// Next two functions could likely have runtimes improved

// Find the matching closing bracket
function bracketMatchingRight(bfString,index) {
    let offset = 0;
    for (let i = index+1; i < bfString.length ; i++) {
        if (bfString[i] == '[') {
            offset++;
        } else if (bfString[i] == ']' && offset > 0) {
            offset--;
        } else if (bfString[i] == ']' && offset == 0) {
            return i;
        }
    }
    return -1;
}

// Find the matching opening bracket
function bracketMatchingLeft(bfString,index) {
    let offset = 0;
    for (let i = index-1; i >= 0 ; i--) {
        if (bfString[i] == ']') {
            offset++;
        } else if (bfString[i] == '[' && offset > 0) {
            offset--;
        } else if (bfString[i] == '[' && offset == 0) {
            return i;
        }
    }
    return -1;
}

// Checks the balancing of brackets
function bracketChecker(bfString) {
    // To mark the code as read-only
    const bfStringConst = bfString;
    let stack = [];

    for (let command of bfStringConst) {
        if (command == '[') {
            stack.push('[');
        } else if (command == ']') {
            if (stack.length == 0) {
                return false;
            } else {
                stack.pop();
            }
        }
    }

    if (stack.length == 0)
        return true;
    else
        return false;
}

// Gets input from usr
function getChar() {
    const input = window.prompt("Enter the characher");
    return input.charCodeAt(0);
}

function printDebug(printDebug) {
    console.log(`Final output: ${printDebug}`);
    console.log(`Final Memory:`);
    console.log(memoryArray);
    console.log(`%iP: ${instructionPointer}`);
    console.log(`%dP: ${dataPointer}`);
    console.log(`Tested on ${memorySize} sized memory, ${cellSize} cell size`);
}

let loopEnums = ["","+","++","+++","++++","+++++","++++++","+++++++","++++++++","+++++++++","++++++++++","+++++++++++","++++++++++++","+++++++++++++","++++++++++++++","+++++++++++++++",">++++[<++++>-]<",">++++[<++++>-]<+",">++++[<++++>-]<++",">+++++[<++++>-]<-",">+++++[<++++>-]<",">+++++[<++++>-]<+",">+++++[<++++>-]<++",">++++[<++++++>-]<-",">++++[<++++++>-]<",">+++++[<+++++>-]<",">+++++[<+++++>-]<+",">+++++[<+++++>-]<++",">+++++[<+++++>-]<+++",">+++++[<++++++>-]<-",">+++++[<++++++>-]<",">+++++[<++++++>-]<+",">++++[<++++++++>-]<",">++++[<++++++++>-]<+",">+++++[<+++++++>-]<-",">+++++[<+++++++>-]<",">++++++[<++++++>-]<",">++++++[<++++++>-]<+",">++++++[<++++++>-]<++",">+++++[<++++++++>-]<-",">+++++[<++++++++>-]<",">++++++[<+++++++>-]<-",">++++++[<+++++++>-]<",">++++++[<+++++++>-]<+",">++++++[<+++++++>-]<++",">+++++[<+++++++++>-]<",">+++++[<+++++++++>-]<+",">+++++++[<+++++++>-]<--",">+++++++[<+++++++>-]<-",">+++++++[<+++++++>-]<",">+++++[<++++++++++>-]<",">+++++++[<+++++++>-]<++",">+++++++[<+++++++>-]<+++",">++++++[<+++++++++>-]<-",">++++++[<+++++++++>-]<",">+++++++[<++++++++>-]<-",">+++++++[<++++++++>-]<",">+++++++[<++++++++>-]<+",">+++++++[<++++++++>-]<++",">++++++[<++++++++++>-]<-",">++++++[<++++++++++>-]<",">++++++[<++++++++++>-]<+",">+++++++[<+++++++++>-]<-",">+++++++[<+++++++++>-]<",">++++++++[<++++++++>-]<",">++++++++[<++++++++>-]<+",">++++++[<+++++++++++>-]<",">++++++[<+++++++++++>-]<+",">+++++++[<++++++++++>-]<--",">+++++++[<++++++++++>-]<-",">+++++++[<++++++++++>-]<",">++++++++[<+++++++++>-]<-",">++++++++[<+++++++++>-]<",">++++++++[<+++++++++>-]<+",">++++++++[<+++++++++>-]<++",">++++++++[<+++++++++>-]<+++",">+++++++[<+++++++++++>-]<-",">+++++++[<+++++++++++>-]<",">+++++++[<+++++++++++>-]<+",">++++++++[<++++++++++>-]<-",">++++++++[<++++++++++>-]<",">+++++++++[<+++++++++>-]<",">+++++++++[<+++++++++>-]<+",">+++++++++[<+++++++++>-]<++",">+++++++[<++++++++++++>-]<",">+++++++[<++++++++++++>-]<+",">++++++++[<+++++++++++>-]<--",">++++++++[<+++++++++++>-]<-",">++++++++[<+++++++++++>-]<",">+++++++++[<++++++++++>-]<-",">+++++++++[<++++++++++>-]<",">+++++++++[<++++++++++>-]<+",">+++++++++[<++++++++++>-]<++",">+++++++++[<++++++++++>-]<+++",">++++++++[<++++++++++++>-]<--",">++++++++[<++++++++++++>-]<-",">++++++++[<++++++++++++>-]<",">++++++++[<++++++++++++>-]<+",">+++++++++[<+++++++++++>-]<-",">+++++++++[<+++++++++++>-]<",">++++++++++[<++++++++++>-]<",">++++++++++[<++++++++++>-]<+",">++++++++++[<++++++++++>-]<++",">++++++++[<+++++++++++++>-]<-",">++++++++[<+++++++++++++>-]<",">++++++++[<+++++++++++++>-]<+",">+++++++++[<++++++++++++>-]<--",">+++++++++[<++++++++++++>-]<-",">+++++++++[<++++++++++++>-]<",">++++++++++[<+++++++++++>-]<-",">++++++++++[<+++++++++++>-]<",">++++++++++[<+++++++++++>-]<+",">++++++++[<++++++++++++++>-]<",">++++++++[<++++++++++++++>-]<+",">++++++++[<++++++++++++++>-]<++",">+++++++++[<+++++++++++++>-]<--",">+++++++++[<+++++++++++++>-]<-",">+++++++++[<+++++++++++++>-]<",">+++++++++[<+++++++++++++>-]<+",">++++++++++[<++++++++++++>-]<-",">++++++++++[<++++++++++++>-]<",">+++++++++++[<+++++++++++>-]<",">+++++++++++[<+++++++++++>-]<+",">+++++++++++[<+++++++++++>-]<++",">+++++++++++[<+++++++++++>-]<+++",">+++++++++[<++++++++++++++>-]<-",">+++++++++[<++++++++++++++>-]<",">+++++++++[<++++++++++++++>-]<+"];
function compressedEncoder(string) {
    let remNum = string.charCodeAt(0);
    let str = "";
    for (let i = 0 ; i < string.length ; i++) {
        //console.log(remNum);
        if (Math.abs(remNum)>=127) {
            console.log(`Error: ${string.charAt(i)} ${string.charCodeAt(i)}`)
        } 
        if (remNum >= 0) {
            str += loopEnums[remNum];
        } else {
           let tempString = loopEnums[Math.abs(remNum)];
           if (Math.abs(remNum)<16) {
            str += tempString.replaceAll("+","-");
           } else {
            str += `${tempString.substring(0,tempString.indexOf('<'))}${tempString.substring(tempString.indexOf('<'),tempString.lastIndexOf('>')).replaceAll("+","-")}>-]<`;
            let lastIncrmenting = `${tempString.substring(tempString.lastIndexOf('<')+1)}`;
            if (lastIncrmenting == '')
                str += '';
            else if (lastIncrmenting.charAt(0) == "+") 
                str += lastIncrmenting.replaceAll("+","-");
            else if (lastIncrmenting.charAt(0) == "-") 
                str += lastIncrmenting.replaceAll("-","+");
           }
        }
        

        str+=`.`;
        remNum = string.charCodeAt(i+1) - string.charCodeAt(i);
        // if (Math.abs(remNum)>127)
        
        //     remNum = 32;
    }
    return str;
}

function simpleEncoder(string) {
    let remNum = string.charCodeAt(0);
    let str = "";
    for (let i = 0 ; i < string.length ; i++) {
        for (let j = 0 ; j < remNum ; j++) {
            str+="+";
        } 
        for (let j = 0 ; j > remNum ; j--) {
            str+="-";
        }

        str+=".";
        remNum = string.charCodeAt(i+1) - string.charCodeAt(i);
    }
    return str;
}

function lazyEncoder(string) {
    let str = "";
    for (let char of string) {
        for (let i = 0 ; i < char.charCodeAt(0) ; i++) {
            str+="+";
        }
        str+=".[-]";
    }
    return str;
}

