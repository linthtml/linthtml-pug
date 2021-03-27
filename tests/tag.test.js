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
    const [new_line, , new_line_2] = ul.children;

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

  // should extract interpolation data too? ("#[" and "]")
  test("tag interpolation (single line)", () => {
    const src = "p foo #[strong bar]";
    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [p] = root.children;

    expect(p.children).toHaveLength(2); // Text "foo " and strong node

    const [text, strong] = p.children;

    expect(text.type).toEqual("text");
    expect(text.data).toEqual("foo ");
    expect(text.loc).toEqual({
      start: {
        line: 1,
        column: 3
      },
      end: {
        line: 1,
        column: 7
      }
    });

    expect(strong.type).toEqual("tag");
    expect(strong.name).toEqual("strong");
    expect(strong.children).toHaveLength(1);
    expect(strong.loc).toEqual({
      start: {
        line: 1,
        column: 9
      },
      end: {
        line: 1,
        column: 19
      }
    });
  });

  test("tag interpolation (multi lines)", () => {
    const src = [
      "p.",
      "  This is a very long and boring paragraph that spans multiple lines. Suddenly there is a #[strong strongly worded phrase] that cannot be",
      "  #[em ignored]."
    ].join("\n");

    const root = parse(src);

    expect(root.children).toHaveLength(1);

    const [p] = root.children;

    // 2 new line, 3 text nodes ("." is a text node) + 2 child (strong and em)
    expect(p.children).toHaveLength(7);

    const [new_line_1, text_1, strong, text_2, new_line_2, em, text_3] = p.children;

    expect(new_line_1.data).toEqual("\n  ");
    expect(new_line_1.loc).toEqual({
      start: {
        line: 1,
        column: 3
      },
      end: {
        line: 2,
        column: 3
      }
    });

    expect(text_1.data).toEqual("This is a very long and boring paragraph that spans multiple lines. Suddenly there is a ");
    expect(text_1.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 91
      }
    });

    expect(strong.type).toEqual("tag");
    expect(strong.name).toEqual("strong");
    expect(strong.children).toHaveLength(1);
    expect(strong.loc).toEqual({
      start: {
        line: 2,
        column: 93
      },
      end: {
        line: 2,
        column: 122
      }
    });

    expect(text_2.data).toEqual(" that cannot be");
    expect(text_2.loc).toEqual({
      start: {
        line: 2,
        column: 123
      },
      end: {
        line: 2,
        column: 138
      }
    });

    expect(new_line_2.data).toEqual("\n  ");
    expect(new_line_2.loc).toEqual({
      start: {
        line: 2,
        column: 138
      },
      end: {
        line: 3,
        column: 3
      }
    });

    expect(em.type).toEqual("tag");
    expect(em.name).toEqual("em");
    expect(em.children).toHaveLength(1);
    expect(em.loc).toEqual({
      start: {
        line: 3,
        column: 5
      },
      end: {
        line: 3,
        column: 15
      }
    });
    expect(text_3.data).toEqual(".");
    expect(text_3.loc).toEqual({
      start: {
        line: 3,
        column: 16
      },
      end: {
        line: 3,
        column: 17
      }
    });
  });
});

// p.
//   This is a very long and boring paragraph that spans multiple lines.
//   Suddenly there is a #[strong strongly worded phrase] that cannot be
//   #[em ignored].
// p.
//   And here's an example of an interpolated tag with an attribute:
//   #[q(lang="es") ¡Hola Mundo!]
// p foo #[strong bar]
// p foo #[strong(class="my-class") bar]
