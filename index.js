const lexer = require("pug-lexer");
const parser = require("pug-parser");
const walk = require("pug-walk");

const { get_lines_index } = require("./lib/utils");

const to_tag_node = require("./lib/convertors/tag");
const to_attribute_node = require("./lib/convertors/attribute");
const to_doctype_node = require("./lib/convertors/doctype");
const to_text_node = require("./lib/convertors/text");
const to_comment_node = require("./lib/convertors/comment");
const to_code_node = require("./lib/convertors/code");

module.exports = function parse(code) {
  const lines = get_lines_index(code);

  const ast = parser(lexer(code));

  const new_ast = walk(ast, null, (node, replace) => {
    node.type = node.type.toLowerCase();
    node.parent = null;
    node.children = [];

    const node_start = {
      line: node.line,
      column: node.column
    };

    node.loc = {
      start: node_start
    };

    if (node.type === "block") {
      node.loc = {
        start: {
          line: node.line,
          column: 0
        },
        end: {
          line: node.line,
          column: 0
        }
      };
      node.children = node.nodes;
      delete node.nodes;
    }

    if (node.attrs) {
      // and attributes are not updated https://pugjs.org/language/attributes.html#attributes
      node.attributes = node.attrs.map(attribute => to_attribute_node(attribute, lines));
      delete node.attrs;
    }

    if (node.type === "text") {
      node = to_text_node(node);
    }

    if (node.type === "doctype") {
      node = to_doctype_node(node, lines);
    }

    if (node.type === "tag") {
      node = to_tag_node(node, lines);
    }

    if (node.type === "comment" || node.type === "blockcomment") {
      node = to_comment_node(node, lines);
    }

    if (node.type === "code") {
      node = to_code_node(node, lines);
    }

    return replace(node);
  });

  new_ast.type = "root";
  return new_ast;
};
