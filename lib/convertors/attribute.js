const { index_to_loc } = require("../utils");

function is_id_attribute_short(attribute, line) {
  const raw = line.slice(attribute.column - 1);
  return attribute.name === "id" && raw[0] === "#";
}
function is_class_attribute_short(attribute, line) {
  const raw = line.slice(attribute.column - 1);
  return attribute.name === "class" && raw[0] === ".";
}

function extract_attribute_name(attribute, lines) {
  const line = lines[attribute.line].text;
  const { name } = attribute;
  let name_length = (is_id_attribute_short(attribute, line) || is_class_attribute_short(attribute, line))
    ? 1
    : name.length;

  const raw = line.slice(attribute.column - 1);

  // attribute name can have quotes
  // div(class='div-class' '(click)'='play()')
  const start_with_quote = /^('|")/.test(raw);
  const name_raw = start_with_quote
    ? line.slice(attribute.column - 1, attribute.column + name_length + 1)
    : line.slice(attribute.column - 1, attribute.column + name_length - 1);

  if (start_with_quote) {
    name_length += 2;
  }

  const name_position = {
    start: {
      line: attribute.line,
      column: attribute.column
    },
    end: {
      line: attribute.line,
      column: attribute.column + name_length
    }
  };

  return {
    chars: attribute.name,
    raw: name_raw,
    loc: name_position
  };
}

function extract_attribute_equal({ name, line }, lines) {
  const line_text = lines[line].text;

  const raw = line_text.slice(name.loc.end.column - 1);
  const match = raw.match(/^\s*!?=\s*/); // ! before mean that attribute value should not be escaped (special chars) it's not really part of the equal
  const rawEqValue = match
    ? match[0]
    : null;
  if (rawEqValue) {
    return {
      chars: rawEqValue,
      loc: {
        start: {
          line,
          column: name.loc.end.column
        },
        end: {
          line,
          column: name.loc.end.column + rawEqValue.length
        }
      }
    };
  }

  return null;
}

function extract_attribute_value(attribute, lines) {
  const line_text = lines[attribute.line].text;
  if (attribute.val && typeof attribute.val !== "boolean") {
    const value_start = attribute.equal
      ? attribute.equal.loc.end.column
      : attribute.name.loc.end.column;
    const raw = line_text.slice(value_start - 1).slice(0, attribute.val.length);
    const val_no_quotes = attribute.val
      .replace(/^('|")/, "")
      .replace(/('|")$/, "");

    const chars = raw === val_no_quotes
      ? val_no_quotes
      : attribute.val;

    const value_length = chars.length;
    const value_end = lines[attribute.line - 1].end_index + value_start + value_length;
    return {
      chars,
      raw: chars,
      escaped: attribute.mustEscape,
      loc: {
        start: {
          line: attribute.line,
          column: value_start
        },
        end: index_to_loc(value_end - 1, lines)
      }
    };
  }
  return null;
}

function to_attribute_node(attribute, lines) {
  const name = extract_attribute_name(attribute, lines);
  const equal = extract_attribute_equal({ ...attribute, name }, lines);
  const value = extract_attribute_value({ ...attribute, equal, name }, lines);

  return {
    type: "attribute",
    index: attribute.index, // TODO: remove ?
    name,
    value,
    equal,
    loc: {
      start: {
        line: attribute.line,
        column: attribute.column
      },
      end: value
        ? value.loc.end
        : name.loc.end
    }
  };
}

module.exports = to_attribute_node;
