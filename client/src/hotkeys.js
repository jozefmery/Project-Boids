/**
 * File: hotkeys.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 6.3.2020
 * License: none
 * Description: 
 * 
 */

// import dependencies
import uniqid from "uniqid";
import { EventHandler } from "./events";
import deepcopy from "deepcopy";

const keyNameNormalizer = {
    // convert from actual to the one used in definitions
    "+": "plus",
    " ": "space",
    "control": "ctrl"
};

function normalizeKeyName(key) {

    const lowerKey = key.toLowerCase(); // convert to lower case to simplify comparison
    const normalized = keyNameNormalizer[lowerKey]; 
    return normalized ? normalized : lowerKey;
}

/* enum */ class HotkeyEvent {

    static KEYDOWN = "KEYDOWN";
    static KEYUP = "KEYUP";
}

function normalizeSequences(sequences) {

    return  sequences.map(sequence =>                       // normalize all sequences
            sequence.toLowerCase()                          // all sequences must be lower case to simplify comparison
            .split(" ")                                     // split whole sequence to an array of combinations
            .filter(combination => combination.length)      // discard empty strings e.g.: "a  b" => ["a", "", "b"] => ["a", "b"]
            .map(combination => combination.split("+")      // split combination to an array of keys     
            .reduce((rest, current) =>                      // reduce array of keys to an object
                ({ ...rest, [current]: true}), {})));                                      
}  

function isObjectSubset(subset, superset) {

    for(const key in subset) {

        if(superset[key] === undefined) {

            return false;
        }
    }

    return true;
}

class HotKeyContext {

    constructor() {

        // enable context by default
        this._enabled = true;

        // create keyboard event handler
        this._keyChangedEvent = new EventHandler("keyChanged", this._keyChangedCallback);
        
        // create helper members
        this._hotkeys = {};
        this._keyDownBuffer = {};

        this._sequences = {

            [HotkeyEvent.KEYDOWN]: {

                reset: 0, // default to invalid timeout id
                buffer: [],
            },

            [HotkeyEvent.KEYUP]: {

                reset: 0, 
                buffer: [],
            },
        };
        
        this._bufferResetTime = 1000; // ms
    }

    _resetSequenceBuffer(dir) {

        this._sequences[dir].buffer = [];
    }

    _matchSequence(dir, sequence) {

        const buffer = this._sequences[dir].buffer;

        // empty sequence matches everything
        if(sequence.length === 0) return true;

        if(buffer.length < sequence.length) return false;

        // iterate backwards 
        let bufferIndex = buffer.length - 1;
        let sequenceIndex = sequence.length - 1;

        while(bufferIndex >= 0 && sequenceIndex >= 0) {

            // check if subset
            if(isObjectSubset(sequence[sequenceIndex], buffer[bufferIndex])) {

                // if last combination matched, the sequence matched
                if(sequenceIndex === 0) {

                    return true;
                }
            
            } else {

                return false;
            }

            --sequenceIndex;
            --bufferIndex;
        }
    }

    _callMatchingHandlers(dir) {

        for(const id in this._hotkeys) {

            const hotkey = this._hotkeys[id];

            // check if hotkey is enabled and the event type matches
            if(!hotkey.isEnabled() || hotkey.eventType() !== dir) continue;

            // check every option
            for(const idx in hotkey._sequences) {

                if(this._matchSequence(dir, hotkey._sequences[idx])) {

                    // call handler and exit
                    hotkey._callback();
                    break;
                }
            }
        }
    }

    _mergeOldKeys(dir) {
        
        const buffer = this._sequences[dir].buffer;

        if(buffer.length < 2) return;
            
        let pop = true;

        const oldState = buffer[buffer.length - 2];
        const newState = buffer[buffer.length - 1];

        for(const key in oldState) {

            if(!(oldState[key] && newState[key] === false)) {

                pop = false;
                break;
            }
        }

        if(pop) {

            buffer.splice(buffer.length - 2, 1);
        }
    }

    _keyChangedCallback = event => {

        // check if context is enabled
        if(!this.isEnabled()) return;

        const dir = event.pressed ? HotkeyEvent.KEYDOWN : HotkeyEvent.KEYUP;

        const key = normalizeKeyName(event.key);

        // set other keys as old
        for(const key in this._keyDownBuffer) this._keyDownBuffer[key] = false;

        // update key buffer
        if(dir === HotkeyEvent.KEYDOWN) {

            // set as new key
            this._keyDownBuffer[key] = true;
        }

        const stateCopy = deepcopy(this._keyDownBuffer);
        
        if(dir === HotkeyEvent.KEYUP) {

            delete this._keyDownBuffer[key];
        }

        // clear existing reset buffer timeout

        clearTimeout(this._sequences[dir].reset);

        this._sequences[dir].buffer.push(stateCopy);

        this._mergeOldKeys(dir);

        if(dir === HotkeyEvent.KEYDOWN) console.log(JSON.stringify(this._sequences[dir].buffer));

        this._callMatchingHandlers(dir);

        this._sequences[dir].reset = setTimeout(() => this._resetSequenceBuffer(dir), this._bufferResetTime);
    }

    _registerHotkey(hotkey) {

        // save reference
        this._hotkeys[hotkey._id] = hotkey;
    }

    _removeHotkey(hotkey) {

        // remove reference
        delete this._hotkeys[hotkey._id];
    }

    setKeyPressDiffTime(ms) {

        this._bufferResetTime = ms;
    }

    isEnabled() {

        return this._enabled;
    }

    setEnabled(enable) {

        this._enabled = enable;
    }
}

// create a default, global hotkey context
const globalHotkeyContext = new HotKeyContext(); 

class Hotkey {

    constructor(sequences, callback, eventType = HotkeyEvent.KEYDOWN, context = null) {

        // generate id
        this._id = uniqid();

        // enable context by default
        this._enabled = true;

        // save all properties
        this._callback = callback;
        this._sequences = normalizeSequences(sequences);
        this._eventType = eventType;

        // if no context is provided, default to global
        this._context = context ? context : globalHotkeyContext;

        this._context._registerHotkey(this);
    }

    isEnabled() {

        return this._enabled;
    }

    setEnabled(enable) {

        this._enabled = enable;
    }

    setCallback(callback) {

        this._callback = callback;
    }

    setSequences(sequences) {

        this._sequences = normalizeSequences(sequences);
    }

    eventType() {

        return this._eventType;
    }

    setEventType(eventType) {

        this._eventType = eventType;
    }

    remove() {

        this._context._removeHotkey(this);
    }
}

/* examples:

    single keys: ["a"], ["b"],
    multiple combinations: ["a", "B"], - case doesn't matter
    multiple keys: ["ctrl+a", "a+b"],
    sequences: ["a b c"],
    complex sequences: ["ctrl ctrl+a", "ctrl+a ctrl+b shift+a a+b", "a+b b b ctrl+c"]
*/

export {
    
        Hotkey,
        HotKeyContext, 
        globalHotkeyContext
        
    };
