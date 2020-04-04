/**
 * File: test-utils.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 4.4.2020
 * License: none
 * Description: Defines various utilities for tests.
 * 
 */

type Constructor = new (...args: any[]) => any;

type Arguments = Array<any>;

type Function = (...args: Arguments) => any;

type Matchers<Additional> = Array<{ name: string, invert?: boolean } & Additional>;

type GenericMatchers = Matchers<{}>;

type SpecificMatchers = Matchers<{ result?: any }>;

type MethodCalls = Array<{ method: string, args?: Arguments }>;

type GenericCase<Additional = {}> = { args?: Arguments, result?: any } & Additional;

type SpecificCase<Additional = {}> = { args?: Arguments, matchers: SpecificMatchers } & Additional;

type TestCase<Additional = {}> = GenericCase<Additional> | SpecificCase<Additional>;

export type FunctionTest = { 
    
    func: Function 
    matchers?: GenericMatchers;
    cases: Array<Readonly<TestCase>>;
};

export type ObjectTest = {

    ctor: Constructor;
    property?: string;
    matchers?: GenericMatchers;
    cases: Array<Readonly<TestCase<{ calls?: MethodCalls }>>>
};

export type ValueTest = {

    value: any;
    matchers: GenericMatchers;
    result?: any;
};

export type Test = FunctionTest | ObjectTest | ValueTest;

function getMatchers(testCase: TestCase, description: Test): GenericMatchers | undefined {

    if((testCase as SpecificCase).matchers) {
        // return specific matchers
        return (testCase as SpecificCase).matchers;
    }

    // return to generic matchers
    return description.matchers;
}

function getResult(matcher: GenericMatchers[number], testCase: TestCase): any {

    if(matcher.hasOwnProperty("result")) {

        return (matcher as SpecificMatchers[number]).result;
    }

    return (testCase as GenericCase).result;
}

function invokeMatcher(testedValue: any, expectedResult: any, matcher: string, invertMatcher: boolean = false): void {

    if(invertMatcher) {

        (expect(testedValue) as any).not[matcher](expectedResult);
    
    } else {

        (expect(testedValue) as any)[matcher](expectedResult);
    }
}

function argsToArray(args: Array<any> | undefined): Array<any> {

    return args !== undefined ? args : []
}

function runFunctionTest(description: FunctionTest): void {

    description.cases.forEach(testCase => {
        
        // invoke function and get test subject for every test case
        const subject = description.func(...argsToArray(testCase.args));
        
        const matchers = getMatchers(testCase, description);

        // check if any matchers were defined
        if(!matchers) return;

        // invoke all matchers for each subject
        matchers.forEach(matcher => {

            invokeMatcher(subject, getResult(matcher, testCase), matcher.name, matcher.invert);
        });
    });
}

function runMethods(subject: { [index: string]: Function }, calls?: MethodCalls): void {

    if(!calls) return;

    calls.forEach(call => {

        subject[call.method](...argsToArray(call.args));
    });
}

function runObjectTest(description: ObjectTest): void {

    description.cases.forEach(testCase => {
       
        // construct object for every test case
        let subject: any = new description.ctor(...argsToArray(testCase.args));
        
        // run methods on object if any
        runMethods(subject, testCase.calls);

        // fetch object property if any
        subject = description.property !== undefined ? subject[description.property] : subject;

        const matchers = getMatchers(testCase, description);

        // check if any matchers were defined
        if(!matchers) return;

        // invoke all matchers for each subject
        matchers.forEach(matcher => {

            invokeMatcher(subject, getResult(matcher, testCase), matcher.name, matcher.invert);
        });
    });
}

function runValueTest(description: ValueTest): void {

    // invoke all matchers for the same value-result pair
    description.matchers.forEach(matcher => {

        invokeMatcher(description.value, description.result, matcher.name, matcher.invert);
    });
}

export function runTest(description: Test): void {

    // determine type of test and call apropriate function
    if((<ValueTest>description).value) {

        runValueTest(description as ValueTest);
    
    } else if((<ObjectTest>description).ctor) {

        runObjectTest(description as ObjectTest);

    } else {

        runFunctionTest(description as FunctionTest);
    }
}
