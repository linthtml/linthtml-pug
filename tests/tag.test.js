const { describe, expect, test } = require("@jest/globals");
const parse = require("../index");

describe("Tags", () => {
  test("tag with no children", () => {
    const src = "div";
    const nodes = parse(src);

    expect(nodes).toHaveLength(1);

    const [div] = nodes;

    expect(div.name).toEqual("div");

    expect(div.close).toBeUndefined();

    expect(div.open.chars).toEqual("div");
    expect(div.open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 4
      }
    });

    expect(div.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 4
      }
    });
  });

  test("Implicite div", () => {
    const src = ".foo";
    const nodes = parse(src);

    expect(nodes).toHaveLength(1);

    const [div] = nodes;

    expect(div.name).toEqual("div");

    expect(div.close).toBeUndefined();

    expect(div.open.chars).toEqual("div");
    expect(div.open.raw).toEqual("");
    expect(div.open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 1
      }
    });

    // Tag end position is at the end of the attributes
    expect(div.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 5
      }
    });
  });

  test("Tag with attributes on multiple lines", () => {
    const src = [
      "input(",
      "  type='checkbox'",
      "  name='agreement'",
      "  checked",
      ")"
    ].join("\n");
    const nodes = parse(src);

    expect(nodes).toHaveLength(1);

    const [input] = nodes;

    expect(input.name).toEqual("input");

    expect(input.close).toBeUndefined();

    expect(input.open.chars).toEqual("input");
    expect(input.open.raw).toEqual("input");
    expect(input.open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 6
      }
    });

    expect(input.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 4,
        column: 10
      }
    });
  });

  test("Tag with text child", () => {
    const src = "p Lorem ipsum dolor sit amet, consectetur adipiscing elit";
    const nodes = parse(src);

    expect(nodes).toHaveLength(1);

    const [p] = nodes;

    expect(p.name).toEqual("p");

    expect(p.close).toBeUndefined();

    expect(p.open.chars).toEqual("p");
    expect(p.open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 2
      }
    });

    expect(p.children).toHaveLength(1);
    expect(p.children[0].type).toEqual("text"); // Text content extractions is tested in the file text.test.js

    expect(p.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: src.length + 1
      }
    });
  });

  test("Tag with nested child (one level)", () => {
    const src = [
      "ul",
      "  li"
    ].join("\n");

    const nodes = parse(src);

    expect(nodes).toHaveLength(1);

    const [ul] = nodes;

    expect(ul.name).toEqual("ul");

    expect(ul.close).toBeUndefined();

    expect(ul.open.chars).toEqual("ul");
    expect(ul.open.raw).toEqual("ul");
    expect(ul.open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 3
      }
    });

    expect(ul.children).toHaveLength(1);

    expect(ul.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 2,
        column: 5
      }
    });
  });

  test("Tag with nested child (two levels)", () => {
    const src = [
      "div",
      "  ul",
      "    li"
    ].join("\n");

    const nodes = parse(src);

    expect(nodes).toHaveLength(1);

    const [div] = nodes;

    expect(div.name).toEqual("div");

    expect(div.close).toBeUndefined();

    expect(div.open.chars).toEqual("div");
    expect(div.open.raw).toEqual("div");
    expect(div.open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 4
      }
    });

    expect(div.children).toHaveLength(1);
    expect(div.children[0].children).toHaveLength(1);
    expect(div.children[0]).toHaveProperty("parent", div);

    expect(div.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 3,
        column: 7
      }
    });
  });
});
