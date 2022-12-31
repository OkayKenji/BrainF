let memoryArray;
let instructionPointer;
let dataPointer;
let strOutput;
const memorySize = 10;
const cellSize = 127; //in decimal

function output() {
    const input = document.getElementById('input').value;
    // console.log(input);
    const output = bfInrpreter(input);
    document.getElementById('output').value = output;
}

function bfInrpreter(bfString) {
    // To mark the code as read-only
    const bfStringConst = bfString;

    if (!bracketChecker(bfString)) {
        return -1;    
    }

    // Allocates the memory space for the array of 0s
    memoryArray = [];
    memoryArray.length = memorySize;
    memoryArray.fill(0);

    // Intilaize the pointers
    instructionPointer = 0; 
    dataPointer = 0; 

    //Degbug:
    strOutput = "";

    // Start the program
    while (true) {
        // End program when reaching end of the program
        if (instructionPointer >= bfStringConst.length ) {
            console.log("Reached end of program.");
            break;
        }

        // Get next instruction
        let currentInstruction = bfStringConst.charAt(instructionPointer);
        // console.log(`Current instruction: ${currentInstruction}`);

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
            console.log("Ignored as comment.")
        }

        // Step to next instruction
        instructionPointer++;
    }

    printDebug(strOutput);   
    return strOutput; 
}

function boundChecker(newDataPointer) {
    if (newDataPointer >= memorySize || newDataPointer < 0 ) {
        console.log("Warning: Pointer moved outside of memory, ignored.");
        return dataPointer;
    } else {
        return newDataPointer;
    }
}

function flowProtection(newCellValue) {
    if (newCellValue > cellSize || newCellValue < 0 ) {
        console.log("Warning: Instruction would cause overflow/underflow, ignored.");
        return memoryArray[dataPointer];
    } else {
        return newCellValue;
    } 
}

function printHandler(cellValue) {
    if (cellValue < 0 || cellValue > cellSize) {
        console.log("Error: Encounted unexpected memory value");
    } else if (cellValue < 32) {
        strOutput += String.fromCharCode(cellValue);
        //console.log(String.fromCharCode(memoryArray[dataPointer]));
        console.log("Warning: Encounted whitespace ASCII, may cause error.");
    } else {
        strOutput += String.fromCharCode(cellValue);
        // console.log(String.fromCharCode(memoryArray[dataPointer]));
    }
}

//keep going right, if another [  do a i++. then if ], check to make sure i <= 0 else i--j
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

function printDebug(printDebug) {
    console.log(`Final output: ${printDebug}`);
    console.log(`Final Memory:`);
    console.log(memoryArray);
    console.log(`%iP: ${instructionPointer}`);
    console.log(`%dP: ${dataPointer}`);
    console.log(`Tested on ${memorySize} sized memory, ${cellSize} cell size`);
}

function getChar() {
    const input = window.prompt("Enter the characher");
    return input.charCodeAt(0);
}