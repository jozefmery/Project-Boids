/**
 * File: hotkeys.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 6.3.2020
 * License: none
 * Description: Defines a hotkey system consisting of context, 
 *              hotkey definition and different helpers.
 *              examples of supported bindings:
 *                  single keys: ["a"], ["b"],
 *                  multiple keys: ["a", "B"], - case doesn't matter
 *                  combinations: ["ctrl+a", "a+b"],
 *                  sequences: ["a b c"],
 *                  complex sequences: ["ctrl ctrl+a", "ctrl+a ctrl+b shift+a a+b", "a+b b b ctrl+c"]
 *
 */

// import dependencies
import uniqid from "uniqid";

// helper object which contains key names present in event objects
// and normalized strings as values which are used in sequence definitions
const keyNameNormalizer: { [index: string]: string } = {
    "+": "plus",
    " ": "space",
    "control": "ctrl"
};

function normalizeKeyName(key: string): string {

    // convert to lower case to simplify comparison
    const lowerKey = key.toLowerCase(); 
    const normalized = keyNameNormalizer[lowerKey]; 
    return normalized ? normalized : lowerKey;
};

enum HotkeyEvent {

    KEYDOWN,
    KEYUP,
    BOTH
};

interface ICombination { 

    [index: string]: boolean;
};

class Combination {

    /// Protected members

    protected combination: ICombination;

    /// Constructor function

    public constructor(combination: Readonly<ICombination> = {}) {

        // create copy
        this.combination = { ...combination };
    }

    /// Protected static methods 

    protected static getNormalized(combination: string): ICombination {

        return combination.replace(/\s+/g, "")  // remove redundant spaces
                .split("+")                     // split combination to an array of keys
                .map(key => key.toLowerCase())  // all keys must be lower case to simplify comparison
                .filter(key => key.length)      // remove empty string
                .reduce((rest, current) =>      // reduce array of keys to an object
                ({ ...rest, [current]: true}), {});
    }

    /// Public static methods

    public static fromString(combination: string): Combination {

        return new Combination(Combination.getNormalized(combination));
    }

    public static fromOther(combination: Readonly<Combination>) {

        return new Combination(combination.get());
    }

    /// Public methods

    public get(): Readonly<ICombination> {
        
        return this.combination;
    }
    
    public clear(): void {

        this.combination = {};
    }

    public addKey(key: string): void {

        this.combination[key] = true;
    }

    public removeKey(key: string) {

        delete this.combination[key];
    }

    public setOldKeys() {

        for(let key in this.combination) {

            this.combination[key] = false;
        }
    }

    public isSubsetOf(other: Readonly<Combination>, exact: boolean): boolean {
        
        let matched = true;
        let matchedExactly = false;
        const superset = other.get();

        for(const key in this.combination) {

            if(superset[key] === undefined) {

                matched = false;
                break;
            
            } else if(superset[key] === true) {

                matchedExactly = true;
            } 
        }

        return exact ? matchedExactly && matched : matched;
    }

    public hasOldKeysOf(other: Readonly<Combination>): boolean {

        const old = other.get();

        for(const key in old) {

            if(this.combination[key] !== false) {

                return false;
            }
        }

        return true;
    }
};

type SequenceData = Array<Combination>;

class Sequence {

    /// Protected members

    protected sequence: SequenceData;

    /// Constructor function

    public constructor(sequence: string = "") {

        this.sequence = Sequence.getNormalized(sequence);
    }

    /// Protected static methods

    protected static getNormalized(sequence: string): SequenceData {

        return sequence.split(" ")                              // split whole sequence to an array of combinations
            .filter(combination => combination.length)          // discard empty strings e.g.: "a  b" => ["a", "", "b"] => ["a", "b"]
                                                                // space is defined using "space" string
            .map(combination => Combination.fromString(combination));
    }

    /// Public methods

    public get(): Readonly<SequenceData> {

        return this.sequence;
    }

    public push(combination: Readonly<Combination>): void {
        
        // push a copy
        this.sequence.push(Combination.fromOther(combination));
    }

    public clear(): void {

        this.sequence = [];
    }

    public mergeOldKeys(): void {

        // sanity check
        if(this.sequence.length < 2) throw new Error("Attempting to merge keys when there aren't at least 2 combinations");

        this.sequence.splice(this.sequence.length - 2, 1);
    }

    public match(sequence: Readonly<Sequence>, exact: boolean): boolean {

        const buffer = sequence.get();

        // empty sequence definition matches everything
        if(this.sequence.length === 0) return true;

        if(buffer.length < this.sequence.length) return false;

        // iterate backwards 
        let bufferIndex = buffer.length - 1;
        let sequenceIndex = this.sequence.length - 1;

        while(bufferIndex >= 0 && sequenceIndex >= 0) {

            const subset = this.sequence[sequenceIndex];
            const superset = buffer[bufferIndex];

            // check if for combination match
            if(subset.isSubsetOf(superset, exact)) {

                // if last combination matched, the sequence matched
                if(sequenceIndex === 0) {

                    return true;
                }
            
            } else {

                // break loop and return false
                break;
            }

            --sequenceIndex;
            --bufferIndex;
        }

        return false;
    }
};

// define callback signature
type Callback = (event: { event: HotkeyEvent }) => boolean | void;
type SequenceDefinitions = Readonly<Array<string>>;

class Hotkey {

    /// Protected members

    protected readonly id: string;
    protected toggled: boolean;
    protected enabled: boolean;

    protected sequences: Array<Sequence>;

    /// Constructor function

    public constructor(sequences: SequenceDefinitions, 
                protected callback: Callback, 
                protected eventType: HotkeyEvent) {

        // create helper properties
        this.id = uniqid();
        this.toggled = false;

        // enable hotkey by default
        this.enabled = true;
        
        // convert from definition to internal representation
        this.sequences = Hotkey.stringsToSequences(sequences);
    }

    /// Protected static methods

    protected static stringsToSequences(sequences: SequenceDefinitions): Array<Sequence> {

        return sequences.map(sequence => new Sequence(sequence));
    }

    /// Public methods

    public invoke(event: HotkeyEvent = HotkeyEvent.KEYDOWN): ReturnType<Callback> {

        return this.callback({ event });
    }

    public isToggled(): boolean {

        return this.toggled;
    }

    public setToggled(toggle: boolean): void {

        this.toggled = toggle;
    }

    public isEnabled(): boolean {

        return this.enabled;
    }

    public setEnabled(enable: boolean): void {

        this.enabled = enable;
    }

    public setCallback(callback: Callback): void {

        this.callback = callback;
    }

    public setSequences(sequences: SequenceDefinitions): void {

        this.sequences = Hotkey.stringsToSequences(sequences);
    }

    public getEventType(): HotkeyEvent {

        return this.eventType;
    }

    public setEventType(eventType: HotkeyEvent): void {

        this.eventType = eventType;
    }

    public eventMatch(event: HotkeyEvent): boolean {

        return this.eventType === HotkeyEvent.BOTH || this.eventType === event;
    }

    public getId(): string {

        return this.id;
    }

    public match(sequence: Readonly<Sequence>, exact: boolean): boolean {

        for(const idx in this.sequences) {

            if(this.sequences[idx].match(sequence, exact)) {

                return true;
            }
        }

        return false;
    }
};

type SequenceBuffer = {

    reset: ReturnType<typeof setTimeout>;
    buffer: Sequence;
};

type EventIndexer = HotkeyEvent.KEYDOWN | HotkeyEvent.KEYUP;

class HotKeyContext {

    /// Protected Members

    protected enabled: boolean;
    protected hotkeys: { [index: string]: Hotkey };
    protected keyCombination: Combination;
    protected sequences : {

        [HotkeyEvent.KEYUP]: SequenceBuffer;
        [HotkeyEvent.KEYDOWN]: SequenceBuffer;

    };
    protected bufferResetTime: number;

    /// Constructor function

    public constructor() {

        // enable context by default
        this.enabled = true;
        
        // initialize helper members
        this.hotkeys = {};
        this.keyCombination = new Combination();

        this.sequences = {

            [HotkeyEvent.KEYDOWN]: {

                reset: undefined as any, // default to invalid timeout id
                buffer: new Sequence()
            },

            [HotkeyEvent.KEYUP]: {

                reset: undefined as any, 
                buffer: new Sequence()
            },
        };
        
        this.bufferResetTime = 1000; // ms
    }

    /// Protected methods

    protected resetSequenceBuffer(event: EventIndexer): void {

        this.sequences[event].buffer.clear();
    }

    protected callMatchingHandlers(events: HotkeyEvent, sequence: Readonly<Sequence>, 
                                exactMatch: boolean, toggleHandler: boolean): boolean {

        let preventDefault = false;

        let eventArray = events === HotkeyEvent.BOTH ? [HotkeyEvent.KEYDOWN, HotkeyEvent.KEYUP] : [events];

        for(const event of eventArray) {

            for(const id in this.hotkeys) {

                const hotkey = this.hotkeys[id];

                // check if hotkey is enabled and the event type matches
                if(!hotkey.isEnabled() || !hotkey.eventMatch(event)) continue;

                if(hotkey.match(sequence, exactMatch)) {

                    hotkey.setToggled(toggleHandler && event === HotkeyEvent.KEYDOWN);

                    // call handler and exit
                    preventDefault = hotkey.invoke(event) || preventDefault;
                    break;
                }
            }
        }

        return preventDefault;
    }

    protected mergeOldKeys(event: EventIndexer): void {
        
        const sequence = this.sequences[event].buffer; 
        const buffer = sequence.get();

        if(buffer.length < 2 || event === HotkeyEvent.KEYUP) return;
        
        const oldCombination = buffer[buffer.length - 2];
        const newCombination = buffer[buffer.length - 1];

        if(newCombination.hasOldKeysOf(oldCombination)) {

            sequence.mergeOldKeys();
        }
    }

    protected registerHotkey(hotkey: Hotkey): Hotkey {

        // save reference
        this.hotkeys[hotkey.getId()] = hotkey;

        return hotkey;
    }

    /// Public methods

    public onBlurCallback(): void {

        for(const id in this.hotkeys) {

            const hotkey = this.hotkeys[id];

            if(hotkey.isToggled() && hotkey.eventMatch(HotkeyEvent.KEYUP)) {

                hotkey.setToggled(false);
                hotkey.invoke(HotkeyEvent.KEYUP);
            }
        }

        this.keyCombination.clear();
    }

    public onKeyChangedCallback(event: { key: string, pressed: boolean }): boolean {

        // check if context is enabled
        if(!this.isEnabled()) return false; 

        const eventType = event.pressed ? HotkeyEvent.KEYDOWN : HotkeyEvent.KEYUP;

        const key = normalizeKeyName(event.key);

        // set other keys as old
        this.keyCombination.setOldKeys();
        // set as neweset key
        this.keyCombination.addKey(key);
        
        // save current state
        this.sequences[eventType].buffer.push(this.keyCombination);
    
        if(eventType === HotkeyEvent.KEYUP) {

            this.keyCombination.removeKey(key);
        }

        // clear existing reset buffer timeout

        clearTimeout(this.sequences[eventType].reset);

        this.mergeOldKeys(eventType);

        const preventDefault = this.callMatchingHandlers(eventType, this.sequences[eventType].buffer, true, true);
        
        this.sequences[eventType].reset = setTimeout(() => this.resetSequenceBuffer(eventType), this.bufferResetTime);

        return preventDefault;
    }

    public createHotkey(sequences: Readonly<Array<string>>, callback: Callback, eventType = HotkeyEvent.KEYDOWN): Hotkey {

        return this.registerHotkey(new Hotkey(sequences, callback, eventType));
    }

    public removeHotkey(hotkey: Readonly<Hotkey>): void {

        // remove reference
        delete this.hotkeys[hotkey.getId()];
    }

    public clearHotkeys(): void {

        this.hotkeys = {};
    }

    public invokeSequence(sequence: string, event = HotkeyEvent.KEYDOWN): boolean {

        return this.callMatchingHandlers(event, new Sequence(sequence), false, false);
    }

    public setKeyPressDiffTime(ms: number): void {

        this.bufferResetTime = ms;
    }

    public isEnabled(): boolean {

        return this.enabled;
    }

    public setEnabled(enable: boolean): void {

        this.enabled = enable;
    }
};

// export public interface
export { HotKeyContext, HotkeyEvent };

// export testables
export const _testables = {

    normalizeKeyName,
    Combination,
    Sequence,
    Hotkey
}