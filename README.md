enpitz
======

A tool to quickly take notes from your terminal.

**WARNING: This software is under heavy development, and not all of its features tested. Be careful and use it at your own risk.**

## prerequisite

* `Node.js` version 8 or later

## installation

```sh
$ npm i -g enpitz
```

OR

```sh
$ yarn global add enpitz
```

## how to use

Type `enpitz -h` to get help message.

```
  Usage: enpitz [options] [command]

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

  Commands:

    add <note>     Save a note to storage
    list [date]    Show notes saved in specific date (default: today)
```

### take a note

```sh
$ enpitz add 'Good morning!'
√ success Successfully saved note: `Good morning!` at Users/lettenj61/_enpitz/2016-05-14.json
```

### remind a note

```sh
$ enpitz list 2016-05-14
* start Showing 1 note(s) from Users/lettenj61/_enpitz/2016-05-14.json ...
[2016-05-14 08:18:04]: Good morning!
√ success Done.
```

## license

This software is released under MIT license. See [LICENSE](https://github.com/lettenj61/enpitz/blob/master/LICENSE) for the detail.