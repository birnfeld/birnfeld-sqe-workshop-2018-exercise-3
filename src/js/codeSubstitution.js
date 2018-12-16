import * as escodegen from 'escodegen';
import * as esprima from 'esprima';

let symsubDictionary = {
    'BlockStatement': symsubBlockStatement,
    'ExpressionStatement': symsubExpression,
    'AssignmentExpression': symsubAssignmentExpr,
    'ReturnStatement': symsubReturnStatement,
    'FunctionDeclaration': symsubFunctionDeclaration,
    'VariableDeclaration': symsubVarDeclaration,
    'WhileStatement': symsubWhileStatement,
    'IfStatement': symsubIfStatement,
    'Program': symsubProgram
};

function replaceVars(parsedCode, varDictionary){
    for (let variable in varDictionary) {
        while (parsedCode.includes(variable))
            parsedCode = parsedCode.replace(variable, varDictionary[variable]);
    }
    return parsedCode;
}

function symsubExpr(parsedCode, varDictionary){
    symsubDictionary[parsedCode['type']](parsedCode, varDictionary);
}

function symsubExpression(parsedCode, varDictionary){
    symsubExpr(parsedCode['expression'],varDictionary);
}

function getGlobalVarsAndFunctionCode(parsedCode){
    let globalVarsDict = {};
    let toDelete=[];
    let functionCode = parsedCode;
    parsedCode['body'].forEach(function (element) {
        if(element['type'] === 'VariableDeclaration'){
            element['declarations'].forEach(function (varDec) {
                globalVarsDict[varDec['id']['name']] = escodegen.generate(varDec['init']);
            });
            toDelete.push(element);
        }
        else
            functionCode = element;
    });
    return [functionCode, globalVarsDict];
}

function symbolicSubstitution(parsedCode, varDictionary) {
    symsubExpr(parsedCode, varDictionary);
    return parsedCode;
}

function symsubProgram(parsedCode, varDictionary){
    parsedCode['body'].forEach(function (element) {
        symsubExpr(element, varDictionary);
    });
}

export {getGlobalVarsAndFunctionCode};
export {symbolicSubstitution};
export {replaceVars};
export {symsubIfStatement};

function symsubBlockStatement(parsedCode, varDictionary){
    let tempDict = {};
    Object.assign(tempDict, varDictionary);
    let toDelete=[];
    parsedCode['body'].forEach(function (element) {
        symsubExpr(element, varDictionary);
        if(element['type'] === 'VariableDeclaration' || (element['type'] === 'ExpressionStatement' && (escodegen.generate(element['expression']['left']) in varDictionary)))
            toDelete.push(element);
    });
    toDelete.forEach(function (element) {
        parsedCode['body'].splice(element, 1);
    });
    Object.assign(varDictionary, tempDict);
}

function symsubReturnStatement(parsedCode, varDictionary) {
    let returnValue;
    returnValue = replaceVars(escodegen.generate(parsedCode['argument']), varDictionary);
    try {
        returnValue = eval(returnValue);
    } catch (e) {
        e.toString();
    }
    returnValue = esprima.parseScript(returnValue.toString());
    parsedCode['argument'] = returnValue['body'][0]['expression'];
}

function symsubFunctionDeclaration(parsedCode, varDictionary){
    symsubExpr(parsedCode['body'],varDictionary);
}

function symsubWhileStatement(parsedCode, varDictionary){
    parsedCode['test'] = esprima.parseScript(replaceVars(escodegen.generate(parsedCode['test']), varDictionary)).body[0].expression;
    symsubExpr(parsedCode['body'], varDictionary);
}

function symsubIfStatement(parsedCode, varDictionary) {
    parsedCode['test'] = esprima.parseScript(replaceVars(escodegen.generate(parsedCode['test']), varDictionary)).body[0].expression;
    symsubExpr(parsedCode['consequent'], varDictionary);
    if(parsedCode['alternate'] != null)
        symsubExpr(parsedCode['alternate'], varDictionary);
}

function symsubVarDeclarator(parsedCode, varDictionary){
    if(parsedCode['init']['type'] === 'ArrayExpression'){
        for(let i=0; i<parsedCode['init']['elements'].length; i++) {
            varDictionary[parsedCode['id']['name']+'['+i+']']='('+replaceVars(escodegen.generate(parsedCode['init']['elements'][i]), varDictionary)+')';
            tryEvaluate(escodegen.generate(parsedCode['id'])+'['+i+']',varDictionary);
        }
    }
    else {
        varDictionary[parsedCode['id']['name']] = '(' + replaceVars(escodegen.generate(parsedCode['init']), varDictionary) + ')';
        tryEvaluate(escodegen.generate(parsedCode['id']),varDictionary);
    }
}

function symsubVarDeclaration(parsedCode, varDictionary){
    parsedCode['declarations'].forEach(function (element) {
        symsubVarDeclarator(element, varDictionary);
    });
}

function symsubAssignmentExpr(parsedCode, varDictionary){
    if(escodegen.generate(parsedCode['left']) in varDictionary) {
        if(parsedCode['right']['type'] !== 'ArrayExpression') {
            varDictionary[escodegen.generate(parsedCode['left'])] = '(' + replaceVars(escodegen.generate(parsedCode['right']), varDictionary) + ')';
            tryEvaluate(escodegen.generate(parsedCode['left']), varDictionary);
        }
        else{
            delete varDictionary[escodegen.generate(parsedCode['left'])];
            for(let i=0; i<parsedCode['right']['elements'].length; i++) {
                varDictionary[escodegen.generate(parsedCode['left'])+'['+i+']'] = '('+replaceVars(escodegen.generate(parsedCode['right']['elements'][i]), varDictionary)+')';
                tryEvaluate(escodegen.generate(parsedCode['left'])+'['+i+']', varDictionary);
            }
            varDictionary[escodegen.generate(parsedCode['left'])] = '('+replaceVars(escodegen.generate(parsedCode['right']), varDictionary)+')';
        }
    }
    else
        parsedCode['right'] = esprima.parseScript(replaceVars(escodegen.generate(parsedCode['right']), varDictionary)).body[0].expression;
}

function tryEvaluate(dictionaryItem, varDictionary){
    try {
        varDictionary[dictionaryItem] = eval(varDictionary[dictionaryItem]);
    } catch (e) {
        e.toString();
    }
}