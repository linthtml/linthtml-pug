const { index_to_loc } = require("../utils");

function get_code_first_line_text(node, lines) {
  const start_code_line = lines[node.line].text;
  return start_code_line.slice(node.column - 1);
}

function is_data_on_same_line(node, lines) {
  const code_text = get_code_first_line_text(node, lines);
  return code_text.length > node.val.length;
}

function get_code_start_text_length(node, lines) {
  const code_text = get_code_first_line_text(node, lines);

  // eslint-disable-next-line no-useless-escape
  const match = code_text.match(/^!?[\-=]\s+/);

  return match
    ? match[0].length
    : 0;
}

function get_code_line_padding_length(node, lines) {
  let padding = "";
  let start_with = false;
  let i = 0;
  do {
    i++;
    const { text } = lines[node.line + i];

    if (text.trim() !== "") {
      start_with = node.val.startsWith(text.trim());
    }
    if (start_with === false) {
      padding += text;
    }
  } while (start_with === false);

  return padding.length + get_code_start_text_length(node, lines);
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
  const start_position = lines[node.line - 1].end_index + node.column;

  const end_position = is_data_on_same_line(node, lines)
    ? start_position + get_code_start_text_length(node, lines) + node.val.length
    : start_position + get_code_block_length(node, lines) + get_code_line_padding_length(node, lines);
  return {
    type: node.type,
    data: node.val,
    buffer: node.buffer,
    mustEscape: node.mustEscape,
    isInline: node.isInline,
    loc: {
      start: {
        line: node.line,
        column: node.column
      },
      end: index_to_loc(end_position, lines)
    }
  };
}

module.exports = to_code_node;
