// import * as escodegen from 'escodegen';
// import {parseCode} from './code-analyzer';

function mapArgs(parsedCode, args){
    let argDict = {};
    if (args === '') return argDict;
    let argArr=args.split(',');
    let j = 0;
    for(let i=0; i<argArr.length; i++, j++) {
        let arg = argArr[i];
        if(argArr[i][0] === '['){
            arg += ',';
            i++;
            while(argArr[i].indexOf(']') < 0){
                arg += argArr[i]+',';
                i++;
            }
            arg += argArr[i];
        }
        argDict[parsedCode['params'][j]['name']] = arg;
    }
    return argDict;
}

export {mapArgs};
//
// function colorCode(parsedCode, args){
//     let redLines=[];
//     let greenLines=[];
//     let argDict = mapArgs(parsedCode, args);
//     let mappedCode=parseCode(escodegen.generate(parsedCode), true);
//     mappedCode['body'].forEach(function (element) {
//         evalExpr(element, redLines, greenLines, argDict);
//     });
//     let lineColors=[];
//     lineColors.push(greenLines);
//     lineColors.push(redLines);
//
//     return lineColors;
// }
//
// export {colorCode};
//
// let evalDictionary = {
//     'BlockStatement': evalBlockStatement,
//     'ExpressionStatement': evalExpression,
//     'FunctionDeclaration': evalFunctionDeclaration,
//     'WhileStatement': evalWhileStatement,
//     'IfStatement': evalIfStatement
// };
//
// function evalExpr(parsedCode, redLines, greenLines, argDict){
//     if(parsedCode['type'] !== 'ReturnStatement' && parsedCode['type'] !== 'VariableDeclaration' && parsedCode['type'] !== 'AssignmentExpression')
//         evalDictionary[parsedCode['type']](parsedCode, redLines, greenLines, argDict);
// }
//
// function evalExpression(parsedCode, redLines, greenLines, argDict){
//     evalExpr(parsedCode['expression'], redLines, greenLines, argDict);
// }
//
// function evalBlockStatement(parsedCode, redLines, greenLines, argDict){
//     parsedCode['body'].forEach(function (element) {
//         evalExpr(element, redLines, greenLines, argDict);
//     });
// }
//
// function evalFunctionDeclaration(parsedCode, redLines, greenLines, argDict){
//     evalExpr(parsedCode['body'], redLines, greenLines, argDict);
// }
//
// function evalWhileStatement(parsedCode, redLines, greenLines, argDict){
//     evalExpr(parsedCode['body'], redLines, greenLines, argDict);
// }
//
// function evalIfStatement(parsedCode, redLines, greenLines, argDict) {
//     let codeString = escodegen.generate(parsedCode['test']);
//     for (let arg in argDict) {
//         codeString = codeString.replace(new RegExp(arg, 'g'), argDict[arg]);
//     }
//     if(eval(codeString))
//         greenLines.push(parsedCode['loc']['start']['line']);
//     else
//         redLines.push(parsedCode['loc']['start']['line']);
//
//     evalExpr(parsedCode['consequent'], redLines, greenLines, argDict);
//     if(parsedCode['alternate'] != null)
//         evalExpr(parsedCode['alternate'], redLines, greenLines, argDict);
// }