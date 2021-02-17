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
 * @property {number} start_index
 */

/**
 * @param {string} code - text to split in lines
 * @returns {Line[]}
 */
function get_lines_index(code) {
  const lines = [];
  let index = 0;
  do {
    let text = null;
    if (index === 0) {
      text = code.slice(0, index);
    } else {
      text = code.slice(lines[lines.length - 1].start_index, index);
    }
    lines.push({
      start_index: index,
      text
    });
  } while (index = code.indexOf("\n", index) + 1); // eslint-disable-line no-cond-assign
  // /(\r\n|\r|\n)/ instead ?

  const text = code.slice(lines[lines.length - 1].start_index);
  index = lines[lines.length - 1].start_index + text.length;
  lines.push({
    start_index: index,
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

  if (node.attributes.length > 0) {
    return node.attributes.reduce((_, node) => node.loc.end, null);
  }

  return {
    line: node.line,
    column: node.column + node.name.length // - 1 // ?
  };
}

/**
 * @param {number} index
 * @param {Lines[]} lines
 * @returns {Position}
 */
function index_to_loc(position, lines) {
  let index = 0;
  while (lines[index].start_index < (position - 1)) {
    index++;
  }

  return {
    line: index,
    column: position - lines[index - 1].start_index
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

module.exports = {
  get_lines_index,
  index_to_loc,
  get_node_end_position,
  get_node_start_position
};
