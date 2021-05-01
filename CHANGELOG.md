# Changelog

## v0.5.0

### Feature - Improve conditions conversion

Now LintHTML will be able to access nodes inside conditions.

## v0.4.0

### Feature - Conditions conversion

Now linthtml-pug convert conditions (`if`, `else if` ,`else`) in a format compatible with LintHTML but with some limitations.
At the moment LintHTML won't be able to access nodes inside the conditions this will require some evolutions on LintHTML sides.

## v0.3.0

### Feature - Return root node

The parser now return the root node of the parsed code to match the format expected by LintHTML.

### Feature - Add missing indent nodes

Now the return AST contains text nodes with only indent chars (spaces/tabs) between the other nodes.
The PUG parser does not extract those nodes but LintHTML uses those nodes in the `indent-*` rules.

## v0.2.0

### Feature - Comments conversion

Now comments are correctly converted in a format correctly handled by LintHTML.

## v0.1.0

First release of the parser with basic support for tags, text node, doctype and attributes.
