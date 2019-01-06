import {replaceVars} from './codeSubstitution';
import {symbolicSubstitution} from './codeSubstitution';
import {parseCode} from './code-analyzer';

function colorGraph(codeGraph, varDict){
    let visited = [];
    colorDFS(codeGraph[0], varDict, visited);
}

function colorDFS(graphNode, varDict, visited){
    if(graphNode != null && visited.indexOf(graphNode) < 0){
        visited.push(graphNode);
        graphNode.isColor = true;
        if(graphNode.type !== 'exit')
            nextNode(graphNode, varDict, visited);
    }
    else
        colorDFS(graphNode.false, varDict, visited);
}

function nextNode(graphNode, varDict, visited){
    if(graphNode.normal){
        symbolicSubstitution(parseCode(graphNode.label, true), varDict);
        colorDFS(graphNode.normal, varDict, visited);
    }
    else if(colorCondNode(graphNode, varDict))
        colorDFS(graphNode.true, varDict, visited);
    else
        colorDFS(graphNode.false, varDict, visited);
}

function colorCondNode(graphNode, varDict){
    let nodeLabel = graphNode.label;
    nodeLabel = replaceVars(nodeLabel, varDict);
    if (eval(nodeLabel))
        return true;
    return false;
}

export {colorGraph};