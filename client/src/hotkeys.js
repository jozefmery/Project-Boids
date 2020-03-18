/**
 * File: hotkeys.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 6.3.2020
 * License: none
 * Description: Defines a hotkey system consisting of context, 
 *              hotkey definition and different helpers.
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

function normalizeCombination(combination) {

    return combination.split("+")       // split combination to an array of keys
        .map(key => key.toLowerCase())  // all keys must be lower case to simplify comparison   
        .reduce((rest, current) =>      // reduce array of keys to an object
        ({ ...rest, [current]: true}), {});
}

function normalizeSequence(sequence) {

    return sequence.split(" ")                              // split whole sequence to an array of combinations
        .filter(combination => combination.length)          // discard empty strings e.g.: "a  b" => ["a", "", "b"] => ["a", "b"]
        .map(combination => normalizeCombination(combination));
}

function normalizeSequences(sequences) {

    return sequences.map(sequence => normalizeSequence(sequence));   // normalize all sequences                                    
}  

function combinationsMatch(subset, superset) {

    let match = true;
    let exactMatch = false;

    for(const key in subset) {

        if(superset[key] === undefined) {

            match = false;
            break;
        
        } else if(superset[key] === true) {

            exactMatch = true;
        } 
    }

    return {

        match, exactMatch: exactMatch && match
    };
}

/* enum */ class HotkeyEvent {

    static KEYDOWN = "KEYDOWN";
    static KEYUP = "KEYUP";
    static BOTH = "BOTH";
}

class Hotkey {

    constructor(sequences, callback, eventType) {

        // create helper properties
        this._id = uniqid();
        this._toggled = false;

        // enable context by default
        this._enabled = true;

        // save all properties
        this._callback = callback;
        this._sequences = normalizeSequences(sequences);
        this._eventType = eventType;
    }

    invoke(event = HotkeyEvent.KEYDOWN) {

        this._callback({ event });
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

    eventMatch(event) {

        return this._eventType === HotkeyEvent.BOTH || this._eventType === event;
    }
}

class HotKeyContext {

    constructor() {

        // enable context by default
        this._enabled = true;

        // create keyboard event handler
        this._keyChangedEvent = new EventHandler("keyChanged", this._keyChangedCallback);
        this._windowBlurEvent = new EventHandler("windowBlurred", this._onBlurCallback);
        
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

    _resetSequenceBuffer(event) {

        this._sequences[event].buffer = [];
    }

    _matchSequence(sequence, buffer, exactMatch) {

        const matchType = exactMatch ? "exactMatch" : "match";

        // empty sequence matches everything
        if(sequence.length === 0) return true;

        if(buffer.length < sequence.length) return false;

        // iterate backwards 
        let bufferIndex = buffer.length - 1;
        let sequenceIndex = sequence.length - 1;

        while(bufferIndex >= 0 && sequenceIndex >= 0) {

            // check if for combination match
            if(combinationsMatch(sequence[sequenceIndex], buffer[bufferIndex])[matchType]) {

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

    _callMatchingHandlers(event, sequenceBuffer, exactMatch, toggleHandler) {

        let preventDefault = false;

        for(const id in this._hotkeys) {

            const hotkey = this._hotkeys[id];

            // check if hotkey is enabled and the event type matches
            if(!hotkey.isEnabled() || !hotkey.eventMatch(event)) continue;

            // check every option
            for(const idx in hotkey._sequences) {

                const sequence = hotkey._sequences[idx];

                if(this._matchSequence(sequence, sequenceBuffer, exactMatch)) {

                    hotkey._toggled = toggleHandler && event === HotkeyEvent.KEYDOWN;

                    // call handler and exit
                    preventDefault |= hotkey._callback({ event: event });
                    break;
                }
            }
        }

        return preventDefault;
    }

    _mergeOldKeys(event) {
        
        const buffer = this._sequences[event].buffer;

        if(buffer.length < 2 || event === HotkeyEvent.KEYUP) return;
            
        let pop = true;
        
        const oldState = buffer[buffer.length - 2];
        const newState = buffer[buffer.length - 1];

        // check if new state contains all keys from old state as old
        for(const key in oldState) {

            if(newState[key] !== false) {

                pop = false;
                break;
            }
        }

        if(pop) {

            buffer.splice(buffer.length - 2, 1);
        }
    }

    _onBlurCallback = () => {

        for(const id in this._hotkeys) {

            const hotkey = this._hotkeys[id];

            if(hotkey._toggled && hotkey.eventMatch(HotkeyEvent.KEYUP)) {

                hotkey._toggled = false;
                hotkey._callback({ event: HotkeyEvent.KEYUP });
            }
        }

        this._keyDownBuffer = {};
    }

    _keyChangedCallback = event => {

        // check if context is enabled
        if(!this.isEnabled()) return;

        const event = event.pressed ? HotkeyEvent.KEYDOWN : HotkeyEvent.KEYUP;

        const key = normalizeKeyName(event.key);

        // set other keys as old
        for(const key in this._keyDownBuffer) this._keyDownBuffer[key] = false;
        // set as neweset key
        this._keyDownBuffer[key] = true;
        
        // save current state
        this._sequences[event].buffer.push(deepcopy(this._keyDownBuffer));
    
        if(event === HotkeyEvent.KEYUP) {

            delete this._keyDownBuffer[key];
        }

        // clear existing reset buffer timeout

        clearTimeout(this._sequences[event].reset);

        this._mergeOldKeys(event);

        const preventDefault = this._callMatchingHandlers(event, this._sequences[event].buffer, true, true);
        
        this._sequences[event].reset = setTimeout(() => this._resetSequenceBuffer(event), this._bufferResetTime);

        return preventDefault;
    }

    _registerHotkey(hotkey) {

        // save reference
        this._hotkeys[hotkey._id] = hotkey;

        return hotkey;
    }

    createHotkey(sequences, callback, eventType = HotkeyEvent.KEYDOWN) {

        return this._registerHotkey(new Hotkey(sequences, callback, eventType));
    }

    removeHotkey(hotkey) {

        // remove reference
        delete this._hotkeys[hotkey._id];
    }

    clearHotkeys() {

        this._hotkeys = {};
    }

    invokeSequence(sequence, event = HotkeyEvent.KEYDOWN) {

        const buffer = normalizeSequence(sequence);

        for(let eventType in event) {

            if(event[eventType]) {

                this._callMatchingHandlers(eventType, buffer, false, false);
            }
        }
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

/* examples:

    single keys: ["a"], ["b"],
    multiple combinations: ["a", "B"], - case doesn't matter
    multiple keys: ["ctrl+a", "a+b"],
    sequences: ["a b c"],
    complex sequences: ["ctrl ctrl+a", "ctrl+a ctrl+b shift+a a+b", "a+b b b ctrl+c"]
*/

export { HotKeyContext, HotkeyEvent };
