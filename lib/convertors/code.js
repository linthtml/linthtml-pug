const { index_to_loc, link_nodes, cleanup_node_children } = require("../utils");

function get_code_block_first_line(node, lines) {
  const start_code_line = lines[node.line].text;
  return start_code_line.slice(node.column - 1);
}

function is_multiline_code_block(node, lines) {
  const code_text = get_code_block_first_line(node, lines);
  return code_text.length > node.val.length;
}

function get_code_block_start_text_length(node, lines) {
  const code_text = get_code_block_first_line(node, lines);

  // eslint-disable-next-line no-useless-escape
  const match = code_text.match(/^(!?=|-)\s+/);

  return match
    ? match[0].length
    : 0;
}

function get_code_line_padding_length(node, lines) {
  let padding = "";
  let is_code_start = false;
  let i = 0;
  do {
    i++;
    const { text } = lines[node.line + i];

    if (text.trim() !== "") {
      is_code_start = node.val.startsWith(text.trim());
    }
    if (is_code_start === false) {
      padding += text;
    }
  } while (is_code_start === false);

  return padding.length + get_code_block_start_text_length(node, lines);
}

function get_code_value_start_line(node, lines) {
  let is_code_start = false;
  let i = 0;
  do {
    i++;
    const { text } = lines[node.line + i];

    if (text.trim() !== "") {
      is_code_start = node.val.startsWith(text.trim());
    }
  } while (is_code_start === false);

  return node.line + i;
}

function get_code_block_length(node, lines) {
  const value_start_line = get_code_value_start_line(node, lines);
  const nb_code_lines = node.val.split("\n").length;
  let real_code_value = "";
  for (let i = 0; i < nb_code_lines; i++) {
    real_code_value += lines[value_start_line + i].text;
  }

  return real_code_value.length;
}

function to_code_node(node, lines) {
  const start_index = lines[node.line - 1].end_index + node.column;

  const end_index = is_multiline_code_block(node, lines)
    ? start_index + get_code_block_start_text_length(node, lines) + node.val.length
    : start_index + get_code_block_length(node, lines) + get_code_line_padding_length(node, lines);

  let end_position = index_to_loc(end_index, lines);
  let children = [];
  if (node.block && node.block.children) {
    children = node.block.children;
    end_position = children.reduce((_, child) => child.loc.end, end_position);
  }

  const code = {
    type: node.type,
    data: node.val,
    buffer: node.buffer,
    mustEscape: node.mustEscape,
    isInline: node.isInline,
    children,
    loc: {
      start: {
        line: node.line,
        column: node.column
      },
      end: end_position
    }
  };

  code.children = cleanup_node_children(code, lines);
  code.children = link_nodes(code.children, code);

  return code;
}

module.exports = to_code_node;
