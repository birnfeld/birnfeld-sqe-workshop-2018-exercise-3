import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse, locFlag) => {
    return esprima.parseScript(codeToParse, {loc: locFlag});
};

export {parseCode};

class parsedRow{
    constructor(line, type, name, condition, value){
        this.line=line;
        this.type=type;
        this.name=name;
        this.condition=condition;
        this.value=value;
    }
}

export {parsedRow};

const parseDictionary = {
    'BlockStatement': parseBlockStatement,
    'ExpressionStatement': parseExpression,
    'AssignmentExpression': parseAssignmentExpr,
    'ReturnStatement': parseReturnStatement,
    'FunctionDeclaration': parseFunctionDeclaration,
    'VariableDeclaration': parseVarDeclaration,
    'WhileStatement': parseWhileStatement,
    'ForStatement': parseForStatement,
    'IfStatement': parseIfStatement
};

function parseExpr(parsedCode,rows){
    return parseDictionary[parsedCode['type']](parsedCode,rows);
}

function parseExpression(parsedCode,rows){
    parseExpr(parsedCode['expression'],rows);
}

function parseProgram(parsedCode) {
    let rows=[];
    parsedCode['body'].forEach(function (element) {
        parseExpr(element,rows);
    });
    return rows;
}

export {parseProgram};

function parseBlockStatement(parsedCode,rows){
    parsedCode['body'].forEach(function (element) {
        parseExpr(element,rows);
    });
}

function parseReturnStatement(parsedCode,rows) {
    rows.push(new parsedRow(parsedCode['loc']['start']['line'],parsedCode['type'],'','',escodegen.generate(parsedCode['argument'])));
}

function parseFunctionDeclaration(parsedCode,rows){
    rows.push(new parsedRow(parsedCode['loc']['start']['line'],parsedCode['type'],parsedCode['id']['name'],'',''));
    parsedCode['params'].forEach(function (element) {
        rows.push(new parsedRow(element['loc']['start']['line'],element['type'],element['name'],'',''));
    });
    parseBlockStatement(parsedCode['body'],rows);
}

function parseWhileStatement(parsedCode,rows){
    rows.push(new parsedRow(parsedCode['loc']['start']['line'],parsedCode['type'],'',escodegen.generate(parsedCode['test']),''));
    parseExpr(parsedCode['body'],rows);
}

function parseForStatement(parsedCode,rows){
    rows.push(new parsedRow(parsedCode['loc']['start']['line'],parsedCode['type'],'',escodegen.generate(parsedCode['init'])+';'+escodegen.generate(parsedCode['test'])+';'+escodegen.generate(parsedCode['update']),''));
    parseExpr(parsedCode['body'],rows);
}

function parseIfStatement(parsedCode,rows) {
    rows.push(new parsedRow(parsedCode['loc']['start']['line'], parsedCode['type'], '', escodegen.generate(parsedCode['test']), ''));
    parseExpr(parsedCode['consequent'], rows);
    if (parsedCode['alternate'] != null) {
        if (parsedCode['alternate']['type'] === 'IfStatement')
            return parseElseIfStatement(parsedCode['alternate'], rows);
        parseExpr(parsedCode['alternate'], rows);
    }
}

function parseElseIfStatement(parsedCode,rows){
    rows.push(new parsedRow(parsedCode['loc']['start']['line'],'else if statement','',escodegen.generate(parsedCode['test']),''));
    parseExpr(parsedCode['consequent'],rows);
    if(parsedCode['alternate']!=null){
        if(parsedCode['alternate']['type']==='IfStatement')
            return parseElseIfStatement(parsedCode['alternate'],rows);
        parseExpr(parsedCode['alternate'],rows);
    }
}

function parseVarDeclarator(parsedCode,rows){
    rows.push(new parsedRow(parsedCode['loc']['start']['line'],parsedCode['type'],parsedCode['id']['name'],'',''));
}

function parseVarDeclaration(parsedCode,rows){
    parsedCode['declarations'].forEach(function (element) {
        parseVarDeclarator(element,rows);
    });
}

function parseAssignmentExpr(parsedCode,rows){
    rows.push(new parsedRow(parsedCode['loc']['start']['line'],parsedCode['type'],parsedCode['left']['name'],'',escodegen.generate(parsedCode['right'])));
}