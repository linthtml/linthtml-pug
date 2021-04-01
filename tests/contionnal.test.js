const { describe, expect, test } = require("@jest/globals");
const parse = require("../index");

describe("Conditional", () => {
  test("Simple if", () => {
    const src = [
      "if condition",
      "  p text"
    ].join("\n");
    const root = parse(src);

    expect(root.children).toHaveLength(1);
    const [conditional] = root.children;

    expect(conditional.type).toEqual("conditional");
    expect(conditional.test).toEqual("condition");

    expect(conditional.alternate).toBeUndefined();

    expect(conditional.consequent).toBeDefined();

    const { consequent } = conditional;

    expect(consequent.type).toEqual("block");
    expect(consequent.parent).toEqual(conditional);
    expect(consequent.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 9
      }
    });

    expect(consequent.children).toHaveLength(1);
    const [p] = consequent.children;

    // No need to tests all properties
    expect(p.type).toEqual("tag");
    expect(p.name).toEqual("p");

    expect(conditional.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 2,
        column: 9
      }
    });
  });

  test("if/else", () => {
    const src = [
      "if condition",
      "  p ok",
      "else",
      "  p not ok"
    ].join("\n");

    const root = parse(src);

    expect(root.children).toHaveLength(1);
    const [conditional] = root.children;

    expect(conditional.type).toEqual("conditional");
    expect(conditional.test).toEqual("condition");

    expect(conditional.alternate).toBeDefined();

    expect(conditional.consequent).toBeDefined();

    const { consequent, alternate } = conditional;

    expect(consequent.type).toEqual("block");
    expect(consequent.parent).toEqual(conditional);
    expect(consequent.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 7
      }
    });

    expect(consequent.children).toHaveLength(1);
    const [p] = consequent.children;

    // No need to tests all properties
    expect(p.type).toEqual("tag");
    expect(p.name).toEqual("p");

    expect(alternate.type).toEqual("block");
    expect(alternate.parent).toEqual(conditional);
    expect(alternate.loc).toEqual({
      start: {
        line: 4, // should be 3
        column: 3 // should be 1
      },
      end: {
        line: 4,
        column: 11
      }
    });

    expect(alternate.children).toHaveLength(1);
    const [p_else] = alternate.children;

    // No need to tests all properties
    expect(p_else.type).toEqual("tag");
    expect(p_else.name).toEqual("p");

    expect(conditional.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 4,
        column: 11
      }
    });
  });

  test("if/else if/else", () => {
    const src = [
      "if condition",
      "  p ok",
      "else if other_condition",
      "  p maybe ok",
      "else",
      "  p not ok"
    ].join("\n");

    const root = parse(src);

    expect(root.children).toHaveLength(1);
    const [conditional] = root.children;

    expect(conditional.type).toEqual("conditional");
    expect(conditional.test).toEqual("condition");

    expect(conditional.alternate).toBeDefined();
    expect(conditional.consequent).toBeDefined();

    const { consequent } = conditional;
    const else_if = conditional.alternate;

    expect(consequent.type).toEqual("block");
    expect(consequent.parent).toEqual(conditional);
    expect(consequent.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 7
      }
    });

    expect(consequent.children).toHaveLength(1);

    expect(else_if.type).toEqual("conditional");
    expect(else_if.parent).toEqual(conditional);
    expect(else_if.loc).toEqual({
      start: {
        line: 3, // should be 3
        column: 1
      },
      end: {
        line: 6,
        column: 11
      }
    });

    expect(else_if.alternate).toBeDefined();
    expect(else_if.consequent).toBeDefined();

    expect(else_if.consequent.children).toHaveLength(1);
    const [p_else_if] = else_if.consequent.children;

    // No need to tests all properties
    expect(p_else_if.type).toEqual("tag");
    expect(p_else_if.name).toEqual("p");

    const _else = else_if.alternate;

    expect(_else.type).toEqual("block");
    expect(_else.parent).toEqual(else_if);
    expect(_else.loc).toEqual({
      start: {
        line: 6, // should be 5
        column: 3 // should be 1
      },
      end: {
        line: 6,
        column: 11
      }
    });

    expect(conditional.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 6,
        column: 11
      }
    });
  });
});
