const { describe, expect, test } = require("@jest/globals");
const parse = require("../index");

describe("Comment", () => {
  test("one line comment", () => {
    const src = "//a simple comment";
    const nodes = parse(src);
    const [comment] = nodes;

    expect(nodes).toHaveLength(1);
    expect(comment.data).toEqual("a simple comment");
    expect(comment.buffer).toBeTruthy();

    expect(comment.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 19
      }
    });
  });

  test("one line comment (buffer)", () => {
    const src = "//- a simple comment";
    const nodes = parse(src);
    const [comment] = nodes;

    expect(nodes).toHaveLength(1);
    expect(comment.data).toEqual(" a simple comment");
    expect(comment.buffer).toBeFalsy();

    expect(comment.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 21
      }
    });
  });

  test("multiline comment", () => {
    const src = [
      "//",
      "  a",
      "  multiline",
      "  comment"
    ];
    const nodes = parse(src.join("\n"));
    const [comment] = nodes;

    expect(nodes).toHaveLength(1);
    expect(comment.data).toEqual("a\nmultiline\ncomment");
    expect(comment.buffer).toBeTruthy();

    expect(comment.loc).toEqual({
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

  test("multiline comment(buffer)", () => {
    const src = [
      "//-",
      "  a",
      "  multiline",
      "  comment"
    ];
    const nodes = parse(src.join("\n"));
    const [comment] = nodes;

    expect(nodes).toHaveLength(1);
    expect(comment.data).toEqual("a\nmultiline\ncomment");
    expect(comment.buffer).toBeFalsy();

    expect(comment.loc).toEqual({
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
});
