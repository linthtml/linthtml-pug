const { describe, expect, test } = require("@jest/globals");
const parse = require("../index");

describe("Tags", () => {
  test("tag with no children", () => {
    const src = "div";
    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [div] = root.children;

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
    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [div] = root.children;

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
    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [input] = root.children;

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

  // At the moment parser only create text node if there're indentation
  // test("Parser add new line nodes between nodes (sibling nodes)", () => {
  //   const src = [
  //     "div",
  //     "div"
  //   ].join("\n");
  //   const root = parse(src);
  //   expect(root.children).toHaveLength(3);
  // });

  test("Parser add new line nodes between nodes (parent and children nodes)", () => {
    const src = [
      "ul",
      "  li"
    ].join("\n");

    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [ul] = root.children;

    expect(ul.name).toEqual("ul");
    expect(ul.children).toHaveLength(2); // new line + li
    const [new_line] = ul.children;

    expect(new_line.loc).toEqual({
      start: {
        line: 1,
        column: 3
      },
      end: {
        line: 2,
        column: 3
      }
    });

    expect(new_line.data).toEqual("\n  ");
  });

  test("Parser add new line nodes between nodes (parent and children nodes deep)", () => {
    const src = [
      "ul",
      "  li",
      "    span",
      "  li"
    ].join("\n");

    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [ul] = root.children;

    expect(ul.name).toEqual("ul");
    expect(ul.children).toHaveLength(4); // 2 new line + 2 li
    const [new_line, _, new_line_2] = ul.children;

    expect(new_line.loc).toEqual({
      start: {
        line: 1,
        column: 3
      },
      end: {
        line: 2,
        column: 3
      }
    });

    expect(new_line.data).toEqual("\n  ");

    expect(new_line_2.loc).toEqual({
      start: {
        line: 3,
        column: 9
      },
      end: {
        line: 4,
        column: 3
      }
    });

    expect(new_line_2.data).toEqual("\n  ");
  });


  test("Tag with text child", () => {
    const src = "p Lorem ipsum dolor sit amet, consectetur adipiscing elit";
    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [p] = root.children;

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

    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [ul] = root.children;

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
    expect(ul.children).toHaveLength(2); // new line + li

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

    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [div] = root.children;

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

    expect(div.children).toHaveLength(2); // new line + ul
    expect(div.children[1].children).toHaveLength(2); // new line + li
    expect(div.children[1]).toHaveProperty("parent", div);

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

  test("Children tags are correctly linked together", () => {
    const src = [
      "ul",
      "  li",
      "  li"
    ].join("\n");

    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [ul] = root.children;

    expect(ul.children).toHaveLength(4); // 2 new line + 2 li

    const [new_line_1, li_1, new_line_2, li_2] = ul.children;

    expect(new_line_1.parent).toEqual(ul);
    expect(new_line_1.previousSibling).toBeNull();
    expect(new_line_1.nextSibling).toEqual(li_1);

    expect(li_1.parent).toEqual(ul);
    expect(li_1.previousSibling).toEqual(new_line_1);
    expect(li_1.nextSibling).toEqual(new_line_2);

    expect(new_line_2.parent).toEqual(ul);
    expect(new_line_2.previousSibling).toEqual(li_1);
    expect(new_line_2.nextSibling).toEqual(li_2);

    expect(li_2.parent).toEqual(ul);
    expect(li_2.previousSibling).toEqual(new_line_2);
    expect(li_2.nextSibling).toBeNull();
  });
});
