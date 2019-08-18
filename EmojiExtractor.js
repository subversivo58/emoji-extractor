/**
 * @copyright Copyright (c) 2019 Lauro Moraes - [https://github.com/subversivo58]
 * @license The MIT License (MIT)             - [https://github.com/subversivo58/emoji-extractor/blob/master/LICENSE]
 * @version 0.1.0 [development stage]         - [https://github.com/subversivo58/emoji-extractor/blob/master/VERSIONING.md]
 */
;((root, factory) => {
    // UMD (Universal Module Definition) [improved]
    if ( typeof define === 'function' && define.amd ) {
        define(['exports'], factory)
    } else if ( typeof exports !== 'undefined' ) {
        factory(exports)
    } else {
        factory(root)
    }
})(this, exports => {
    'use strict'
    /**
     * Define execution context (web only)[not Node environment or others][not frameable]
     * -- Browser Context    - main browser (window and document access)
     * -- Web Worker Context - thread       (WorkerGlobalWorkerScope access, don't access ServiceWorkerGlobalScope)
     * -- Service Worker     - proxy        (access WorkerGlobalWorkerScope and ServiceWorkerGlobalScope)
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/self
     *
     *   -- "The Window.self read-only property returns the window itself, as a WindowProxy.
     *       It can be used with dot notation on a window object (that is, window.self) or standalone (self).
     *       The advantage of the standalone notation is that a similar notation exists for non-window contexts, such as in Web Workers.
     *       By using self, you can refer to the global scope in a way that will work not only in a window context (self will resolve to window.self)
     *       but also in a worker context (self will then resolve to WorkerGlobalScope.self)."
     */
    let IsServiceWorkerContext = ( ('WorkerGlobalScope' in self) && ('ServiceWorkerGlobalScope' in self) ) ? true : false,
        IsWebWorkerContext     = ( ('WorkerGlobalScope' in self) && !('ServiceWorkerGlobalScope' in self) ) ? true : false,
        IsWebBrowserContext    = ( ('window' in self && 'document' in self) && !IsServiceWorkerContext && !IsWebWorkerContext) ? true : false

    /**
     * global variables (in scope) [mutables]
     */
    let alreadyInstancied = false,   // protect plugin instance
        firstInstance = Date.now(),  // allow first instance of plugin
        metadata,                    // emoji list object
        cfg                          // store "extractor" options

    // Utilities
    const UTILS = {
        /**
         * Extend objects - simple and minimalist merge objects
         * @arguments {Object}(s) - objects to merge
         * @return {Object} - merged objects
         * @throws {Object} - empty
         */
        Extend(...args) {
            try {
                return Object.assign(...args)
            } catch(e) {
                return {}
            }
        },
        /**
         * utils "is"
         */
        isObject(obj) {
            return typeof obj === 'object'
        },
        isArray(obj) {
            return Array.isArray(obj)
        }
    }

    /**
     * Deep Freezing {Object} and {Object}(s) properties [imutable]
     * @see font: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
     */
    let deepFreeze = obj => {
        // get propertis names
        let propNames = Object.getOwnPropertyNames(obj)
        // freeze properties before auto-freeze
        propNames.forEach(name => {
            let prop = obj[name]
            // freeze prop
            if ( typeof prop === 'object' && prop !== null ) {
                deepFreeze(prop)
            }
        })
        // auto-freeze (nothing if already freeze)
        return Object.freeze(obj)
    }

    /** ------------------------------------------------------------------------------------------|
     * Plugin {Object} [matrix]
     * @param {Date} firstInit - timestamp reference to allow internal first instance (with PluginExtend)
     */
    let Plugin = function(firstInit) {
        // accept only new instance
        if ( !this instanceof Plugin ) {
            throw new Error('Plugin isn\'t initialized! This call is not instance of Plugin!')
        } else if ( alreadyInstancied ) {
            // plugin reached limit of two instances (remember: [first -> PluginExtend], [second -> Plugin exports])
            throw new Error('Plugin already initialized! Only accept one instance of Plugin!')
        } else if ( !firstInit || firstInit !== firstInstance ) {
            // instance of "exports"
            alreadyInstancied = true //make refferer to limit reached of instances (max 2)
        } else {
            // imutable...
            return deepFreeze(this)
        }
    }

    /** ------------------------------------------------------------------------------------------|
     * launch to global scope
     */
    const PluginExtend = new Plugin(firstInstance)

    /**
     * Commodities Plugin exportable (prototypes by "context")
     */
    if ( IsServiceWorkerContext ) {
        // do stuff ...
    } else if ( IsWebWorkerContext ) {
        // do stuff ...
    } else if ( IsWebBrowserContext ) {

        // add save method to Pluggin
        Plugin.prototype.save = () => {
            // check if metadata is defined
            if ( !metadata ) {
                throw new Error(`Emoji "data" isn't not setup!`)
            }
            // check if file name have extension
            if ( !/\./.test(cfg.filename) ) {
                // save to json
                cfg.filename = (/12/.test(cfg.url)) ? 'emoji-v12.json' : 'emoji.json'
            }

            let parts = cfg.filename.split('.'),
                last = parts.length - 1,
                ext = 'js',
                type = 'application/javascript; charset=UTF-8',
                result

            switch(parts[last]){
                case 'js':
                    result = cfg.minify ? `let data=${JSON.stringify(metadata)}` : `let data = ${JSON.stringify(metadata, null, 4)}`
                    break

                case 'mjs':
                    result = cfg.minify ? `let data=${JSON.stringify(metadata)};export default data` : `let data = ${JSON.stringify(metadata, null, 4)};\nexport default data`
                    ext = 'mjs'
                    break

                // force JSON by default
                case 'json':
                default:
                    result = cfg.minify ? JSON.stringify(metadata) : JSON.stringify(metadata, null, 4)
                    ext += 'on' // 'js' + 'on' = 'json'
                    type = 'application/json; charset=UTF-8'
                    break
            }
            let a = document.createElement('a')
            a.href = `data:${type},${encodeURIComponent(result)}`
            // use filename if is: mjs/js/json formats
            if ( parts[last] !== 'mjs' && parts[last] !== 'js' && parts[last] !== 'json' ) {
                a.download = (/12/.test(cfg.url)) ? `emoji-v12.${ext}` : `emoji.${ext}`
            } else {
                a.download = cfg.filename
            }
            a.hidden = true
            document.body.appendChild(a)
            // event
            a.addEventListener('click', () => {
                a.parentNode.removeChild(a)
            }, {
                once: true
            })
            // trigger
            a.click()
        }

        // add extractor to Plugin
        Plugin.prototype.extractor = options => {

            return new Promise((resolve, reject) => {
                // preserve options has `{Object}`
                options = (UTILS.isObject(options) && !UTILS.isArray(options)) ? options : {}

                // merge options and "default options"
                let opt = UTILS.Extend({}, {
                    // proxy + v12
                    url: 'https://cors-anywhere.herokuapp.com/' + 'https://unicode.org/Public/emoji/12.0/emoji-test.txt',
                    minify: false,
                    onlyicon: false,
                    filename: false,
                    ignore: [
                        'yawning face',
                        'brown heart',
                        'white heart',
                        'pinching hand',
                        'mechanical arm',
                        'mechanical leg',
                        'ear with hearing aid',
                        'deaf person',
                        'deaf man',
                        'deaf woman',
                        'person standing',
                        'man standing',
                        'woman standing',
                        'person kneeling',
                        'man kneeling',
                        'woman kneeling',
                        'man with probing cane',
                        'woman with probing cane',
                        'man in motorized wheelchair',
                        'woman in motorized wheelchair',
                        'man in manual wheelchair',
                        'woman in manual wheelchair',
                        'orangutan',
                        'guide dog',
                        'service dog',
                        'sloth',
                        'otter',
                        'skunk',
                        'flamingo',
                        'garlic',
                        'onion',
                        'waffle',
                        'falafel',
                        'butter',
                        'oyster',
                        'beverage box',
                        'mate',
                        'ice cube',
                        'hindu temple',
                        'manual wheelchair',
                        'motorized wheelchair',
                        'auto rickshaw',
                        'parachute',
                        'ringed planet',
                        'diving mask',
                        'yo-yo',
                        'kite',
                        'safety vest',
                        'sari',
                        'one-piece swimsuit',
                        'swim brief',
                        'shorts',
                        'ballet shoes',
                        'banjo',
                        'diya lamp',
                        'axe',
                        'probing cane',
                        'drop of blood',
                        'adhesive bandage',
                        'stethoscope',
                        'chair',
                        'razor',
                        'orange circle', 'yellow circle', 'green circle', 'purple circle', 'brown circle',
                        'red square', 'orange square', 'yellow square', 'green square', 'blue square', 'purple square', 'brown square'
                    ],
                    tones: true
                }, options)

                // store configuration for use later
                cfg = opt

                // request data file
                fetch(opt.url).then(res => res.text()).then(fileEmoji => {

                    // initialize object model
                    let EmojiText2Object = {}

                    // default scope variables
                    let startGroup = false,      // group is started
                        PSS = false,             // possible start skin(s)
                        NS = false,              // no skin
                        LAST_EMOJINAME = '',     // last EMOJINAME iterate
                        opened = false,          // reffer after `startGroup` is disabled
                        subgroupenabled = false, // subgroup comment reffer
                        isfirstsubgroup = true,  // default normalize first subgroup comment
                        currentGroup             // store current group reference

                    // walking to file lines
                    fileEmoji.toString().split('\n').forEach((line, i, array) => {

                        // store line length (for this iteration)
                        let len = line.length

                        // ignore skins tone definition lines (v11)
                        if ( /1F3F(B|C|D|E|F)                                      ;/.test(line) || /# subgroup: skin-tone/.test(line) ) {
                            return
                        }

                        // check if line is group comment
                        if ( /# group:/.test(line) ) {

                            // ignore "conponents" (skins and haires) [v12]
                            if ( /# group: Component/.test(line) ) {
                                return
                            }

                            // group is started?
                            if ( startGroup ) {
                                startGroup = false
                                opened = true
                            }

                            let group = line.replace(/# group: /, '')

                            // make group {Object} entire
                            switch(group){
                                case 'Smileys & People': // v11
                                    EmojiText2Object.people = []
                                    currentGroup = 'people'
                                    break
                                case 'Smileys & Emotion': // v12
                                    EmojiText2Object.smiles = []
                                    currentGroup = 'smiles'
                                    break
                                case 'People & Body': // v12
                                    EmojiText2Object.people = []
                                    currentGroup = 'people'
                                    break
                                case 'Animals & Nature':
                                    EmojiText2Object.nature = []
                                    currentGroup = 'nature'
                                    break
                                case 'Food & Drink':
                                    EmojiText2Object.food = []
                                    currentGroup = 'food'
                                    break
                                case 'Travel & Places':
                                    EmojiText2Object.travel = []
                                    currentGroup = 'travel'
                                    break
                                case 'Activities':
                                    EmojiText2Object.activity = []
                                    currentGroup = 'activity'
                                    break
                                case 'Objects':
                                    EmojiText2Object.objects = []
                                    currentGroup = 'objects'
                                    break
                                case 'Symbols':
                                    EmojiText2Object.symbols = []
                                    currentGroup = 'symbols'
                                    break
                                case 'Flags':
                                    EmojiText2Object.flags = []
                                    currentGroup = 'flags'
                                    break
                            }
                            startGroup = true
                        }

                        // check if line is subgroup comment
                        if ( /# subgroup:/.test(line) ) {
                            if ( isfirstsubgroup ) {
                                isfirstsubgroup = false
                            } else {
                                subgroupenabled = true
                            }
                        }

                        // check if line is "fully-qualified"
                        if ( /; fully-qualified/.test(line) ) {

                            // remove codepoint, comma separator and special char "#" from line (result only icon and EMOJINAME)
                            line = line.substr(67, len)
                            // separator
                            let parts     = line.split(/\s/),
                                icon      = parts[0],                              // effective icon
                                EMOJINAME = parts.slice(1, parts.length).join(' ') // emoji name (for searcheable)

                            // check if is "ignored" emoji by name (description)
                            for (let i = 0; i < opt.ignore.length; i++) {
                                 let REGEX_EMOJINAME = new RegExp(opt.ignore[i])
                                 if ( REGEX_EMOJINAME.test(line) ) {
                                     return
                                 }
                            }

                            // check if not use skin tones
                            if ( !opt.tones && /[:]/.test(EMOJINAME) && !/keycap:/.test(EMOJINAME) && !/flag:/.test(EMOJINAME) ) {
                                return
                            }

                            // adjust v12 prefix on flags names
                            if ( /flag: /.test(EMOJINAME) ) {
                                EMOJINAME = EMOJINAME.replace('flag: ', '')
                            }

                            // check emoji name for possible skin tone subgroup (ignore keycap)
                            const SkinTester = () => {
                                if ( /[:]/.test(EMOJINAME) && !/keycap:/.test(EMOJINAME) && !/flag:/.test(EMOJINAME) ) {
                                    // possible start skins (PSS)
                                    PSS = true
                                    return true
                                } else {
                                    return false
                                }
                            }

                            // last group item (Array) index
                            let lgi = () => {
                                return EmojiText2Object[currentGroup].length - 1
                            }

                            let pushRoutine = (index, special = false) => {
                                if ( special ) {
                                    EmojiText2Object[currentGroup][index][2].push(icon)
                                } else {
                                    EmojiText2Object[currentGroup].push([icon])
                                    EmojiText2Object[currentGroup][lgi()].push(EMOJINAME)
                                }
                            }

                            // is possible skin?
                            if ( PSS ) {
                                // mount RegExp for emoji name
                                let REGEX_EMOJINAME = new RegExp('^' + EMOJINAME.split(':')[0] + ':')
                                // test if emoji name (possible skin) is finded in last emoji name
                                if ( REGEX_EMOJINAME.test(LAST_EMOJINAME) ) {
                                    pushRoutine(lgi(), true)
                                } else {
                                    pushRoutine()
                                    PSS = false
                                    NS = true
                                }
                            } else {
                                if ( SkinTester() ) {
                                    EmojiText2Object[currentGroup][lgi()].push([icon])
                                    NS = false
                                } else {
                                    if ( NS ) {
                                        if ( subgroupenabled ) {
                                            if ( opened ) {
                                                pushRoutine()
                                                opened = false
                                            } else {
                                                pushRoutine()
                                            }
                                            subgroupenabled = false
                                        } else {
                                            pushRoutine()
                                        }
                                    } else {
                                        pushRoutine()
                                        NS = true
                                    }
                                }
                            }
                            // store current emoji name for next iteration
                            LAST_EMOJINAME = EMOJINAME
                        }

                        // on last iteration -------------------------------------------------------------|
                        if ( i === array.length - 1 ) {
                            // save only icons
                            if ( opt.onlyicon ) {
                                Object.keys(EmojiText2Object).forEach((key, idx, arr) => {
                                    let store = []
                                    for (let i = 0; i < EmojiText2Object[key].length; i++) {
                                         // save icons tones (skins)
                                         if ( opt.tones && EmojiText2Object[key][i][2] ) {
                                             store.push([EmojiText2Object[key][i][0], EmojiText2Object[key][i][2]])
                                         } else {
                                             store.push(EmojiText2Object[key][i][0])
                                         }
                                    }
                                    EmojiText2Object[key] = store
                                    //
                                    if ( idx === arr.length -1 ) {
                                        // store for future saving to file
                                        metadata = EmojiText2Object
                                        // resolve
                                        resolve({
                                            data: metadata,
                                            save: PluginExtend.save
                                        })
                                    }
                                })
                            } else {
                                // store for future saving to file
                                metadata = EmojiText2Object
                                // resolve
                                resolve({
                                    data: metadata,
                                    save: PluginExtend.save
                                })
                            }
                        }
                    })
                }).catch(reject)
            })
        }

    } else {
        throw new Error('Context unidentified ... please, this plugin running only Web Workers, Service Worker or Browser (window top)')
    }

    /** ------------------------------------------------------------------------------------------|
     * exports and disallow extensions and mutation [mutable off]
     */
    exports.EmojiExtractor = deepFreeze(new Plugin().extractor)
});
