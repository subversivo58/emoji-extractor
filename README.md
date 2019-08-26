# Javascript Emoji Extractor 🤔

This code extract emojis icons and associate data (groups, subgroups, descriptions) from [unicode.org](https://unicode.org/Public/emoji/12.0/emoji-test.txt) public file.

Emoji icons and associated data is copyrighted of **Unicode, Inc** ... see related documentation:

* [copyright and terms of use](https://www.unicode.org/copyright.html)
* [license](https://www.unicode.org/license.html)


----------

### What does it do:

This code extracts emojis and their description (name) and subsequent associated skins described as "fully-qualified" from the public file maintained by unicode.org

The extracted material is organized into a javascript object and organizes the icons (and descriptions) among the main descriptive groups.

```javascript
// v11 example
let v11 = {
    // Smileys & People
    people: [],
    // Animals & Nature
    nature: [],
    // Food & Drink
    food: [],
    // Travel & Places
    travel: [],
    // Activities
    activity: [],
    // Objecties
    objects: [],
    // Symbols
    symbols: [],
    // Flags
    flags: []
}

// v12 example
let v12 = {
    // Smileys & Emotion
    smiles: [],
    // People & Body
    people: [],
    // Animals & Nature
    nature: [],
    // Food & Drink
    food: [],
    // Travel & Places
    travel: [],
    // Activities
    activity: [],
    // Objecties
    objects: [],
    // Symbols
    symbols: [],
    // Flags
    flags: []
}
```

Not all icons have been implemented even in the latest versions of major browsers ... a "generic" list of unsupported icons is included in the code (by description).


----------

### Use:

**ES6 module example**:

```javascript
import EmojiExtractor from 'path/to/EmojiExtractor.mjs'

/**
 * @param {String}   url      - url for v11 or v12 data file target             [default: v12 url whith pŕoxy]
 * @param {Boolean}  minify   - simple remove lines and white spaces            [default: false]
 * @param {Boolean}  onlyicon - return only icons                               [default: false]
 * @param {Boolean}  tones    - return icons skins                              [default: true]
 * @param {String}   filemane - optional for save/download data                 [default: use .json]
 * @param {Array}    ignore   - list of ignore icons, skins                     [default: "generic list"]
 * @return {Promise}          - return data object and save/download method
 */
EmojiExtractor({
   url: 'path/to/12.0/emoji-test.txt', // v12 example
   minify: Boolean,
   onlyicon: Boolean,
   tones: Boolean,
   filename: String,
   ignore: Array
}).then(Extractor => {
    console.log(Extractor) // expect: {data: {…}, save: ƒ}
}).catch(console.log)
```

**In `GlobalScope` example (not ES6 module)**:

Include in your document:

```html
<script src="path/to/EmojiExtractor.min.js"></script>
```

----------

Use:

```javascript

let EmojiExtractor = window.EmojiExtractor

EmojiExtractor({/*settings*/}).then(Extractor => {
    // save to file ... use:
    Extractor.save()
}).catch(console.log)
```

----------

### Features:

Library lightway (no ES6 module):

* **minified** - only basic info comment: weight +- 5.36kB
* **unminified** - whit all code comments: weight +- 22.7kB

Data result (JSON):

* **minified** - only icons, no skins, no lines, no white spaces and with ignorated list: weight +- 13.6kB
* **unmified** - icons, descriptions, skins, lines and white spaces (with ignorated list): weight +- 155kB

> The above measurements are "gross" and do not represent network traffic measurements using **GZIP**

----------

### Demo:

Please, see the basic demonstration on [https://jsfiddle.net/subversivo58/](https://jsfiddle.net/subversivo58/jcng6wpy/56/)


----------

### Todo:

- [ ] implement ES6 module library version
- [ ] get specif icons by group
- [ ] get specific loot of icons (by "name/description")


----------

### Contributing:

Your contribution to this code will be welcomed, please see the [contribution guide](https://github.com/subversivo58/emoji-extractor/blob/master/CONTRIBUTING.md)


----------

### License:

MIT License

Copyright (c) 2019 Lauro Moraes [[AKA Subversivo58]](https://github.com/subversivo58)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
