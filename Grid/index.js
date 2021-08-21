let div = document.getElementById("myTable");
let dom_numRows = document.getElementById('numRows');
let dom_numCols = document.getElementById('numCols');

let tableHtml = '';
let rows = 5;
let cols = 5; // collum
let j = 1;

function ramdom() {
    return Math.floor(Math.random() * 999 + 1);
}

function getInput() {
    rows = parseInt(dom_numRows.value);
    cols = parseInt(dom_numCols.value);
}

function creatIndexHeader() {

}

function myFunction() {
    getInput();
    tableHtml += `<table>`
    // create header;

    for (let r = -1; r < rows; r++) {
        tableHtml += `<tr>`;
        for (let c = -1; c < cols - 1; c++) {
            if (r === -1) {
                if (c === -1) {
                    tableHtml += `
                                <th>
                                    STT
                                </th>
                            `
                } else {
                    tableHtml += `
                                <th>
                                    ${c + 2}
                                </th>
                            `
                }
            } else {
                if (c === -1) {
                    tableHtml += `<td>` + j + `</td>`;
                    j++;
                } else {

                    tableHtml += `<td>` + ramdom() + `</td>`;
                }
            }
        }
        tableHtml += `</tr>`;
    }
    tableHtml += `</table>`
    console.log(tableHtml)
    div.insertAdjacentHTML('afterbegin', `${tableHtml}`);
}