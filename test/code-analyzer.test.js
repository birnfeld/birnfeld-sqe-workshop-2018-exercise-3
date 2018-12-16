import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import * as esprima from 'esprima';
// import {parseProgram} from '../src/js/code-analyzer';
// import {parsedRow} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(esprima.parseScript('', {loc: false})),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });


    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;', false)),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
});

// describe('The javascript parser', () => {
//     it('test 1: empty program', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('', {loc: true})),[]
//         );
//     });
// });
//
// describe('The javascript parser', () => {
//     it('test 2: test simple if statement', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('if(x % 2 == 0)\n' +
//                 '    x = x + 1;', {loc: true})),buildArrIf()
//         );
//     });
// });
//
// function buildArrIf(){
//     let arr=[];
//     arr.push(new parsedRow('1','IfStatement','','x % 2 == 0',''));
//     arr.push(new parsedRow('2','AssignmentExpression','x','','x + 1'));
//     return arr;
// }
//
// describe('The javascript parser', () => {
//     it('test 3: test simple if-else statement', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('if(x % 2 == 0)\n' +
//                 '    x = x + 1;\n' +
//                 'else\n' +
//                 '    x = x + 2;', {loc: true})),buildArrIfElse()
//         );
//     });
// });
//
// function buildArrIfElse(){
//     let arr=[];
//     arr.push(new parsedRow('1','IfStatement','','x % 2 == 0',''));
//     arr.push(new parsedRow('2','AssignmentExpression','x','','x + 1'));
//     arr.push(new parsedRow('4','AssignmentExpression','x','','x + 2'));
//     return arr;
// }
//
// describe('The javascript parser', () => {
//     it('test 4: test simple if-else-if statement', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('if(x % 2 == 0)\n' +
//                 '    x = x + 1;\n' +
//                 'else if (x %3 == 0)\n' +
//                 '    x = x + 6;', {loc: true})),buildArrIfElseIf()
//         );
//     });
// });
//
// function buildArrIfElseIf(){
//     let arr=[];
//     arr.push(new parsedRow('1','IfStatement','','x % 2 == 0',''));
//     arr.push(new parsedRow('2','AssignmentExpression','x','','x + 1'));
//     arr.push(new parsedRow('3','else if statement','','x % 3 == 0',''));
//     arr.push(new parsedRow('4','AssignmentExpression','x','','x + 6'));
//     return arr;
// }
//
// describe('The javascript parser', () => {
//     it('test 5: test simple if-else-if-else statement', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('if(x < 5)\n' +
//                 '    x = x + 2;\n' +
//                 'else if(x == 5)\n' +
//                 '    x = x + 1;\n' +
//                 'else if(x > 5)\n' +
//                 '    x = x - 1;', {loc: true})),buildArrIfElseIfElse()
//         );
//     });
// });
//
// function buildArrIfElseIfElse(){
//     let arr=[];
//     arr.push(new parsedRow('1','IfStatement','','x < 5',''));
//     arr.push(new parsedRow('2','AssignmentExpression','x','','x + 2'));
//     arr.push(new parsedRow('3','else if statement','','x == 5',''));
//     arr.push(new parsedRow('4','AssignmentExpression','x','','x + 1'));
//     arr.push(new parsedRow('5','else if statement','','x > 5',''));
//     arr.push(new parsedRow('6','AssignmentExpression','x','','x - 1'));
//     return arr;
// }
//
// describe('The javascript parser', () => {
//     it('test 6: test simple while loop', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('while(i < 5){\n' +
//                 '    i = i + 1;\n' +
//                 '}', {loc: true})),buildArrWhile()
//         );
//     });
// });
//
// function buildArrWhile(){
//     let arr=[];
//     arr.push(new parsedRow('1','WhileStatement','','i < 5',''));
//     arr.push(new parsedRow('2','AssignmentExpression','i','','i + 1'));
//     return arr;
// }
//
// describe('The javascript parser', () => {
//     it('test 7: test for loop', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('for(i=0;i<5;i++){\n' +
//                 '    x = x + 1;\n' +
//                 '}', {loc: true})),buildArrFor()
//         );
//     });
// });
//
// function buildArrFor(){
//     let arr=[];
//     arr.push(new parsedRow('1','ForStatement','','i = 0;i < 5;i++',''));
//     arr.push(new parsedRow('2','AssignmentExpression','x','','x + 1'));
//     return arr;
// }
//
// describe('The javascript parser', () => {
//     it('test 8: test factorial function', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('function fact(n){\n' +
//                 '   if (n == 0)\n' +
//                 '       return 1;\n' +
//                 '   else\n' +
//                 '       return n * fact(n - 1);\n' +
//                 '}', {loc: true})),buildArrFact()
//         );
//     });
// });
//
// function buildArrFact(){
//     let arr=[];
//     arr.push(new parsedRow('1','FunctionDeclaration','fact','',''));
//     arr.push(new parsedRow('1','Identifier','n','',''));
//     arr.push(new parsedRow('2','IfStatement','','n == 0',''));
//     arr.push(new parsedRow('3','ReturnStatement','','','1'));
//     arr.push(new parsedRow('5','ReturnStatement','','','n * fact(n - 1)'));
//     return arr;
// }
//
// describe('The javascript parser', () => {
//     it('test 9: binary search', () => {assert.deepEqual(
//         parseProgram(esprima.parseScript('function binarySearch(X, V, n){\n' +
//             '    let low, high, mid;\n' +
//             '    low = 0;\n' +
//             '    high = n - 1;\n' +
//             '    while (low <= high) {\n' +
//             '        mid = (low + high)/2;\n' +
//             '        if (X < V[mid])\n' +
//             '            high = mid - 1;\n' +
//             '        else if (X > V[mid])\n' +
//             '            low = mid + 1;\n' +
//             '        else\n' +
//             '            return mid;\n' +
//             '    }\n' +
//             '    return -1;\n' +
//             '}', {loc: true})),buildArrBinarySearch([]));
//     });
// });
//
// function buildArrBinarySearch(arr){
//     arr.push(new parsedRow('1','FunctionDeclaration','binarySearch','',''));
//     arr.push(new parsedRow('1','Identifier','X','',''));
//     arr.push(new parsedRow('1','Identifier','V','',''));
//     arr.push(new parsedRow('1','Identifier','n','',''));
//     arr.push(new parsedRow('2','VariableDeclarator','low','',''));
//     arr.push(new parsedRow('2','VariableDeclarator','high','',''));
//     arr.push(new parsedRow('2','VariableDeclarator','mid','',''));
//     arr.push(new parsedRow('3','AssignmentExpression','low','','0'));
//     arr.push(new parsedRow('4','AssignmentExpression','high','','n - 1'));
//     arr.push(new parsedRow('5','WhileStatement','','low <= high',''));
//     arr.push(new parsedRow('6','AssignmentExpression','mid','','(low + high) / 2'));
//     arr.push(new parsedRow('7','IfStatement','','X < V[mid]',''));
//     arr.push(new parsedRow('8','AssignmentExpression','high','','mid - 1'));
//     arr.push(new parsedRow('9','else if statement','','X > V[mid]',''));
//     arr.push(new parsedRow('10','AssignmentExpression','low','','mid + 1'));
//     arr.push(new parsedRow('12','ReturnStatement','','','mid'));
//     arr.push(new parsedRow('14','ReturnStatement','','','-1'));
//     return arr;
// }
//
// describe('The javascript parser', () => {
//     it('test 10: gcd', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('function gcd(a, b) {\n' +
//                 '\tif (b == 0) {\n' +
//                 '\t    return a;\n' +
//                 '\t}\n' +
//                 '\treturn gcd(b, a % b);\n' +
//                 '}', {loc: true})),buildArrGcd()
//         );
//     });
// });
//
// function buildArrGcd(){
//     let arr=[];
//     arr.push(new parsedRow('1','FunctionDeclaration','gcd','',''));
//     arr.push(new parsedRow('1','Identifier','a','',''));
//     arr.push(new parsedRow('1','Identifier','b','',''));
//     arr.push(new parsedRow('2','IfStatement','','b == 0',''));
//     arr.push(new parsedRow('3','ReturnStatement','','','a'));
//     arr.push(new parsedRow('5','ReturnStatement','','','gcd(b, a % b)'));
//     return arr;
// }
//
// describe('The javascript parser', () => {
//     it('test 11: ffact (2 functions)', () => {
//         assert.deepEqual(
//             parseProgram(esprima.parseScript('function fact(n){\n' +
//                 '   if (n == 0)\n' +
//                 '       return 1;\n' +
//                 '   else\n' +
//                 '       return n * fact(n - 1);\n' +
//                 '}\n' +
//                 '\n' +
//                 'function ffact(n){\n' +
//                 '    if (fact(n) == 0)\n' +
//                 '       return fact(n);\n' +
//                 '    else\n' +
//                 '       return fact(fact(n));\n' +
//                 '}', {loc: true})),buildArrFFact()
//         );
//     });
// });
//
// function buildArrFFact() {
//     let arr = [];
//     arr.push(new parsedRow('1', 'FunctionDeclaration', 'fact', '', ''));
//     arr.push(new parsedRow('1', 'Identifier', 'n', '', ''));
//     arr.push(new parsedRow('2', 'IfStatement', '', 'n == 0', ''));
//     arr.push(new parsedRow('3', 'ReturnStatement', '', '', '1'));
//     arr.push(new parsedRow('5', 'ReturnStatement', '', '', 'n * fact(n - 1)'));
//     arr.push(new parsedRow('8', 'FunctionDeclaration', 'ffact', '', ''));
//     arr.push(new parsedRow('8', 'Identifier', 'n', '', ''));
//     arr.push(new parsedRow('9', 'IfStatement', '', 'fact(n) == 0', ''));
//     arr.push(new parsedRow('10', 'ReturnStatement', '', '', 'fact(n)'));
//     arr.push(new parsedRow('12', 'ReturnStatement', '', '', 'fact(fact(n))'));
//     return arr;
// }