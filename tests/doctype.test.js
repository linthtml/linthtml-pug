const { describe, expect, test } = require("@jest/globals");
const parse = require("../index");

describe("Doctype", () => {
  [
    "html",
    "xml",
    "transitional",
    "strict",
    "frameset",
    "1.1",
    "basic",
    "mobile",
    "plist"
  ].forEach(type => {
    test(`${type} doctype`, () => {
      const src = `doctype ${type}`;
      const { nodes } = parse(src);
      const [doctype] = nodes;

      expect(nodes).toHaveLength(1);
      expect(doctype.value).toEqual(type);

      expect(doctype.loc).toEqual({
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 1 + src.length
        }
      });
    });
  });

  test("Custom doctype", () => {
    const src = "doctype html PUBLIC \"-//W3C//DTD XHTML Basic 1.1//EN\"";
    const { nodes } = parse(src);
    const [doctype] = nodes;

    expect(nodes).toHaveLength(1);
    expect(doctype.value).toEqual("html PUBLIC \"-//W3C//DTD XHTML Basic 1.1//EN\"");

    expect(doctype.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 1 + src.length
      }
    });
  });
});
