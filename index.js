const lexer = require("pug-lexer");
const parser = require("pug-parser");
const walk = require("pug-walk");

const { get_lines_index } = require("./lib/utils");
const to_tag_node = require("./lib/convertors/tag");
const to_attribute_node = require("./lib/convertors/attribute");
const to_doctype_node = require("./lib/convertors/doctype");
const to_text_node = require("./lib/convertors/text");

module.exports = function parse(code) {
  const lines = get_lines_index(code);

  const ast = parser(lexer(code));

  return walk(ast, null, (node, replace) => {
    node.type = node.type.toLowerCase();
    node.children = [];
    const node_start = {
      line: node.line,
      column: node.column
    };

    if (node.block && node.block.nodes) {
      node.children = node.block.nodes;
      delete node.block;
    }

    if (node.attrs) {
      // and attributes are not updated https://pugjs.org/language/attributes.html#attributes
      node.attributes = node.attrs.map(attribute => to_attribute_node(attribute, lines));
      delete node.attrs;
    }
    node.loc = {
      start: node_start
    };

    if (node.type === "text") {
      node = to_text_node(node);
    }

    if (node.type === "doctype") {
      node = to_doctype_node(node, lines);
    }

    if (node.type === "tag") {
      node = to_tag_node(node, lines);
    }

    // if (node.type !== "Block") {
    //   node.loc = {
    //     start: {
    //       line: node.line,
    //       column: node.column
    //     },
    //     end: get_node_end_position(node)
    //   };
    // }

    return replace(node);
  });
};
