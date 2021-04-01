const {
  cleanup_node_children,
  get_node_end_position,
  link_nodes
} = require("../utils");

function find_first_meaningful_node(nodes) {
  return nodes.find(child => {
    if (child.type === "text") {
      return /^(\n|\r\n)[\t\s]*$/.test(child.data) === false;
    }
    return true;
  });
}

function to_block_node(node, lines) {
  node.children = node.nodes;
  const children = cleanup_node_children(node, lines);
  const first_meaningful_child = find_first_meaningful_node(children);

  const block = {
    type: "block",
    children,
    parent: null,
    loc: {
      start: {
        line: node.line,
        column: first_meaningful_child.loc.start.column
      }
    }
  };
  block.loc.end = get_node_end_position(block);
  block.children = link_nodes(node.children, block);
  return block;
}

module.exports = to_block_node;
