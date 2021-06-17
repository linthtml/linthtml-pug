const { index_to_loc, link_nodes, cleanup_node_children } = require("../utils");

function is_default(node) {
  return node.expr === "default";
}

/**
 *
 * @param {*} node
 * @param {import('../utils').Line[]} lines
 * @returns
 */
function get_open_text(node, lines) {
  let end_index = node.column - 1;
  let line = lines[node.line].text;
  line = line.slice(end_index);
  if (is_default(node) === false) {
    line = line.slice(4); // WHEN === 4
    end_index += 4;
    const spaces_match = line.match(/^\s+/);
    if (spaces_match) {
      const nb_space = spaces_match[0].length;
      end_index += nb_space;
      line = line.slice(nb_space);
    }
  }

  line = line.slice(node.expr.length);
  end_index += node.expr.length;

  const expansion_match = line.match(/^\s*:/);
  if (expansion_match) {
    const nb_space = expansion_match[0].length;
    end_index += nb_space;
    line = line.slice(nb_space);
  }
  return lines[node.line].text.slice(node.column - 1, end_index);
}

function to_when_node(node, lines) {
  const start_index = lines[node.line - 1].end_index + node.column;
  const start_position = index_to_loc(start_index - 1, lines);
  const open_text = get_open_text(node, lines);
  let end_position = index_to_loc(start_index + open_text.length - 1, lines);
  let children = [];
  // TODO: Create util function for this
  if (node.block && node.block.children) {
    children = node.block.children;
    end_position = children.reduce((_, child) => child.loc.end, end_position);
  }
  const when_node = {
    type: "when",
    name: "when",
    expr: node.expr,
    children,
    open: {
      chars: open_text,
      raw: open_text,
      loc: {
        start: start_position,
        end: index_to_loc(start_index + open_text.length - 1, lines)
      }
    },
    loc: {
      start: start_position,
      end: end_position
    }
  };
  // TODO: Create util function for this
  when_node.children = cleanup_node_children(when_node, lines);
  when_node.children = link_nodes(when_node.children, when_node);
  return when_node;
}

module.exports = to_when_node;
