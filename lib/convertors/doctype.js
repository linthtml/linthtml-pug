const { get_node_start_position } = require("../utils");

function to_doctype_node(node, lines) {
  const line = lines[node.line].text;

  let doctype_end = node.type.length;
  const raw = line.slice(doctype_end);
  const R = new RegExp(`\\s*${node.val}`);

  const doctype_value = raw.match(R);
  doctype_end = doctype_value
    ? doctype_end + doctype_value[0].length
    : doctype_end;

  return {
    type: node.type,
    value: node.val,
    loc: {
      start: get_node_start_position(node),
      end: {
        line: node.line,
        column: doctype_end + 1
      }
    }
  };
}

module.exports = to_doctype_node;
