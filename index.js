import { SudokuSolver } from "./sudokusolver.js"

let selectedrow = null
let selectedcol = null
let sudoku = document.querySelector(".sudoku")
let solvebtn = document.querySelector(".solvebtn")
let resetbtn = document.querySelector(".resetbtn")
let numbermenu = document.querySelector(".number-menu")
let tooltip = document.querySelector(".tooltip");
let puzzle = CreateBoard()
let solver = new SudokuSolver(puzzle)
createNumberButtons()

CreateGrid()

function CreateBoard() {

    let puzzle = []
    for (let i = 0; i < 9; i++) {
        puzzle[i] = []
        for (let j = 0; j < 9; j++) {
            puzzle[i][j] = 0
        }
    }

    return puzzle
}

function CreateGrid() {

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {

            let div = document.createElement("div")
            div.classList.add("cell")
            div.id = i + "_" + j

            if (i === 2 || i === 5) {

                div.classList.add("horizontal-line")
            }

            if (j === 2 || j === 5) {

                div.classList.add("vertical-line")
            }


            div.addEventListener("click", function () {

                tooltip.classList.add('hidden');

                // Verwijder 'active' van alle cellen
                document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("active"));

                let index = div.id.split("_")
                selectedrow = parseInt(index[0])
                selectedcol = parseInt(index[1])
                div.classList.add("active");

                createNumberButtons()

            })

            sudoku.appendChild(div)
        }
    }
}

function createNumberButtons() {

    numbermenu.innerHTML = ""
    solver.getCellPossibilities()

    let possibilities = []

    if (selectedrow !== null && selectedcol !== null) {

        possibilities = solver.sudoku[selectedrow][selectedcol].possibilities

        for (let i = 0; i < 9; i++) {

            let btn = document.createElement("div")

            if (possibilities[i] !== undefined) {

                btn.textContent = possibilities[i]

            } else {

                btn.textContent = ""
            }


            //btn.textContent = possibilities[i]
            btn.classList = "number-menu div"
            btn.addEventListener("click", function () {

                tooltip.classList.add('hidden');

                let clickedcell = document.getElementById(selectedrow + "_" + selectedcol)
                clickedcell.innerHTML = btn.innerHTML
                puzzle[selectedrow][selectedcol] = parseInt(btn.innerHTML)
                solver.sudoku[selectedrow][selectedcol].value = parseInt(btn.innerHTML)

            })

            numbermenu.appendChild(btn)
        }

    } else {

        for (let i = 0; i < 9; i++) {

            let btn = document.createElement("div")
            btn.classList = "number-menu div"
            numbermenu.appendChild(btn)
        }
    }


}

tooltip.addEventListener("click", function () {

    tooltip.classList.add('hidden');

})

solvebtn.addEventListener("click", function () {

    tooltip.classList.add('hidden');

    if(solver.solved)return

    solver.solve()

    if (!solver.solved) {

        alert("er is geen oplossing of deze is nog niet gevonden")
        return
    }

    // Oplossing tonen
    for (let i = 0; i < solver.sudoku.length; i++) {
        for (let j = 0; j < solver.sudoku[i].length; j++) {
            const cell = document.getElementById(i + "_" + j)
            cell.textContent = solver.sudoku[i][j].value
        }
    }

    document.querySelector(".output").innerHTML = solver.output
})

resetbtn.addEventListener("click", function () {

    tooltip.classList.add('hidden');

    numbermenu.innerHTML = ""

    for (let i = 0; i < solver.sudoku.length; i++) {
        for (let j = 0; j < solver.sudoku[i].length; j++) {
            const cell = document.getElementById(i + "_" + j)
            cell.textContent = ""
        }
    }


    puzzle = CreateBoard()
    solver = new SudokuSolver(puzzle)

    document.querySelector(".output").innerHTML = ""
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("active"));

    createNumberButtons()

})
