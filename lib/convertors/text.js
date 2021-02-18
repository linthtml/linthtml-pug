const { get_node_start_position } = require("../utils");

function to_text_node(node) {
  node.data = node.val;
  node.loc.end = {
    line: node.line,
    column: node.column + node.data.length
  };
  return {
    type: "text",
    data: node.val,
    loc: {
      start: get_node_start_position(node),
      end: {
        line: node.line,
        column: node.column + node.val.length
      }
    }
  };
}

module.exports = to_text_node;
