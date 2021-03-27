const { get_node_end_position, index_to_loc } = require("../utils");

/**
 *
 * @param {String} text
 * @returns {Boolean}
 */
function is_indent_only(text) {
  return /^[\t ]+$/.test(text);
}

/**
 *
 * @param {*} node
 * @param {*} lines
 * @returns
 */
function create_indent_node_if_needed(node, lines) {
  const line_text = lines[node.loc.start.line].text;
  const indent = line_text.slice(0, node.loc.start.column - 1);
  if (is_indent_only(indent)) {
    const [new_line_char] = /[\n\r]+$/.exec(lines[node.loc.start.line - 1].text);
    const text_node = {
      type: "text",
      data: `${new_line_char}${indent}`,
      nextSibling: node,
      loc: {
        start: index_to_loc(lines[node.loc.start.line - 1].end_index, lines),
        end: {
          line: node.loc.start.line,
          column: node.loc.start.column
        }
      }
    };
    return text_node;
  }

  return null;
}

/**
 *
 * @param {*} nodes
 * @param {*} parent_node
 * @returns
 */
function link_nodes(nodes, parent_node) {
  return nodes.reduce((linked_nodes, node) => {
    const last_node = linked_nodes[linked_nodes.length - 1];
    node.parent = parent_node;
    node.nextSibling = null;
    node.previousSibling = null;

    if (last_node) {
      last_node.nextSibling = node;
      node.previousSibling = last_node;
    }

    return [...linked_nodes, node];
  }, []);
}
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

  tag.children = tag.children.reduce((children, child) => {
    // remove empty text nodes
    if (child.type === "text" && child.data === "") {
      return [...children];
    }
    const text_node = create_indent_node_if_needed(child, lines);
    if (text_node) {
      return [...children, text_node, child];
    }

    return [...children, child];
  }, []);

  tag.children = link_nodes(tag.children, tag);
  return tag;
}

module.exports = to_tag_node;
