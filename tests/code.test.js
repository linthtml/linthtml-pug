const { describe, expect, test } = require("@jest/globals");
const parse = require("../index");

describe("Unbuffered code block", () => {
  test("One line code block", () => {
    const src = "- var foo = 'bar'";
    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [code] = root.children;

    expect(code.type).toEqual("code");
    expect(code.data).toEqual("var foo = 'bar'");
    expect(code.buffer).toBeFalsy();
    expect(code.mustEscape).toBeFalsy();
    expect(code.isInline).toBeFalsy();
    expect(code.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 18
      }
    });
  });
  test("One line code block + children", () => {
    const src = [
      "- for (var x = 0; x < 3; x++)",
      "  li item"
    ].join("\n");
    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [code] = root.children;

    expect(code.type).toEqual("code");
    expect(code.data).toEqual("for (var x = 0; x < 3; x++)");
    expect(code.buffer).toBeFalsy();
    expect(code.mustEscape).toBeFalsy();
    expect(code.isInline).toBeFalsy();
    expect(code.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 2,
        column: 10
      }
    });

    expect(code.children).toHaveLength(2); // new line + li
    // no need to test all children properties
    expect(code.children[0].parent).toEqual(code);
  });

  test("Multi lines code block", () => {
    const src = [
      "-",
      "  var test = 'foo'",
      "  var test_2 = 'bar'"
    ].join("\n");

    const root = parse(src);
    expect(root.children).toHaveLength(1);

    const [code] = root.children;

    expect(code.type).toEqual("code");
    expect(code.data).toEqual("var test = 'foo'\nvar test_2 = 'bar'"); // PUG trim code lines
    expect(code.buffer).toBeFalsy();
    expect(code.mustEscape).toBeFalsy();
    expect(code.isInline).toBeFalsy();
    expect(code.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 3,
        column: 21
      }
    });
  });

  test("Multi lines code block (with extra new lines)", () => {
    const src = [
      "-",
      "",
      "",
      "  var test = 'foo'",
      "  var test_2 = 'bar'"
    ].join("\n");

    const root = parse(src);
    expect(root.children).toHaveLength(1);

    const [code] = root.children;

    expect(code.type).toEqual("code");
    expect(code.data).toEqual("var test = 'foo'\nvar test_2 = 'bar'"); // PUG trim code lines
    expect(code.buffer).toBeFalsy();
    expect(code.mustEscape).toBeFalsy();
    expect(code.isInline).toBeFalsy();
    expect(code.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 5,
        column: 21
      }
    });
  });

  // Does not work, no children "li" to code block
  // test("Multi lines code block with children", () => {
  //   const src = [
  //     "- ",
  //     "  var max = 5",
  //     "  for (var x = 0; x < 5; x++)",
  //     "    li item"
  //   ].join("\n");
  // });
});

describe("Buffered code block", () => {
  test("", () => {
    const src = [
      "p",
      "  = 'This code is <escaped>!'"
    ].join("\n");

    const root = parse(src);
    expect(root.children).toHaveLength(1);

    const [p] = root.children;
    expect(p.children).toHaveLength(2); // new line + code block

    const [, code] = p.children;

    expect(code.type).toEqual("code");
    expect(code.data).toEqual("'This code is <escaped>!'");
    expect(code.buffer).toBeTruthy();
    expect(code.mustEscape).toBeTruthy();
    expect(code.isInline).toBeFalsy();
    expect(code.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 30
      }
    });
  });

  test("Inline code block", () => {
    const src = "p= 'This code is' + ' <escaped>!'";

    const root = parse(src);
    expect(root.children).toHaveLength(1);

    const [p] = root.children;
    expect(p.children).toHaveLength(1); // new line + code block

    const [code] = p.children;

    expect(code.type).toEqual("code");
    expect(code.data).toEqual("'This code is' + ' <escaped>!'");
    expect(code.buffer).toBeTruthy();
    expect(code.mustEscape).toBeTruthy();
    expect(code.isInline).toBeTruthy();
    expect(code.loc).toEqual({
      start: {
        line: 1,
        column: 2
      },
      end: {
        line: 1,
        column: 34
      }
    });
  });

  test("Not escaped code block", () => {
    const src = [
      "p",
      "  != 'This code is <strong>not</strong> escaped!'"
    ].join("\n");

    const root = parse(src);
    expect(root.children).toHaveLength(1);

    const [p] = root.children;
    expect(p.children).toHaveLength(2); // new line + code block

    const [, code] = p.children;

    expect(code.type).toEqual("code");
    expect(code.data).toEqual("'This code is <strong>not</strong> escaped!'");
    expect(code.buffer).toBeTruthy();
    expect(code.mustEscape).toBeFalsy();
    expect(code.isInline).toBeFalsy();
    expect(code.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 50
      }
    });
  });

  test("Not exaped inline code block", () => {
    const src = "p!= 'This code is' + ' <strong>not</strong> escaped!'";

    const root = parse(src);
    expect(root.children).toHaveLength(1);

    const [p] = root.children;
    expect(p.children).toHaveLength(1); // new line + code block

    const [code] = p.children;

    expect(code.type).toEqual("code");
    expect(code.data).toEqual("'This code is' + ' <strong>not</strong> escaped!'");
    expect(code.buffer).toBeTruthy();
    expect(code.mustEscape).toBeFalsy();
    expect(code.isInline).toBeTruthy();
    expect(code.loc).toEqual({
      start: {
        line: 1,
        column: 2
      },
      end: {
        line: 1,
        column: 54
      }
    });
  });
});
