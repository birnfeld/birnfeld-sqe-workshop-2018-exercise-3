import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {mapArgs} from './code-color';
import {createGraph} from './code-graph';
import {digraphCode} from './code-graph';
import {colorGraph} from './graph-color';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse, true);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let inputVector=$('#inputVector').val();
        let codeGraph = createGraph(parsedCode);
        let varDict = {};
        varDict = Object.assign({}, varDict, mapArgs(parsedCode['body'][0], inputVector));
        colorGraph(codeGraph, varDict);
        let codeGraphScript = digraphCode(codeGraph);
        let d3 = require('d3-graphviz');
        d3.graphviz('#graph').renderDot(codeGraphScript);
    });
});

// function generateColoredCode(parsedCode, greenLines, redLines){
//     let codeLines=parsedCode.split('\n');
//     for(var i=0; i<codeLines.length; i++){
//         if(greenLines.includes(i+1)){
//             $('#resCodeWrapper').append('<xmp style=\'background-color: #dff0d8; color: #3c763d; font-size: 16px; font-weight: bold; padding: 10px 0; border: 1px solid #d6e9c6; margin: 0;\'>'+codeLines[i]+'</xmp>');
//         }
//         else if (redLines.includes(i+1)){
//             $('#resCodeWrapper').append('<xmp style=\'background-color: #f2dede; color: #a94442; font-size: 16px; font-weight: bold; padding: 10px 0; border: 1px solid #ebccd1; margin: 0;\'>'+codeLines[i]+'</xmp>');
//         }
//         else{
//             $('#resCodeWrapper').append('<xmp style=\'font-size: 16px; color: #808080; padding: 10px 0; margin: 0;\'>'+codeLines[i]+'</xmp>');
//         }
//     }
// }


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