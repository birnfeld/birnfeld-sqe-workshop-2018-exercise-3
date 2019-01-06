import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {createGraph} from '../src/js/code-graph';
import {digraphCode} from '../src/js/code-graph';
import {nodesCode} from '../src/js/code-graph';
import {edgesCode} from '../src/js/code-graph';
import {colorGraph} from '../src/js/graph-color';

describe('The Code-Graph Component', () => {
    it('test 1: createGraph with 1 node', () => {
        let codeToParse = 'function foo(x){\n' +
            '    return x;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(codeGraph[0].label, 'return x;');
        assert.equal(codeGraph[0].normal, undefined);
        assert.equal(codeGraph[0].true, undefined);
        assert.equal(codeGraph[0].false, undefined);
        assert.equal(codeGraph[0].type, 'exit');
    });
});

describe('The Code-Graph Component', () => {
    it('test 2: createGraph with 2 nodes', () => {
        let codeToParse = 'function foo(x){\n' +
            'let a = 1;\n' +
            'return a;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(codeGraph[0].label, 'let a = 1;');
        assert.equal(codeGraph[0].normal.label, 'return a;');
        assert.equal(codeGraph[0].normal.type, 'exit');
    });
});

describe('The Code-Graph Component', () => {
    it('test 3: createGraph with if', () => {
        let codeToParse = 'function foo(x){\n' +
            'let a = 1;\n' +
            'if (a > x){\n' +
            'a = x;\n' +
            '}\n' +
            'return a;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(codeGraph[0].label, 'let a = 1;');
        assert.equal(codeGraph[0].normal.label, 'a > x');
        assert.equal(codeGraph[0].normal.true.label, 'a = x');
        assert.equal(codeGraph[0].normal.true.normal.label, 'return a;');
        assert.equal(codeGraph[0].normal.true.normal.type, 'exit');
        assert.equal(codeGraph[0].normal.true.normal, codeGraph[0].normal.false);
    });
});

describe('The Code-Graph Component', () => {
    it('test 4: createGraph with while', () => {
        let codeToParse = 'function foo(x){\n' +
            'let a = 1;\n' +
            'while (a < x){\n' +
            'a = a + 1;\n' +
            '}\n' +
            'return a;\n' +
            '}';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(codeGraph[0].label, 'let a = 1;');
        assert.equal(codeGraph[0].normal.label, 'a < x');
        assert.equal(codeGraph[0].normal.true.label, 'a = a + 1');
        assert.equal(codeGraph[0].normal.true.normal, codeGraph[0].normal);
        assert.equal(codeGraph[0].normal.false.label, 'return a;');
        assert.equal(codeGraph[0].normal.false.type, 'exit');
    });
});

describe('The Code-Graph Component', () => {
    it('test 5: example #1', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' +
            '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' + '    } else {\n' +
            '        c = c + z + 5;\n' + '    }\n' + '    \n' + '    return c;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(codeGraph[0].label, 'let a = x + 1;\nlet b = a + y;\nlet c = 0;');
        assert.equal(codeGraph[0].normal.label, 'b < z');
        assert.equal(codeGraph[0].normal.true.label, 'c = c + 5');
        assert.equal(codeGraph[0].normal.false.label, 'b < z * 2');
        assert.equal(codeGraph[0].normal.false.true.label, 'c = c + x + 5');
        assert.equal(codeGraph[0].normal.false.false.label, 'c = c + z + 5');
        assert.equal(codeGraph[0].normal.false.false.normal, codeGraph[0].normal.false.true.normal);
        assert.equal(codeGraph[0].normal.false.false.normal, codeGraph[0].normal.true.normal);
        assert.equal(codeGraph[0].normal.false.false.normal.label, 'return c;');
    });
});

describe('The Code-Graph Component', () => {
    it('test 6: example #2', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' + '   let b = a + y;\n' +
            '   let c = 0;\n' + '   \n' + '   while (a < z) {\n' +
            '       c = a + b;\n' + '       z = c * 2;\n' +
            '       a++;\n' + '   }\n' + '   \n' + '   return z;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(codeGraph[0].label, 'let a = x + 1;\nlet b = a + y;\nlet c = 0;');
        assert.equal(codeGraph[0].normal.label, 'a < z');
        assert.equal(codeGraph[0].normal.true.label, 'c = a + b\nz = c * 2\na++');
        assert.equal(codeGraph[0].normal.true.normal, codeGraph[0].normal);
        assert.equal(codeGraph[0].normal.false.label, 'return z;');
    });
});

describe('The Code-Graph Component', () => {
    it('test 7: example #1 disgraph nodes', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' +
            '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' + '    } else {\n' +
            '        c = c + z + 5;\n' + '    }\n' + '    \n' + '    return c;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(nodesCode(codeGraph), 'node_0 [label="1\n' +
            'let a = x + 1;\n' + 'let b = a + y;\n' +
            'let c = 0;" shape=box]\n' + 'node_1 [label="2\n' +
            'b < z" shape=diamond]\n' + 'node_2 [label="3\n' +
            'c = c + 5" shape=box]\n' + 'node_3 [label="4\n' + 'return c;" shape=box]\n' +
            'node_4 [label="5\n' + 'b < z * 2" shape=diamond]\n' +
            'node_5 [label="6\n' + 'c = c + x + 5" shape=box]\n' + 'node_6 [label="7\n' +
            'c = c + z + 5" shape=box]\n');
    });
});

describe('The Code-Graph Component', () => {
    it('test 8: example #1 disgraph edges', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' +
            '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' + '    } else {\n' +
            '        c = c + z + 5;\n' + '    }\n' + '    \n' + '    return c;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(edgesCode(codeGraph), 'node_0 -> node_1\n' +
            'node_1 -> node_2 [label="T"]\n' +
            'node_1 -> node_4 [label="F"]\n' +
            'node_2 -> node_3\n' +
            'node_4 -> node_5 [label="T"]\n' +
            'node_4 -> node_6 [label="F"]\n' +
            'node_5 -> node_3\n' +
            'node_6 -> node_3\n');
    });
});

describe('The Code-Graph Component', () => {
    it('test 9: example #1 disgraph code', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' +
            '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' + '    } else {\n' +
            '        c = c + z + 5;\n' + '    }\n' + '    \n' + '    return c;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(digraphCode(codeGraph), 'digraph {node_0 [label="1\n' +
            'let a = x + 1;\n' + 'let b = a + y;\n' + 'let c = 0;" shape=box]\n' +
            'node_1 [label="2\n' + 'b < z" shape=diamond]\n' + 'node_2 [label="3\n' +
            'c = c + 5" shape=box]\n' + 'node_3 [label="4\n' + 'return c;" shape=box]\n' + 'node_4 [label="5\n' +
            'b < z * 2" shape=diamond]\n' + 'node_5 [label="6\n' + 'c = c + x + 5" shape=box]\n' +
            'node_6 [label="7\n' + 'c = c + z + 5" shape=box]\n' + 'node_0 -> node_1\n' + 'node_1 -> node_2 [label="T"]\n' +
            'node_1 -> node_4 [label="F"]\n' + 'node_2 -> node_3\n' + 'node_4 -> node_5 [label="T"]\n' +
            'node_4 -> node_6 [label="F"]\n' + 'node_5 -> node_3\n' + 'node_6 -> node_3\n' + ' }');
    });
});

describe('The Code-Graph Component', () => {
    it('test 10: example #2 disgraph nodes', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' + '   let b = a + y;\n' +
            '   let c = 0;\n' + '   \n' + '   while (a < z) {\n' +
            '       c = a + b;\n' + '       z = c * 2;\n' +
            '       a++;\n' + '   }\n' + '   \n' + '   return z;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(nodesCode(codeGraph), 'node_0 [label="1\n' +
            'let a = x + 1;\n' + 'let b = a + y;\n' +
            'let c = 0;" shape=box]\n' + 'node_1 [label="2\n' +
            'a < z" shape=diamond]\n' + 'node_2 [label="3\n' +
            'c = a + b\n' + 'z = c * 2\n' + 'a++" shape=box]\n' +
            'node_3 [label="4\n' + 'return z;" shape=box]\n');
    });
});

describe('The Code-Graph Component', () => {
    it('test 11: example #2 disgraph edges', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' + '   let b = a + y;\n' +
            '   let c = 0;\n' + '   \n' + '   while (a < z) {\n' +
            '       c = a + b;\n' + '       z = c * 2;\n' +
            '       a++;\n' + '   }\n' + '   \n' + '   return z;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(edgesCode(codeGraph), 'node_0 -> node_1\n' +
            'node_1 -> node_2 [label="T"]\n' +
            'node_1 -> node_3 [label="F"]\n' +
            'node_2 -> node_1\n');
    });
});

describe('The Code-Graph Component', () => {
    it('test 12: example #2 disgraph code', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' + '   let b = a + y;\n' +
            '   let c = 0;\n' + '   \n' + '   while (a < z) {\n' +
            '       c = a + b;\n' + '       z = c * 2;\n' +
            '       a++;\n' + '   }\n' + '   \n' + '   return z;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        assert.equal(digraphCode(codeGraph), 'digraph {node_0 [label="1\n' +
            'let a = x + 1;\n' + 'let b = a + y;\n' + 'let c = 0;" shape=box]\n' +
            'node_1 [label="2\n' + 'a < z" shape=diamond]\n' + 'node_2 [label="3\n' +
            'c = a + b\n' + 'z = c * 2\n' + 'a++" shape=box]\n' +
            'node_3 [label="4\n' + 'return z;" shape=box]\n' +
            'node_0 -> node_1\n' + 'node_1 -> node_2 [label="T"]\n' +
            'node_1 -> node_3 [label="F"]\n' + 'node_2 -> node_1\n' + ' }');
    });
});

describe('The Code-Graph Component', () => {
    it('test 9: example #1 full process', () => {
        let codeToParse = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '    }\n' + '    \n' + '    return c;\n' + '}\n';
        let codeGraph = createGraph(parseCode(codeToParse, false));
        colorGraph(codeGraph, {'x': '1', 'y': '2', 'z': '3'});
        assert.equal(digraphCode(codeGraph), 'digraph {node_0 [label="1\n' + 'let a = x + 1;\n' +
            'let b = a + y;\n' + 'let c = 0;" shape=box style=filled fillcolor=green]\n' + 'node_1 [label="2\n' + 'b < z" shape=diamond style=filled fillcolor=green]\n' +
            'node_2 [label="3\n' + 'c = c + 5" shape=box]\n' + 'node_3 [label="4\n' + 'return c;" shape=box style=filled fillcolor=green]\n' + 'node_4 [label="5\n' +
            'b < z * 2" shape=diamond style=filled fillcolor=green]\n' + 'node_5 [label="6\n' + 'c = c + x + 5" shape=box style=filled fillcolor=green]\n' + 'node_6 [label="7\n' +
            'c = c + z + 5" shape=box]\n' + 'node_0 -> node_1\n' + 'node_1 -> node_2 [label="T"]\n' + 'node_1 -> node_4 [label="F"]\n' + 'node_2 -> node_3\n' + 'node_4 -> node_5 [label="T"]\n' +
            'node_4 -> node_6 [label="F"]\n' + 'node_5 -> node_3\n' + 'node_6 -> node_3\n' + ' }');
    });
});