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
import { runStaticMethods } from "../utils"; 

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