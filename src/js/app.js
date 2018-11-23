
import $ from 'jquery';
import {parseCode, parseProgram} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        let codeToParse = $('#codePlaceholder').val();
        let syntaxTree = parseCode(codeToParse, true);$('#parsedCode').val(JSON.stringify(syntaxTree, null, 2));

        let myParsedExpressions = [];
        parseProgram(syntaxTree, myParsedExpressions);

        PopulateTable(myParsedExpressions);
    });
});

function ClearTable() {
    let table = document.getElementById('data table');
    table.innerHTML = '';
}

function PopulateTable(myParsedExpressions)
{
    ClearTable();
    myParsedExpressions.forEach(function (myParsedExpression) {
        AddRow(myParsedExpression);
    });
}

function AddRow(myParsedExpression)
{
    let table = document.getElementById('data table');
    // Create an empty <tr> element and add it to the 1st position of the table:
    let row = table.insertRow(-1);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    let cell_0 = row.insertCell(0);
    let cell_1 = row.insertCell(1);
    let cell_2 = row.insertCell(2);
    let cell_3 = row.insertCell(3);
    let cell_4 = row.insertCell(4);

    // Add some text to the new cells:
    cell_0.textContent = myParsedExpression.Line;
    cell_1.textContent = myParsedExpression.Type;
    cell_2.textContent = myParsedExpression.Name;
    cell_3.textContent = myParsedExpression.Condition;
    cell_4.textContent = myParsedExpression.Value;
}

