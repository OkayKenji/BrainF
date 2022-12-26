let memoryArray;
let instructionPointer;
let dataPointer;
let strOutput;
const memorySize = 10;
const cellSize = 127; //in decimal

function output() {
    const input = document.getElementById('input').value;
    console.log(input);
    const output = bfInrpreter(input);
    document.getElementById('output').value = output;
}

function bfInrpreter(bfString) {
    // To mark the code as read-only
    const bfStringConst = bfString;

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
        console.log(`Current instruction: ${currentInstruction}`);

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
            console.log("To be added");
        } else if (currentInstruction == '[') { // Begins loop, if dp points to memory that is 0, jumps to after next ']'
            console.log("Calling, jump");
            let maxJumpSize = jumpHandler(bfStringConst);
            if (maxJumpSize == -1) return -1;
            console.log("Back from, jump");
            instructionPointer += maxJumpSize;
        } else if (currentInstruction == ']') { // Can end loop, if dp points to memory that is non-0 jumps back to previous ']'
            console.log("Error: Encounted unexpected ']'. Forcing ending program.");
            printDebug(strOutput);   
            return strOutput; 
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

function jumpHandler(bfString) {
    const bfStringConst = bfString;

    let jumpSize = 1;
    let maxJumpSize = 1;
    while(true) {
        // console.log(memoryArray);

        let currentInstructionIndex = instructionPointer + jumpSize;
        let currentInstruction = bfStringConst.charAt(currentInstructionIndex);
        // console.log(currentInstruction);

        if (currentInstruction == '>') {
            if (dataPointer + 1 >= memorySize) {
                console.log("Warning: Pointer incremented outside of memory, ignored.");
            } else {
                dataPointer++;
            }
        } else if (currentInstruction == '<') {
            if (dataPointer - 1 < 0) {
                console.log("Warning: Pointer incremented outside of memory, ignored.");
            } else {
                dataPointer--;
            }
        } else if (currentInstruction == '+') {
            if (memoryArray[dataPointer]+1 > cellSize) {
                console.log("Warning: Instruction incremented beyond max size of cell, ignored.");
            } else {
                memoryArray[dataPointer]++;
            }
        } else if (currentInstruction == '-') {
            if (memoryArray[dataPointer]-1 < 0) {
                console.log("Warning: Instruction incremented below 0, ignored.");
            } else {
                memoryArray[dataPointer]--;
            }
        } else if (currentInstruction == '.') {
            if (memoryArray[dataPointer]< 0 || memoryArray[dataPointer] > cellSize) {
                console.log("Error: Encounted unexpected memory value");
            } else if (memoryArray[dataPointer] < 32) {
                console.log("Warning: Encounted whitespace ASCII, ignored.");
            } else {
                strOutput += String.fromCharCode(memoryArray[dataPointer]);
                console.log(String.fromCharCode(memoryArray[dataPointer]));
            }
        } else if (currentInstruction == ',') {
            console.log("To be added");
        } else if (currentInstruction == '[') {
            console.log("Nested loops not supported!");
            return -1;
        } else if (currentInstruction == ']') {
            if (memoryArray[dataPointer] == 0) {
                console.log("Exit")
                break;
            } 
            maxJumpSize = jumpSize;
            jumpSize = 1;
            continue;
        } else {
            // Other then <>+-.,[] all other charcters are ignored.
            console.log("Ignored as comment.")
        }
        jumpSize++;
    }
    return maxJumpSize;
}

function printDebug(printDebug) {
    console.log(`Final output: ${printDebug}`);
    console.log(`Final Memory:`);
    console.log(memoryArray);
    console.log(`%iP: ${instructionPointer}`);
    console.log(`%dP: ${dataPointer}`);
    console.log(`Tested on ${memorySize} sized memory, ${cellSize} cell size`);
}