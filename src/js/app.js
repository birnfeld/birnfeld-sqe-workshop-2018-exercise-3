import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getGlobalVarsAndFunctionCode} from './codeSubstitution';
import {symbolicSubstitution} from './codeSubstitution';
import {colorCode} from './code-color';
import * as escodegen from 'escodegen';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse, false);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let functionCode = getGlobalVarsAndFunctionCode(parsedCode);
        let resCode = symbolicSubstitution(functionCode[0], functionCode[1]);
        let inputVector=$('#inputVector').val();
        let lineColors=colorCode(resCode, inputVector);
        let greenLines=lineColors[0];
        let redLines=lineColors[1];
        generateColoredCode(escodegen.generate(resCode),greenLines,redLines);
    });
});

function generateColoredCode(parsedCode, greenLines, redLines){
    let codeLines=parsedCode.split('\n');
    for(var i=0; i<codeLines.length; i++){
        if(greenLines.includes(i+1)){
            $('#resCodeWrapper').append('<xmp style=\'background-color: #dff0d8; color: #3c763d; font-size: 16px; font-weight: bold; padding: 10px 0; border: 1px solid #d6e9c6; margin: 0;\'>'+codeLines[i]+'</xmp>');
        }
        else if (redLines.includes(i+1)){
            $('#resCodeWrapper').append('<xmp style=\'background-color: #f2dede; color: #a94442; font-size: 16px; font-weight: bold; padding: 10px 0; border: 1px solid #ebccd1; margin: 0;\'>'+codeLines[i]+'</xmp>');
        }
        else{
            $('#resCodeWrapper').append('<xmp style=\'font-size: 16px; color: #808080; padding: 10px 0; margin: 0;\'>'+codeLines[i]+'</xmp>');
        }
    }
}



// function enterTableRows(arr){
//     arr.forEach(function (element) {
//         let row=document.getElementById('parsedTable').insertRow();
//         row.insertCell().innerHTML = element.line;
//         row.insertCell().innerHTML = element.type;
//         row.insertCell().innerHTML = element.name;
//         row.insertCell().innerHTML = element.condition;
//         row.insertCell().innerHTML = element.value;
//     });
// }