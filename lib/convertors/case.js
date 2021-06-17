const { index_to_loc, link_nodes, cleanup_node_children } = require("../utils");

function get_open_chars(node, lines) {
  const start_line = lines[node.line].text;
  return start_line.replace(/\n/g, "").trim();
}
/**
 *
 * @param {*} node
 * @param {import('../utils').Line[]} lines
 * @returns
 */
function to_case_node(node, lines) {
  const start_index = lines[node.line - 1].end_index + node.column;
  const start_line = get_open_chars(node, lines);
  const start_position = index_to_loc(start_index - 1, lines);
  let end_position = index_to_loc(start_index + node.type.length - 1, lines);
  let children = [];
  if (node.block && node.block.children) {
    children = node.block.children;
    end_position = children.reduce((_, child) => child.loc.end, end_position);
  }
  const case_node = {
    type: "case",
    name: "case",
    expr: node.expr,
    children,
    open: {
      chars: start_line,
      raw: start_line,
      loc: {
        start: start_position,
        end: index_to_loc(lines[node.line].end_index - 1, lines) // should the whole line the whole line ^^
      }
    },
    loc: {
      start: start_position,
      end: end_position
    }
  };
  case_node.children = cleanup_node_children(case_node, lines);
  case_node.children = link_nodes(case_node.children, case_node);
  return case_node;
}

module.exports = to_case_node;
