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
        // console.log(memoryArray);
        // End program when reaching end of the program
        if (instructionPointer >= bfStringConst.length ) {
            console.log("Reached end of program.");
            break;
        }

        let currentInstruction = bfStringConst.charAt(instructionPointer);
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
                strOutput += String.fromCharCode(memoryArray[dataPointer]);
                //console.log(String.fromCharCode(memoryArray[dataPointer]));
                console.log("Warning: Encounted whitespace ASCII, may cause error.");
            } else {
                strOutput += String.fromCharCode(memoryArray[dataPointer]);
                // console.log(String.fromCharCode(memoryArray[dataPointer]));
            }
        } else if (currentInstruction == ',') {
            console.log("To be added");
        } else if (currentInstruction == '[') {
            console.log("Calling, jump");
            let maxJumpSize = jumpHandler(bfStringConst);
            if (maxJumpSize == -1) return -1;
            console.log("Back from, jump");
            instructionPointer += maxJumpSize;
        } else if (currentInstruction == ']') {
            console.log("Error: Encounted unexpected ']'. Forcing ending program.");
            break;
        } else {
            // Other then <>+-.,[] all other charcters are ignored.
            console.log("Ignored as comment.")
        }

        // Step to next instruction
        instructionPointer++;
    }

    printDebug(strOutput);   
    return strOutput; 
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