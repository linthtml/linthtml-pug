const { get_node_end_position } = require("../utils");

function get_end_position(node) {
  if (node.alternate) {
    return node.alternate.loc.end;
  }

  if (node.consequent) {
    return node.consequent.loc.end;
  }

  return get_node_end_position(node);
}

function to_condition_node(node, lines) {
  const condition = {
    type: "conditional",
    test: node.test,
    // ...node,
    consequent: node.consequent,
    loc: node.loc
      ? node.loc
      : {
          start: {
            line: node.line,
            column: node.column
          }
        }
  };

  if (node.alternate) {
    condition.alternate = node.alternate.type === "conditional"
      ? to_condition_node(node.alternate) // else if
      : node.alternate; // else
  }

  condition.loc.end = get_end_position(condition);
  condition.consequent.parent = condition;

  if (condition.alternate) {
    condition.alternate.parent = condition;
  }

  return condition;
}

module.exports = to_condition_node;
