/**
 * File: hotkey.test.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 4.4.2020
 * License: none
 * Description: Defines unit test for hotkey classes and functions.
 * 
 */

// import test subjects
import { HotKeyContext, HotkeyEvent, _testables } from "../hotkeys";

// import test utilities
import { FunctionTest, ObjectTest, runTest } from "./test-utils";

// extract testables
const { normalizeEventKey,
        Combination,
        Sequence,
        Hotkey,

} = _testables;

test("normalizeEventKey()", () => {

    const description: FunctionTest = {
        
        func: normalizeEventKey,
        matchers: [{ name: "toBe" }],
        cases: [

            { args: ["a"],          result: "a" },
            { args: ["A"],          result: "a" },
            { args: ["+"],          result: "plus" },
            { args: ["Control"],    result: "ctrl" },
            { args: [" "],          result: "space" }
        ] 
    };

    runTest(description);
});

test("new Combination(CombinationData)", () => {

    const description: ObjectTest = {
        
        ctor: Combination,
        property: "combination",
        // test deep equaliy and reference difference
        matchers: [{ name: "toStrictEqual" }, { name: "toBe", invert: true }],
        cases: [
        
            // default construction test
            { args: undefined, result: {} },

            // empty object
            { args: [{}], result: {} },

            // non empty objects
            { args: [{ a: true }],                      result: { a: true } },
            { args: [{ a: false, b: true }],            result: { a: false, b: true } },
            { args: [{ a: false, b: true, c: true }],   result: { a: false, b: true, c: true } },
            { args: [{ "": true }],                     result: {} },
            { args: [{ "   ": true }],                  result: {} },
            { args: [{ A: true }],                      result: { a: true } },
            { args: [{ "  A  ": false }],               result: { a: false } },
        ]
    };

    runTest(description);
});

test("new Combination(string)", () => {

    const description: ObjectTest = {
        
        ctor: Combination,
        property: "combination",
        matchers: [{ name: "toStrictEqual" }],
        cases: [
        
            // empty definition
            { args: [""], result: {} },

            // redundant spaces
            { args: [" "],                  result: {} },
            { args: ["     "],              result: {} },
            { args: [" a"],                 result: { a: true } },
            { args: ["a    "],              result: { a: true } },
            { args: ["   a   +   b    "],   result: { a: true, b: true } },
            { args: [" c  t  r  l"],        result: { ctrl: true } },

            // redundant "+" characters
            { args: ["+"],                  result: {} },
            { args: ["+a"],                 result: { a: true } },
            { args: ["a+"],                 result: { a: true } },
            { args: ["+a+b"],               result: { a: true, b: true } },
            { args: ["a+b+"],               result: { a: true, b: true } },
            { args: ["    a   +   b  +  "], result: { a: true, b: true } },

            // duplicate keys
            { args: ["a+a"],        result: { a: true } },
            { args: ["a+a+b+b"],    result: { a: true, b: true } },
            
            // complex combinations
            { args: ["a+b+ctrl+c"], result: { a: true, b: true, c: true, ctrl: true } },
            { args: ["c+ctrl+b+a"], result: { a: true, b: true, c: true, ctrl: true } },
        ]
    };

    runTest(description);
});

test("new Combination(Combination)", () => {

    const testSubject = new Combination({ a: true, b: false });

    const description: ObjectTest = {

        ctor: Combination,
        matchers: [ { name: "toStrictEqual" }, { name: "toBe", invert: true }],

        cases: [
            // test constructing from other object
            { args: [testSubject], result: testSubject }
        ]
    };

    runTest(description);
});

test("Combination.clear()", () => {

    const parameter = { a: true, b: false };

    let description: ObjectTest = {

        ctor: Combination,
        property: "combination",
        matchers: [{ name: "toStrictEqual" }],
        cases: [
            // simple clear calls
            { 
                calls: [{ method: "clear" }],
                result: {}
            },
            {
                args: [{ a: true }],
                calls: [{ method: "clear" }],
                result: {}
            },
            {
                args: [{ a: true, b: false, c: true, d: false }],
                calls: [{ method: "clear" }],
                result: {}
            },
            // chain calls
            {   
                args: [{ a: true, b: false}],
                calls: [{ method: "clear" }, 
                        { method: "set", args: ["a+b"] }, 
                        { method: "clear" }],
                result: {}
            },
            // make sure parameter is unchanged
            {
                args: [parameter],
                calls: [{ method: "clear" }],
                matchers: [{ name: "toStrictEqual", result: {} },
                            { name: "toBe", invert: true, result: parameter }]
            }
        ]
    };

    runTest(description);    
});

test("Combination.addKey()", () => {

    const description: ObjectTest = {

        ctor: Combination,
        property: "combination",
        matchers: [{ name: "toStrictEqual" }],
        cases: [
            // simple tests
            {
                calls: [{ method: "addKey", args: ["a"] }],
                result: { a: true }
            },
            {
                args: [{ a: false }],
                calls: [{ method: "addKey", args: ["b"] }],
                result: { a: false, b: true }
            },
            {
                args: [{ a: false }],
                calls: [{ method: "addKey", args: ["a", false] }],
                result: { a: false }
            },
            {
                args: [{ a: false }],
                calls: [{ method: "addKey", args: ["a", true] }],
                result: { a: true }
            },
            // chained method calls
            {
                calls: [{ method: "addKey", args: ["a", false] },
                        { method: "addKey", args: ["b", true ] }],
                result: { a: false, b: true }
            },
            {
                args: [{ c: false }],
                calls: [{ method: "set", args: [{}] },
                        { method: "addKey", args: ["a", true] },
                        { method: "clear" },
                        { method: "addKey", args: ["b", false] }],
                result: { b: false }    
            },
            // key name normalization
        ]
    };

    runTest(description);

    // // key name normalization tests
    // expect(subject({ a: true }).addKey("   A  ", false).get()).toStrictEqual({ a: false });

    // expect(subject({ a: true }).addKey("   A  ", false).get()).toStrictEqual({ a: false });
    // // invalid key tests
    // expect(subject().addKey("", true).get()).toStrictEqual({});
    
    // expect(subject().addKey("   ", false).get()).toStrictEqual({});
});

// test("Combination.removeKey()", () => {

//     // simple tests
//     expect(subject().removeKey("a").get()).toStrictEqual({});

//     expect(subject("a").removeKey("a").get()).toStrictEqual({});
//     // chained method calls
//     expect(subject({ a: true, b: false }).addKey("c").removeKey("a").get()).toStrictEqual({ b: false, c: true });

//     expect(subject("a+b+b").removeKey("a").addKey("b").removeKey("b").get()).toStrictEqual({});
//     // key name normalization tests
//     expect(subject("a+b").removeKey("  A  ").get()).toStrictEqual({ b: true });            
//     // invalid key tests
//     expect(subject("a+b").removeKey("").get()).toStrictEqual({ a: true, b: true });

//     expect(subject("a+b").removeKey("  ").get()).toStrictEqual({ a: true, b: true });

//     // missing key tests
//     expect(subject("a+b").removeKey("c").get()).toStrictEqual({ a: true, b: true });

//     expect(subject("a+b").removeKey(" C ").get()).toStrictEqual({ a: true, b: true });
// });

// test("Combination.setKeysTo()", () => {

//     expect(subject().setKeysTo(false).get()).toStrictEqual({});

//     expect(subject("a+b").setKeysTo(false).get()).toStrictEqual({ a: false, b: false });

//     expect(subject("a+b").addKey("b", false).setKeysTo(false).get()).toStrictEqual({ a: false, b: false });

//     expect(subject({ a: true, b: true }).addKey("b", false).setKeysTo(true).get()).toStrictEqual({ a: true, b: true });
// });

// test("Combination.get()", () => {

//     const testSubject = subject(); 

//     expect(testSubject.get()).toStrictEqual(testSubject.combination);

//     expect(testSubject.get()).toBe(testSubject.combination);
// });

// test("Combination.toString()", () => {

//     // simple tests
//     expect(subject().toString()).toBe("");

//     expect(subject({ a: true }).toString()).toBe("a");

//     expect(subject({ a: false }).toString()).toBe("a");
//     // keys sorting tests
//     expect(subject({ a: true, b: false }).toString()).toBe("a+b");
    
//     expect(subject({ b: false, a: false }).toString()).toBe("a+b");

//     expect(subject(" b + a ").toString()).toBe("a+b");
// });

// test("Combination.isSubsetOf()", () => {

//     expect(subject().isSubsetOf(subject(), false)).toBeTruthy();

//     expect(subject().isSubsetOf(subject(), true)).toBeFalsy();

//     expect(subject().isSubsetOf(subject("a+b"), false)).toBeTruthy();

//     expect(subject().isSubsetOf(subject("a+b"), true)).toBeFalsy();
    
//     expect(subject({ a: false }).isSubsetOf(subject({ a: false }), false)).toBeTruthy();
    
//     expect(subject({ a: false }).isSubsetOf(subject({ a: false }), true)).toBeFalsy();

//     expect(subject({ a: true, b: true }).isSubsetOf(subject({ a: true }), false)).toBeFalsy();

//     expect(subject({ a: false, b: false })
//         .isSubsetOf(subject({ a: false, b: true }), false)).toBeTruthy();

//     expect(subject({ a: false, b: false })
//         .isSubsetOf(subject({ a: false, b: true }), true)).toBeTruthy();

//     expect(subject({ a: false, b: false })
//         .isSubsetOf(subject({ a: false, b: false }), true)).toBeFalsy();

//     expect(subject({ a: false, b: false })
//         .isSubsetOf(subject({ a: false, b: false, c: false }), false)).toBeTruthy();

//     expect(subject({ a: false, b: false })
//         .isSubsetOf(subject({ a: false, b: false, c: false }), true)).toBeFalsy();

//     expect(subject({ a: false, b: false })
//         .isSubsetOf(subject({ a: false, b: true, c: false }), true)).toBeTruthy();
    
//     expect(subject({ a: false, b: false })
//         .isSubsetOf(subject({ b: true, c: false }), false)).toBeFalsy();
// });

// test("Combination.hasOldKeysOf()", () => {

//     expect(subject().hasOldKeysOf(subject())).toBeTruthy();

//     expect(subject({ a: true }).hasOldKeysOf(subject())).toBeTruthy();

//     expect(subject({ a: true, b: true })
//         .hasOldKeysOf(subject())).toBeTruthy();

//     expect(subject({ a: true, b: true })
//         .hasOldKeysOf(subject({ a: true }))).toBeFalsy();

//     expect(subject({ a: false, b: true })
//         .hasOldKeysOf(subject({ a: true }))).toBeTruthy();

//     expect(subject({ a: false, b: false })
//         .hasOldKeysOf(subject({ a: false, b: false }))).toBeTruthy();

//     expect(subject({ a: false, b: false })
//         .hasOldKeysOf(subject({ a: true, b: true }))).toBeTruthy();

//     expect(subject({ a: false, b: false })
//         .hasOldKeysOf(subject({ a: false, b: false, c: true }))).toBeFalsy();
// });

// test("Combination.isEmpty()", () => {

//     expect(subject().isEmpty()).toBeTruthy();

//     expect(subject({}).isEmpty()).toBeTruthy();

//     expect(subject("").isEmpty()).toBeTruthy();

//     expect(subject("  ").isEmpty()).toBeTruthy();

//     expect(subject("a").isEmpty()).toBeFalsy();

//     expect(subject("a+B").isEmpty()).toBeFalsy();
// });



class SequenceTest extends Sequence {

    private static create(sequence?: ConstructorParameters<typeof Sequence>[0]): SequenceTest {

        return new Sequence(sequence);
    }

    public static _testConstructors() {

        // shorthand
        const subject = SequenceTest.create;

        test("new Sequence(string)", () => {

            expect(subject().sequence).toHaveLength(0);
            
            expect(subject("").sequence).toHaveLength(0);
            
            expect(subject("    ").sequence).toHaveLength(0);

            expect(subject("a b").sequence).toStrictEqual([new Combination("a"), new Combination("b")]);

            expect(subject(" a  b ").sequence).toStrictEqual([new Combination("a"), new Combination("b")]);

            expect(subject(" a+b  b+a").sequence).toStrictEqual([new Combination("b+a"), new Combination("a+b")]);

            expect(subject(" a + b + c    c + b + a ctrl").sequence).toStrictEqual([new Combination("b+a+c"), 
                                                                                    new Combination("c+a+b"),
                                                                                    new Combination("ctrl")]);
     
            expect(subject("A+b b  +  A A").sequence).toStrictEqual([new Combination("a+b"), 
                                                                    new Combination("a+b"),
                                                                    new Combination("a")]);
        });

        test("new Sequence(SequenceData)", () => {

            let sequenceData = [new Combination(), new Combination()];

            expect(subject(sequenceData)).toStrictEqual(subject(sequenceData));

            expect(subject(sequenceData).sequence).toHaveLength(2);

            expect(subject(sequenceData).sequence).toStrictEqual([new Combination(), new Combination()]);

            expect(subject(sequenceData).sequence).not.toBe(sequenceData);

            sequenceData = [new Combination("a+b"), new Combination("a+b+c+d")];

            expect(subject(sequenceData).sequence).toStrictEqual([new Combination("a+b"), new Combination("a+b+c+d")]);
        });

        test("new Sequence(Sequence)", () => {

            const testSubject = subject("a+b b+c");

            expect(subject(testSubject)).toStrictEqual(testSubject);

            expect(subject(testSubject).sequence).not.toBe(testSubject.sequence);
        });
    }

    public static _testMutatorMethods() {

        // shorthand
        const subject = SequenceTest.create;
        
        test("Sequence.push()", () => {

            expect(subject().push(new Combination()).get()).toHaveLength(1);

            expect(subject([new Combination()]).push(new Combination()).get())
                .toHaveLength(2);

            expect(subject([new Combination()]).push(new Combination()).get())
                .toStrictEqual([new Combination(), new Combination()]);

            const combination = new Combination();

            expect(subject().push(combination).get()[0]).toStrictEqual(combination);

            expect(subject().push(combination).get()[0]).not.toBe(combination);
        });
        
        test("Sequence.clear()", () => {

            expect(subject().clear().get()).toHaveLength(0);

            expect(subject("a+b b+c").clear().get()).toHaveLength(0);

            expect(subject("a+b b+c").clear().push(new Combination()).get())
                .toHaveLength(1);
            
            expect(subject().clear().push(new Combination()).clear().get())
                .toHaveLength(0);

            expect(subject("b+c").set("a+b").push(new Combination()).clear().get())
                .toHaveLength(0);

            expect(subject("b+c").set("a+b").push(new Combination()).clear().get())
                .toHaveLength(0);

            expect(subject().set("a+b").push(new Combination()).clear().set("a+b").get())
                .toHaveLength(1);
        });
       
        test("Sequence.mergeOldKeys()", () => {

            expect(subject().mergeOldKeys().get()).toHaveLength(0);

            expect(subject("a+b").mergeOldKeys().get()).toHaveLength(1);

            expect(subject([new Combination({ a: true }), new Combination({ a: false, b: true })])
                .mergeOldKeys().get()).toHaveLength(1);
            
            expect(subject([new Combination({ a: false }), new Combination({ a: false, b: true })])
                .mergeOldKeys().get()).toHaveLength(1);
            
            expect(subject([new Combination({ a: true }), new Combination({ a: true, b: true })])
                .mergeOldKeys().get()).toHaveLength(2);

            expect(subject([new Combination({ a: true }), new Combination({ a: false, b: true })])
                .mergeOldKeys().get()).toStrictEqual([new Combination({ a: false, b: true })]);

            expect(subject([new Combination({ a: false, c: false }), new Combination({ a: false, b: true })])
                .mergeOldKeys().get()).toHaveLength(2);
        });
    }

    public static _testQueryMethods() {

        // shorthand
        const subject = SequenceTest.create;

        test("Sequence.get()", () => {

            expect(subject().get()).toStrictEqual([]);

            expect(subject([]).get()).toStrictEqual([]);

            const sequence = [new Combination()];

            expect(subject(sequence).get()).toStrictEqual(sequence);

            expect(subject(sequence).get()).not.toBe(sequence);
        });

        test("Sequence.toString()", () =>{

            expect(subject().toString()).toBe("");
            
            expect(subject("   ").toString()).toBe("");

            expect(subject("a a a").toString()).toBe("a a a");

            expect(subject("A A A").toString()).toBe("a a a");

            expect(subject("A+b b  +  A A").toString()).toBe("a+b a+b a");
        });
        
        test("Sequence.isMatchingSubsetOf()", () => {

            expect(subject().isMatchingSubsetOf(subject())).toBeTruthy();

            expect(subject([new Combination({ a: false })])
                .isMatchingSubsetOf(subject([new Combination({ a: false })])))
                .toBeFalsy();
            
            expect(subject([new Combination({ a: false })])
                .isMatchingSubsetOf(subject([new Combination({ a: true, b: false })])))
                .toBeTruthy();

            expect(subject([new Combination({ a: true })]).isMatchingSubsetOf(subject()))
                .toBeFalsy();

            let testSequence = [new Combination({ a: true, b: false })];

            expect(subject([new Combination({ a: true })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeTruthy();

            expect(subject([new Combination({ c: true })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeFalsy();

            expect(subject([new Combination({ a: true, b: false })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeTruthy();

            expect(subject([new Combination({ a: true, b: false, c: true })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeFalsy();

            testSequence = [new Combination({ a: true }), new Combination({ b: true, c: false })];

            expect(subject()
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeTruthy()

            expect(subject([new Combination({ b: true })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeTruthy();

            expect(subject([new Combination({ b: false })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeTruthy();

            expect(subject([new Combination({ b: true, c: false })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeTruthy();

            expect(subject([new Combination({ a: false }), new Combination({ c: false })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeFalsy();

            expect(subject([new Combination({ a: false, b: true }), new Combination({ a: true })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeFalsy();

            expect(subject([new Combination({ a: false }), new Combination({ c: true })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeFalsy();

            testSequence = [new Combination({ a: true }), 
                            new Combination({ a: false, b: true }), 
                            new Combination({ a: false, b: false, c: true })];

            expect(subject([new Combination({ c: false })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeTruthy();

            expect(subject([new Combination({ b: false })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeFalsy();

            expect(subject([new Combination({ b: true }), new Combination({ c: true })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeTruthy();
            
            expect(subject([new Combination({ a: true }), new Combination({ c: true })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeFalsy();

            expect(subject([new Combination({ a: true, b: true })])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeFalsy();

            expect(subject([new Combination("a"), new Combination("a+b"),  
                            new Combination("a+b+c")])
                .isMatchingSubsetOf(subject(testSequence)))
                .toBeTruthy();
        });
    }
};

type HotkeyParam = ConstructorParameters<typeof Hotkey>;

class HotkeyTest extends Hotkey {

    private static create(sequences: HotkeyParam[0] = [], 
                            callback: HotkeyParam[1] = () => {}, 
                            eventType: HotkeyParam[2] = HotkeyEvent.KEYDOWN): HotkeyTest {

        return new Hotkey(sequences, callback, eventType);
    }

    public static _testConstructors() {

        const subject = HotkeyTest.create;

        test("new Hotkey()", () => {

            let testSubject = subject();

            expect(testSubject.sequences).toHaveLength(0);

            expect(testSubject.sequences).toStrictEqual([]);

            expect(testSubject.enabled).toBeTruthy();

            expect(testSubject.id).not.toBe("");

            expect(testSubject.eventType).toBe(HotkeyEvent.KEYDOWN);

            expect(testSubject.callback).toBeTruthy();

            const testCallback = () => {};
            testSubject = subject([" a + b ", " B+B   + c "], testCallback, HotkeyEvent.BOTH);

            expect(testSubject.sequences).toHaveLength(2);

            expect(testSubject.sequences).toStrictEqual([new Sequence("a+b"), new Sequence("b+c")]);

            expect(testSubject.enabled).toBeTruthy();

            expect(testSubject.id).not.toBe("");

            expect(testSubject.eventType).toBe(HotkeyEvent.BOTH);

            expect(testSubject.callback).toBeTruthy();

            expect(testSubject.callback).toBe(testCallback);
        });
    }

    public static _testMutatorMethods() {

        const subject = HotkeyTest.create;

        test("Hotkey.setCallback()", () => {

            const testCallback1 = () => {};
            const testCallback2 = () => {};
            const testSubject = subject([], testCallback1);

            expect((testSubject as HotkeyTest).callback)
                .toBe(testCallback1);
            
            expect((testSubject.setCallback(testCallback2) as HotkeyTest).callback)
                .toBe(testCallback2);
        });

        test("Hotkey.setEnabled()", () => {

            expect(subject().isEnabled()).toBeTruthy();

            expect(subject().setEnabled(true).isEnabled()).toBeTruthy();

            expect(subject().setEnabled(false).isEnabled()).toBeFalsy();

            expect(subject().setEnabled(true).setEnabled(false).isEnabled()).toBeFalsy();

            expect(subject().setEnabled(true).setEnabled(true).isEnabled()).toBeTruthy();
        });

        test("Hotkey.setSequences()", () => {

            const testSubject = subject();

            expect(testSubject.sequences).toHaveLength(0);

            testSubject.setSequences(["a", "b"]);
            expect(testSubject.sequences).toStrictEqual([new Sequence("a"), new Sequence("b")]);
            
            testSubject.setSequences([]);
            expect(testSubject.sequences).toHaveLength(0);

            testSubject.setSequences(["a+b+c", "+ b + c + a + D  +"]);
            expect(testSubject.sequences).toStrictEqual([new Sequence("a+b+c"), new Sequence("a+b+c+d")]);
        });

        test("Hotkey.setEventType()", () => {
            
            expect(subject().setEventType(HotkeyEvent.KEYDOWN).getEventType()).toBe(HotkeyEvent.KEYDOWN);

            expect(subject().setEventType(HotkeyEvent.KEYUP).getEventType()).toBe(HotkeyEvent.KEYUP);

            expect(subject().setEventType(HotkeyEvent.BOTH).getEventType()).toBe(HotkeyEvent.BOTH);
        });
    }

    public static _testUtilityMethods() {

        const subject = HotkeyTest.create;

        test("Hotkey.invoke()", () => {

            const testSubject = subject([], jest.fn());

            expect(testSubject.callback).toHaveBeenCalledTimes(0);
            
            testSubject.invoke();
            expect(testSubject.callback).toHaveBeenCalledTimes(1);

            testSubject.invoke();
            expect(testSubject.callback).toHaveBeenCalledTimes(2);
            
            testSubject.setCallback(jest.fn());
            testSubject.invoke();
            expect(testSubject.callback).toHaveBeenCalledTimes(1);

            testSubject.setCallback(() => false);
            expect(testSubject.invoke()).toBe(false);

            testSubject.setCallback(() => true);
            expect(testSubject.invoke()).toBe(true);
        });
    }

    public static _testQueryMethods() {

        const subject = HotkeyTest.create;

        test("Hotkey.isEnabled()", () => {

            expect(subject().isEnabled()).toBeTruthy();
            
            let testSubject = subject();
            testSubject.enabled = false;
            expect(testSubject.isEnabled()).toBeFalsy();

            expect(subject().setEnabled(true).isEnabled()).toBeTruthy();

            expect(subject().setEnabled(false).isEnabled()).toBeFalsy();
        });

        test("Hotkey.getEventType()", () => {

            let testSubject = subject([], () => {}, HotkeyEvent.KEYDOWN);
            expect(testSubject.eventType).toBe(HotkeyEvent.KEYDOWN);

            testSubject.eventType = HotkeyEvent.KEYUP;
            expect(testSubject.getEventType()).toBe(HotkeyEvent.KEYUP);

            expect(testSubject.setEventType(HotkeyEvent.BOTH).getEventType()).toBe(HotkeyEvent.BOTH);
        });

        test("Hotkey.eventMatch()", () => {

            expect(subject([], () => {}, HotkeyEvent.KEYUP).eventMatch(HotkeyEvent.KEYUP)).toBeTruthy();

            expect(subject([], () => {}, HotkeyEvent.KEYDOWN).eventMatch(HotkeyEvent.KEYDOWN)).toBeTruthy();

            expect(subject([], () => {}, HotkeyEvent.BOTH).eventMatch(HotkeyEvent.BOTH)).toBeTruthy();

            expect(subject([], () => {}, HotkeyEvent.BOTH).eventMatch(HotkeyEvent.KEYDOWN)).toBeTruthy();

            expect(subject([], () => {}, HotkeyEvent.BOTH).eventMatch(HotkeyEvent.KEYUP)).toBeTruthy();

            expect(subject([], () => {}, HotkeyEvent.KEYDOWN).eventMatch(HotkeyEvent.BOTH)).toBeFalsy();

            expect(subject([], () => {}, HotkeyEvent.KEYUP).eventMatch(HotkeyEvent.BOTH)).toBeFalsy();

            expect(subject([], () => {}, HotkeyEvent.KEYDOWN).eventMatch(HotkeyEvent.KEYUP)).toBeFalsy();

            expect(subject([], () => {}, HotkeyEvent.KEYUP).eventMatch(HotkeyEvent.KEYDOWN)).toBeFalsy();
        });

        test("Hotkey.getId()", () => {

            expect(subject().getId()).not.toBe("");

            expect(subject().getId() !== subject().getId()).toBeTruthy();
        });

        test("Hotkey.hasMatchingSequence()", () => {

            let testSubject = subject([]);

            expect(testSubject.hasMatchingSequence(new Sequence())).toBeFalsy();
            
            testSubject.setSequences(["a"]);
            expect(testSubject.hasMatchingSequence(new Sequence("a"))).toBeTruthy();
            
            expect(testSubject.hasMatchingSequence(new Sequence("b"))).toBeFalsy();
            
            testSubject.setSequences(["a", "b"]);
            expect(testSubject.hasMatchingSequence(new Sequence("b"))).toBeTruthy();

            expect(testSubject.hasMatchingSequence(new Sequence("a+b"))).toBeTruthy();

            expect(testSubject.hasMatchingSequence(new Sequence("b+c"))).toBeTruthy();
            
            testSubject.setSequences([]);
            expect(testSubject.hasMatchingSequence(new Sequence("b+c"))).toBeFalsy();
            
            testSubject.setSequences(["a"]);
            expect(testSubject.hasMatchingSequence(new Sequence("b+c"))).toBeFalsy();
        });
    }
};

class HotKeyContextTest extends HotKeyContext {

    

    
};