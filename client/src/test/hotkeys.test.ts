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

        test("new Combination(ICombination)", () => {

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

            expect(subject1.combination).toStrictEqual(subject2.combination)
            
            expect(subject1.combination).not.toBe(subject2.combination)
        });
    }    

    public static _testMutatorMethods() {

        // shorthand
        const subject = CombinationTest.create;

        test("Combination.set()", () => {

            expect(subject().set({}).get()).toStrictEqual({});

            expect(subject().set({ a: true, b: false }).get()).toStrictEqual({ a: true, b: false });

            const param = { a: true };

            expect(subject().set(param).get()).toStrictEqual(param);
            // check if a copy is created
            expect(subject().set(param).get()).not.toBe(param);

            expect(subject({ A: true }).get()).toStrictEqual({ a: true });
            
            expect(subject({ "   A   ": true }).get()).toStrictEqual({ a: true });
        });

        test("Combination.clear()", () => {

            expect(subject().clear().get()).toStrictEqual({});

            expect(subject({ a: true }).clear().get()).toStrictEqual({});
            
            expect(subject({ a: true, b: false, c: true, d: false }).clear().get()).toStrictEqual({});
            
            const param = { a: true, b: false };

            expect(subject(param).clear().get()).toStrictEqual({});
            
            expect(param).toStrictEqual({ a: true, b: false });
            
            expect(subject(param).set(param).clear().get()).toStrictEqual({});
            
            expect(param).toStrictEqual({ a: true, b: false });
            
            expect(subject(param).clear().set(param).clear().get()).toStrictEqual({});
        });

        test("Combination.addKey()", () => {

            expect(subject().addKey("a").get()).toStrictEqual({ a: true });
            
            expect(subject({ a: false }).addKey("b").get()).toStrictEqual({ a: false, b: true });

            expect(subject({ a: false }).addKey("a", false).get()).toStrictEqual({ a: false });
            
            expect(subject({ a: false }).addKey("a", true).get()).toStrictEqual({ a: true });

            expect(subject().addKey("a", false).addKey("b", true).get()).toStrictEqual({ a: false, b: true });

            expect(subject({"c": false }).set({}).addKey("a", true).clear().addKey("b", false).get()).
                toStrictEqual({ b: false });

            expect(subject({ a: true }).addKey("   A  ", false).get()).toStrictEqual({ a: false });
        });

        test("Combination.removeKey()", () => {

            expect(subject().removeKey("a").get()).toStrictEqual({});

            expect(subject("a").removeKey("a").get()).toStrictEqual({});

            expect(subject({ a: true, b: false }).addKey("c").removeKey("a").get()).toStrictEqual({ b: false, c: true });

            expect(subject("a+b+b").removeKey("a").addKey("b").removeKey("b").get()).toStrictEqual({});

            expect(subject("a+b").removeKey("  A  ").get()).toStrictEqual({ b: true });
        });

        test("Combination.setOldKeys()", () => {

            expect(subject().setOldKeys().get()).toStrictEqual({});

            expect(subject("a+b").setOldKeys().get()).toStrictEqual({ a: false, b: false });

            expect(subject("a+b").addKey("b", false).setOldKeys().get()).toStrictEqual({ a: false, b: false });
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

            expect(subject().toString()).toBe("");

            expect(subject({ a: true }).toString()).toBe("a");

            expect(subject({ a: false }).toString()).toBe("a");
            
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

        test("Combination.hasOldKeysOf", () => {

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
    }
};

[
    CombinationTest

].forEach(classObject => runStaticMethods(classObject, /^_test/));