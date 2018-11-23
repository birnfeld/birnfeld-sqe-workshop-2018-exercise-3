import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseProgram} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse, true);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let rows=parseProgram(parsedCode);
        enterTableRows(rows);
        return rows;
    });
});

function enterTableRows(arr){
    arr.forEach(function (element) {
        let row=document.getElementById('parsedTable').insertRow();
        row.insertCell().innerHTML = element.line;
        row.insertCell().innerHTML = element.type;
        row.insertCell().innerHTML = element.name;
        row.insertCell().innerHTML = element.condition;
        row.insertCell().innerHTML = element.value;
    });
}