import * as esp from 'esprima';

import {Literal, BlockStatement,
    ExpressionStatement, Identifier, IfStatement, ReturnStatement, VariableDeclaration, WhileStatement,
    MemberExpression, BinaryExpression, UnaryExpression, SequenceExpression
    , AssignmentExpression, ForStatement} from './Literals';


class myParsedExpression {
    constructor(Line, Type, Name, Condition, Value) {
        this.Line = Line;
        this.Type = Type;
        this.Name = Name;
        this.Condition = Condition;
        this.Value = Value;
    }
}

const parseCode = (codeToParse, useLocation) => {
    return esp.parseScript(codeToParse, { loc:useLocation });
};


let parsedExpressions = [];

/**
 * @Summary This function populates 'mySyntaxTree' with 'myParsedExpression' objects,
 *           According to the exercise_1's specifications.
 * @Assuming The program contains only a function (According to the exercise_1's specifications)
 * @param parsedProgram a program's code parsed by esprima
 * @param myParsedExpressions
 */
function parseProgram(parsedProgram, myParsedExpressions) {
    if (parsedProgram == null)
        return;

    // Assuming program only contains functions for now.
    parsedProgram.body.forEach(function (func) {
        parseFunction(func,myParsedExpressions);
    });

    //Clear
    while (parsedExpressions.length >0)
        parsedExpressions.pop();

    //Populate
    myParsedExpressions.forEach(function (exp) {
        parsedExpressions.push(new myParsedExpression(
            exp.Line, exp.Type, exp.Name, exp.Condition, exp.Value
        ));
    });
}

function parseFunction(parsedFunction, myParsedExpressions) {
    if (parsedFunction == null)
        return;

    // Append the function
    myParsedExpressions.push(new myParsedExpression(
        parsedFunction.id.loc.start.line, parsedFunction.type, parsedFunction.id.name, null, null));
    // push the parameters
    parsedFunction.params.forEach(function (param) {
        myParsedExpressions.push(new myParsedExpression( param.loc.start.line, VariableDeclaration, param.name, null, null));
    });
    // push the body
    parsedFunction.body.body.forEach(function (exp) {
        parseGeneral(exp,myParsedExpressions);
    });
}

/**
 * @Summary This function parses general expressions (function code)
 * @param exp
 * @param myParsedExpressions
 */
function parseGeneral(exp, myParsedExpressions) {
    if (exp == null )
        return;
    let typeToHandlerMapping = [];
    typeToHandlerMapping[VariableDeclaration] = parseVariabledeclaration;
    typeToHandlerMapping[ExpressionStatement] = parseExpressionStatement;
    typeToHandlerMapping[WhileStatement] = parseWhileStatement;
    typeToHandlerMapping[IfStatement] = parseIfOrElseStatementDispatcher;
    typeToHandlerMapping[ReturnStatement] = parseReturnStatement;
    typeToHandlerMapping[SequenceExpression] = parseSequenceExpression;
    typeToHandlerMapping[AssignmentExpression] = parseAssignmentExpression;
    typeToHandlerMapping[BlockStatement] = parseBlockStatement;
    typeToHandlerMapping[ForStatement] = parseForStatement;

    let func = typeToHandlerMapping [exp.type];
    if (!(func != null )) {
        return;
    }
    func.call(this, exp, myParsedExpressions);
}

function parseSequenceExpression(sequenceExpression, myParsedExpressions) {
    if (sequenceExpression == null )
        return;

    sequenceExpression.expressions.forEach(function (exp) {
        parseGeneral(exp, myParsedExpressions);
    });
}

function parseVariabledeclaration(parsedVariabledeclaration, myParsedExpressions) {
    if (parsedVariabledeclaration == null )
        return;

    // A Variabledeclaration contains numerous VariableDeclerators (e.g "let x,y")
    parsedVariabledeclaration.declarations.forEach(function (declerator) {
        parseVariableDeclerator(declerator, myParsedExpressions);
    });
}


function parseVariableDeclerator(parsedVariableDeclerator, myParsedExpressions) {
    if (parsedVariableDeclerator == null )
        return;

    if (parsedVariableDeclerator.init == null) {
        myParsedExpressions.push(new myParsedExpression(parsedVariableDeclerator.id.loc.start.line, parsedVariableDeclerator.type,
            parsedVariableDeclerator.id.name, null, null));
        return;
    }

    let valueArray = [];
    parseBinaryExpressionDispatcher(parsedVariableDeclerator.init, valueArray);
    let value = valueArray.join('');

    myParsedExpressions.push(new myParsedExpression(parsedVariableDeclerator.id.loc.start.line, parsedVariableDeclerator.type,
        parsedVariableDeclerator.id.name, null, value)
    );
}



function parseExpressionStatement(parsedExpressionStatement, myParsedExpressions) {
    if (parsedExpressionStatement == null )
        return;

    switch (parsedExpressionStatement.expression.type) {
    case 'AssignmentExpression':
        parseAssignmentExpression(parsedExpressionStatement.expression,myParsedExpressions);
        break;
        /*
        currently only support AssignmentExpression
         */
    }
}

function parseAssignmentExpression(parsedAssignmentExpression, myParsedExpressions) {
    if (parsedAssignmentExpression == null )
        return;

    let valueArray = [];
    parseBinaryExpressionDispatcher(parsedAssignmentExpression.right, valueArray);
    let value = valueArray.join('');

    myParsedExpressions.push(new myParsedExpression(
        parsedAssignmentExpression.loc.start.line,
        parsedAssignmentExpression.type,
        parsedAssignmentExpression.left.name,
        null,
        value)
    );
}
function parseBinaryExpression_ExpressionStatement(parsedBinaryExpression, value) {
    value.push(parsedBinaryExpression.expression.value);
}
function parseBinaryExpression_Literal(parsedBinaryExpression, value) {
    value.push(parsedBinaryExpression.value);
}
function parseBinaryExpression_UnaryExpression(parsedBinaryExpression, value) {
    value.push(parsedBinaryExpression.operator);
    value.push(parsedBinaryExpression.argument.value);
}
function parseBinaryExpression_Identifier(parsedBinaryExpression, value) {
    value.push(parsedBinaryExpression.name);
}
function parseBinaryExpression_MemberExpression(parsedBinaryExpression, value) {
    value.push(parsedBinaryExpression.object.name);
    value.push('[');
    parseBinaryExpressionDispatcher(parsedBinaryExpression.property,value);
    value.push(']');
}
// Possible support of arrays
/*
function parseBinaryExpression_ArrayExpression(parsedBinaryExpression, value) {
    value.push('[');
    let elements = [];
    parsedBinaryExpression.elements.forEach(function (element) {
        parseBinaryExpressionDispatcher(element,elements);
        elements.push(',');
    });
    if (elements.length>0)
        elements.pop();
    value.push(elements.join(''));
    value.push(']');
}
*/

/**
 * @Summary the function receives an expression, and returns an array of strings representing it.
 * @param parsedBinaryExpression - The BinaryExpression
 * @param value - The array of strings to contain the result
 */
function parseBinaryExpressionDispatcher(parsedBinaryExpression, value) {
    if (parsedBinaryExpression == null)
        return;

    let typeToHandlerMapping = [];
    typeToHandlerMapping [ExpressionStatement] = parseBinaryExpression_ExpressionStatement; typeToHandlerMapping [Literal] = parseBinaryExpression_Literal;
    typeToHandlerMapping [UnaryExpression] = parseBinaryExpression_UnaryExpression;typeToHandlerMapping [Identifier] = parseBinaryExpression_Identifier;
    typeToHandlerMapping [MemberExpression] = parseBinaryExpression_MemberExpression;

    let func = typeToHandlerMapping [parsedBinaryExpression.type];
    if (func!=null )
        func.call(this, parsedBinaryExpression,value);

    handleBinaryExpression(parsedBinaryExpression, value);

}
function handleBinaryExpression(parsedBinaryExpression, value) {
    if (parsedBinaryExpression.type === BinaryExpression)
    {
        parseBinaryExpressionDispatcher(parsedBinaryExpression.left,value);
        value.push(parsedBinaryExpression.operator,value);
        parseBinaryExpressionDispatcher(parsedBinaryExpression.right,value);
    }
}

function parseWhileStatement(parsedWhileStatement, myParsedExpressions) {
    if (parsedWhileStatement == null )
        return;

    // Parse WhileStatement
    let valueArray = [];
    parseBinaryExpressionDispatcher(parsedWhileStatement.test, valueArray);
    let value = valueArray.join('');

    myParsedExpressions.push(new myParsedExpression(parsedWhileStatement.loc.start.line, parsedWhileStatement.type,
        null, value, null));
    
    // Parse body
    if (parsedWhileStatement.body.type === BlockStatement)
        parsedWhileStatement.body.body.forEach(function (exp) {parseGeneral(exp,myParsedExpressions);});
    else
        parseGeneral(parsedWhileStatement.body,myParsedExpressions);
}

/**
 * Function receives :
 * 1) IfStatement (else-if translates to IfStatement)
 * or
 * 2) ExpressionStatement/BlockStatement representing 'else' statement
 * @param parsedStatement
 * @param myParsedExpressions
 */
function parseIfOrElseStatementDispatcher(parsedStatement, myParsedExpressions) {
    if (parsedStatement == null )
        return;

    let typeToHandlerMapping = [];
    typeToHandlerMapping [IfStatement] = parseIfStatement;
    typeToHandlerMapping [BlockStatement] = parseBlockStatement;

    let func = typeToHandlerMapping [parsedStatement.type];
    if (func!=null)
        func.call(this, parsedStatement,myParsedExpressions);
    else
        parseGeneral(parsedStatement,myParsedExpressions);
}

function parseIfStatement(parsedStatement, myParsedExpressions) {
    let valueArray = []; // Parse Condition
    parseBinaryExpressionDispatcher(parsedStatement.test, valueArray);
    let value = valueArray.join('');
    myParsedExpressions.push(new myParsedExpression(parsedStatement.loc.start.line, parsedStatement.type, null, value, null));
    if (parsedStatement.consequent.type === BlockStatement)  // Parse body
        parsedStatement.consequent.body.forEach(function (exp) {parseGeneral(exp,myParsedExpressions);});
    else
        parseGeneral(parsedStatement.consequent,myParsedExpressions);

    parseIfOrElseStatementDispatcher(parsedStatement.alternate, myParsedExpressions);
}

function parseBlockStatement (parsedStatement, myParsedExpressions) {
    if (parsedStatement == null )
        return;

    parsedStatement.body.forEach(function (exp) {parseGeneral(exp,myParsedExpressions);});
}

function parseReturnStatement(parsedReturnStatement, myParsedExpressions) {
    if (parsedReturnStatement == null )
        return;

    // Parse WhileStatement
    let valueArray = [];
    parseBinaryExpressionDispatcher(parsedReturnStatement.argument, valueArray);
    let value = valueArray.join('');

    myParsedExpressions.push(new myParsedExpression(
        parsedReturnStatement.loc.start.line,
        parsedReturnStatement.type,
        null,
        null,
        value)
    );
}
function parseForStatement(parsedForStatement, myParsedExpressions) {
    if (parsedForStatement == null )
        return;

    let valueArray = [];
    parseBinaryExpressionDispatcher(parsedForStatement.test, valueArray);
    let value = valueArray.join('');

    myParsedExpressions.push(new myParsedExpression(parsedForStatement.loc.start.line, parsedForStatement.type, null, value, null));

    parseAssignmentExpression(parsedForStatement.init, myParsedExpressions);
    parseAssignmentExpression(parsedForStatement.update,myParsedExpressions);

    if (parsedForStatement.body.type === BlockStatement)
        parsedForStatement.body.body.forEach(function (exp) {parseGeneral(exp,myParsedExpressions);});
    else
        parseGeneral(parsedForStatement.body,myParsedExpressions);
}

export {parseCode, parseProgram};
export  {parseBinaryExpressionDispatcher, parseVariabledeclaration, parseVariableDeclerator,
    parseAssignmentExpression, parseSequenceExpression, parseWhileStatement, parseIfOrElseStatementDispatcher,
    parseReturnStatement, parseIfStatement, parseGeneral, parseFunction, parseBinaryExpression_ExpressionStatement,
    parseBinaryExpression_Literal, parseBinaryExpression_UnaryExpression, parseBinaryExpression_Identifier,
    parseBinaryExpression_MemberExpression, parseExpressionStatement, parseBlockStatement, parseForStatement,
    myParsedExpression};