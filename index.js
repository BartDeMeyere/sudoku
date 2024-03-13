let cells = []
let rows = 9
let columns = 9
let cellsize = 40
let clickedcell = undefined
let cellcolor = undefined
let stack = []
let count = 0

$(".grid").css("display" , "grid")
$(".grid").css("grid-template-columns" , "repeat(" + columns + "," + cellsize + "px)")
$(".grid").css("grid-template-rows" , "repeat(" + rows + "," + cellsize + "px)")

$("#clear").prop("disabled" , true)

CreateCells()

function CreateCells(){

    for(var i = 0 ; i < rows ; i++){

        for(var j = 0 ; j < columns ; j++){

            //create new cell object
            cells.push(new Cell(i,j))

            //create dom div elements
            var div = $("<div></div>")
            div.addClass("cell")
            div.attr("id" , i+"_"+j)

            if(i < 3 && j > 2 && j < 6){

                div.css("backgroundColor" , "rgb(203,203,203)")
            }

            if(i > 2 && i < 6 && j < 3){

                div.css("backgroundColor" , "rgb(203,203,203)")
            }


            if(i > 2 && i < 6 && j > 5){

                div.css("backgroundColor" , "rgb(203,203,203)")
            }


            if(i > 5 && j < 6 && j > 2){

                div.css("backgroundColor" , "rgb(203,203,203)")
            }

            div.on("click" , function(){

                $(".cellpossibilities").css("display" , "grid")

                if(clickedcell){

                    if(cellcolor === "rgb(203, 203, 203)"){

                        clickedcell.css("backgroundColor" ,  "rgb(203,203,203)")


                    }else{

                        clickedcell.css("backgroundColor" , "rgb(255,255,255)")
                    }
                    
                }

                clickedcell = $(this)

                cellcolor = clickedcell.css("backgroundColor")

                clickedcell.css("backgroundColor" , "rgba(255,255,0,.4)")


                $(".cellpossibilities").empty()

                var id = clickedcell.attr("id").split("_")
                var r = parseInt(id[0])
                var c = parseInt(id[1])
        
                GetCellpossibilites(r,c)
        
                var pickedcell = GetCell(r,c)

                for(var i = 0 ; i < pickedcell.possibilities.length ; i++){

                    var ndiv = $("<div></div")
                    ndiv.html(pickedcell.possibilities[i])

                    ndiv.on("click" , function(){

                        var id = clickedcell.attr("id").split("_")
                        var r = parseInt(id[0])
                        var c = parseInt(id[1])
                        clickedcell.html($(this).html())
                        GetCell(r,c).value = parseInt($(this).html())

                    })
                    $(".cellpossibilities").append(ndiv)
                }

            })

            $(".grid").append(div)

        }
    }
}

function GetCell(row , column){

    for(var i = 0 ; i < cells.length ; i++){

        if(cells[i].row === row && cells[i].column === column){

            return cells[i]
        }
    }
}

function GetElement(row , column){

    return $("#" + row + "_" + column)
}

function inRow(row , value){

    for(var c = 0 ; c < columns ; c++){

        if(GetCell(row , c).value === value){

            return true
        }
    }

    return false

}

function inColumn(column , value){

    for(var r = 0 ; r < rows ; r++){

        if(GetCell(r , column).value === value){

            return true
        }
    }

    return false
    
}

function inSubgrid(row , column ,  value){

    var startrow = Math.floor(row / 3) * 3
    var startcolumn = Math.floor(column / 3) * 3

    for(var i = startrow ; i < startrow + 3 ; i++){

        for(var j = startcolumn ; j < startcolumn + 3 ; j++){

            if(GetCell(i,j).value === value){

                return true
            }
        }
    }

    return false
}

function GetPossibilities(){

    cells.forEach(cell => {

        cell.possibilities = []
    })

    for(var i = 0 ; i < cells.length ; i++){

        for(var n = 1 ; n <= 9 ; n++){

            if(!inRow(cells[i].row , n) && !inColumn(cells[i].column , n) && !inSubgrid(cells[i].row , cells[i].column , n)){

                cells[i].possibilities.push(n)
            }
        }
    }

}

function GetEmptySpot(){

    for(var i = 0 ; i < cells.length ; i++){

        if(cells[i].value === 0){

            return cells[i]
        }
    }
}

function solve(){

    var currentcell = GetEmptySpot()

    if(!currentcell){

        $("#clear").prop("disabled" , false)

        //sudoku is solved
        console.log("sudoku solved in " + count + " steps")
        return
    }

    for(var i = currentcell.index ; i < currentcell.possibilities.length ; i++){

        var number = currentcell.possibilities[i]

        if(!inRow(currentcell.row , number) && !inColumn(currentcell.column , number) && !inSubgrid(currentcell.row , currentcell.column , number)){

            currentcell.value = number 
            currentcell.index = i + 1
            GetElement(currentcell.row , currentcell.column).html(number)
            stack.push(currentcell)
            break;


        }
    }

    if(currentcell.value === 0){

        if(stack.length > 0){

            currentcell.index = 0
            currentcell = stack.pop()
            currentcell.value = 0
            GetElement(currentcell.row , currentcell.column).html("")
        }
 
    }

    count++

    setTimeout(solve , 5)

}

//event listeners
$("#solve").on("click" , function(){

    $("#clear").prop("disabled" , true)
    $("#solve").prop("disabled" , true)
    $(".cellpossibilities").css("display" , "none")
    GetPossibilities()
    solve()

})

$("#clear").on("click" , function(){

    count = 0

    cells.forEach(cell => {

        cell.value = 0
        cell.possibilities = []
        cell.index = 0

        GetElement(cell.row , cell.column).html("")
    })

    $("#clear").prop("disabled" , true)
    $("#solve").prop("disabled" , false)
    $(".cellpossibilities").css("display" , "none")

})

function GetCellpossibilites(row , column){

    var current = GetCell(row , column)

    current.possibilities = []

    for(var n = 1 ; n <= 9 ; n++){

        if(!inRow(current.row , n) && !inColumn(current.column , n) && !inSubgrid(current.row , current.column , n)){

            current.possibilities.push(n)
        }
    }
}
