# Changelog

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
