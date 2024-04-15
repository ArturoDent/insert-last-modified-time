# Insert Last Modified Time

Using `vscode.workspace.fs.stat(URI)).mtime` the last modified time of the current file is obtained.  It can be inserted at the cursor or at the top of the file (on command or on save) using a user-specified template and various time-date options.  `Intl.DateTimeFormat(locales, options).format(timeMS)` is used for this.

## Extension Settings

### This extension contributes the following two commands:

1. "LMT: Insert Last Modified Time at top of file" : (`insert-last-modified-time.insertTimeTop`)

This command will use the current template and options from the settings and insert the template at the top of the current file.

This command can be used in a `editor.codeActionsOnSave` setting (see below) so that the command is triggered each time you save the file.

2. "LMT: Insert Last Modified Time at cursor" : (`insert-last-modified-time.insertTimeCursor`)

Simply insert the last modified time at the cursor - does not use the template, but does use the options (as shown below).

Both commands can be bound to a keybinding.  Examples:

```jsonc
{
  "key": "alt+t",                     // whatever keybinding you want
  "command": "insert-last-modified-time.insertTimeCursor"
},
{
  "key": "shift+alt+t",               // whatever keybinding you want
  "command": "insert-last-modified-time.insertTimeTop"
},

// insert the LMT and comment the line
{
  "key": "ctrl+alt+t",                // whatever keybinding you want
  "command": "runCommands",           // a built-in vscode code
  "args": {
    "commands": [
      "insert-last-modified-time.insertTimeCursor",
      "editor.action.addCommentLine"
    ]
  },
  // restrict to rust files
  // "when": "editorTextFocus && !editorReadonly && editorLangId == rust"
  
  // restrict to .js and .ts files
  "when": "editorTextFocus && !editorReadonly && resourceExtname =~ /\\.(js|ts)/"
}
```

### This extension contributes the following settings:

1. "Insert Last Modified Time: Template" (`insertLastModifiedTime.template` in settings.json)

A template that will be used when inserting the last modified time at the **top** of the current file.  Example (and the default):

```plaintext
/**
 * Last Modified Time: %% LMT %%
 */
```

This `%% LMT %%` is required to be somewhere in your template.  It will be replaced by the last modified time and is part of the matching function of this extension.  The extension will search the top of the document for a pattern like your template.  The template can be anything, as long as `%% LMT %%` appears in it somewhere.  And you probably want it to be a comment so use the language's comment characters.

* If you see squigglies under your template in `settings.json` and the error message is:

```plaintext
String does not match the pattern of \"%%\s*LMT\s*%%\".
```

that means you don't have the required `%% LMT %%` (spaces are optional, `\s*`) in your template.

Another example of a template:

```plaintext
// Current file last modified : %%LMT%%
```

```plaintext
"insertLastModifiedTime.template": "/**\n * Last Modified Time: %% LMT %%: JS\n */",
```

As seen above you can use `\n` or `\t` instead of actual whietspace in your templates.

2. Insert Last Modified Time: Options (`insertLastModifiedTime.options` in settings.json)

Set options from `Intl.DateTimeFormat(locales, options)`, see [MDN: Intl.DateTimeFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#timezonename).

You should get intellisense suggestions for the options and their values in `setting.json`.

Examples:

```jsonc
"insertLastModifiedTime.options": {
  "locales": "en-US",
  "timeStyle": "full",
  "dateStyle": "full"
}
// Friday, April 12, 2024 at 8:39:31 PM Mountain Daylight Time
```

```jsonc
"insertLastModifiedTime.options": {
  
  "locales": "fr",
  
  "year": "2-digit",
  "hour": "2-digit",
  "minute": "numeric",
  
  "timeZone": "CET",
  "timeZoneName": "long"
}
// 13 avril 24 à 05:13 UTC+02:00
```

You can combine language-specific settings into one setting:

```jsonc
"[javascript]": { 
  "insertLastModifiedTime.template": "/**\n * Last Modified Time: %% LMT %%\n */",
  "insertLastModifiedTime.options": {
    "locales": "en-US",
    "timeStyle": "full",
    "dateStyle": "full",
  }
}
```

The time and date options include:

```plaintext
1.  timeStyle  - cannot be used with other options like `hour`, `month`, etc.
2.  dateStyle  - cannot be used with other options like `hour`, `month`, etc.

3.  month - this group (options 3-10) can't be used with `dateStyle` and/or `timeStyle`
4.  day
5.  weekday
6.  dayPeriod
7.  hour
8.  minute
9.  second
10. timeZoneName

11. locales - only one string supported, like "en-US"
12. localeMatcher
13. calendar
14. numberingSystem
15. hour12
16. hourCycle
17. timeZone
```

## Known Issues

`dateStyle` and `timeStyle` cannot be used together with options like `hour`, `month`, `day`, `second`, etc.  This is a limitation of `Intl.DateTimeFormat()`, see [Intl warning](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#timestyle).

Using `dateStyle` and `timeStyle` with those options 3-10 above will cause errors to appear (the squiggly lines, if enabled) in the template settings.

## `codeActionsOnSave`

The command `insert-last-modified-time.insertTimeTop` can be used in a `codeActionsOnSave` setting so that it is run whenever the current file is saved.  Examples of the setting:

```jsonc
"editor.codeActionsOnSave": [                          // applies to all languages
  "source.insert-last-modified-time.insertTimeTop"     // must start with "source."
],

"[typescript][javascript]": {         // to restrict it to the specified languages
  "editor.codeActionsOnSave": [
    "source.insert-last-modified-time.insertTimeTop"   // must start with "source."
  ]
}
```

## TODO

* support array of `locales`
* support comment start/end for each language
* exclusion list (of globs) to not apply `codeActionsOnSave` ?

## Release Notes

0.0.1 Initial Release

-----------------------------------------------------------------------------------------------------------  
