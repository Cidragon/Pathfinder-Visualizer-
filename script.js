
const BACKGROUND_COLOR = 'rgb(250,0,250)'
const START_COLOR = 'rgba(0, 255, 0, 1)'
const END_COLOR = 'rgba(0,0,255,1)'

let columns = 20
let rows = 20
let start_points = [0,0]
let end_points = [0,0]

function create_grid(){
    const container = document.getElementById('grid-container')

    for (let y = 0; y < rows; y++) {
        const row = document.createElement('div');
        row.classList.add('row')
        for( let x = 0; x < columns; x++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            let id = x.toString() + " " + y.toString()
            cell.id = id
            
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
    return ""
}

function generate_start_and_end_points(){
    start_points[0] = Math.floor(Math.random() * columns)
    start_points[1] = Math.floor(Math.random() * rows)

    end_points[0] = Math.floor(Math.random() * columns)
    end_points[1] = Math.floor(Math.random() * rows)

    while (start_points[0] == end_points[0] && start_points[1] == end_points[1]){
        end_points[0] = Math.floor(Math.random() * columns)
        end_points[1] = Math.floor(Math.random() * rows)
    }
}

generate_start_and_end_points()
create_grid()