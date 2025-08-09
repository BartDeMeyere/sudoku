export class SudokuSolver {

    constructor(puzzle) {

        this.puzzle = puzzle
        this.sudoku = []
        this.stack = []
        this.init()
        this.getCellPossibilities()
        this.solved = false
        this.output = ""
    }

    init() {

        for (let i = 0; i < this.puzzle.length; i++) {
            this.sudoku.push([])
            for (let j = 0; j < this.puzzle[i].length; j++) {
                this.sudoku[i][j] = {

                    row: i,
                    col: j,
                    value: this.puzzle[i][j],
                    possibilities: [],
                    index: 0
                }
            }
        }
    }

    inRow(n, row) {

        for (let c = 0; c < this.sudoku[0].length; c++) {

            if (this.sudoku[row][c].value === n) {

                return true
            }
        }

        return false
    }

    inCol(n, col) {

        for (let r = 0; r < this.sudoku.length; r++) {

            if (this.sudoku[r][col].value === n) {

                return true
            }
        }

        return false
    }

    inSubGrid(n, row, col) {

        let startrow = Math.floor(row / 3) * 3
        let startcol = Math.floor(col / 3) * 3

        for (let i = startrow; i < startrow + 3; i++) {
            for (let j = startcol; j < startcol + 3; j++) {

                if (this.sudoku[i][j].value === n) {

                    return true
                }

            }
        }

        return false
    }

    getCellPossibilities() {

        for (let i = 0; i < this.sudoku.length; i++) {
            for (let j = 0; j < this.sudoku[i].length; j++) {
                if (this.sudoku[i][j].value === 0) {
                    this.sudoku[i][j].possibilities = []
                    for (let n = 1; n <= 9; n++) {
                        if (!this.inRow(n, i) && !this.inCol(n, j) && !this.inSubGrid(n, i, j)) {
                            this.sudoku[i][j].possibilities.push(n)
                        }
                    }

                } else {

                    this.sudoku[i][j].possibilities = []
                }
            }
        }
    }

    sudokuSolved() {

        for (let i = 0; i < this.sudoku.length; i++) {
            for (let j = 0; j < this.sudoku[i].length; j++) {
                if (this.sudoku[i][j].value === 0) {
                    this.solved = false
                    return
                }
            }
        }

        this.solved = true
    }

    autoFillSingleCandidates() {

        for (let i = 0; i < this.sudoku.length; i++) {
            for (let j = 0; j < this.sudoku[i].length; j++) {
                if (this.sudoku[i][j].possibilities.length === 1) {
                    this.sudoku[i][j].value = this.sudoku[i][j].possibilities[0]
                    this.sudoku[i][j].possibilities = []
                }
            }
        }

    }

    findBestEmptySpot() {

        let winnerCell = null

        for (let i = 0; i < this.sudoku.length; i++) {
            for (let j = 0; j < this.sudoku[i].length; j++) {
                if (this.sudoku[i][j].value === 0) {
                    if (!winnerCell ||
                        this.sudoku[i][j].possibilities.length < winnerCell.possibilities.length) {
                        winnerCell = this.sudoku[i][j]
                    }
                }
            }
        }

        return winnerCell
    }


    solve() {

        let steps = 0
        this.getCellPossibilities()
        this.autoFillSingleCandidates()

        do {

            this.sudokuSolved()

            let current = this.findBestEmptySpot()
            if (!current) break;
            let placed = false

            for (let i = current.index; i < current.possibilities.length; i++) {

                let n = current.possibilities[i]

                if (!this.inRow(n, current.row) && !this.inCol(n, current.col) && !this.inSubGrid(n, current.row, current.col)) {

                    current.value = n
                    current.index = i + 1
                    this.stack.push(current)
                    placed = true
                    break;
                }
            }

            if (!placed) {

                if (this.stack.length > 0) {

                    current.value = 0
                    current.index = 0
                    current = this.stack.pop()
                    current.value = 0
                }

            }

            steps++

        } while (!this.solved)

        this.output = "Deze puzzel is opgelost in  " + steps + " stappen"

    }
}