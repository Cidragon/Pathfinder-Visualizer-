
const SEPARATOR = ","
const PATH_COLOR = 'rgb(250,0,250)'
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
let grid = []
let selected_pathfinding_algorithm = null

const EMPTY_POINT = 0
const WALL_POINT = 1
const STAR_POINT = 2
const END_POINT = 3
const PATH_POINT = 4

window.addEventListener('mouseup', (event) => {
    if (is_left_hold) {
        mouse_released_in_grid(event);
    }
});

function create_grid(){
    grid = []
    const _columns = document.getElementById("columns").value
    const _rows = document.getElementById("rows").value
    if (_columns >= 1) columns = _columns
    if (_rows >= 1) rows = _rows

    for(let y = 0; y < rows; y++){
        const row = []
        for(let x = 0; x < columns; x++){
            row.push(0)
        }
        grid.push(row)
    }
    console.log(grid)
}

function create_grid_divs(){
    const container = document.getElementById('grid-container')
    container.innerHTML = ""

    for (let y = 0; y < rows; y++) {
        const row = document.createElement('div');
        row.classList.add('row')
        for( let x = 0; x < columns; x++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            let id = x.toString() + SEPARATOR + y.toString()
            cell.id = id
            cell.addEventListener('dragstart', (e) => e.preventDefault()); //prevent drag and drop
            cell.addEventListener('mousedown', mouse_pressed_in_grid)

            if (start_points[0] == x && start_points[1] == y){
                cell.style.backgroundColor = START_COLOR
            }
            else if (end_points[0] == x && end_points[1] == y){
                cell.style.backgroundColor = END_COLOR
            }
            else if (grid[y][x] == PATH_POINT){
                cell.style.backgroundColor = PATH_COLOR
            }
            row.appendChild(cell);
        }
        container.appendChild(row)
    }
}

function button_generate_maze(){
    create_grid()
    generate_start_and_end_points()
    create_grid_divs()
}

//show default application values to the user interface
function show_default_values(){
    const _columns = document.getElementById("columns")
    _columns.value = columns
    const _rows = document.getElementById("rows")
    _rows.value = rows
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

    grid[start_points[1]][start_points[0]] = STAR_POINT
    grid[end_points[1]][end_points[0]] = END_POINT

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

function find_path(){
    set_selected_pathfinding_algorithm()

    switch (selected_pathfinding_algorithm){
        case 'DFS': dfs()
        case 'BFS':
            pass
    }
}

let visited = new Set()

function dfs_clockwise(x, y){
    let point = point_to_string(x,y)
    if(visited.has(point)) return
    if(x == end_points[0] && y == end_points[1]){
        console.log("found end: ", visited)
        return true
    }

    visited.add(point)
    
    //clockwise movement
    if(y > 0 && dfs_clockwise(x,y-1)){
        return true
    }
    if(x < grid[0].length - 1 && dfs_clockwise(x+1,y)){
        return true
    }
    if(y < grid.length - 1 && dfs_clockwise(x,y+1)){
        return true
    }
    if(x > 0 && dfs_clockwise(x-1,y)){
        return true
    }

    return false
}

let directions = [[0,-1],[1,0],[0,1],[-1,0]]

function dfs_direction(x,y, direction = 0){
    let point = point_to_string(x,y)
    if(visited.has(point)) return
    if(x == end_points[0] && y == end_points[1]){
        console.log("found end: ", visited)
        return true
    }

    visited.add(point)

    let searchOrder = [];
    for (let i = 0; i < 4; i++) {
        searchOrder.push((direction + i) % 4);
    }

    // 2. Try directions in the prioritized order
    for (let dirIndex of searchOrder) {
        let [dx, dy] = directions[dirIndex];
        let nextX = x + dx;
        let nextY = y + dy;

        // Boundary check
        if (nextX >= 0 && nextX < grid[0].length && 
            nextY >= 0 && nextY < grid.length) {
            
            // Pass the current dirIndex to the next call to "stick" to it
            if (dfs_direction(nextX, nextY, dirIndex)) {
                return true;
            }
        }
    }


    return false
}

function paint_path(){
    console.log(visited)
    visited.forEach(value => {
        let point = value.split(SEPARATOR)
        let x = parseInt(point[0])
        let y = parseInt(point[1])

        grid[y][x] = PATH_POINT
    })

    visited = new Set()
    create_grid_divs()
    console.log(grid)
}

function point_to_string(x,y){
    return x.toString() + SEPARATOR + y.toString()
}

function set_selected_pathfinding_algorithm(){
    const radios = document.getElementsByName('pathfinder');
    for (const radio of radios) {
        if (radio.checked) {
            selected_pathfinding_algorithm = radio.value;
            break; 
        }
    }

    console.log(selected_pathfinding_algorithm)
}


//generate_start_and_end_points()
button_generate_maze()
show_default_values()

dfs_direction(start_points[0], start_points[1])
paint_path()
