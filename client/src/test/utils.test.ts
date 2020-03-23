/**
 * File: utils.test.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 22.3.2020
 * License: none
 * Description: Defines unit test for utility functions.
 * 
 */

// import dependencies
import { createSlice } from "@reduxjs/toolkit";

// import test subjects
import { capitalize,
        clamp,
        dispatchToProps,
        runStaticMethods
     } from "../utils"; 

test("Capitalize utility tests", () => {

    expect(capitalize("")).toBe("");
    expect(capitalize("a")).toBe("A");
    expect(capitalize("A")).toBe("A");
    expect(capitalize("abc")).toBe("Abc");
    expect(capitalize("aBc")).toBe("Abc");
    expect(capitalize("ABC")).toBe("Abc");
    expect(capitalize("Abc")).toBe("Abc");
    expect(capitalize("AbcAbc")).toBe("Abcabc");
});

test("Clamp utiliy tests", () => {

    // interger tests
    expect(clamp(-1000, 2, 3)).toBe(2);
    expect(clamp(2, 1, 3)).toBe(2);
    expect(clamp(100, 2, 3)).toBe(3);
    expect(clamp(-100, 1, 1)).toBe(1);

    // exception test
    expect(() => clamp(1, 3, 2)).toThrow(Error);

    // float tests
    expect(clamp(1.0, 1.0, 1.0)).toBeCloseTo(1.0);
    expect(clamp(1000.0, 1.0, 2.0)).toBeCloseTo(2.0);
    expect(clamp(-123.123, 0.001, 0.005)).toBeCloseTo(0.001);
    expect(clamp(9999.9999, 10.1, 10.123)).toBeCloseTo(10.123);
});

test("Dispatch to props mapper utility function tests", () => {

    // create test slices
    const testSliceA = createSlice({

        name: "A",
        initialState: null,

        reducers: {

            // action body doesn't matter
            A1: (state, _) => state,
            A2: (state, _) => state,
            A3: (state, _) => state
        }
    });

    const testSliceB = createSlice({

        name: "B",
        initialState: null,

        reducers: {

            // action body doesn't matter
            B1: (state, _) => state,
            B2: (state, _) => state,
            B3: (state, _) => state
        }
    });

    const testSliceCduplicate = createSlice({

        name: "C",
        initialState: null,

        reducers: {

            // action body doesn't matter
            C1: (state, _) => state,
            C2: (state, _) => state,
            A3: (state, _) => state // intentional duplicate name
        }
    });

    // no slices test
    expect(dispatchToProps([])).toStrictEqual({});

    // single slice test
    expect(dispatchToProps([testSliceA])).toStrictEqual({ 
        A1: testSliceA.actions.A1, 
        A2: testSliceA.actions.A2, 
        A3: testSliceA.actions.A3});
    
    // multiple slices test
    expect(dispatchToProps([testSliceA, testSliceB])).toStrictEqual({ 
        A1: testSliceA.actions.A1, 
        A2: testSliceA.actions.A2, 
        A3: testSliceA.actions.A3,
        B1: testSliceB.actions.B1,
        B2: testSliceB.actions.B2,
        B3: testSliceB.actions.B3});
    
    // order of slices shouldn't matter
    expect(dispatchToProps([testSliceB, testSliceA])).toStrictEqual({ 
        A1: testSliceA.actions.A1, 
        A2: testSliceA.actions.A2, 
        A3: testSliceA.actions.A3,
        B1: testSliceB.actions.B1,
        B2: testSliceB.actions.B2,
        B3: testSliceB.actions.B3});

    // duplicate name test
    expect(() => dispatchToProps([testSliceA, testSliceA])).toThrow(Error);
    expect(() => dispatchToProps([testSliceA, testSliceCduplicate])).toThrow(Error);

    // check if correct duplicate name was detected
    expect(() => dispatchToProps([testSliceA, testSliceCduplicate]))
        .toThrowError("A3");
});

let mockFunction = jest.fn();
const resetMockFunction = () => mockFunction.mock.calls = [];

class TestClass {

    public static funcA = mockFunction;
    public static funcB = mockFunction;
    public static funcAB = mockFunction;
}

test("Static method runner utility tests", () => {

    // test running without condition
    runStaticMethods(TestClass);
    expect(mockFunction.mock.calls.length).toBe(3);
    
    // condition tests
    resetMockFunction();
    runStaticMethods(TestClass, /A/);
    expect(mockFunction.mock.calls.length).toBe(2);

    resetMockFunction();
    runStaticMethods(TestClass, /AB/);
    expect(mockFunction.mock.calls.length).toBe(1);

    resetMockFunction();
    runStaticMethods(TestClass, /ABC/);
    expect(mockFunction.mock.calls.length).toBe(0);

    resetMockFunction();
    runStaticMethods(TestClass, /^func/);
    expect(mockFunction.mock.calls.length).toBe(3);

    resetMockFunction();
    runStaticMethods(TestClass, /.{6,}/);
    expect(mockFunction.mock.calls.length).toBe(1);
});