import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {replaceVars} from '../src/js/codeSubstitution';
import {symbolicSubstitution} from '../src/js/codeSubstitution';
// import {getGlobalVarsAndFunctionCode} from '../src/js/codeSubstitution';

describe('The Substitution Component', () => {
    it('test 1: replace vars test', () => {
        let codeToParse = 'if (a > b)\n' +
            '    return c;';
        let varDict = {'a': '1', 'b': '2', 'c': '3'};
        assert.deepEqual(
            replaceVars(codeToParse, varDict),
            'if (1 > 2)\n' +
            '    return 3;'
        );
    });
});

describe('The Substitution Component', () => {
    it('test 2: substitute get rid of let statements', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 3;\n' +
            '    return (c + c);\n' +
            '}';
        let resCode = 'function foo(x, y, z) {\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 3;\n' +
            '    return 6;\n' +
            '}';
        assert.deepEqual(
            symbolicSubstitution(parseCode(codeToParse, false), {}),
            parseCode(resCode, false)
        );
    });
});

describe('The Substitution Component', () => {
    it('test 3: substitute split array', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = [1,2,3];\n' +
            '    return a[0] + a[1] + a[2];\n' +
            '}';
        let resCode = 'function foo(x, y, z) {\n' +
            '    let a = [1,2,3];\n' +
            '    return 6;\n' +
            '}';
        assert.deepEqual(
            symbolicSubstitution(parseCode(codeToParse, false), {}),
            parseCode(resCode, false)
        );
    });
});

describe('The Substitution Component', () => {
    it('test 4: substitute array with assignment', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x;\n' +
            '    a = [1,2,3];\n' +
            '    a[0] = 5;\n' +
            '    return x + a[0];\n' +
            '}';
        let resCode = 'function foo(x, y, z) {\n' +
            '    let a = x;\n' +
            '    a = [1,2,3];\n' +
            '    a[0] = 5;\n' +
            '    return x + 5;\n' +
            '}';
        assert.deepEqual(
            symbolicSubstitution(parseCode(codeToParse, false), {}),
            parseCode(resCode, false)
        );
    });
});

describe('The Substitution Component', () => {
    it('test 5: substitute if statement', () => {
        let codeToParse = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' +
            '    let b = y;\n' + '    if (a < z)\n' + '        return a;\n' +
            '    return b;\n' + '}';
        let resCode = 'function foo(x, y, z){\n' +'    let a = x + 1;\n' +
            '    let b = y;\n' + '    if (x + 1 < z)\n' +
            '        return x + 1;\n' +
            '    return y;\n' +
            '}';
        assert.deepEqual(
            symbolicSubstitution(parseCode(codeToParse, false), {}),
            parseCode(resCode, false)
        );
    });
});

describe('The Substitution Component', () => {
    it('test 6: substitute while statement', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = y;\n' +
            '    while (b < z)\n' +
            '        a++;\n' + '        z--;\n' +
            '    return a;\n' + '}';
        let resCode = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = y;\n' +
            '    while (y < z)\n' +
            '        a++;\n' + '        z--;\n' +
            '    return (x + 1) + 1;\n' + '}';
        assert.deepEqual(
            symbolicSubstitution(parseCode(codeToParse, false), {}),
            parseCode(resCode, false)
        );
    });
});

describe('The Substitution Component', () => {
    it('test 7: test example #1', () => {
        let codeToParse = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' +
            '        return x + y + z + c;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' + '    } else {\n' + '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' + '    }\n' + '}';
        let resCode = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' + '    \n' + '    if (x + 1 + y < z) {\n' + '        c = c + 5;\n' +
            '        return x + y + z + 5;\n' + '    } else if (x + 1 + y < z * 2) {\n' + '        c = c + x + 5;\n' +
            '        return x + y + z + (0 + x + 5);\n' + '    } else {\n' + '        c = c + z + 5;\n' +
            '        return x + y + z + (0 + z + 5);\n' + '    }\n' + '}';
        assert.deepEqual(
            symbolicSubstitution(parseCode(codeToParse, false), {}),
            parseCode(resCode, false)
        );
    });
});

describe('The Substitution Component', () => {
    it('test 8: test example #2', () => {
        let codeToParse = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' + '    while (a < z) {\n' + '        c = a + b;\n' +
            '        z = c * 2;\n' + '    }\n' + '    return z;\n' + '}';
        let resCode = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' + '    while (x + 1 < z) {\n' + '        c = a + b;\n' +
            '        z = (x + 1 + (x + 1 + y)) * 2;\n' + '    }\n' + '    return z;\n' + '}';
        assert.deepEqual(
            symbolicSubstitution(parseCode(codeToParse, false), {}),
            parseCode(resCode, false)
        );
    });
});

describe('The Substitution Component', () => {
    it('test 9: binary expr', () => {
        let codeToParse = 'a > 1';
        let resCode = 'a > 1';
        assert.deepEqual(
            symbolicSubstitution(parseCode(codeToParse, false), {}),
            parseCode(resCode, false)
        );
    });
});



// describe('The Substitution Component', () => {
//     it('test 9: test global vars function', () => {
//         let codeToParse = 'let m = 2;\n' +
//             'let n = 5;\n' +
//             'function foo(x, y, z){\n' +
//             '    return m + n;\n' +
//             '}\n' +
//             'let t = 7;';
//         let functionCode = getGlobalVarsAndFunctionCode(parseCode(codeToParse, false));
//         assert.deepEqual(
//             functionCode[1],
//             {'m': '2', 'n': '5', 't': '7'}
//         );
//     });
// });
//
// describe('The Substitution Component', () => {
//     it('test 10: test global vars before function substitute', () => {
//         let codeToParse = 'let m = 2;\n' +
//             'let n = 5;\n' +
//             'function foo(x, y, z){\n' +
//             '    return m + n;\n' +
//             '}';
//         let resCode = 'function foo(x, y, z) {\n' +
//             '    return 7;\n' +
//             '}';
//         let functionCode = getGlobalVarsAndFunctionCode(parseCode(codeToParse, false));
//         assert.deepEqual(
//             symbolicSubstitution(functionCode[0], functionCode[1]),
//             parseCode(resCode, false)['body'][0]
//         );
//     });
// });
//
// describe('The Substitution Component', () => {
//     it('test 11: test global vars after function substitute', () => {
//         let codeToParse = 'function foo(x, y, z){\n' +
//             '    return m + n;\n' +
//             '}\n' +
//             'let m = 2;\n' +
//             'let n = 5;';
//         let resCode = 'function foo(x, y, z) {\n' +
//             '    return 7;\n' +
//             '}';
//         let functionCode = getGlobalVarsAndFunctionCode(parseCode(codeToParse, false));
//         assert.deepEqual(
//             symbolicSubstitution(functionCode[0], functionCode[1]),
//             parseCode(resCode, false)['body'][0]
//         );
//     });
// });
//
// describe('The Substitution Component', () => {
//     it('test 12: test example #1 + global vars', () => {
//         let codeToParse = 'let m = 2;\n' + 'let n = 5;\n' + 'function foo(x, y, z){\n' +
//             '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' +
//             '    if (b < z) {\n' + '        c = c + m;\n' + '        return x + y + z + c;\n' +
//             '    } else if (b < z * 2) {\n' + '        c = t + x + 5;\n' + '        return x + y + z + c;\n' +
//             '    } else {\n' + '        c = c + n + 5;\n' + '        return x + y + z + c;\n' +
//             '    }\n' + '}\n' + 'let t = 7;';
//         let resCode = 'function foo(x, y, z) {\n' + '    if (x + 1 + y < z) {\n' +
//             '        return x + y + z + 2;\n' + '    } else if (x + 1 + y < z * 2) {\n' +
//             '        return x + y + z + (7 + x + 5);\n' + '    } else {\n' +
//             '        return x + y + z + 10;\n' + '    }\n' + '}';
//         let functionCode = getGlobalVarsAndFunctionCode(parseCode(codeToParse, false));
//         assert.deepEqual(
//             symbolicSubstitution(functionCode[0], functionCode[1]),
//             parseCode(resCode, false)['body'][0]
//         );
//     });
// });