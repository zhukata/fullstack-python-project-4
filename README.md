### Hexlet tests and linter status:
[![Actions Status](https://github.com/zhukata/fullstack-python-project-4/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/zhukata/fullstack-python-project-4/actions)

### Overview

**"PageLoader"** is a command line utility that downloads a page from the Internet and saves it on a computer. Besides the page itself (html), application downloads all its local assets (images, styles, and js), allowing one to open the page without the Internet.

### Minimal system requirements:
- Unix terminal
- Node.js: version from 18.x

### Utility setup
1. Clone the repo with the following command:
```bash
git clone 
```
2. Enter the root directory of the package with the command:
```bash
cd fullstack-python-project-4
```
3. Install the necessary dependencies with the command:
```bash
npm ci
```
4. Create a symbolic link to the package in order to make the utility to run from any directory of the system using the command: 
```bash
npm link
```

### Usage
```bash
Usage: page-loader [options] <url>

Page loader utility

Options:
  -V, --version      output the version number
  -o --output [dir]  output dir (default: "/home/user/current-dir")
  -h, --help         display help for command
```
Program can handle both absolute and relative output directory paths. By default, an output directory is a current working one. 
Unsuccessful asset downloads or writes to the system are acceptable and will not cause the program to stop.