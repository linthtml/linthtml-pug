const { describe, expect, test } = require("@jest/globals");
const parse = require("../index");

describe("Attributes extraction", function() {
  describe("Simple attributes", () => {
    test("", () => {
      const src = "a(href='//google.com') Google";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [href] = attributes;

      expect(href.name.chars).toEqual("href");
      expect(href.name.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 7
        }
      });
      expect(href.equal.chars).toEqual("=");
      expect(href.equal.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 8
        }
      });
      expect(href.value.chars).toEqual("'//google.com'");
      expect(href.value.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 22
        }
      });

      expect(href.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 22
        }
      });
    });

    test("", () => {
      const src = "a(class='button' href='//google.com') Google";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(2);

      const [_class, href] = attributes;

      expect(href.name.chars).toEqual("href");
      expect(href.name.loc).toEqual({
        start: {
          line: 1,
          column: 18
        },
        end: {
          line: 1,
          column: 22
        }
      });
      expect(href.equal.chars).toEqual("=");
      expect(href.equal.loc).toEqual({
        start: {
          line: 1,
          column: 22
        },
        end: {
          line: 1,
          column: 23
        }
      });
      expect(href.value.chars).toEqual("'//google.com'");
      expect(href.value.loc).toEqual({
        start: {
          line: 1,
          column: 23
        },
        end: {
          line: 1,
          column: 37
        }
      });

      expect(href.loc).toEqual({
        start: {
          line: 1,
          column: 18
        },
        end: {
          line: 1,
          column: 37
        }
      });

      expect(_class.name.chars).toEqual("class");
      expect(_class.name.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 8
        }
      });
      expect(_class.equal.chars).toEqual("=");
      expect(_class.equal.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 9
        }
      });
      expect(_class.value.chars).toEqual("'button'");
      expect(_class.value.loc).toEqual({
        start: {
          line: 1,
          column: 9
        },
        end: {
          line: 1,
          column: 17
        }
      });
    });

    test("", () => {
      const src = "a(class='button', href='//google.com') Google";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(2);

      const [_class, href] = attributes;

      expect(href.name.chars).toEqual("href");
      expect(href.name.loc).toEqual({
        start: {
          line: 1,
          column: 19
        },
        end: {
          line: 1,
          column: 23
        }
      });
      expect(href.equal.chars).toEqual("=");
      expect(href.equal.loc).toEqual({
        start: {
          line: 1,
          column: 23
        },
        end: {
          line: 1,
          column: 24
        }
      });
      expect(href.value.chars).toEqual("'//google.com'");
      expect(href.value.loc).toEqual({
        start: {
          line: 1,
          column: 24
        },
        end: {
          line: 1,
          column: 38
        }
      });

      expect(href.loc).toEqual({
        start: {
          line: 1,
          column: 19
        },
        end: {
          line: 1,
          column: 38
        }
      });

      expect(_class.name.chars).toEqual("class");
      expect(_class.name.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 8
        }
      });
      expect(_class.equal.chars).toEqual("=");
      expect(_class.equal.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 9
        }
      });
      expect(_class.value.chars).toEqual("'button'");
      expect(_class.value.loc).toEqual({
        start: {
          line: 1,
          column: 9
        },
        end: {
          line: 1,
          column: 17
        }
      });
    });
  });

  describe("Multiline attributes", () => {
    test("One attribute per lines", () => {
      const src = [
        "input(",
        "  type='checkbox'",
        "  name='agreement'",
        "  checked",
        ")"
      ].join("\n");
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(3);

      const [type, name, checked] = attributes;

      expect(type.name.chars).toEqual("type");
      expect(type.name.loc).toEqual({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 2,
          column: 7
        }
      });
      expect(type.equal.chars).toEqual("=");
      expect(type.equal.loc).toEqual({
        start: {
          line: 2,
          column: 7
        },
        end: {
          line: 2,
          column: 8
        }
      });
      expect(type.value.chars).toEqual("'checkbox'");
      expect(type.value.loc).toEqual({
        start: {
          line: 2,
          column: 8
        },
        end: {
          line: 2,
          column: 18
        }
      });
      expect(type.loc).toEqual({
        start: {
          line: 2,
          column: 3
        },
        end: {
          line: 2,
          column: 18
        }
      });

      expect(name.name.chars).toEqual("name");
      expect(name.name.loc).toEqual({
        start: {
          line: 3,
          column: 3
        },
        end: {
          line: 3,
          column: 7
        }
      });
      expect(name.equal.chars).toEqual("=");
      expect(name.equal.loc).toEqual({
        start: {
          line: 3,
          column: 7
        },
        end: {
          line: 3,
          column: 8
        }
      });
      expect(name.value.chars).toEqual("'agreement'");
      expect(name.value.loc).toEqual({
        start: {
          line: 3,
          column: 8
        },
        end: {
          line: 3,
          column: 19
        }
      });
      expect(name.loc).toEqual({
        start: {
          line: 3,
          column: 3
        },
        end: {
          line: 3,
          column: 19
        }
      });

      expect(checked.name.chars).toEqual("checked");
      expect(checked.name.loc).toEqual({
        start: {
          line: 4,
          column: 3
        },
        end: {
          line: 4,
          column: 10
        }
      });
      expect(checked.equal).toBeNull();
      expect(checked.value).toBeNull();
      expect(checked.loc).toEqual({
        start: {
          line: 4,
          column: 3
        },
        end: {
          line: 4,
          column: 10
        }
      });
    });

    test("Attribute value on multiple lines", () => {
      const src = [
        "input(data-json=`",
        "  {",
        "    \"very-long\": \"piece of ,\"",
        "    \"data\": true",
        "  }",
        "`)"
      ];
      const root = parse(src.join("\n"));
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [data_json] = attributes;

      expect(data_json.name.chars).toEqual("data-json");
      expect(data_json.name.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 16
        }
      });

      expect(data_json.equal.chars).toEqual("=");
      expect(data_json.equal.loc).toEqual({
        start: {
          line: 1,
          column: 16
        },
        end: {
          line: 1,
          column: 17
        }
      });

      const value = [
        "`",
        "  {",
        "    \"very-long\": \"piece of ,\"",
        "    \"data\": true",
        "  }",
        "`"
      ].join("\n");
      expect(data_json.value.chars).toEqual(value);
      expect(data_json.value.loc).toEqual({
        start: {
          line: 1,
          column: 17
        },
        end: {
          line: 6,
          column: 2
        }
      });
    });
  });

  describe("Quoted attributes", () => {
    test("Atribute name with parentheses", () => {
      const src = "div(class='div-class', (click)='play()')";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(2);

      const [, click] = attributes;

      expect(click.name.chars).toEqual("(click)");
      expect(click.name.loc).toEqual({
        start: {
          line: 1,
          column: 24
        },
        end: {
          line: 1,
          column: 31
        }
      });

      expect(click.equal.chars).toEqual("=");
      expect(click.equal.loc).toEqual({
        start: {
          line: 1,
          column: 31
        },
        end: {
          line: 1,
          column: 32
        }
      });

      expect(click.value.chars).toEqual("'play()'");
      expect(click.value.loc).toEqual({
        start: {
          line: 1,
          column: 32
        },
        end: {
          line: 1,
          column: 40
        }
      });
    });

    test("Atribute name with quotes", () => {
      const src = "div(class='div-class' '(click)'='play()')";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(2);

      const [, click] = attributes;

      expect(click.name.raw).toEqual("'(click)'");
      expect(click.name.loc).toEqual({
        start: {
          line: 1,
          column: 23
        },
        end: {
          line: 1,
          column: 32
        }
      });

      expect(click.equal.chars).toEqual("=");
      expect(click.equal.loc).toEqual({
        start: {
          line: 1,
          column: 32
        },
        end: {
          line: 1,
          column: 33
        }
      });

      expect(click.value.chars).toEqual("'play()'");
      expect(click.value.loc).toEqual({
        start: {
          line: 1,
          column: 33
        },
        end: {
          line: 1,
          column: 41
        }
      });
    });
  });
  describe("Attribute interpolation", () => {
    test("", () => {
      const src = "a(href='/' + url) Link";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [href] = attributes;

      expect(href.name.chars).toEqual("href");
      expect(href.name.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 7
        }
      });

      expect(href.equal.chars).toEqual("=");
      expect(href.equal.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 8
        }
      });

      expect(href.value.chars).toEqual("'/' + url");
      expect(href.value.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 17
        }
      });

      expect(href.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 17
        }
      });
    });
    test("", () => {
      const src = "a(href=url) Link";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [href] = attributes;

      expect(href.name.chars).toEqual("href");
      expect(href.name.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 7
        }
      });

      expect(href.equal.chars).toEqual("=");
      expect(href.equal.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 8
        }
      });

      expect(href.value.chars).toEqual("url");
      expect(href.value.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 11
        }
      });

      expect(href.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 11
        }
      });
    });
    test("", () => {
      const src = "button(class='btn btn-' + btnType + ' btn-' + btnSize)";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [_class] = attributes;

      expect(_class.name.chars).toEqual("class");
      expect(_class.name.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 13
        }
      });

      expect(_class.equal.chars).toEqual("=");
      expect(_class.equal.loc).toEqual({
        start: {
          line: 1,
          column: 13
        },
        end: {
          line: 1,
          column: 14
        }
      });

      expect(_class.value.chars).toEqual("'btn btn-' + btnType + ' btn-' + btnSize");
      expect(_class.value.loc).toEqual({
        start: {
          line: 1,
          column: 14
        },
        end: {
          line: 1,
          column: 54
        }
      });

      expect(_class.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 54
        }
      });
    });
    test("", () => {
      // eslint-disable-next-line no-template-curly-in-string
      const src = "button(class=`btn btn-${btnType} btn-${btnSize}`)";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [_class] = attributes;

      expect(_class.name.chars).toEqual("class");
      expect(_class.name.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 13
        }
      });

      expect(_class.equal.chars).toEqual("=");
      expect(_class.equal.loc).toEqual({
        start: {
          line: 1,
          column: 13
        },
        end: {
          line: 1,
          column: 14
        }
      });

      // eslint-disable-next-line no-template-curly-in-string
      expect(_class.value.chars).toEqual("`btn btn-${btnType} btn-${btnSize}`");
      expect(_class.value.loc).toEqual({
        start: {
          line: 1,
          column: 14
        },
        end: {
          line: 1,
          column: 49
        }
      });

      expect(_class.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 49
        }
      });
    });
  });

  describe("Escaped/Unescaped Attributes", () => {
    test("Attribute value are escaped by default", () => {
      const src = "div(escaped='<code>')";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [escaped] = attributes;

      expect(escaped.value.escaped).toBeTruthy();
    });
    test("Attribute value are escaped by default", () => {
      const src = "div(escaped!='<code>')";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [escaped] = attributes;

      expect(escaped.name.chars).toEqual("escaped");
      expect(escaped.name.loc).toEqual({
        start: {
          line: 1,
          column: 5
        },
        end: {
          line: 1,
          column: 12
        }
      });

      expect(escaped.equal.chars).toEqual("!=");
      expect(escaped.equal.loc).toEqual({
        start: {
          line: 1,
          column: 12
        },
        end: {
          line: 1,
          column: 14
        }
      });

      expect(escaped.value.escaped).toBeFalsy();
      expect(escaped.value.chars).toEqual("'<code>'");
      expect(escaped.value.loc).toEqual({
        start: {
          line: 1,
          column: 14
        },
        end: {
          line: 1,
          column: 22
        }
      });
    });
  });

  describe("Boolean attributes", () => {
    test("", () => {
      const src = "input(checked)";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [checked] = attributes;

      expect(checked.name.chars).toEqual("checked");
      expect(checked.name.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 14
        }
      });

      expect(checked.equal).toBeNull();
      expect(checked.value).toBeNull();

      expect(checked.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 14
        }
      });
    });
    test("", () => {
      const src = "input(checked=true)";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [checked] = attributes;

      expect(checked.name.chars).toEqual("checked");
      expect(checked.name.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 14
        }
      });

      expect(checked.equal.chars).toEqual("=");
      expect(checked.equal.loc).toEqual({
        start: {
          line: 1,
          column: 14
        },
        end: {
          line: 1,
          column: 15
        }
      });
      expect(checked.value.chars).toEqual("true");
      expect(checked.value.loc).toEqual({
        start: {
          line: 1,
          column: 15
        },
        end: {
          line: 1,
          column: 19
        }
      });

      expect(checked.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 19
        }
      });
    });
    test("", () => {
      const src = "input(checked=false)";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [checked] = attributes;

      expect(checked.name.chars).toEqual("checked");
      expect(checked.name.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 14
        }
      });

      expect(checked.equal.chars).toEqual("=");
      expect(checked.equal.loc).toEqual({
        start: {
          line: 1,
          column: 14
        },
        end: {
          line: 1,
          column: 15
        }
      });
      expect(checked.value.chars).toEqual("false");
      expect(checked.value.loc).toEqual({
        start: {
          line: 1,
          column: 15
        },
        end: {
          line: 1,
          column: 20
        }
      });

      expect(checked.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 20
        }
      });
    });
    test("", () => {
      const src = "input(checked=true.toString())";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [checked] = attributes;

      expect(checked.name.chars).toEqual("checked");
      expect(checked.name.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 14
        }
      });

      expect(checked.equal.chars).toEqual("=");
      expect(checked.equal.loc).toEqual({
        start: {
          line: 1,
          column: 14
        },
        end: {
          line: 1,
          column: 15
        }
      });
      expect(checked.value.chars).toEqual("true.toString()");
      expect(checked.value.loc).toEqual({
        start: {
          line: 1,
          column: 15
        },
        end: {
          line: 1,
          column: 30
        }
      });

      expect(checked.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 30
        }
      });
    });
    test("", () => {
      const src = "input(checked=true && 'checked')";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [checked] = attributes;

      expect(checked.name.chars).toEqual("checked");
      expect(checked.name.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 14
        }
      });

      expect(checked.equal.chars).toEqual("=");
      expect(checked.equal.loc).toEqual({
        start: {
          line: 1,
          column: 14
        },
        end: {
          line: 1,
          column: 15
        }
      });

      expect(checked.value.chars).toEqual("true && 'checked'");
      expect(checked.value.loc).toEqual({
        start: {
          line: 1,
          column: 15
        },
        end: {
          line: 1,
          column: 32
        }
      });

      expect(checked.loc).toEqual({
        start: {
          line: 1,
          column: 7
        },
        end: {
          line: 1,
          column: 32
        }
      });
    });
  });

  describe("Attributes with array or object values", () => {
    test("Object values", () => {
      const src = "a(style={color: 'red', background: 'green'})";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [style] = attributes;

      expect(style.name.chars).toEqual("style");
      expect(style.name.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 8
        }
      });

      expect(style.equal.chars).toEqual("=");
      expect(style.equal.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 9
        }
      });

      expect(style.value.chars).toEqual("{color: 'red', background: 'green'}");
      expect(style.value.loc).toEqual({
        start: {
          line: 1,
          column: 9
        },
        end: {
          line: 1,
          column: 44
        }
      });

      expect(style.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 44
        }
      });
    });

    test("Array values", () => {
      const src = "a(class=['bling', 'foo'])";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [_class] = attributes;

      expect(_class.name.chars).toEqual("class");
      expect(_class.name.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 8
        }
      });

      expect(_class.equal.chars).toEqual("=");
      expect(_class.equal.loc).toEqual({
        start: {
          line: 1,
          column: 8
        },
        end: {
          line: 1,
          column: 9
        }
      });

      expect(_class.value.chars).toEqual("['bling', 'foo']");
      expect(_class.value.loc).toEqual({
        start: {
          line: 1,
          column: 9
        },
        end: {
          line: 1,
          column: 25
        }
      });

      expect(_class.loc).toEqual({
        start: {
          line: 1,
          column: 3
        },
        end: {
          line: 1,
          column: 25
        }
      });
    });
  });

  describe("Literal forms", () => {
    test("id", () => {
      const src = "div#foo";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [id] = attributes;

      expect(id.name.chars).toEqual("id");
      expect(id.name.raw).toEqual("#");
      expect(id.name.loc).toEqual({
        start: {
          line: 1,
          column: 4
        },
        end: {
          line: 1,
          column: 5
        }
      });

      expect(id.equal).toBeNull();
      expect(id.value.chars).toEqual("foo");
      expect(id.value.loc).toEqual({
        start: {
          line: 1,
          column: 5
        },
        end: {
          line: 1,
          column: 8
        }
      });

      expect(id.loc).toEqual({
        start: {
          line: 1,
          column: 4
        },
        end: {
          line: 1,
          column: 8
        }
      });
    });
    test("class", () => {
      const src = "div.foo";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(1);

      const [_class] = attributes;

      expect(_class.name.chars).toEqual("class");
      expect(_class.name.raw).toEqual(".");
      expect(_class.name.loc).toEqual({
        start: {
          line: 1,
          column: 4
        },
        end: {
          line: 1,
          column: 5
        }
      });

      expect(_class.equal).toBeNull();
      expect(_class.value.chars).toEqual("foo");
      expect(_class.value.loc).toEqual({
        start: {
          line: 1,
          column: 5
        },
        end: {
          line: 1,
          column: 8
        }
      });

      expect(_class.loc).toEqual({
        start: {
          line: 1,
          column: 4
        },
        end: {
          line: 1,
          column: 8
        }
      });
    });
  });
  describe("Complex examples", () => {
    test("Same attribute can be defined multiple times", () => {
      const src = "a.bang(class=classes class=['bing'])";
      const root = parse(src);
      const { attributes } = root.children[0];

      expect(root.children).toHaveLength(1);

      expect(attributes).toHaveLength(3);

      attributes.forEach(attribute => expect(attribute.name.chars).toEqual("class"));
    });
  });

  // describe("&attributes", () => {});
  test("Attributes of interpolated tags", () => {
    const src = "p #[strong(class='my-class') bar]";
    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [p] = root.children;
    const [strong] = p.children;
    const { attributes } = strong;

    expect(attributes).toHaveLength(1);

    const [_class] = attributes;

    expect(_class.name.chars).toEqual("class");
    expect(_class.value.chars).toEqual("'my-class'");
    expect(_class.loc).toEqual({
      start: {
        line: 1,
        column: 12
      },
      end: {
        line: 1,
        column: 28
      }
    });
  });
});

// a.bang(class=classes class=['bing'])

// p foo #[strong(class="my-class") bar]
