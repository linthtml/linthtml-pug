const { index_to_loc } = require("../utils");

function is_id_attribute_short(attribute, line) {
  const raw = line.slice(attribute.column - 1);
  return attribute.name === "id" && raw[0] === "#";
}
function is_class_attribute_short(attribute, line) {
  const raw = line.slice(attribute.column - 1);
  return attribute.name === "class" && raw[0] === ".";
}

function to_attribute_node(attribute, lines) {
  const line = lines[attribute.line].text;

  let equal = null;
  let value = null;

  const { name } = attribute;
  let name_length = (is_id_attribute_short(attribute, line) || is_class_attribute_short(attribute, line))
    ? 1
    : name.length;

  let raw = line.slice(attribute.column - 1);

  // attribute name can have quotes
  // div(class='div-class' '(click)'='play()')
  const start_with_quote = /^('|")/.test(raw);
  const name_raw = start_with_quote
    ? line.slice(attribute.column - 1, attribute.column + name_length + 1)
    : line.slice(attribute.column - 1, attribute.column + name_length - 1);

  if (start_with_quote) {
    name_length += 2;
  }

  let attribute_end = attribute.column + name_length;
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

  raw = line.slice(attribute.column + name_length - 1);
  const match = raw.match(/^\s*!?=\s*/); // ! before mean that attribute value should not be escaped (special chars) it's not really part of the equal
  let rawEqValue = match
    ? match[0]
    : null;
  if (rawEqValue) {
    equal = {
      chars: rawEqValue,
      loc: {
        start: {
          line: attribute.line,
          column: attribute_end
        },
        end: {
          line: attribute.line,
          column: attribute_end + rawEqValue.length
        }
      }
    };
    attribute_end += rawEqValue.length;
  }

  if (attribute.val && typeof attribute.val !== "boolean") {
    rawEqValue = rawEqValue || "";
    raw = raw.slice(rawEqValue.length);
    const raw_raw = raw.slice(0, attribute.val.length);
    const val_no_quotes = attribute.val
      .replace(/^('|")/, "")
      .replace(/('|")$/, "");
    let chars = null;
    if (raw_raw === attribute.val) {
      chars = attribute.val;
    } else if (raw_raw.match(val_no_quotes)) {
      chars = val_no_quotes;
    } else {
      chars = attribute.val;
    }

    const value_length = chars.length;
    const value_end = lines[attribute.line - 1].end_index + attribute_end + value_length;

    value = {
      chars,
      raw: chars,
      escaped: attribute.mustEscape,
      loc: {
        start: {
          line: attribute.line,
          column: attribute_end
        },
        end: index_to_loc(value_end, lines)
      }
    };
    attribute_end += value_length;
  }

  return {
    type: "attribute",
    index: attribute.index, // TODO: remove ?
    name: {
      chars: attribute.name,
      raw: name_raw,
      loc: name_position
    },
    value,
    equal,
    loc: {
      start: {
        line: attribute.line,
        column: attribute.column
      },
      end: {
        line: attribute.line,
        column: attribute_end
      }
    }
  };
}

module.exports = to_attribute_node;
