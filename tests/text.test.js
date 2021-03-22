const { describe, expect, test } = require("@jest/globals");
const parse = require("../index");

describe("Text", () => {
  test("Inline text", () => {
    const src = "| Foo bar";
    const root = parse(src);
    const [text] = root.children;

    expect(root.children).toHaveLength(1);
    expect(text.data).toEqual("Foo bar");

    expect(text.loc).toEqual({
      start: {
        line: 1,
        column: 3
      },
      end: {
        line: 1,
        column: 10
      }
    });
  });

  test("Text inside node", () => {
    const src = "p Foo bar";
    const root = parse(src);
    const [text] = root.children[0].children;

    expect(root.children).toHaveLength(1);

    expect(text.data).toEqual("Foo bar");
    expect(text.loc).toEqual({
      start: {
        line: 1,
        column: 3
      },
      end: {
        line: 1,
        column: 10
      }
    });
  });
});
