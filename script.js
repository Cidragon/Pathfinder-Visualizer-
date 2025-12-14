
const columns = 20
const rows = 20

const cells = [];

function create_grid(){
    const container = document.getElementById('grid-container');
    console.log(container);
    for (let y = 0; y < rows; y++) {
        const row = document.createElement('div');
        row.classList.add('row')
        for( let x = 0; x < columns; x++){
            const cell = document.createElement('div');

            let R = Math.floor(Math.random() * 256)
            let G = Math.floor(Math.random() * 256)
            let B = Math.floor(Math.random() * 256)

            //cell.style.backgroundColor = `rgb(${R},${G},${B})`
            //cell.innerHTML = x.toString() + "," + y.toString()
            //console.log(cell.value)
            cell.classList.add('cell');
            row.appendChild(cell);
            //container.appendChild(cell)
        }
        container.appendChild(row)
    }
    return ""
}

create_grid()