import assert from 'assert';
import {parseBinaryExpressionDispatcher, parseVariabledeclaration, parseVariableDeclerator,
    parseAssignmentExpression, parseSequenceExpression, parseWhileStatement,
    parseIfOrElseStatementDispatcher, parseIfStatement, parseReturnStatement,
    parseCode, parseProgram, parseFunction, parseGeneral,
    parseBinaryExpression_ExpressionStatement, parseBinaryExpression_Identifier,
    parseBinaryExpression_Literal, parseBinaryExpression_MemberExpression,
    parseBinaryExpression_UnaryExpression, parseExpressionStatement, parseBlockStatement,
    parseForStatement,
    myParsedExpression} from '../src/js/code-analyzer';

describe('Unit Testing - parseBinaryExpressionDispatcher', () => {
    //Calculations
    it('Literal - \'1\'', () => {testParseBinaryExpression('{"type":"ExpressionStatement","expression":{"type":"Literal","value":1,"raw":"1"}}','1');});
    it('Literal - \'-1\'', () => {testParseBinaryExpression('{"type":"ExpressionStatement","expression":{"type":"Literal","value":1,"raw":"1"}}','1');});
    it('MemberExpression - \'v[2]\'', () => {testParseBinaryExpression('{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"v","loc":{"start":{"line":9,"column":17},"end":{"line":9,"column":18}}},"property":{"type":"Literal","value":2,"raw":"1","loc":{"start":{"line":9,"column":19},"end":{"line":9,"column":20}}},"loc":{"start":{"line":9,"column":17},"end":{"line":9,"column":21}}}','v[2]');});
    it('BinaryExpression between Literals - \'1+2\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"+","left":{"type":"Literal","value":1,"raw":"1"},"right":{"type":"Literal","value":2,"raw":"2"}}','1+2');});
    it('BinaryExpression between MemberExpressions - \'array1[2]+array2[2]\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"+","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array1"},"property":{"type":"Literal","value":2,"raw":"2"}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array2"},"property":{"type":"Literal","value":2,"raw":"2"}}}','array1[2]+array2[2]');});
    it('BinaryExpression between MemberExpression and literal - \'array1[2]+5\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"+","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array1"},"property":{"type":"Literal","value":2,"raw":"2"}},"right":{"type":"Literal","value":5,"raw":"5"}}','array1[2]+5');});
    it('BinaryExpression between Identifiers - \'n+m\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"n"},"right":{"type":"Identifier","name":"m"}}','n+m');});
    it('Nested BinaryExpression between Identifiers - \'n+m+x\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"n"},"right":{"type":"Identifier","name":"m"}},"right":{"type":"Identifier","name":"x"}}','n+m+x');});
    it('Nested BinaryExpression between Identifiers - \'v[2]+a[0]+arr[3]\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"v"},"property":{"type":"Literal","value":2,"raw":"2"}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"a"},"property":{"type":"Literal","value":0,"raw":"0"}}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"arr"},"property":{"type":"Literal","value":3,"raw":"3"}}}','v[2]+a[0]+arr[3]');});
    it('Nested BinaryExpression between Identifiers - \'1+2-3\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"-","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Literal","value":1,"raw":"1"},"right":{"type":"Literal","value":2,"raw":"2"}},"right":{"type":"Literal","value":3,"raw":"3"}}','1+2-3');});
    let expected12 = [];
    it('- null', () => { let value = [];
        parseBinaryExpressionDispatcher(null, value);  assert.deepEqual(value,expected12);
    });
});

describe('Unit Testing - parseBinaryExpressionDispatcher', () => {
    //Conditions
    it('BinaryExpression between Literals - \'1<2\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1"},"right":{"type":"Literal","value":2,"raw":"2"}}','1<2');});
    it('BinaryExpression between MemberExpressions - \'array1[2]>=array2[2]\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":">=","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array1"},"property":{"type":"Literal","value":2,"raw":"2"}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array2"},"property":{"type":"Literal","value":2,"raw":"2"}}}','array1[2]>=array2[2]');});
    it('BinaryExpression between Identifiers - \'n<m\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"n"},"right":{"type":"Identifier","name":"m"}}','n<m');});
    it('BinaryExpression between MemberExpression and Literal - \'array1[2]==5\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"==","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array1"},"property":{"type":"Literal","value":2,"raw":"2"}},"right":{"type":"Literal","value":5,"raw":"5"}}','array1[2]==5');});
    it('BinaryExpression between Identifiers and Literal - \'n!=2\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"!=","left":{"type":"Identifier","name":"n"},"right":{"type":"Literal","value":2,"raw":"2"}}','n!=2');});
    it('BinaryExpression between MemberExpression and Identifiers - \'v[2]<m\'', () => {testParseBinaryExpression('{"type":"BinaryExpression","operator":"<","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"v"},"property":{"type":"Literal","value":2,"raw":"2"}},"right":{"type":"Identifier","name":"m"}}','v[2]<m');});
});
describe('Unit Testing - parseVariableDeclerator', () => {
    let expected1 = [new myParsedExpression(1,'VariableDeclarator','low',null,null)];
    it('Single un-initialized - \'let low;\'', () => {testDeepEqual(parseVariableDeclerator,'{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":null,"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}',expected1);});
    let expected2 = [new myParsedExpression(1,'VariableDeclarator','low',null,0)];
    it('Single initialized - \'let low=0;\'', () => {testDeepEqual(parseVariableDeclerator,'{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}',expected2);});
    let expected3 = [new myParsedExpression(1,'VariableDeclarator','low',null,-1)];
    it('Single initialized - \'let low=-1;\'', () => {testDeepEqual(parseVariableDeclerator,'{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"prefix":true,"loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":10}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":10}}}',expected3);});
});

describe('Unit Testing - parseVariabledeclarator', () => {
    let expected1 = [new myParsedExpression(1,'VariableDeclarator','low',null,null)];
    it('Single un-initialized - \'let low;\'', () => {testDeepEqual(parseVariabledeclaration, '{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":null,"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":8}}}',expected1);});
    let expected2 = [new myParsedExpression(1,'VariableDeclarator','low',null,0)];
    it('Single initialized - \'let low=0;\'', () => {testDeepEqual(parseVariabledeclaration,'{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}',expected2);});
    let expected3 = [new myParsedExpression(1,'VariableDeclarator','low',null,-1)];
    it('Single initialized - \'let low=-1;\'', () => {testDeepEqual(parseVariabledeclaration,'{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"prefix":true,"loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":10}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":10}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":11}}}',expected3);});
    let expected4 = [new myParsedExpression(1,'VariableDeclarator','low',null,0), new myParsedExpression(1,'VariableDeclarator','high',null,-1)];
    it('Single initialized - \'let low = 0,high= -1;\'', () => {testDeepEqual(parseVariabledeclaration,'{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":11}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":11}}},{"type":"VariableDeclarator","id":{"type":"Identifier","name":"high","loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":16}}},"init":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":20}}},"prefix":true,"loc":{"start":{"line":1,"column":18},"end":{"line":1,"column":20}}},"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":20}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":21}}}',expected4);});
    let expected5 = [];
    it('- null', () => {
        let value = [];
        parseVariableDeclerator(null, value);
        assert.deepEqual(value,expected5);
    });
});


describe('Unit Testing - parseExpressionStatement', () => {
    let expected1 = [];
    it('- null', () => {
        let value = [];
        parseExpressionStatement(null, value);
        assert.deepEqual(value,expected1);
    });
    let expected2 = [new myParsedExpression(2,'AssignmentExpression','igh',null,1)];
    it('real', () => {
        let value = [];
        parseExpressionStatement(JSON.parse('{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"igh","loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":5}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":9}}},"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":11}}}'), value);
        assert.deepEqual(value,expected2);
    });
});

describe('Unit Testing - parseVariabledeclaration', () => {
    let expected1 = [new myParsedExpression(1,'VariableDeclarator','low',null,null)];
    it('Single un-initialized - \'let low;\'', () => {testDeepEqual(parseVariabledeclaration,'{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":null,"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":8}}}',expected1);});
    let expected2 = [new myParsedExpression(1,'VariableDeclarator','low',null,0)];
    it('Single initialized - \'let low=0;\'', () => {testDeepEqual(parseVariabledeclaration,'{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}',expected2);});
    let expected3 = [new myParsedExpression(1,'VariableDeclarator','low',null,-1)];
    it('Single initialized - \'let low=-1;\'', () => {testDeepEqual(parseVariabledeclaration,'{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"prefix":true,"loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":10}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":10}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":11}}}',expected3);});
    let expected4 = [new myParsedExpression(1,'VariableDeclarator','low',null,0), new myParsedExpression(1,'VariableDeclarator','high',null,-1)];
    it('Single initialized - \'let low = 0,high= -1;\'', () => {testDeepEqual(parseVariabledeclaration,'{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}}},"init":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":11}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":11}}},{"type":"VariableDeclarator","id":{"type":"Identifier","name":"high","loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":16}}},"init":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":20}}},"prefix":true,"loc":{"start":{"line":1,"column":18},"end":{"line":1,"column":20}}},"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":20}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":21}}}',expected4);});
    let expected5 = [];
    it('- null', () => {
        let value = [];
        parseVariabledeclaration(null, value);
        assert.deepEqual(value,expected5);
    });
});


describe('Unit Testing - parseAssignmentExpression', () => {
    let expected1 = [new myParsedExpression(1,'AssignmentExpression','low',null,0)];
    it('Single assigned Literals - \'low = 0;\'', () => {testDeepEqual(parseAssignmentExpression,'{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":3}}},"right":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":7}}},"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":7}}}',expected1);});
    let expected2 = [new myParsedExpression(1,'AssignmentExpression','low',null,-1)];
    it('Single assigned Literals - \'low = -1;\'', () => {testDeepEqual(parseAssignmentExpression,'{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":3}}},"right":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":8}}},"prefix":true,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":8}}},"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":8}}}',expected2);});
    let expected4 = [new myParsedExpression(1,'AssignmentExpression','low',null,'array[1]')];
    it('Single assigned member - \'low = array[1];\'', () => {testDeepEqual(parseAssignmentExpression,'{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":3}}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array","loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":11}}},"property":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":13}}},"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":14}}},"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":14}}}',expected4);});
    let expected5 = [];
    it('- null', () => {
        let value = [];
        parseAssignmentExpression(null, value);
        assert.deepEqual(value,expected5);
    });
});

describe('Unit Testing - parseSequenceExpression', () => {
    let expected1 = [new myParsedExpression(1,'AssignmentExpression','low',null,0), new myParsedExpression(1,'AssignmentExpression','high',null,-1)];
    it('Several assigned Literals - \'low = 0, high = -1;\'', () => {testDeepEqual(parseSequenceExpression, '{"type":"SequenceExpression","expressions":[{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":3}}},"right":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":7}}},"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":7}}},{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"high","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":13}}},"right":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":18}}},"prefix":true,"loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":18}}},"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":18}}}],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":18}}}',expected1);});
    let expected2 = [];
    it('- null', () => {
        let value = [];
        parseSequenceExpression(null, value);
        assert.deepEqual(value,expected2);
    });
});

describe('Unit Testing - parseForStatement', () => {
    let expected1 = [new myParsedExpression(2,'ForStatement',null,'1<2',null)];
    it('- \'for (;1<2;) {}\'', () => {testDeepEqual(parseForStatement, '{"type":"ForStatement","init":null,"test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":13}}},"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":13}}},"update":null,"body":{"type":"BlockStatement","body":[],"loc":{"start":{"line":2,"column":15},"end":{"line":2,"column":17}}},"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":17}}}',expected1);});
    let expected2 = [];
    it('- null', () => {
        let value = [];
        parseForStatement(null, value);
        assert.deepEqual(value,expected2);
    });
    let expected3 = [new myParsedExpression(2,'ForStatement',null,'1<2',null), new myParsedExpression(3,'AssignmentExpression','i',null,1)];
    it('- \'for (;1<2;) i=1;\'', () => {testDeepEqual(parseForStatement, '{"type":"ForStatement","init":null,"test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":10}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":12}}},"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":12}}},"update":null,"body":{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"i","loc":{"start":{"line":3,"column":7},"end":{"line":3,"column":8}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":10}}},"loc":{"start":{"line":3,"column":7},"end":{"line":3,"column":10}}},"loc":{"start":{"line":3,"column":7},"end":{"line":3,"column":11}}},"loc":{"start":{"line":2,"column":4},"end":{"line":3,"column":11}}}',expected3);});
    let expected4 = [new myParsedExpression(2,'ForStatement',null,'1<2',null), new myParsedExpression(3,'AssignmentExpression','i',null,1), new myParsedExpression(4,'AssignmentExpression','j',null,2)];
    it('- \'for (;1<2;) i=1;\'', () => {testDeepEqual(parseForStatement, '{"type":"ForStatement","init":null,"test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":10}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":12}}},"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":12}}},"update":null,"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"i","loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":9}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":11}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":11}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":12}}},{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"j","loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":9}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":4,"column":10},"end":{"line":4,"column":11}}},"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":11}}},"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":12}}}],"loc":{"start":{"line":2,"column":15},"end":{"line":5,"column":5}}},"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":5}}}',expected4);});

});

describe('Unit Testing - parseWhileExpression', () => {
    let expected1 = [new myParsedExpression(1,'WhileStatement',null,'1<2',null)];
    it('- \'while (1<2) {}\'', () => {testDeepEqual(parseWhileStatement, '{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":8}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":10}}},"body":{"type":"BlockStatement","body":[],"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":14}}},"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":14}}}',expected1);});
    let expected2 = [new myParsedExpression(1,'WhileStatement',null,'1<2',null), new myParsedExpression(1,'VariableDeclarator','low',null,null)];
    it('- \'while (1<2) {let low;}\'', () => {testDeepEqual(parseWhileStatement, '{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":8}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":10}}},"body":{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":20}}},"init":null,"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":20}}}],"kind":"let","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":21}}}],"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":22}}},"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":22}}}',expected2);});
    let expected3 = [];
    it('- null', () => {
        let value = [];
        parseWhileStatement(null, value);
        assert.deepEqual(value,expected3);
    });
    let expected4 = [new myParsedExpression(1,'WhileStatement',null,'1<2',null)];
    it('- \'while (1<2) let low;\'', () => {testDeepEqual(parseWhileStatement, '{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":8}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":10}}},"body":{"type":"ExpressionStatement","expression":{"type":"Literal","value":true,"raw":"true","loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":5}}},"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":6}}},"loc":{"start":{"line":1,"column":0},"end":{"line":2,"column":6}}}',expected4);});
    let expected5 = [new myParsedExpression(2,'WhileStatement',null,'1<2',null),new myParsedExpression(3,'AssignmentExpression','i',null,1)];
    it('- \'while (1<2) {i=1}}\'', () => {testDeepEqual(parseWhileStatement, '{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":13}}},"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":13}}},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"i","loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":9}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":11}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":11}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":12}}}],"loc":{"start":{"line":2,"column":15},"end":{"line":4,"column":5}}},"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":5}}}',expected5);});
    let expected6 = [new myParsedExpression(2,'WhileStatement',null,'1<2',null),new myParsedExpression(3,'AssignmentExpression','i',null,1),new myParsedExpression(4,'AssignmentExpression','j',null,2)];
    it('- \'while (1<2) {i=1; j=2;}}\'', () => {testDeepEqual(parseWhileStatement, '{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":13}}},"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":13}}},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"i","loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":9}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":11}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":11}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":12}}},{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"j","loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":9}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":4,"column":10},"end":{"line":4,"column":11}}},"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":11}}},"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":12}}}],"loc":{"start":{"line":2,"column":15},"end":{"line":5,"column":5}}},"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":5}}}',expected6);});

});


describe('Unit Testing - parseIfStatement', () => {
    //Calculations
    let expected1 = [new myParsedExpression(2,'IfStatement',null,'1<2',null), new myParsedExpression(3,'VariableDeclarator','low',null,null)];
    it('- \'if (1<2) { let low;}\'', () => {testDeepEqual(parseIfStatement, '{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":11}}},"consequent":{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":12}}},"init":null,"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":12}}}],"kind":"let","loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":13}}}],"loc":{"start":{"line":2,"column":14},"end":{"line":4,"column":5}}},"alternate":null,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":5}}}',expected1);});
});

describe('Unit Testing - parseIfOrElseStatementDispatcher', () => {
    let expected1 = [new myParsedExpression(2,'IfStatement',null,'1<2',null), new myParsedExpression(3,'VariableDeclarator','low',null,null)];
    it('- \'if (1<2) { let low;}\'', () => {testDeepEqual(parseIfOrElseStatementDispatcher, '{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":11}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":11}}},"consequent":{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":12}}},"init":null,"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":12}}}],"kind":"let","loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":13}}}],"loc":{"start":{"line":2,"column":14},"end":{"line":4,"column":5}}},"alternate":null,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":5}}}',expected1);});
    let expected2 = [];
    it('- \'\'', () => {testDeepEqual(parseIfOrElseStatementDispatcher, '{"type":"Hi"}',expected2);});
    let expected3 = [new myParsedExpression(7,'IfStatement',null,'1<2',null), new myParsedExpression(8,'AssignmentExpression','low',null,5)];
    it('- \'\'', () => {testDeepEqual(parseIfOrElseStatementDispatcher,'{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":7,"column":12},"end":{"line":7,"column":13}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":7,"column":14},"end":{"line":7,"column":15}}},"loc":{"start":{"line":7,"column":12},"end":{"line":7,"column":15}}},"consequent":{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low","loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":15}}},"right":{"type":"Literal","value":5,"raw":"5","loc":{"start":{"line":8,"column":18},"end":{"line":8,"column":19}}},"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":19}}},"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":20}}},"alternate":null,"loc":{"start":{"line":7,"column":8},"end":{"line":8,"column":20}}}',expected3);});
});

describe('Unit Testing - parseReturnStatement', () => {
    let expected1 = [new myParsedExpression(2,'ReturnStatement',null,null,'1')];
    it('- \'return 1;\'', () => {testDeepEqual(parseReturnStatement, '{"type":"ReturnStatement","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":7},"end":{"line":2,"column":8}}},"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":9}}}',expected1);});
    let expected2 = [];
    it('- null', () => {
        let value = [];
        parseReturnStatement(null, value);
        assert.deepEqual(value,expected2);
    });
});

describe('Unit Testing - parseGeneral', () => {
    let expected1 = [new myParsedExpression(2,'ReturnStatement',null,null,'1')];
    it('- \'return 1;\'', () => {testDeepEqual(parseGeneral, '{"type":"ReturnStatement","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":7},"end":{"line":2,"column":8}}},"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":9}}}',expected1);});
    let expected2 = [];
    it('- null', () => {
        let value = [];
        parseGeneral(null, value);
        assert.deepEqual(value,expected2);
    });
    let expected3 = [];
    it('- null', () => {
        let value = [];
        parseGeneral('{"type":"wrong"}', value);
        assert.deepEqual(value,expected3);
    });
});

describe('Unit Testing - parseFunction', () => {
    let expected1 = [new myParsedExpression(1,'FunctionDeclaration','f',null,null)];
    it('- \'function f() {}\'', () => {testDeepEqual(parseFunction, '{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"f","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"params":[],"body":{"type":"BlockStatement","body":[],"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":15}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":15}}}',expected1);});
    let expected2 = [new myParsedExpression(1,'FunctionDeclaration','p',null,null), new myParsedExpression(1,'VariableDeclaration','x',null,null), new myParsedExpression(1,'VariableDeclaration','y',null,null)];
    it('- \'function p(x,y) {}\'', () => {testDeepEqual(parseFunction, '{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"p","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":11},"end":{"line":1,"column":12}}},{"type":"Identifier","name":"y","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}}],"body":{"type":"BlockStatement","body":[],"loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":18}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":18}}}',expected2);});
    let expected3 = [];
    it('- null', () => {
        let value = [];
        parseFunction(null, value);
        assert.deepEqual(value,expected3);
    });
    let expected4 = [new myParsedExpression(1,'FunctionDeclaration','f',null,null), new myParsedExpression(2,'VariableDeclarator','low',null,null)];
    it('- \'function f() {let low;}\'', () => {testDeepEqual(parseFunction, '{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"f","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"params":[],"body":{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":8}}},"init":null,"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":8}}}],"kind":"let","loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":9}}}],"loc":{"start":{"line":1,"column":13},"end":{"line":3,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":3,"column":1}}}',expected4);});

});

describe('Unit Testing - parseProgram', () => {
    let expected1 = [new myParsedExpression(1,'FunctionDeclaration','p',null,null)];
    it('- \'function f() {}\'', () => {testDeepEqual(parseProgram,'{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"p","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"params":[],"body":{"type":"BlockStatement","body":[],"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":15}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":15}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":15}}}',expected1);});
    let expected2 = [];
    it('- null', () => {
        let value = [];
        parseProgram(null, value);
        assert.deepEqual(value,expected2);
    });
});

describe('Unit Testing - parseCode', () => {
    let expected1 = [new myParsedExpression(1,'FunctionDeclaration','p',null,null)];
    it('- \'function f() {}\'', () => {testDeepEqual(parseProgram,'{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"p","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":10}}},"params":[],"body":{"type":"BlockStatement","body":[],"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":15}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":15}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":15}}}',expected1);});
});

describe('Unit Testing - parseBinaryExpression_ExpressionStatement', () => {
    let expected1 = '1';
    it('- \'1\'', () => {testParseparseBinaryExpression_ExpressionStatement('{"type":"ExpressionStatement","expression":{"name":"n","value":"1","raw":1}}\n',expected1);});
});

describe('Unit Testing - parseBinaryExpression_Literal', () => {
    let expected1 = '1';
    it('- \'1\'', () => {testParseparseBinaryExpression_Literal('{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1}}}',expected1);});
});

describe('Unit Testing - parseBinaryExpression_UnaryExpression', () => {
    let expected1 = '-1';
    it('- \'-1\'', () => {testParseBinaryExpression_UnaryExpression('{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":1},"end":{"line":1,"column":2}}},"prefix":true,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":2}}}',expected1);});
});

describe('Unit Testing - parseBinaryExpression_Identifier', () => {
    let expected1 = 'n';
    it('- \'n\'', () => {testParseparseBinaryExpression_Identifier('{"type":"Identifier","name":"n","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1}}}',expected1);});
});

describe('Unit Testing - parseBinaryExpression_MemberExpression', () => {
    let expected1 = 'v[1]';
    it('- \'v[1]\'', () => {testParseBinaryExpression_MemberExpression('{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"v","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":1}}},"property":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":2},"end":{"line":1,"column":3}}},"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":4}}}',expected1);});
});

describe('Unit Testing - parseBlockStatement', () => {
    let expected1 = [];
    it('- null', () => {
        let value = [];
        parseBlockStatement(null, value);
        assert.deepEqual(value,expected1);
    });
    let expected2 = [new myParsedExpression(2,'VariableDeclarator','low',null,null)];
    it('{let low;}', () => {
        let value = [];
        parseBlockStatement(JSON.parse('{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":7}}},"init":null,"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":7}}}],"kind":"let","loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":8}}}]}'), value);
        assert.deepEqual(value,expected2);
    });
});

describe('The javascript parser', () => {
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;',false)),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
});

describe('Unit Testing - myParsedExpression', () => {
    let expected1 = new myParsedExpression(1,'FunctionDeclaration','p',null,null);
    it('- \'1\'', () => {assert.deepEqual(new myParsedExpression(1,'FunctionDeclaration','p',null,null),expected1);});
});

function testParseBinaryExpression_MemberExpression(json,expectedMyParsedExpressions) {
    let expression = JSON.parse(json);

    let value = [];
    parseBinaryExpression_MemberExpression(expression, value);

    assert.deepEqual(value.join(''),expectedMyParsedExpressions);
}

function testParseparseBinaryExpression_Identifier(json,expectedMyParsedExpressions) {
    let expression = JSON.parse(json);

    let value = [];
    parseBinaryExpression_Identifier(expression, value);

    assert.deepEqual(value.join(''),expectedMyParsedExpressions);
}

function testParseparseBinaryExpression_Literal(json,expectedMyParsedExpressions) {
    let expression = JSON.parse(json);

    let value = [];
    parseBinaryExpression_Literal(expression, value);

    assert.deepEqual(value.join(''),expectedMyParsedExpressions);
}

function testParseBinaryExpression_UnaryExpression(json,expectedMyParsedExpressions) {
    let expression = JSON.parse(json);

    let value = [];
    parseBinaryExpression_UnaryExpression(expression, value);

    assert.deepEqual(value.join(''),expectedMyParsedExpressions);
}

function testParseparseBinaryExpression_ExpressionStatement(json,expectedMyParsedExpressions) {
    let expression = JSON.parse(json);

    let value = [];
    parseBinaryExpression_ExpressionStatement(expression, value);

    assert.deepEqual(value.join(''),expectedMyParsedExpressions);
}

function testParseBinaryExpression(json,expected) {
    let expression = JSON.parse(json);

    let value = [];
    parseBinaryExpressionDispatcher(expression, value);

    let actual = value.join('');
    assert.equal(actual,expected);
}

function testDeepEqual(func, json,expectedMyParsedExpressions) {
    let expression = JSON.parse(json);

    let value = [];
    func.call(this, expression, value);

    assert.deepEqual(value,expectedMyParsedExpressions);
}