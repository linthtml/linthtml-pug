const { get_node_end_position } = require("../utils");

//

// Here end position stop at last attribute ><
// input(
//   type='checkbox'
//   name='agreement'
//   checked=true
// )

// End position stop at end of first line here
// input(data-json=`
//   {
//     "very-long": "piece of ",
//     "data": true
//   }
// `)
function to_tag_node(node, lines) {
  const line = lines[node.line].text;
  const end_position = get_node_end_position(node);

  const name_raw = line.slice(node.column - 1);
  const is_implicit_div = node.name === "div" && /^div/.test(name_raw) === false;
  const name_length = is_implicit_div
    ? 0
    : node.name.length;

  return {
    ...node,
    type: "tag",
    parent: null,
    open: { // implicit div don't have open (position should be with a rang of 0)
      chars: node.name,
      raw: is_implicit_div
        ? ""
        : node.name,
      loc: {
        start: {
          line: node.line,
          column: node.column
        },
        end: {
          line: node.line,
          column: node.column + name_length // unless implicit div
        }
      }
    },
    loc: {
      start: {
        line: node.line,
        column: node.column
      },
      end: end_position
    }
  };
}

module.exports = to_tag_node;
