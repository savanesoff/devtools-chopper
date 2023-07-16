[![by Protosus](https://raw.githubusercontent.com/savanesoff/protosus/main/public/icons/by-protosus.svg)](https://github.com/savanesoff/devtools-chopper)

# devtools-chopper

[![Github](https://badgen.net/badge/Protosus/devtools-chopper?color=purple&icon=github)](https://github.com/savanesoff/devtools-chopper)
[![Build Status](https://github.com/savanesoff/devtools-chopper/actions/workflows/publish.yaml/badge.svg?branch=main&event=push)](https://github.com/savanesoff/devtools-chopper/actions/workflows/publish.yaml)
[![npm version](https://badge.fury.io/js/devtools-chopper.svg)](https://badge.fury.io/js/devtools-chopper)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Li](https://badgen.net/badge/savanesoff/LI?color=blue)](https://www.linkedin.com/in/samvel-avanesov)

Chopper is a Javascript log display devtool which allows you to monitor application logs in DOM. Main feature being the ability to `PIN` specific type logs to make is easier to track log messages you're most interested in.

Its highly customizable and extends [`overdrag`](https://www.npmjs.com/package/devtools-chopper) package which allows element to be dragged, resized and placed anywhere on screen.

> 🌲🌲🌲 `chopping` logs 🌲🌲🌲

## Demo

You can view a live demo [here](https://savanesoff.github.io/devtools-chopper)

[![Validator](https://raw.githubusercontent.com/savanesoff/devtools-chopper/main/demo/assets/devtools-chopper.gif)](https://savanesoff.github.io/devtools-chopper)

## Installation

[![NPM](https://nodei.co/npm/devtools-chopper.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/devtools-chopper/)

To install `devtools-chopper`:

`npm`

```shell
npm install --save-dev devtools-chopper
```

`yarn`

```shell
yarn add -D devtools-chopper
```

`pnpm`

```shell
pnpm add -D devtools-chopper
```

## Usage

`devtools-chopper` is framework agnostic and can be used in any JS environment, `React`, `Angular`, `Vue` and supports TS out-of-the-box.

```TS
import Chopper from "devtools-chopper";
const chopper = new Chopper();

// standard scroll
chopper.$log('Message');
// pinned
chopper.$pin.log('Message');
```

### API

Standard log API available:

- `$debug()`
- `$log()`
- `$info()`
- `$warn()`
- `$error()`

To pin a message that is not los in scrolling jungle, use `$pin.<type>`, the message will be printed as a pinned entry as well as in the scrolling set of messages. Its a great way to track logs without searching for it.
However, using standard console of devtools, you can simply enter a filter parameter to achieve the very same effect.

Each takes unlimited number of arguments, just like a typical `console` method would.

```TS
// ...
chopper.$log('arg1', 'arg3', 'arg3', ...);
```

Messages will not be rendered if `logLevel` is set to filter out a message log type.

Ex: If `logLevel` is set to `none`, no messages will be printed.

Here is a map of `logLevel` gates:

```JSON
{
    "verbose": ["debug", "log", "info", "warn", "error"],
    "info": ["info", "warn", "error"],
    "warn": ["warn", "error"],
    "error": ["error"],
    "none": [],
}

```

<details> 
<summary> Advanced APIs </summary>
If you want to modify various parameters of a `chopper` instance, the following APIs are available for use:

- `setLogLevel( level Levels )`: changes current log level
- `console(data: unknown[], type: ConsoleType, info: EntryInfo)`: Override method that prints to console. Ex: if you'd like it to print only raw data without prettifying it with styles and other info.
- `renderEntry(parent: HTMLElement, data: unknown[], type: ConsoleType, info: EntryInfo)`: override how the chopper renders log entry element.
</details>

## Constructor

The Overdrag class constructor accepts an object with the following properties:

- **`name`** (required): name of logging

Optional:

- **`level`** (default: 'verbose'): Controls both chopper's and console outputs made by chopper.

- **`styles`** (default: current chopper console only theme): CSS styles object. Use plain CSS to style DOM elements.

- **`console`** (default: 'true'): Print to console.

<details>
<summary> See inherited overdrag parameters: </summary>

- **`element`** (default: randomly positioned `div` in body): The DOM element container of chopper.

- **`minContentHeight`** (default: `Overdrag.DEFAULTS.minContentHeight`): The minimum height of the DOM element (CSS height) in pixels. This prevents resizing smaller than the specified value.

- **`minContentWidth`** (default: `Overdrag.DEFAULTS.minContentWidth`): The minimum width of the DOM element (CSS width) in pixels. This prevents resizing smaller than the specified value.

- **`maxContentHeight`** (default: `Overdrag.DEFAULTS.maxContentHeight: Infinity`): The max height of the DOM element (CSS height) in pixels. This prevents resizing bigger than the specified value.

- **`maxContentWidth`** (default: `Overdrag.DEFAULTS.maxContentWidth: Infinity`): The max width of the DOM element (CSS width) in pixels. This prevents resizing bigger than the specified value.

- **`snapThreshold`** (default: `Overdrag.DEFAULTS.snapThreshold`): The distance to the edge of the relative parent element (top, left, bottom, right) when the element should snap to it.

- **`controlsThreshold`** (default: `Overdrag.DEFAULTS.controlsThreshold`): The distance to the edge of the element (top, left, bottom, right) when the element should show resize cursor and activate control points.

- **`clickDetectionThreshold`** (default: `Overdrag.DEFAULTS.clickDetectionThreshold`): The threshold distance to detect a click event. If you've started dragging the element, mouse up event will not trigger `click` event.

- **`stack`** (default: `false`): If true, an `Overdrag` parent element that has a recursively embedded `Overdrag` elements as a child will retain `over` state while the child is active. Else, the parent element will be set to `out` state (inactive)
</details>

> **NOTE**  
> Multiple instances can be spawned. Each will position itself randomly unless you specify its element style or provide your own element.

## Extending Class

Use `devtools-chopper` functionality to track any class instances logs, so you can monitor its activity:

```TS
import Chopper from "devtools-chopper";

class MyClass extends Chopper {
    constructor(){
        super({name: 'MyClass'});
        this.$log(this.name + 'initialized');
    }
}
```

> **NOTE**  
> Extends [`overdrag`](https://www.npmjs.com/package/overdrag) which inherits [`eventemitter3`](https://www.npmjs.com/package/eventemitter3).

## Description

You can control many different aspects of the instance by referring to its `overdrag` extension [documentation](https://www.npmjs.com/package/devtools-chopper)

### Log Entry

Each log entry includes the following info:

- Type of log and time of entry `<log type>@<time>` ex: `debug@12345555353`
- Log call origin file path and position: `<file path>:<line>:<column>`
- Log message as string

### In Brief:

`devtools-chopper` includes the following functionalities and interactions:

- Draggable: within offsetParent bounds
- Resizable: using 8 control points
- Play, Pause of scrollable logs
- Level switch: changes level interactively, by using header buttons
- Style every aspect of it using CSS or provide JSON styles options

## Console

`devtools-chopper` prints to console automatically using its current gates. When printing to console, the theme will be applied as well!
![Alt text](https://raw.githubusercontent.com/savanesoff/devtools-chopper/main/demo/assets/console.png)

> **NOTE**  
> You can disable console printing by passing `{console: false}`

```TS
const chopper = new Chopper({name: 'Event Monitoring', console: false});
```

## Road map

- Enable unit tests
- Enable pinning logs interactively by selecting log origin you're interested in.
- Enable logged objects preview

# PS

[![Li](https://badgen.net/badge/Hit%20me%20up%20on/LI?color=blue)](https://www.linkedin.com/in/samvel-avanesov)

Enjoy! 🎉🎉🎉
