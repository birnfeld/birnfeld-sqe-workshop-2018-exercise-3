import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
// import {symbolicSubstitution} from '../src/js/codeSubstitution';
// import {getGlobalVarsAndFunctionCode} from '../src/js/codeSubstitution';
import {mapArgs} from '../src/js/code-color';

describe('The Color Component', () => {
    it('test 1: mapArgs test', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    return x;\n' +
            '}';
        let inputVector = '1,2,3';
        let varDict = {'x': '1', 'y': '2', 'z': '3'};
        assert.deepEqual(
            mapArgs(parseCode(codeToParse, false)['body'][0], inputVector),
            varDict
        );
    });
});

describe('The Color Component', () => {
    it('test 2: mapArgs with an array', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    return x;\n' +
            '}';
        let inputVector = '1,2,[4,5,6]';
        let varDict = {'x': '1', 'y': '2', 'z': '[4,5,6]'};
        assert.deepEqual(
            mapArgs(parseCode(codeToParse, false)['body'][0], inputVector),
            varDict
        );
    });
});

describe('The Color Component', () => {
    it('test 3: empty mapArgs test', () => {
        let codeToParse = 'function foo(){\n' +
            '    return 1;\n' +
            '}';
        let inputVector = '';
        let varDict = {};
        assert.deepEqual(
            mapArgs(parseCode(codeToParse, false)['body'][0], inputVector),
            varDict
        );
    });
});



//
// describe('The Color Component', () => {
//     it('test 4: good line color simple test', () => {
//         let codeToParse = 'function foo(){\n' +
//             '    if(1 < 2)\n' +
//             '        return 0;\n' +
//             '}';
//         let inputVector = '';
//         let lineColors = colorCode(parseCode(codeToParse, false)['body'][0], inputVector);
//         assert.deepEqual(lineColors[0], [2]);
//         assert.deepEqual(lineColors[1], []);
//     });
// });
//
// describe('The Color Component', () => {
//     it('test 5: bad line color simple test', () => {
//         let codeToParse = 'function foo(){\n' +
//             '    if(1 > 2)\n' +
//             '        return 0;\n' +
//             '}';
//         let inputVector = '';
//         let lineColors = colorCode(parseCode(codeToParse, false)['body'][0], inputVector);
//         assert.deepEqual(lineColors[0], []);
//         assert.deepEqual(lineColors[1], [2]);
//     });
// });
//
// describe('The Color Component', () => {
//     it('test 6: color with input vector', () => {
//         let codeToParse = 'function foo(x, y){\n' +
//             '    if(x < y)\n' +
//             '        return 0;\n' +
//             '}';
//         let inputVector = '1,2';
//         let lineColors = colorCode(parseCode(codeToParse, false)['body'][0], inputVector);
//         assert.deepEqual(lineColors[0], [2]);
//         assert.deepEqual(lineColors[1], []);
//     });
// });
//
// describe('The Color Component', () => {
//     it('test 7: no lines to color', () => {
//         let codeToParse = 'function foo(x, y, z){\n' +
//             '    while (x < z)\n' +
//             '        y = y + 1;\n' +
//             '}';
//         let inputVector = '1,2,3';
//         let lineColors = colorCode(parseCode(codeToParse, false)['body'][0], inputVector);
//         assert.deepEqual(lineColors[0], []);
//         assert.deepEqual(lineColors[1], []);
//     });
// });
//
// describe('The Color Component', () => {
//     it('test 8: multiple ifs - example #1', () => {
//         let codeToParse = 'function foo(x, y, z){\n' +
//             '    if (x + 1 + y < z) {\n' +
//             '        return x + y + z + 5;\n' +
//             '    } else if (x + 1 + y < z * 2) {\n' +
//             '        return x + y + z + x + 5; \n' +
//             '    } else {\n' +
//             '        return x + y + z + z + 5;\n' +
//             '    }\n' +
//             '}';
//         let inputVector = '1,2,3';
//         let lineColors = colorCode(parseCode(codeToParse, false)['body'][0], inputVector);
//         assert.deepEqual(lineColors[0], [4]);
//         assert.deepEqual(lineColors[1], [2]);
//     });
// });
//
// describe('The Color Component', () => {
//     it('test 9: multiple ifs - example #1 with substitution', () => {
//         let codeToParse = 'function foo(x, y, z){\n' +
//             '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' +
//             '    if (b < z) {\n' +
//             '        c = c + 5;\n' +
//             '        return x + y + z + c;\n' +
//             '    } else if (b < z * 2) {\n' +
//             '        c = c + x + 5;\n' +
//             '        return x + y + z + c;\n' +
//             '    } else {\n' +
//             '        c = c + z + 5;\n' +
//             '        return x + y + z + c;\n' + '    }\n' + '}\n';
//         let inputVector = '1,2,3';
//         let lineColors = colorCode(symbolicSubstitution(parseCode(codeToParse, false),{})['body'][0], inputVector);
//         assert.deepEqual(lineColors[0], [4]);
//         assert.deepEqual(lineColors[1], [2]);
//     });
// });
//
// describe('The Color Component', () => {
//     it('test 10: full cycle test', () => {
//         let codeToParse = 'let m = 2;\n' + 'let n = 5;\n' +
//             'function foo(x, y, z){\n' +
//             '    let a = x + m;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    let d = [1,2,x];\n' +
//             '    if (b < z) {\n' +
//             '        c = c + n;\n' + '        return x + y + z + c;\n' +
//             '    } else if (b < z * 2) {\n' +
//             '        c = c + x + t;\n' + '        return x + y + z + c;\n' +
//             '    } else {\n' +
//             '        c = c + z + 5;\n' + '        return x + y + z + c;\n' + '    }\n' +
//             '    if (d[2] < t)\n' +
//             '        return 0;\n' + '}\n' + 'let t = 7;';
//         let inputVector = '1,2,3';
//         let functionCode = getGlobalVarsAndFunctionCode(parseCode(codeToParse, false));
//         let lineColors = colorCode(symbolicSubstitution(functionCode[0],functionCode[1]), inputVector);
//         assert.deepEqual(lineColors[0], [4,9]);
//         assert.deepEqual(lineColors[1], [2]);
//     });
// });