// import helper
import { runStaticMethods } from "../utils";

// import test subjects
import { HotKeyContext, HotkeyEvent, _testables } from "../hotkeys";

// extract testables
const { normalizeEventKey,
        Combination,
        Sequence,
        Hotkey,

} = _testables;

test("Key name normalizing", () => {

    expect(normalizeEventKey("a")).toBe("a");

    expect(normalizeEventKey("A")).toBe("a");

    expect(normalizeEventKey("+")).toBe("plus");

    expect(normalizeEventKey("Control")).toBe("ctrl");

    expect(normalizeEventKey(" ")).toBe("space");
});

class CombinationTest extends Combination {

    private static create(combination?: ConstructorParameters<typeof Combination>[0]): CombinationTest {
        
        return new Combination(combination);
    }

    public static _testConstructors() {

        // shorthand
        const subject = CombinationTest.create;

        test("new Combination(CombinationData)", () => {

            // default construct test
            expect(subject().combination).toStrictEqual({});

            // empty equality test
            const param = {};
            expect(subject(param).combination).toStrictEqual(param);
            // check if combination object is a different copy from parameter
            expect(subject(param).combination).not.toBe(param);

            // non empty equality test
            expect(subject({ a: true }).combination).toStrictEqual({ a: true });

            expect(subject({ a: false, b: true }).combination).toStrictEqual({ a: false, b: true });
            
            expect(subject({ a: false, b: true, c: true }).combination).toStrictEqual({ a: false, b: true, c: true });

            expect(subject({ "": true }).combination).toStrictEqual({});

            expect(subject({ "   ": true }).combination).toStrictEqual({});

            expect(subject({ A: true }).combination).toStrictEqual({ a: true });

            expect(subject({ "  A  ": false }).combination).toStrictEqual({ a: false });
        });

        test("new Combination(string)", () => {

            // empty definition
            expect(subject("").combination).toStrictEqual({});

            // redundant spaces
            expect(subject(" ").combination).toStrictEqual({});

            expect(subject("     ").combination).toStrictEqual({});

            expect(subject(" a").combination).toStrictEqual({ a: true });
            
            expect(subject("a    ").combination).toStrictEqual({ a: true });

            expect(subject("   a   +   b    ").combination).toStrictEqual({ a: true, b: true });

            expect(subject(" c  t  r  l").combination).toStrictEqual({ ctrl: true });
            
            // test redundant '+' characters
            expect(subject("+").combination).toStrictEqual({});

            expect(subject("+a").combination).toStrictEqual({ a: true });

            expect(subject("a+").combination).toStrictEqual({ a: true });

            expect(subject("+a+b").combination).toStrictEqual({ a: true, b: true });
            
            expect(subject("a+b+").combination).toStrictEqual({ a: true, b: true });

            expect(subject("    a   +   b  +  ").combination).toStrictEqual({ a: true, b: true });

            // duplicate keys
            expect(subject("a+a").combination).toStrictEqual({ a: true });

            expect(subject("a+a+b+b").combination).toStrictEqual({ a: true, b: true });

            // complex combinations
            expect(subject("a+b+ctrl+c").combination).toStrictEqual({ a: true, b: true, c: true, ctrl: true });

            expect(subject("c+ctrl+b+a").combination).toStrictEqual({ a: true, b: true, c: true, ctrl: true });

        });

        test("new Combination(Combination)", () => {

            const subject1 = subject({ a: true, b: false });
            const subject2 = subject(subject1);

            expect(subject1).toStrictEqual(subject2)
            // check if a copy was created
            expect(subject1.combination).not.toBe(subject2.combination)
        });
    }    

    public static _testMutatorMethods() {

        // shorthand
        const subject = CombinationTest.create;

        test("Combination.clear()", () => {

            // simple clear tests
            expect(subject().clear().get()).toStrictEqual({});

            expect(subject({ a: true }).clear().get()).toStrictEqual({});
            
            expect(subject({ a: true, b: false, c: true, d: false }).clear().get()).toStrictEqual({});
            
            // tests with a parameter
            const param = { a: true, b: false };

            expect(subject(param).clear().get()).toStrictEqual({});
            // make sure parameter remains unaltered
            expect(param).toStrictEqual({ a: true, b: false });
            
            expect(subject(param).set(param).clear().get()).toStrictEqual({});
            
            expect(param).toStrictEqual({ a: true, b: false });
            // chain method calls
            expect(subject(param).clear().set(param).clear().get()).toStrictEqual({});
        });

        test("Combination.addKey()", () => {

            // simple tests
            expect(subject().addKey("a").get()).toStrictEqual({ a: true });
            
            expect(subject({ a: false }).addKey("b").get()).toStrictEqual({ a: false, b: true });

            expect(subject({ a: false }).addKey("a", false).get()).toStrictEqual({ a: false });
            
            expect(subject({ a: false }).addKey("a", true).get()).toStrictEqual({ a: true });
            // chained method calls
            expect(subject().addKey("a", false).addKey("b", true).get()).toStrictEqual({ a: false, b: true });

            expect(subject({ c: false }).set({}).addKey("a", true).clear().addKey("b", false).get()).
                toStrictEqual({ b: false });
            // key name normalization tests
            expect(subject({ a: true }).addKey("   A  ", false).get()).toStrictEqual({ a: false });

            expect(subject({ a: true }).addKey("   A  ", false).get()).toStrictEqual({ a: false });
            // invalid key tests
            expect(subject().addKey("", true).get()).toStrictEqual({});
            
            expect(subject().addKey("   ", false).get()).toStrictEqual({});
        });

        test("Combination.removeKey()", () => {

            // simple tests
            expect(subject().removeKey("a").get()).toStrictEqual({});

            expect(subject("a").removeKey("a").get()).toStrictEqual({});
            // chained method calls
            expect(subject({ a: true, b: false }).addKey("c").removeKey("a").get()).toStrictEqual({ b: false, c: true });

            expect(subject("a+b+b").removeKey("a").addKey("b").removeKey("b").get()).toStrictEqual({});
            // key name normalization tests
            expect(subject("a+b").removeKey("  A  ").get()).toStrictEqual({ b: true });            
            // invalid key tests
            expect(subject("a+b").removeKey("").get()).toStrictEqual({ a: true, b: true });

            expect(subject("a+b").removeKey("  ").get()).toStrictEqual({ a: true, b: true });

            // missing key tests
            expect(subject("a+b").removeKey("c").get()).toStrictEqual({ a: true, b: true });

            expect(subject("a+b").removeKey(" C ").get()).toStrictEqual({ a: true, b: true });
        });

        test("Combination.setKeysTo()", () => {

            expect(subject().setKeysTo(false).get()).toStrictEqual({});

            expect(subject("a+b").setKeysTo(false).get()).toStrictEqual({ a: false, b: false });

            expect(subject("a+b").addKey("b", false).setKeysTo(false).get()).toStrictEqual({ a: false, b: false });

            expect(subject({ a: true, b: true }).addKey("b", false).setKeysTo(true).get()).toStrictEqual({ a: true, b: true });
        });
    }

    public static _testQueryMethods() {

        // shorthand
        const subject = CombinationTest.create;

        test("Combination.get()", () => {

            const testSubject = subject(); 

            expect(testSubject.get()).toStrictEqual(testSubject.combination);

            expect(testSubject.get()).toBe(testSubject.combination);
        });

        test("Combination.toString()", () => {

            // simple tests
            expect(subject().toString()).toBe("");

            expect(subject({ a: true }).toString()).toBe("a");

            expect(subject({ a: false }).toString()).toBe("a");
            // keys sorting tests
            expect(subject({ a: true, b: false }).toString()).toBe("a+b");
            
            expect(subject({ b: false, a: false }).toString()).toBe("a+b");

            expect(subject(" b + a ").toString()).toBe("a+b");
        });

        test("Combination.isSubsetOf()", () => {

            expect(subject().isSubsetOf(subject(), false)).toBeTruthy();

            expect(subject().isSubsetOf(subject(), true)).toBeFalsy();

            expect(subject().isSubsetOf(subject("a+b"), false)).toBeTruthy();

            expect(subject().isSubsetOf(subject("a+b"), true)).toBeFalsy();
            
            expect(subject({ a: false }).isSubsetOf(subject({ a: false }), false)).toBeTruthy();
            
            expect(subject({ a: false }).isSubsetOf(subject({ a: false }), true)).toBeFalsy();

            expect(subject({ a: true, b: true }).isSubsetOf(subject({ a: true }), false)).toBeFalsy();

            expect(subject({ a: false, b: false })
                .isSubsetOf(subject({ a: false, b: true }), false)).toBeTruthy();

            expect(subject({ a: false, b: false })
                .isSubsetOf(subject({ a: false, b: true }), true)).toBeTruthy();

            expect(subject({ a: false, b: false })
                .isSubsetOf(subject({ a: false, b: false }), true)).toBeFalsy();

            expect(subject({ a: false, b: false })
                .isSubsetOf(subject({ a: false, b: false, c: false }), false)).toBeTruthy();

            expect(subject({ a: false, b: false })
                .isSubsetOf(subject({ a: false, b: false, c: false }), true)).toBeFalsy();

            expect(subject({ a: false, b: false })
                .isSubsetOf(subject({ a: false, b: true, c: false }), true)).toBeTruthy();
            
            expect(subject({ a: false, b: false })
                .isSubsetOf(subject({ b: true, c: false }), false)).toBeFalsy();
        });

        test("Combination.hasOldKeysOf()", () => {

            expect(subject().hasOldKeysOf(subject())).toBeTruthy();

            expect(subject({ a: true }).hasOldKeysOf(subject())).toBeTruthy();

            expect(subject({ a: true, b: true })
                .hasOldKeysOf(subject())).toBeTruthy();

            expect(subject({ a: true, b: true })
                .hasOldKeysOf(subject({ a: true }))).toBeFalsy();

            expect(subject({ a: false, b: true })
                .hasOldKeysOf(subject({ a: true }))).toBeTruthy();

            expect(subject({ a: false, b: false })
                .hasOldKeysOf(subject({ a: false, b: false }))).toBeTruthy();

            expect(subject({ a: false, b: false })
                .hasOldKeysOf(subject({ a: true, b: true }))).toBeTruthy();

            expect(subject({ a: false, b: false })
                .hasOldKeysOf(subject({ a: false, b: false, c: true }))).toBeFalsy();
        });

        test("Combination.isEmpty()", () => {

            expect(subject().isEmpty()).toBeTruthy();

            expect(subject({}).isEmpty()).toBeTruthy();

            expect(subject("").isEmpty()).toBeTruthy();

            expect(subject("  ").isEmpty()).toBeTruthy();

            expect(subject("a").isEmpty()).toBeFalsy();

            expect(subject("a+B").isEmpty()).toBeFalsy();
        });
    }
};

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

[
    CombinationTest,
    SequenceTest,
    HotkeyTest,
    HotKeyContextTest

].forEach(classObject => runStaticMethods(classObject, /^_test/));