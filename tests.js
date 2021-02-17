const parse = require('./index');

const code = `a(class='button', href='//google.com') Google`;

const ast = parse(code);
console.log(JSON.stringify(ast.nodes[0].attributes[1], null, "  "))