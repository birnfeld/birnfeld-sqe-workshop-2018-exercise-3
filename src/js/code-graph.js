import * as esgraph from 'esgraph';
import * as escodegen from 'escodegen';

function createGraph(parsedCode){
    let codeGraph = esgraph(parsedCode['body'][0]['body'])[2];
    cleanGraph(codeGraph);
    codeGraph.forEach(function (element) {
        element.label = escodegen.generate(element.astNode);
    });
    mergeNodes(codeGraph);
    return codeGraph;
}

function cleanGraph(codeGraph){
    codeGraph[0].normal.type = 'entry';
    codeGraph[0].normal.prev = [];

    codeGraph.splice(0, 1);
    let exit = null;
    codeGraph[codeGraph.length - 1].prev.forEach(function (element) {
        if(element.astNode.type === 'ReturnStatement')
            exit = element;
    });
    // codeGraph.forEach(function (element) {
    //     if(codeGraph[codeGraph.length - 1] in element.next)
    //         element.next.remove(codeGraph[codeGraph.length - 1]);
    // });
    exit.next = [];
    exit.type = 'exit';
    delete exit.normal;
    codeGraph.splice(codeGraph.length - 1, 1);
}

function mergeNodes(codeGraph){
    let toRemove = [];
    codeGraph.forEach(function (element) {
        let nextElement = element.normal;
        while(element.normal && nextElement.normal){
            if(toRemove.indexOf(nextElement) < 0)
                toRemove.push(nextElement);
            element.label += '\n' + nextElement.label;
            element.next = nextElement.next;
            element.normal = nextElement.normal;
            nextElement = nextElement.normal;
        }
    });
    toRemove.forEach(function (element) {
        codeGraph.splice(codeGraph.indexOf(element),1);
    });
}

function digraphCode(codeGraph){
    let digraphCode = 'digraph {' + nodesCode(codeGraph) + edgesCode(codeGraph) + ' }';
    return digraphCode;
}

function nodesCode(codeGraph){
    let i = 1;
    let res = '';
    codeGraph.forEach(function (element) {
        res += 'node_' + (i-1) + ' [label="' + i + '\n' + element.label + '"';
        let node_shape = 'box';
        if(!(element.normal || element.type === 'exit'))
            node_shape = 'diamond';
        res += ' shape=' + node_shape;
        if(element.isColor)
            res += ' style=filled fillcolor=green';
        res += ']\n';
        i++;
    });
    return res;
}

function edgesCode(codeGraph){
    let edgesCode = '';
    codeGraph.forEach(function (element) {
        if(element.normal){
            edgesCode += 'node_' + codeGraph.indexOf(element) + ' -> ' + 'node_' + codeGraph.indexOf(element.normal) + '\n';
        }
        if(element.true){
            edgesCode += 'node_' + codeGraph.indexOf(element) + ' -> ' + 'node_' + codeGraph.indexOf(element.true) + ' [label="T"]\n';
        }
        if(element.false){
            edgesCode += 'node_' + codeGraph.indexOf(element) + ' -> ' + 'node_' + codeGraph.indexOf(element.false) + ' [label="F"]\n';
        }
    });
    return edgesCode;
}

export {createGraph};
export {digraphCode};
export {nodesCode};
export {edgesCode};
