const { get_node_end_position, cleanup_node_children, link_nodes } = require("../utils");


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

  const name_raw = line.slice(node.column - 1);
  const is_implicit_div = node.name === "div" && /^div/.test(name_raw) === false;
  const name_length = is_implicit_div
    ? 0
    : node.name.length;

  let children = [];
  if (node.block && node.block.children) {
    children = node.block.children;
    delete node.block;
  }

  const tag = {
    type: "tag",
    name: node.name,
    parent: null,
    children,
    attributes: node.attributes,
    // isInline: node.isInline,
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
    }
  };
  tag.loc = {
    start: {
      line: node.line,
      column: node.column
    },
    end: get_node_end_position({
      ...tag,
      line: node.line,
      column: node.column
    })
  };

  tag.children = cleanup_node_children(tag, lines);
  tag.children = link_nodes(tag.children, tag);
  return tag;
}

module.exports = to_tag_node;
