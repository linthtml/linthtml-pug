const { index_to_loc, get_node_end_position } = require("../utils");
const to_text_node = require("./text");

function to_comment_node(node, lines) {
  const { end_index } = lines[node.line];
  if (node.type === "blockcomment") {
    // text nodes inside block comment are not visited by pug-walk ><
    if (node.block && node.block.nodes) {
      node.val = node.block.nodes.reduce((data, comment) => `${data}${comment.val}`, "");
      node.children = node.block.nodes.map(to_text_node);
    }
    return {
      type: "comment",
      data: node.val,
      buffer: node.buffer,
      loc: {
        start: {
          line: node.line,
          column: node.column
        },
        end: get_node_end_position(node)
      }
    };
  }

  return {
    type: "comment",
    data: node.val,
    buffer: node.buffer,
    loc: {
      start: {
        line: node.line,
        column: node.column
      },
      end: index_to_loc(end_index + 1, lines)
    }
  };
}

module.exports = to_comment_node;
