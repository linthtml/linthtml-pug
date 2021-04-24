const {
  get_lines_index,
  index_to_loc
} = require("../lib/utils");

describe("get_lines_index", () => {
  test("", () => {
    const text = "foo";
    const lines = get_lines_index(text);

    expect(lines).toEqual([{
      end_index: 0,
      text: ""
    }, {
      end_index: 3,
      text: "foo"
    }]);
  });
  test("", () => {
    const text = [
      "foo",
      "bar"
    ].join("\n");
    const lines = get_lines_index(text);

    expect(lines).toEqual([{
      end_index: 0,
      text: ""
    }, {
      end_index: 4,
      text: "foo\n"
    }, {
      end_index: 7,
      text: "bar"
    }]);
  });
  test("", () => {
    const text = [
      "foo",
      "bar",
      "",
      ""
    ].join("\n");
    const lines = get_lines_index(text);

    expect(lines).toEqual([{
      end_index: 0,
      text: ""
    }, {
      end_index: 4,
      text: "foo\n"
    }, {
      end_index: 8,
      text: "bar\n"
    }, {
      end_index: 9,
      text: "\n"
    }, {
      end_index: 9,
      text: ""
    }]);
  });
});

describe("index_to_loc", () => {
  test("", () => {
    const text = "foo";
    const lines = get_lines_index(text);

    expect(index_to_loc(0, lines)).toEqual({
      line: 1,
      column: 1
    });
    expect(index_to_loc(1, lines)).toEqual({
      line: 1,
      column: 2
    });
    expect(index_to_loc(2, lines)).toEqual({
      line: 1,
      column: 3
    });
    expect(index_to_loc(3, lines)).toEqual({
      line: 1,
      column: 4
    });
  });
  test("", () => {
    const text = [
      "foo",
      "bar"
    ].join("\n");
    const lines = get_lines_index(text);

    expect(index_to_loc(2, lines)).toEqual({
      line: 1,
      column: 3
    });

    expect(index_to_loc(4, lines)).toEqual({
      line: 2,
      column: 1
    });

    expect(index_to_loc(5, lines)).toEqual({
      line: 2,
      column: 2
    });

    expect(index_to_loc(6, lines)).toEqual({
      line: 2,
      column: 3
    });

    expect(index_to_loc(7, lines)).toEqual({
      line: 2,
      column: 4
    });
  });
});
