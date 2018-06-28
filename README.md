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

    add [options] <note>     take a new note
    dir                      show enpitz home directory
    list [options] [date]    show notes saved in specific date (default: today)
    render [options] [date]  render saved notes
```

### take a note

```sh
$ enpitz add 'Good morning!'
√ success saved note: `Good morning!` at Users/lettenj61/_enpitz/2016-05-14.json
```

### remind a note

```sh
$ enpitz list 2016-05-14
[2016-05-14 08:18:04]: Good morning!
```

### render notes

```
$ enpitz render

# Notes 2016-05-14

## 2018-05-14 08:18:04

Good morning!

```

## license

This software is released under MIT license. See [LICENSE](https://github.com/lettenj61/enpitz/blob/master/LICENSE) for the detail.