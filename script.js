
const SEPARATOR = ","
const BACKGROUND_COLOR = 'rgb(250,0,250)'
const START_COLOR = 'rgb(0, 255, 0)'
const END_COLOR = 'rgb(0,0,255)'
const WALL_COLOR = 'rgb(0,0,0)'

const LEFT_CLICK = 0
let is_left_hold = false
let is_start_dragged = false
let is_end_dragged = false
let dragged_cell = null

let columns = 20
let rows = 20
let start_points = [0,0]
let end_points = [0,0]
let drag_start_point = [0,0]

function create_grid(_columns = columns, _rows = rows){
    const container = document.getElementById('grid-container')

    for (let y = 0; y < _rows; y++) {
        const row = document.createElement('div');
        row.classList.add('row')
        for( let x = 0; x < _columns; x++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            let id = x.toString() + SEPARATOR + y.toString()
            cell.id = id
            cell.addEventListener('dragstart', (e) => e.preventDefault()); //prevent drag and drop
            cell.addEventListener('mousedown', mouse_pressed_in_grid)

            if (start_points[0] == x && start_points[1] == y){
                cell.style.backgroundColor = START_COLOR
            }

            if (end_points[0] == x && end_points[1] == y){
                cell.style.backgroundColor = END_COLOR
            }
            row.appendChild(cell);
        }
        container.appendChild(row)
    }
}


function generate_start_and_end_points(){
    start_points[0] = Math.floor(Math.random() * columns)
    start_points[1] = Math.floor(Math.random() * rows)

    end_points[0] = Math.floor(Math.random() * columns)
    end_points[1] = Math.floor(Math.random() * rows)

    if(columns == 1 && rows == 1){
        console.log("impossible to create start and end point when grid is 1x1")
        return
    }

    while (start_points[0] == end_points[0] && start_points[1] == end_points[1]){
        end_points[0] = Math.floor(Math.random() * columns)
        end_points[1] = Math.floor(Math.random() * rows)
    }
}

function mouse_pressed_in_grid(event){
    if(event.button == LEFT_CLICK){
        let coordinates = event.target.id.split(SEPARATOR)
        let x = parseInt(coordinates[0])
        let y = parseInt(coordinates[1])
        
        if(start_points[0] == x && start_points[1] == y){
            is_start_dragged = true
            is_end_dragged = false
            dragged_cell = event.target
        }
        else if(end_points[0] == x && end_points[1] == y){
            is_start_dragged = false
            is_end_dragged = true
            dragged_cell = event.target
        }
        is_left_hold = true
        console.log("left click pressed in ", is_start_dragged, is_end_dragged)
    }
}

function mouse_released_in_grid(event){
    if(event.button == LEFT_CLICK){
        let coordinates = event.target.id.split(SEPARATOR)
        let x = parseInt(coordinates[0])
        let y = parseInt(coordinates[1])

        if(event.target.classList != "cell"){
            is_left_hold = false
            dragged_cell = null
            is_start_dragged = false
            is_end_dragged = false
            return console.log("target isn't a cell")
        }

        if(is_start_dragged && dragged_cell){
            is_start_dragged = false
            start_points = [x,y]
            dragged_cell.style.backgroundColor = ''
            event.target.style.backgroundColor = START_COLOR
        }else if(is_end_dragged && dragged_cell){
            end_points = [x,y]
            dragged_cell.style.backgroundColor = ''
            event.target.style.backgroundColor = END_COLOR
        }
        
        is_left_hold = false
        dragged_cell = null
    }
}

window.addEventListener('mouseup', (event) => {
    if (is_left_hold) {
        mouse_released_in_grid(event);
    }
});
generate_start_and_end_points()
create_grid()