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

/**
 * 
 * Helper object which contains key names present in event objects
 * and normalized strings as values which are used in sequence definitions.
 */
const keyNameNormalizer: { readonly [index: string]: string } = {
    "+": "plus",
    " ": "space",
    "control": "ctrl"
} as const;

/**
 * 
 * Converts a key name present in KeyboardEvent objects to a normalized name
 * used in sequence definitions.
 * 
 * @param   {string} key    Key name present in KeyboardEvent object.
 * @returns {string}        Normalized key name.
 */
function normalizeEventKey(key: string): string {

    // convert to lower case to simplify comparison
    const lowerKey = key.toLowerCase(); 
    const normalized = keyNameNormalizer[lowerKey]; 
    return normalized ? normalized : lowerKey;
};

/**
 * 
 * Defines which event type should a callback listen to.
 */
enum HotkeyEvent {

    KEYDOWN,
    KEYUP,
    BOTH
};

/**
 * 
 * Shape of internal combination representation.
 */
interface CombinationData {

    [index: string]: boolean;
};

/**
 * 
 * Types which can be used to set/construct a Combination.
 */
type CombinationDefinition = Readonly<CombinationData> | Readonly<Combination> | string;

/**
 * 
 * Class for representing a keypress combination with various ways of construction and
 * mutation. Contains various helper query methods.
 */
class Combination {
    
    /// Protected members

    /**
     * 
     * Internal combination representation - object, where keys are 
     * string representations of keyboard keys and the values represent
     * whether a key new.
     */
    protected combination: CombinationData = {};

    /// Constructor function

    /**
     * 
     * Constructs a Combination object based on the supplied parameter.
     * Options:
     *  - undefined         - Create empty representation.
     *  - string            - Keys separated with a "+", spaces and case is ignored,
     *                        all keys are stored as new.
     *  - Combination       - Copy representation from other instance.
     *  - CombinationData   - Define the combination using the internal representation.
     *                        Object keys are normalized - spaces and case are ignored. 
     * 
     * @param {CombinationDefinition} combination Reference for construction.
     */
    public constructor(combination: CombinationDefinition = {}) {

        this.setCombinationData(combination);
    }

    /// Protected static methods 

    /**
     * 
     * Removes all spaces from supplied string and converts it to lower case.
     * 
     * @param   {string} key    Key to be normalized.
     * @returns {string}        Normalized key name.
     */
    protected static normalizeKey(key: string): string {

        return key.replace(/\s+/g, "")  // remove redundant spaces
                .toLowerCase();         // all keys must be lower case to simplify comparison
    }

    /**
     * 
     * Normalizes a combination representation by normalizing each key name,
     * while preserving the values. Empty key names and corresponding values
     * are removed. If multiple keys refer to the same key after normalization,
     * while their values are different, the value of the given 
     * key is undefined (true or false, type remains boolean).
     * 
     * @param   {Readonly<CombinationData>} combination Combination data to be normalized. 
     * @returns {CombinationData}                       Normalized combination representation.
     */
    protected static fromObject(combination: Readonly<CombinationData>): CombinationData {

        return Object.entries(combination)
            .map(([key, value]): [string, boolean] => 
            [Combination.normalizeKey(key),             // normalize key             
            value])                                     // preserve value
            .filter(([key]) => key.length)              // remove empty keys                 
            .reduce((rest, [key, value]) =>             // reduce array of key value pairs to an object
            ({ ...rest, [key]: value }), {});
    }
    
    /**
     * 
     * Transforms a string representation of a combination to the internal representation.
     * 
     * @param   {string} combination    String to be transformed.
     * @returns {CombinationData}       Normalized combination representation.
     */
    protected static fromString(combination: string): CombinationData {

        return combination.split("+")               // split combination to an array of keys
                .map(key => 
                    Combination.normalizeKey(key))  // normalize key
                .filter(key => key.length)          // remove empty string
                .reduce((rest, current) =>          // reduce array of keys to an object
                ({ ...rest, [current]: true }), {});
    }

    /**
     * 
     * Creates a copy of internal representation from a Combination instance.
     * 
     * @param   {Readonly<Combination>} other   Copy target.
     * @returns {CombinationData}               Copied combination representation.
     */
    protected static fromOther(other: Readonly<Combination>): CombinationData {

        return { ...(other.get()) };
    }

    /// Protected methods

    /**
     * 
     * Sets the internal representation in different ways based on the type of
     * the supplied parameter.
     * 
     * @param   {CombinationDefinition} combination Reference for setting the internal representation.
     * @returns {void}
     */
    protected setCombinationData(combination: CombinationDefinition): void {

        if(typeof combination === "string") {

            this.combination = Combination.fromString(combination);

        } else if(combination instanceof Combination) {

            this.combination = Combination.fromOther(combination);

        } else {

            // if combination parameter isn't a string or a Combination instance,
            // it has to be an CombinationData compliant plain object
            this.combination = Combination.fromObject(combination as CombinationData);
        }
    }

    /// Public methods

    // mutator methods

    /**
     * 
     * Sets the internal representation based on the parameter.
     * Works same as the constructor function, except combination can't be undefined.
     * 
     * @param   {CombinationDefinition} combination Reference for setting the internal representation.
     * @returns {Combination}                       Reference to instance to enable chain calls.
     */
    public set(combination: CombinationDefinition): Combination {

        this.setCombinationData(combination);

        return this;
    }

    /**
     * 
     * Removes all keys from the internal representation.
     * 
     * @returns {Combination} Reference to instance to enable chain calls.
     */
    public clear(): Combination {

        this.combination = {};

        return this;
    }
    
    /**
     * 
     * Adds a new key to the internal representation.
     * Key name is normalized - case and spaces are ignored.
     * Empty strings are also ignored.
     * Existing keys have their value updated.
     * 
     * @param   {string} key    Key to be added.
     * @param   {boolean} asNew Value associated with the key.
     * @returns {Combination}   Reference to instance to enable chain calls.
     */
    public addKey(key: string, asNew = true): Combination {

        const normalized = Combination.normalizeKey(key);

        // do not allow empty strings as keys
        if(normalized.length) {

            this.combination[normalized] = asNew;
        }

        return this;
    }
    
    /**
     * 
     * Removes a key from the internal representation.
     * Key name is normalized. Invalid or missing keys are ignored.
     * 
     * @param   {string} key    Key name to be removed.
     * @returns {Combination}   Reference to instance to enable chain calls.
     */
    public removeKey(key: string): Combination {

        // no need to check if key exists
        delete this.combination[Combination.normalizeKey(key)];

        return this;
    }

    /**
     * 
     * Sets all key values.
     * 
     * @param   {boolean} value Value to be set for each key.
     * @returns {Combination}   Reference to instance to enable chain calls.
     */
    public setKeysTo(value: boolean): Combination {

        for(let key in this.combination) {

            this.combination[key] = value;
        }

        return this;
    }

    // query methods
    
    /**
     * 
     * Returns the internal representation for reading.
     * 
     * @returns {Readonly<CombinationData>} Internal representation.
     */
    public get(): Readonly<CombinationData> {
        
        return this.combination;
    }
    
    /**
     * 
     * Transforms the internal representation to a string.
     * Sorted keys are joined using "+" and all are lower case.
     * 
     * @returns {string} String created from representation.
     */
    public toString(): string {

        return Object.keys(this.combination).sort().join("+");
    }
    
    /**
     * 
     * Checks if every key is present in a different instance.
     * 
     * @param  {Readonly<Combination>} other    Instance for comparing.
     * @param  {boolean} requireNewKey          Require at least one of the checked keys to be true (new) in the other instance.
     * @returns boolean                         Return whether instance is sufficient subset of the other instance.
     */
    public isSubsetOf(other: Readonly<Combination>, requireNewKey: boolean): boolean {
        
        let matched = true;
        let foundNewKey = false;
        const superset = other.get();

        for(const key in this.combination) {

            if(superset[key] === undefined) {

                matched = false;
                break;
            
            } else if(superset[key] === true) {

                foundNewKey = true;
            } 
        }

        return requireNewKey ? foundNewKey && matched : matched;
    }
    
    /**
     * 
     * Checks if every key of an other instance is old in the current instance.
     * 
     * @param   {Readonly<Combination>} other   Instance for comparing.
     * @returns {boolean}                       Return whether current instance has every key of other instance as old.
     */
    public hasOldKeysOf(other: Readonly<Combination>): boolean {

        const old = other.get();

        for(const key in old) {

            if(this.combination[key] !== false) {

                return false;
            }
        }

        return true;
    }
    
    /**
     * 
     * Checks whether Combination doesn't contain any keys.
     * 
     * @returns {boolean}   Whether internal representation object has no keys.
     */
    public isEmpty(): boolean {
        
        for(const _ in this.combination) return false;

        return true;
    }
};

/**
 * 
 * Defines the internal representation of sequences.
 */
type SequenceData = Array<Combination>;

/**
 * 
 * Types which can be used to set/construct a Sequence. 
 */
type SequenceDefinition = string | Readonly<SequenceData> | Readonly<Sequence>; 

/**
 * 
 * Class for representing a keypress combination sequence with 
 * various utility methods. 
 */
class Sequence {

    /// Protected members

    /**
     * 
     * Internal sequence representation - array of Combinations.
     */
    protected sequence: SequenceData = [];

    /// Constructor function
    
    /**
     * 
     * Constructs a sequence based on the supplied paramater.
     * Options:
     *  - undefined     - Create empty representation.
     *  - string        - Sequence of combinations separated with spaces. Individual
     *                    keys in a combination are separated with a "+". Case and additional
     *                    spaces are ignored.   
     *  - Sequence      - Copy representation from other instance.
     *  - SequenceData  - Define the sequence using an array of combinations.
     * 
     * @param {SequenceDefinition} sequence Reference for construction.
     */
    public constructor(sequence: SequenceDefinition = []) {

        this.setSequenceData(sequence);
    }

    /// Protected static methods

    /**
     * 
     * Transforms a string representation of a sequence to the internal representation.
     * 
     * @param   {string} sequence   String be transformed.
     * @returns {SequenceData}      Normalized sequence representation.
     */
    protected static fromString(sequence: string): SequenceData {

        return sequence.replace(/\s*\+\s*/g, "+")               // remove redudant spaces within a combination
            .split(" ")                                         // split whole sequence to an array of combinations
            .filter(combination => combination.length)          // discard empty strings e.g.: "a  b" => ["a", "", "b"] => ["a", "b"]
                                                                // space is defined using "space" string
            .map(combination => new Combination(combination));
    }

    /**
     * 
     * Creates a copy of internal representation from a Sequence instance.
     * 
     * @param   {Readonly<Sequence>} sequence   Copy target.
     * @returns {SequenceData}                  Copied sequence representation.
     */
    protected static fromOther(sequence: Readonly<Sequence>): SequenceData {

        return Sequence.fromArray(sequence.get());
    }

    /**
     * 
     * Creates a copy of internal representation from an array of combinations.
     * 
     * @param   {Readonly<SequenceData>} sequence   Array of combinations.
     * @returns {SequenceData}                      Copied sequence representation.
     */
    protected static fromArray(sequence: Readonly<SequenceData>): SequenceData {

        // create a copy
        return sequence.map(combination => new Combination(combination));
    }

    /// Protected methods
    
    /**
     * 
     * Sets the internal representaion based on the type of the supplied parameter.
     * 
     * @param   {SequenceDefinition} sequence   Reference for setting the internal representation.
     * @returns {void}
     */
    protected setSequenceData(sequence: SequenceDefinition): void {

        if(typeof sequence === "string") {

            this.sequence = Sequence.fromString(sequence);
        
        } else if(sequence instanceof Sequence) {

            this.sequence = Sequence.fromOther(sequence);
        
        } else {

            // if sequence isn't a string or an instance of Sequence
            // it has to be SequenceData array
            this.sequence = Sequence.fromArray(sequence as Readonly<SequenceData>);
        }
    }

    /// Public methods

    // mutator methods

    /**
     * 
     * Sets the internal representation based on the parameter.
     * Works same as the constructor function, except sequence can't be undefined.
     * 
     * @param   {SequenceDefinition} sequence   Reference for setting the internal representation.
     * @returns {Sequence}                      Reference to instance to enable chain calls.
     */
    public set(sequence: SequenceDefinition): Sequence {

        this.setSequenceData(sequence);

        return this;
    }
    
    /**
     * 
     * Adds a copy of a combination to the end of the combination array (internal representation).
     * 
     * @param   {Readonly<Combination>} combination Combination to be added.
     * @returns {Sequence}                          Reference to instance to enable chain calls.
     */
    public push(combination: Readonly<Combination>): Sequence {
        
        // push a copy
        this.sequence.push(new Combination(combination));

        return this;
    }
    
    /**
     * 
     * Clears the combination array. 
     * 
     * @returns {Sequence} Reference to instance to enable chain calls.
     */
    public clear(): Sequence {

        this.sequence = [];

        return this;
    }

    /**
     * 
     * Removes the second-to-last Combination from the internal representation,
     * if the last Combination contains every key of the second-to-last Combination
     * as old. Does nothing if there aren't at least two Combinations.
     * 
     * @returns {Sequence} Reference to instance to enable chain calls.
     */
    public mergeOldKeys(): Sequence {

        // shorthand
        const sequence = this.sequence;

        if(sequence.length < 2) return this;
        
        const oldCombination = sequence[sequence.length - 2];
        const newCombination = sequence[sequence.length - 1];

        if(newCombination.hasOldKeysOf(oldCombination)) {

            sequence.splice(sequence.length - 2, 1);
        }

        return this;
    }

    // query methods

    /**
     * 
     * Returns the internal representation for reading.
     * 
     * @returns {Readonly<SequenceData>} Internal representation.
     */
    public get(): Readonly<SequenceData> {

        return this.sequence;
    }

    /**
     * 
     * Transforms the internal representation to a string.
     * Combinations are joined with " ".
     * 
     * @returns {string} String created from representation.
     */
    public toString(): string {

        return this.sequence.map(combination => combination.toString()).join(" ");
    }
  
    /**
     * 
     * Checks if every Combination is a subset of the corresponding Combination
     * in an other sequence. Checked from the back of the arrays.
     * 
     * @param   {Readonly<Sequence>} other  Superset for comparison.
     * @returns {boolean}                   Return whether the sequence is a sufficient subset of the other sequence.
     */
    public isMatchingSubsetOf(other: Readonly<Sequence>): boolean {

        const buffer = other.get();

        // empty sequence definition matches everything
        if(this.sequence.length === 0) return true;

        if(buffer.length < this.sequence.length) return false;

        // iterate backwards 
        let sequenceIndex = this.sequence.length - 1;
        let bufferIndex = buffer.length - 1;

        while(bufferIndex >= 0 && sequenceIndex >= 0) {

            const subset = this.sequence[sequenceIndex];
            const superset = buffer[bufferIndex];

            // check if for combination match
            if(subset.isSubsetOf(superset, true)) {

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

/**
 * 
 * Defines hotkey callback signature.
 */
type Callback = (event: { event: HotkeyEvent }) => boolean | void;

/**
 * 
 * Type used for defining hotkey sequences.
 */
type SequenceDefinitions = Readonly<Array<string>>;

/**
 * 
 * Class for representing hotkeys, including various methods for changing
 * settings after construction.
 */
class Hotkey {

    /// Protected members

    /**
     * 
     * Unique identifier used mainly by HotkeyContext.
     */
    protected readonly id: string;

    /**
     * 
     * Flag representing whether the callback should be invoked 
     * on match. Invoking the callback manually ignores this flag.
     */
    protected enabled: boolean;

    /**
     * 
     * Possible sequences for matching. Callback is invoked
     * once even if multiple sequences match.
     */
    protected sequences: Array<Sequence>;

    /// Constructor function
    
    /**
     * 
     * Constructs a Hotkey object. Hotkeys should be created 
     * using a factory method in Hotkey contexts.
     * 
     * @param {SequenceDefinitions} sequences   Possible sequences for matching.
     * @param {Callback} callback               Callback to be invoked on sequene match.     
     * @param {HotkeyEvent} eventType           Event type upon which to attempt matching.
     */
    public constructor(sequences: SequenceDefinitions, 
                protected callback: Callback,
                protected eventType: HotkeyEvent) {

        // create helper properties
        this.id = uniqid();

        // enable hotkey by default
        this.enabled = true;
        
        // convert from definition to internal representation
        this.sequences = Hotkey.stringsToSequences(sequences);
    }

    /// Protected static methods
    
    /**
     * 
     * Converts an array of string sequence definitions to 
     * an array of corresponding Sequence instances.
     * 
     * @param   {SequenceDefinitions} sequences Array of string sequence definitions to be converted.
     * @returns {Array<Sequence>}               Converted array of Sequence instances.
     */
    protected static stringsToSequences(sequences: SequenceDefinitions): Array<Sequence> {

        return sequences.map(sequence => new Sequence(sequence));
    }

    /// Public methods

    // mutator methods
    
    /**
     * Sets the callback which is called upon match
     * or when invoked manually using invoke().
     * 
     * @param   {Callback} callback Callback to be set.
     * @returns {Hotkey}            Reference to instance to enable chain calls. 
     */
    public setCallback(callback: Callback): Hotkey {

        this.callback = callback;

        return this;
    }
    
    /**
     * 
     * Sets the enabled flag to a desired value.
     * 
     * @param   {boolean} enable    Flag value to be set.
     * @returns {Hotkey}            Reference to instance to enable chain calls. 
     */
    public setEnabled(enable: boolean): Hotkey {

        this.enabled = enable;

        return this;
    }
    
    /**
     * 
     * Sets the possible sequences for matching.
     * 
     * @param   {SequenceDefinitions} sequences Array of string sequence definitions.
     * @returns {Hotkey}                        Reference to instance to enable chain calls. 
     */
    public setSequences(sequences: SequenceDefinitions): Hotkey {

        this.sequences = Hotkey.stringsToSequences(sequences);

        return this;
    }

    /**
     * 
     * Sets the event type upon which the matching of
     * sequences is attempted.
     * 
     * @param   {HotkeyEvent} eventType Event type to be set.
     * @returns {Hotkey}                Reference to instance to enable chain calls. 
     */
    public setEventType(eventType: HotkeyEvent): Hotkey {

        this.eventType = eventType;

        return this;
    }

    // utility methods
   
    /**
     * 
     * Invokes the callback with a specific event type.
     * Event type cannot be HotkeyEvent.BOTH, because
     * BOTH refers to listening to KEYUP or KEYDOWN
     * and callback are always called with one of those.
     * 
     * @param   {HotkeyEvent.KEYUP|HotkeyEvent.KEYDOWN} event   Event type passed to the callback.
     * @returns {boolean|void}                                  Returns whether the callback requested to prevent default behavior.
     */
    public invoke(event: HotkeyEvent.KEYUP | HotkeyEvent.KEYDOWN = HotkeyEvent.KEYDOWN): ReturnType<Callback> {

        return this.callback({ event });
    }

    // query methods
    
    /**
     * 
     * Returns whether the enabled flag is set.
     * 
     * @returns {boolean} Enabled flag.
     */
    public isEnabled(): boolean {

        return this.enabled;
    }
    
    /**
     * 
     * Returns the currently set event type.
     * 
     * @returns {HotkeyEvent} Current event type.
     */
    public getEventType(): HotkeyEvent {

        return this.eventType;
    }

    /**
     * 
     * Checks whether Hotkey listens to a certain event type.
     * 
     * @param   {HotkeyEvent} event Queried event type.
     * @returns {boolean}           Whether Hotkey listens to queried event.
     */
    public eventMatch(event: HotkeyEvent): boolean {

        return this.eventType === HotkeyEvent.BOTH || this.eventType === event;
    }
    
    /**
     * 
     * Returns a unique instance identifier.
     * Used mainly by HotkeyContext.
     * 
     * @returns {string} Unique identifier.
     */
    public getId(): string {

        return this.id;
    }
    
    /**
     * 
     * Checks whether contains at least one matching sequence subset.
     * 
     * @param   {Readonly<Sequence>} sequence   Sequence superset used for comparison.
     * @returns {boolean}                       Whether at least one sequence matched.
     */
    public hasMatchingSequence(sequence: Readonly<Sequence>): boolean {

        for(const idx in this.sequences) {

            if(this.sequences[idx].isMatchingSubsetOf(sequence)) {

                return true;
            }
        }

        return false;
    }
};

/**
 * 
 * Defines object shape which stores a sequence and
 * its corresponding reset timeout id.
 */
type SequenceBuffer = {

    reset: number
    buffer: Sequence;
};

/**
 * 
 * Union type used for indexing Sequence buffers.
 */
type EventIndexer = HotkeyEvent.KEYDOWN | HotkeyEvent.KEYUP;

/**
 * 
 * Class for representing a hotkey group containing
 * various methods for changing options and a Hotkey
 * factory method. Class is responsible for
 * handling keyboard events and calling matching handlers
 * of registered Hotkey instances.
 */
class HotKeyContext {

    /// Protected Members

    /**
     * 
     * Flag representing whether context is enabled.
     * When disabled all events are ignored and no
     * handlers are called.
     */
    protected enabled: boolean;

    /**
     * 
     * Stores a reference to all registered hotkeys,
     * with Hotkey IDs as keys and the reference to 
     * the instance as values.
     */
    protected hotkeys: { [index: string]: Hotkey };

    /**
     * 
     * Stores currently pressed keys.
     */
    protected keyCombination: Combination;

    /**
     * 
     * Stores recent sequence for both KEYDOWN and KEYUP events
     * as a Sequence instance and a corresponding reset timeout ID.
     */
    protected sequences: Record<EventIndexer, SequenceBuffer>; 

    /**
     * 
     * Stores a reference to a callback
     */
    protected blurCallbackRef?: () => void;

    /// Constructor function
    
    /**
     * 
     * Constructs a HotkeyContext instance enabled by default.
     * 
     * @param {number} keyPressDelay                Time in milliseconds after which individual 
     *                                              sequence buffers are reset.
     * @param {boolean} attachBlurHandlerToWindow   Whether to call attachBlurHandlerToWindow().
     */
    public constructor(protected keyPressDelay: number = 500, attachBlurHandlerToWindow: boolean = true) {

        // enable context by default
        this.enabled = true;
        
        // initialize helper members
        this.hotkeys = {};
        this.keyCombination = new Combination(); 

        this.sequences = {

            [HotkeyEvent.KEYDOWN]: {

                reset: 0, // default to invalid timeout id
                buffer: new Sequence()
            },

            [HotkeyEvent.KEYUP]: {

                reset: 0, 
                buffer: new Sequence()
            },
        };

        if(attachBlurHandlerToWindow) {

            this.attachBlurHandlerToWindow();
        }
    }

    /// Protected methods

    /**
     * 
     * Clears a sequence buffer.
     * 
     * @param   {EventIndexer} event Buffer index to be cleared based on event type.
     * @returns {void}
     */
    protected clearSequenceBuffer(event: EventIndexer): void {

        this.sequences[event].buffer.clear();
    }

    /**
     * 
     * Invokes all Hotkey handlers which contain at least one
     * matching sequence subset.
     * 
     * @param   {EventIndexer} event            Type of event for invoking.
     * @param   {Readonly<Sequence>} sequence   Sequence superset for comparison.
     * @returns {boolean}                       Whether at least one called handler requested
     *                                          to prevent default behavior.
     */
    protected callMatchingHandlers(event: EventIndexer, sequence: Readonly<Sequence>): boolean {

        let preventDefault = false;

        // check every registered hotkey
        for(const id in this.hotkeys) {

            // shorthand
            const hotkey = this.hotkeys[id];

            // check if hotkey is enabled and if event type matches
            if(!hotkey.isEnabled() || !hotkey.eventMatch(event)) continue;

            if(hotkey.hasMatchingSequence(sequence)) {

                // call handler and exit
                preventDefault = hotkey.invoke(event) || preventDefault;
                break;
            }
        }

        return preventDefault;
    }

    /**
     * 
     * Saves a reference to a Hotkey instance.
     * 
     * @param   {Hotkey} hotkey Hotkey instance to be saved.
     * @returns {Hotkey}        Reference to the saved hotkey.
     */
    protected registerHotkey(hotkey: Hotkey): Hotkey {

        // save reference
        this.hotkeys[hotkey.getId()] = hotkey;

        return hotkey;
    }

    /**
     * 
     * Updates keyCombination by adding/removing a key based on event type
     * and pushes combination into relevant sequence.
     * 
     * @param   {EventIndexer} event    Type of keyboard event.
     * @param   {string} key            Key to be added/removed.
     * @returns {void}
     */
    protected recieveKey(event: EventIndexer, key: string): void {

        // set other keys as old
        this.keyCombination.setKeysTo(false);
        // add key as new
        this.keyCombination.addKey(key, true);
        
        // save current state
        this.sequences[event].buffer.push(this.keyCombination);
        
        if(event === HotkeyEvent.KEYDOWN) {

            // merging keys makes sense only on key down events
            this.sequences[HotkeyEvent.KEYDOWN].buffer.mergeOldKeys();

        } else { // KEYUP

            this.keyCombination.removeKey(key);
        }
    }

    /**
     * 
     * Clears existing timeout and sets up a new timeout 
     * for clearing relevant sequence buffer.
     * 
     * @param   {EventIndexer} event    Buffer index based on event type.
     * @returns {void}
     */
    protected setupBufferReset(event: EventIndexer): void {

        // clear existing reset buffer timeout
        // no need to check if reset id is valid
        clearTimeout(this.sequences[event].reset);

        this.sequences[event].reset = window.setTimeout(() => this.clearSequenceBuffer(event), this.keyPressDelay);
    } 

    /**
     * 
     * Clears current combination.
     * 
     * @returns HotKeyContext
     */
    protected clearCombination(): HotKeyContext {

        this.keyCombination.clear();

        return this;
    }

    /// Public methods

    // mutator methods
   
    /**
     * 
     * Attaches onBlur handler to window. Does nothing if called multiple times
     * without calling clearBlurHandler.
     * This method should usually be used in a setup phase.
     * If used, clearBlurHandler() should be called before
     * deleting this instance.
     * 
     * @returns {HotKeyContext} Reference to instance to enable chain calls.
     */
    public attachBlurHandlerToWindow(): HotKeyContext {

        if(this.blurCallbackRef === undefined) {
    
            this.blurCallbackRef = () => this.onBlur();
            
            window.addEventListener("blur", this.blurCallbackRef);
        }

        return this;
    }
    
    /**
     * 
     * Clears onBlur handler from window if it was previously
     * attached. 
     * This method should usually be used in a cleanup phase.
     * 
     * @returns {HotKeyContext} Reference to instance to enable chain calls.
     */
    public clearBlurHandler(): HotKeyContext {

        if(this.blurCallbackRef) {

            window.removeEventListener("blur", this.blurCallbackRef);

            this.blurCallbackRef = undefined;
        }

        return this;
    }

    /**
     * 
     * Emulates key released for every currently pressed key,
     * calls all matching handlers which listen to KEYUP/BOTH events
     * and clear current combination.
     * 
     * @returns {void}
     */
    public onBlur(): void {

        if(!this.isEnabled() || this.keyCombination.isEmpty()) return;

        const event = HotkeyEvent.KEYUP;
        
        // set all currently pressed keys to new
        this.keyCombination.setKeysTo(true);

        this.sequences[event].buffer.push(this.keyCombination);

        this.clearCombination();
        
        this.setupBufferReset(event);
        
        this.callMatchingHandlers(event, this.sequences[event].buffer);
    }
    
    /**
     * 
     * Updates key combination, resets existing sequence reset timeout
     * and sets it up again, calls matching handlers and prevents
     * default browser behavior if at least called handler requested it.
     * 
     * @param   {KeyboardEvent} keyboardEvent   Event object passed to the base handler.
     * @param   {boolean} pressed               Whether key was pressed or released.
     * @returns {void}
     */
    public onKeyChanged(keyboardEvent: KeyboardEvent, pressed: boolean): void {

        // check if context is enabled
        if(!this.isEnabled()) return; 

        const event = pressed ? HotkeyEvent.KEYDOWN : HotkeyEvent.KEYUP;

        this.recieveKey(event, normalizeEventKey(keyboardEvent.key));

        this.setupBufferReset(event);

        if(this.callMatchingHandlers(event, this.sequences[event].buffer)) {

            keyboardEvent.preventDefault();
        }
    }
    
    /**
     * 
     * Creates a hotkey instance and registers it for this context.
     * This method should be used for creating Hotkey instances.
     * The return value shouldn't be discarded, because there is
     * no other way to obtain a reference to the new instance.
     * When a Hotkey instance is not needed anymore, removeHotkey
     * context method should be called to delete a reference to the
     * instance preventing possible future invoking.
     * 
     * Sequences are defined using an array of strings, while each string
     * contains key combinations separated with a space (" "). Individual
     * combinations are key names present in event objects separated with 
     * a "+". Exceptions: "+"" is defined as "plus", " " as space and
     * "Control" as "ctrl". Case and additional spaces are ignored.
     * The callback is invoked once even if there are multiple matching 
     * sequences.
     * 
     * @param   {SequenceDefinitions} sequences Possible sequences for matching.
     * @param   {Callback} callback             Callback to be invoked on sequence match.
     * @param   {HotkeyEvent} eventType         Type of event upon which to attempt matching.
     * @returns {Hotkey}                        Reference to constructed Hotkey instance.
     */
    public createHotkey(sequences: SequenceDefinitions, callback: Callback, eventType: HotkeyEvent): Hotkey {

        // registerHotkey returns the referene that is passed to it 
        return this.registerHotkey(new Hotkey(sequences, callback, eventType));
    }
    
    /**
     * 
     * Deletes a reference to a Hotkey instance created using createHotkey
     * context method. This method should be called before throwing away
     * a Hotkey instance. After removing from context,
     * there is no way to add it again.
     * 
     * @param   {Readonly<Hotkey>} hotkey   Instance to be removed from context.
     * @returns {HotKeyContext}             Reference to context instance to enable chain calls.
     */
    public removeHotkey(hotkey: Readonly<Hotkey>): HotKeyContext {

        delete this.hotkeys[hotkey.getId()];

        return this;
    }
    
    /**
     * 
     * Removes all Hotkey references.
     * 
     * @returns {HotKeyContext} Reference to instance to enable chain calls.
     */
    public clearHotkeys(): HotKeyContext {

        this.hotkeys = {};

        return this;
    }
    
    /**
     * 
     * Sets the time in milliseconds after which individual
     * sequence buffers are reset.
     * 
     * @param   {number} ms     Time in milliseconds to be set.
     * @returns {HotKeyContext} Reference to instance to enable chain calls.  
     */
    public setKeyPressDelay(ms: number): HotKeyContext {

        this.keyPressDelay = ms;

        return this;
    }
    
    /**
     * 
     * Sets the enabled flag to a desired value.
     * When disabling also clears the current combination.
     * 
     * @param   {boolean} enable    Enabled flag value to be set.
     * @returns {HotKeyContext}     Reference to instance to enable chain calls.  
     */
    public setEnabled(enable: boolean): HotKeyContext {

        this.enabled = enable;

        if(!this.isEnabled()) {
            // clear combination when disabling context
            // otherwise keys would remain as pressed
            this.clearCombination();
        }

        return this;
    }

    // query methods
    
    /**
     * 
     * Returns whether context is enabled.
     * 
     * @returns {boolean} Enabled flag value.
     */
    public isEnabled(): boolean {

        return this.enabled;
    }
    
    /**
     * 
     * Returns a string representation of the currently pressed
     * key combination.
     * 
     * @returns {string}    Key press combination string representation.
     */
    public currentCombination(): string {

        return this.keyCombination.toString();
    }

    /**
     * 
     * Checks whether a key combination is currently pressed.
     * Individual keys are separated with a "+", case and spaces
     * are ignored.
     * 
     * @param   {string} combination    Queried key combination.
     * @returns {boolean}               Whether queried key combination is pressed.
     */
    public isCombinationPressed(combination: string): boolean {

        // do not require new key when comparing
        return new Combination(combination).isSubsetOf(this.keyCombination, false);
    }

    /**
     * 
     * Invokes a sequence and calls every matching handler 
     * registered in this context. For sequence definition
     * explanation see HotkeyContext.createHotkey.
     * 
     * @param   {string} sequence                               Sequence to be invoked.
     * @param   {HotkeyEvent.KEYDOWN|HotkeyEvent.KEYUP} event   Type of event to be invoked.
     * @returns {boolean}                                       Whether at least one called handler requested to prevent default behavior.
     */
    public invokeSequence(sequence: string, event: HotkeyEvent.KEYDOWN | HotkeyEvent.KEYUP): boolean {

        let preventDefault = false;

        // store internal representation
        const superset = new Sequence(sequence).get();

        // allow i to equal superset length to make sure last iteration is the whole sequence
        for(let i = 1; i <= superset.length; ++i) {
            
            // use internal sequence representation to create an increasingly bigger superset to compare against
            preventDefault = this.callMatchingHandlers(event, new Sequence(superset.slice(0, i))) || preventDefault;
        }

        return preventDefault;
    } 
};

// export public interface
export { HotKeyContext, HotkeyEvent };

// export testables
export const _testables = {

    normalizeEventKey,
    Combination,
    Sequence,
    Hotkey
}