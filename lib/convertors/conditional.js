const {
  get_node_end_position,
  index_to_loc,
  link_nodes,
  cleanup_node_children
} = require("../utils");

function get_end_position(node) {
  if (node.alternate) {
    return node.alternate.loc.end;
  }

  if (node.consequent) {
    return node.consequent.loc.end;
  }

  return get_node_end_position(node);
}

function generate_node_open(node, lines) {
  if (node.open) {
    return node.open;
  }
  const open_line = lines[node.line];
  const open_text = open_line.text.trim();
  const match = open_line.text.match(/\s*/);
  const spaces = match
    ? match[0]
    : "";
  const open_index = lines[node.line - 1].end_index + spaces.length + 1;
  // const open_index = lines[node.line - 1].end_index + spaces.length + 1;

  return {
    chars: open_text,
    raw: open_text,
    loc: {
      start: index_to_loc(open_index, lines),
      end: index_to_loc(open_line.end_index, lines)
    }
  };
}

function generate_block_alternate(node, lines) {
  if (node.open) {
    return node;
  }

  // const open_line = lines[node.loc.start.line];
  const open_line = lines[node.loc.start.line - 1];
  const open_text = open_line.text.trim();
  const match = open_line.text.match(/\s*/);
  const spaces = match
    ? match[0]
    : " ";
  const open_index = lines[node.loc.start.line - 2].end_index + spaces.length;

  const alternate_node = {
    ...node,
    open: {
      chars: open_text,
      raw: open_text,
      loc: {
        start: index_to_loc(open_index, lines),
        end: index_to_loc(open_line.end_index, lines)
      }
    }
  };
  alternate_node.loc.start = alternate_node.open.loc.start;
  alternate_node.children = cleanup_node_children(alternate_node, lines);
  alternate_node.children = link_nodes(alternate_node.children, alternate_node);

  return alternate_node;
}

/**
 *
 * @param {*} node
 * @param {import('../utils').Line[]} lines
 * @returns
 */
function to_condition_node(node, lines) {
  const condition = {
    type: "conditional",
    name: "condition (if)",
    test: node.test,
    consequent: node.consequent,
    children: node.consequent.children,
    open: generate_node_open(node, lines),
    loc: node.loc
      ? node.loc
      : {
          start: {
            line: node.line,
            column: node.column
          }
        }
  };

  if (node.alternate) { // to_condition_node is called for each else if before being called for the "parent if"
    condition.alternate = node.alternate.type === "conditional"
      ? {
          ...to_condition_node(node.alternate, lines),
          name: "condition (else if)"
        } // else if
      : {
          ...generate_block_alternate(node.alternate, lines),
          name: "condition (else)"
        };
  }

  condition.loc.end = get_end_position(condition);
  condition.consequent.parent = condition;
  condition.children = cleanup_node_children(condition, lines);
  condition.children = link_nodes(condition.children, condition);

  return condition;
}

module.exports = to_condition_node;
