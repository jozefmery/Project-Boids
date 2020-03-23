/**
 * File: utils.test.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 22.3.2020
 * License: none
 * Description: Defines unit test for utility functions.
 * 
 */

// import test subjects
import { capitalize,
        clamp,
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