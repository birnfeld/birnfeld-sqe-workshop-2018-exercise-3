import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {createGraph} from '../src/js/code-graph';
import {colorGraph} from '../src/js/graph-color';

describe('The Graph-Color Component', () => {
    it('test 1: color graph with 1 node', () => {
        let codeToParse = 'function foo(x){\n' +
            '    return x;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        let varDict = {'x': '1'};
        colorGraph(codeGraph, varDict);
        assert.ok(codeGraph[0].isColor);
    });
});

describe('The Graph-Color Component', () => {
    it('test 2: color graph with 2 nodes', () => {
        let codeToParse = 'function foo(x){\n' +
            'let a = 1;\n' +
            'return a;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        let varDict = {'x': '1'};
        colorGraph(codeGraph, varDict);
        assert.ok(codeGraph[0].isColor);
        assert.ok(codeGraph[0].normal.isColor);
    });
});

describe('The Code-Graph Component', () => {
    it('test 3: color graph with if (true)', () => {
        let codeToParse = 'function foo(x){\n' +
            'let a = 1;\n' +
            'if (a > x){\n' +
            'a = x;\n' +
            '}\n' +
            'return a;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        let varDict = {'x': '0'};
        colorGraph(codeGraph, varDict);
        assert.ok(codeGraph[0].isColor);
        assert.ok(codeGraph[0].normal.isColor);
        assert.ok(codeGraph[0].normal.true.isColor);
        assert.ok(codeGraph[0].normal.false.isColor);
    });
});

describe('The Code-Graph Component', () => {
    it('test 4: color graph with if (false)', () => {
        let codeToParse = 'function foo(x){\n' +
            'let a = 1;\n' +
            'if (a > x){\n' +
            'a = x;\n' +
            '}\n' +
            'return a;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        let varDict = {'x': '2'};
        colorGraph(codeGraph, varDict);
        assert.ok(codeGraph[0].isColor);
        assert.ok(codeGraph[0].normal.isColor);
        assert.ok(!codeGraph[0].normal.true.isColor);
        assert.ok(codeGraph[0].normal.false.isColor);
    });
});

describe('The Code-Graph Component', () => {
    it('test 5: color graph with if-else', () => {
        let codeToParse = 'function foo(x){\n' +
            'let a = 1;\n' + 'if (a > x){\n' +
            'a = x;\n' + '}\n' + 'else{\n' +
            'a = x + 1;\n' + '}\n' + 'return a;\n' + '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        let varDict = {'x': '0'};
        colorGraph(codeGraph, varDict);
        assert.ok(codeGraph[0].isColor);
        assert.ok(codeGraph[0].normal.isColor);
        assert.ok(codeGraph[0].normal.true.isColor);
        assert.ok(!codeGraph[0].normal.false.isColor);
        assert.ok(codeGraph[0].normal.true.normal.isColor);
    });
});

describe('The Code-Graph Component', () => {
    it('test 6: color graph with while (true)', () => {
        let codeToParse = 'function foo(x){\n' +
            'let a = 1;\n' +
            'while (a < x){\n' +
            'a = a + 1;\n' +
            '}\n' +
            'return a;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        let varDict = {'x': '2'};
        colorGraph(codeGraph, varDict);
        assert.ok(codeGraph[0].isColor);
        assert.ok(codeGraph[0].normal.isColor);
        assert.ok(codeGraph[0].normal.true.isColor);
        assert.ok(codeGraph[0].normal.false.isColor);
    });
});

describe('The Code-Graph Component', () => {
    it('test 7: color graph with while (false)', () => {
        let codeToParse = 'function foo(x){\n' +
            'let a = 1;\n' +
            'while (a < x){\n' +
            'a = a + 1;\n' +
            '}\n' +
            'return a;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        let varDict = {'x': '0'};
        colorGraph(codeGraph, varDict);
        assert.ok(codeGraph[0].isColor);
        assert.ok(codeGraph[0].normal.isColor);
        assert.ok(!codeGraph[0].normal.true.isColor);
        assert.ok(codeGraph[0].normal.false.isColor);
    });
});

describe('The Code-Graph Component', () => {
    it('test 7: color graph example #1', () => {
        let codeToParse = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' +
            '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' +
            '    if (b < z) {\n' + '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' + '    } else {\n' + '        c = c + z + 5;\n' +
            '    }\n' + '    \n' + '    return c;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        let varDict = {'x': '1', 'y': '2', 'z': '3'};
        colorGraph(codeGraph, varDict);
        assert.ok(codeGraph[0].isColor);
        assert.ok(codeGraph[0].normal.isColor);
        assert.ok(!codeGraph[0].normal.true.isColor);
        assert.ok(codeGraph[0].normal.false.isColor);
        assert.ok(codeGraph[0].normal.false.true.isColor);
        assert.ok(!codeGraph[0].normal.false.false.isColor);
        assert.ok(codeGraph[0].normal.true.normal.isColor);
    });
});

describe('The Code-Graph Component', () => {
    it('test 8: color graph example #2', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' + '   let b = a + y;\n' +
            '   let c = 0;\n' + '   \n' + '   while (a < z) {\n' +
            '       c = a + b;\n' + '       z = c * 2;\n' +
            '       a++;\n' + '   }\n' + '   \n' + '   return z;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        let varDict = {'x': '2', 'y': '2', 'z': '3'};
        colorGraph(codeGraph, varDict);
        assert.ok(codeGraph[0].isColor);
        assert.ok(codeGraph[0].normal.isColor);
        assert.ok(!codeGraph[0].normal.true.isColor);
        assert.ok(codeGraph[0].normal.false.isColor);
    });
});