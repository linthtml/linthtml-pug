const { describe, expect, test } = require("@jest/globals");
const parse = require("../index");

describe("Case", function() {
  test("Simple case", () => {
    const src = [
      "case friends",
      "  when 0",
      "    p you have no friends",
      "  default",
      "    p you have #{friends} friends;"
    ].join("\n");
    const root = parse(src);
    const case_node = root.children[0];

    expect(root.children).toHaveLength(1);

    expect(case_node.type).toEqual("case");
    expect(case_node.expr).toEqual("friends");

    expect(case_node.open.chars).toEqual("case friends");
    expect(case_node.open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 13
      }
    });

    const [, when_node, , default_node] = case_node.children;

    expect(when_node.type).toEqual("when");
    expect(when_node.expr).toEqual("0");

    expect(when_node.open.chars).toEqual("when 0");
    expect(when_node.open.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 9
      }
    });

    expect(when_node.parent).toEqual(case_node);
    expect(when_node.children).toHaveLength(2);

    expect(when_node.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 3,
        column: 26
      }
    });

    expect(default_node.type).toEqual("when");
    expect(default_node.expr).toEqual("default");

    expect(default_node.open.chars).toEqual("default");
    expect(default_node.open.loc).toEqual({
      start: {
        line: 4,
        column: 3
      },
      end: {
        line: 4,
        column: 10
      }
    });

    expect(default_node.parent).toEqual(case_node);
    expect(default_node.children).toHaveLength(2);

    expect(default_node.loc).toEqual({
      start: {
        line: 4,
        column: 3
      },
      end: {
        line: 5,
        column: 35
      }
    });

    expect(case_node.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 5,
        column: 35
      }
    });
  });

  test("Fall Through", () => {
    const src = [
      "case friends",
      "  when 0",
      "  when 1",
      "    p you have no friends",
      "  default",
      "    p you have #{friends} friends;"
    ].join("\n");
    const root = parse(src);
    const case_node = root.children[0];

    expect(root.children).toHaveLength(1);

    expect(case_node.type).toEqual("case");
    expect(case_node.expr).toEqual("friends");

    expect(case_node.open.chars).toEqual("case friends");
    expect(case_node.open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 13
      }
    });

    const [, when_node, , when_node_2, , default_node] = case_node.children;

    expect(when_node.type).toEqual("when");
    expect(when_node.expr).toEqual("0");

    expect(when_node.open.chars).toEqual("when 0");
    expect(when_node.open.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 9
      }
    });

    expect(when_node.parent).toEqual(case_node);
    expect(when_node.children).toHaveLength(0);

    expect(when_node.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 9
      }
    });

    expect(when_node_2.type).toEqual("when");
    expect(when_node_2.expr).toEqual("1");

    expect(when_node_2.open.chars).toEqual("when 1");
    expect(when_node_2.open.loc).toEqual({
      start: {
        line: 3,
        column: 3
      },
      end: {
        line: 3,
        column: 9
      }
    });

    expect(when_node_2.parent).toEqual(case_node);
    expect(when_node_2.children).toHaveLength(2);

    expect(when_node_2.loc).toEqual({
      start: {
        line: 3,
        column: 3
      },
      end: {
        line: 4,
        column: 26
      }
    });

    expect(default_node.type).toEqual("when");
    expect(default_node.expr).toEqual("default");

    expect(default_node.open.chars).toEqual("default");
    expect(default_node.open.loc).toEqual({
      start: {
        line: 5,
        column: 3
      },
      end: {
        line: 5,
        column: 10
      }
    });

    expect(default_node.parent).toEqual(case_node);
    expect(default_node.children).toHaveLength(2);

    expect(default_node.loc).toEqual({
      start: {
        line: 5,
        column: 3
      },
      end: {
        line: 6,
        column: 35
      }
    });

    expect(case_node.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 6,
        column: 35
      }
    });
  });

  test("Block Expansion", () => {
    const src = [
      "case friends",
      "  when 0: p you have no friends",
      "  default: p you have #{friends} friends"
    ].join("\n");
    const root = parse(src);
    const case_node = root.children[0];

    expect(root.children).toHaveLength(1);

    expect(case_node.type).toEqual("case");
    expect(case_node.expr).toEqual("friends");

    expect(case_node.open.chars).toEqual("case friends");
    expect(case_node.open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 13
      }
    });

    const [, when_node, , default_node] = case_node.children;

    expect(when_node.type).toEqual("when");
    expect(when_node.expr).toEqual("0");

    expect(when_node.open.chars).toEqual("when 0:");
    expect(when_node.open.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 10
      }
    });

    expect(when_node.parent).toEqual(case_node);
    expect(when_node.children).toHaveLength(1);

    expect(when_node.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 32
      }
    });

    expect(default_node.type).toEqual("when");
    expect(default_node.expr).toEqual("default");

    expect(default_node.open.chars).toEqual("default:");
    expect(default_node.open.loc).toEqual({
      start: {
        line: 3,
        column: 3
      },
      end: {
        line: 3,
        column: 11
      }
    });

    expect(default_node.parent).toEqual(case_node);
    expect(default_node.children).toHaveLength(1);

    expect(default_node.loc).toEqual({
      start: {
        line: 3,
        column: 3
      },
      end: {
        line: 3,
        column: 41
      }
    });

    expect(case_node.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 3,
        column: 41
      }
    });
  });
});
