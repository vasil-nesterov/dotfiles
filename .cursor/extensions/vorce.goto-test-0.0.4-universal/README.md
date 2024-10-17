# goto-test

goto-test is a small extension for VSCode that provides a command to jump/go to the test file for a source file.
Useful when jumping between implementation and tests often.

## Features

###  Go to Test file

Tries to find and switch to the current file's test file. Uses configuration for each file ending to search. Only works in workspaces.

1. Open a workspace
2. If needed edit the config to add more file types
3. Open a file you have tests for
4. Run the "Go to Test file" command (`Ctrl+Shift+P` or `Cmd+Shift+P` and then type "go to test file")

### Go to Source file

The reverse of "Go to Test file"; tries to open the source/implementation file for a test file.

## Extension Settings

This extension contributes the following settings:

* `goto-test.testFilePatterns`: An object containing file ending => test file pattern. Example:

```json
"goto-test.testFilePatterns": {
  "java": "%source_file%Test.java",
  "ex": "%source_file%_test.exs"
}
```

## Known Issues

Only works in workspaces

## Release Notes

-
