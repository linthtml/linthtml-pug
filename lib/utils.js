/**
 * @typedef {object} Position
 * @property {Range} start
 * @property {Ranger} end
 */

/**
 * @typedef {Range}
 * @property {integer} line
 * @property {integer} column
 */

/**
 * @typedef {object} Line
 * @property {string} text
 * @property {number} end_index
 */

/**
 * @param {string} code - text to split in lines
 * @returns {Line[]}
 */
function get_lines_index(code) {
  const lines = [];
  let index = 0;
  do {
    let text = "";
    if (index > 0) {
      text = code.slice(lines[lines.length - 1].end_index, index);
    }
    lines.push({
      end_index: index,
      text
    });
  } while (index = code.indexOf("\n", index) + 1); // eslint-disable-line no-cond-assign
  // /(\r\n|\r|\n)/ instead ?

  const text = code.slice(lines[lines.length - 1].end_index);
  index = lines[lines.length - 1].end_index + text.length;
  lines.push({
    end_index: index,
    text
  });
  return lines;
}

/**
 * @param {Object} node
 * @returns {Position}
 */
function get_node_end_position(node) {
  const children_end_position = node.children.reduce((_, node) => node.loc.end, null);

  if (children_end_position) {
    return children_end_position;
  }

  if (node.attributes && node.attributes.length > 0) {
    return node.attributes.reduce((_, node) => node.loc.end, null);
  }

  return {
    line: node.line,
    column: node.column + (node.name || "").length
  };
}

/**
 * @param {number} index
 * @param {Line[]} lines
 * @returns {Position}
 */

//
// What is index?
// if it's a char, do we want the position before of after????
//  Check function current usage to define clear rule/algo for this function
//
function index_to_loc(position, lines) {
  let index = 0;
  do {
    index++;
  } while (lines[index].end_index < position);

  const column = index <= 1
    ? position
    : position - lines[index - 1].end_index;

  if (index < (lines.length - 1) && column === lines[index].text.length) {
    return {
      line: index + 1,
      column: 1
    };
  }
  return {
    line: index,
    column: column + 1
  };
}

/**
 * @param {*} node
 * @param {Range}
 */
function get_node_start_position(node) {
  return {
    line: node.line,
    column: node.column
  };
}

function link_condition_nodes(node, parent_node) {
  if (node && node.type === "conditional" && node.alternate) {
    node.alternate.parent = parent_node;
    node.alternate.children = link_nodes(node.alternate.children, node.alternate); // ⚠️nested nested nested. What are the perfs?
    return link_condition_nodes(node.alternate);
  }
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

    link_condition_nodes(node, parent_node);

    if (last_node) {
      last_node.nextSibling = node;
      node.previousSibling = last_node;
    }

    return [...linked_nodes, node];
  }, []);
}

/**
 *
 * @param {String} text
 * @returns {Boolean}
 */
function is_indent_only(text) {
  return /^[\t ]+(#\[)?$/.test(text); // "(#\[)?" because lines can start with a tag interpolation ^^
}

/**
 *
 * @param {String} text
 * @returns {Boolean}
 */
function is_new_line_only(text) {
  return /^(\n|\r\n)$/.test(text);
}

/**
 *
 * @param {*} node
 * @param {Line[]} lines
 * @returns
 */
function create_indent_node_if_needed(node, lines) {
  const line_text = lines[node.loc.start.line].text;
  let indent = line_text.slice(0, node.loc.start.column - 1);
  if (is_indent_only(indent)) {
    const [new_line_char] = /[\n\r]+$/.exec(lines[node.loc.start.line - 1].text);
    indent = indent.replace(/#\[$/, "");
    const text_node = {
      type: "text",
      data: `${new_line_char}${indent}`,
      nextSibling: node,
      loc: {
        start: index_to_loc(lines[node.loc.start.line - 1].end_index - 1, lines),
        end: {
          line: node.loc.start.line,
          column: indent.length + 1
        }
      }
    };
    return text_node;
  }

  return null;
}

function get_all_condition_alternate(node) {
  if (node.type === "conditional" && node.alternate) {
    return [node, ...get_all_condition_alternate(node.alternate)];
  }

  return [node];
}

function add_conditional_nodes_as_children(node) {
  return node
    .children
    .reduce((children, child) => {
      if (child.type === "conditional" && child.alternate) {
        return [...children, child, ...get_all_condition_alternate(child.alternate)];
      }

      return [...children, child];
    }, []);
}
/**
 *
 * @param {*} node
 * @param {Line[]} lines
 * @returns
 */
function cleanup_node_children(node, lines) {
  const children = add_conditional_nodes_as_children(node);

  return children
    .reduce((children, child) => {
    // remove empty text nodes
      if (child.type === "text" && child.data === "") {
        return [...children];
      }
      const text_node = create_indent_node_if_needed(child, lines);
      if (text_node) {
        const previous_node = children[children.length - 1];
        // if previous node is only a new_line node then we need to merge the indent node and the previous node
        if (previous_node && previous_node.type === "text" && is_new_line_only(previous_node.data)) {
          children.pop();
        }
        return [...children, text_node, child];
      }

      return [...children, child];
    }, []);
}

module.exports = {
  get_lines_index,
  index_to_loc,
  get_node_end_position,
  get_node_start_position,
  link_nodes,
  cleanup_node_children,
  is_indent_only,
  is_new_line_only
};
