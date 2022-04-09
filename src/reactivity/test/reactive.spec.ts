import {reactive, readonly, isReactive, isReadonly} from "../reactive";
describe('reactive',() => {
    it('happy path', function () {
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        expect(isReactive(observed)).toBe(true)
        let readonlyObserved = readonly(observed)
        expect(isReadonly(readonlyObserved)).toBe(true)
        expect(isReadonly(observed)).toBe(false)
        const original2 = { foo: 1 }
        const readonly1 = readonly(original)
        expect(readonly1).not.toBe(original2)
        expect(readonly1.foo).toBe(1)
    });
    it('warn the set', function () {
        console.warn = jest.fn()

        const user = readonly({age:18})

        user.age = 11

        expect(console.warn).toBeCalled()
    });
    // reactive和readonly嵌套对象转换功能
    test("nested reactives", () => {
        const original = {
            nested: {
                foo: 1,
            },
            array: [{ bar: 2 }],
        };
        const observed = reactive(original);
        expect(isReactive(observed.nested)).toBe(true);
        expect(isReactive(observed.array)).toBe(true);
        expect(isReactive(observed.array[0])).toBe(true);
        const readonlyObserved = readonly(original)
        expect(isReadonly(readonlyObserved.nested)).toBe(true)
        expect(isReadonly(readonlyObserved.array)).toBe(true)
        expect(isReadonly(readonlyObserved.array[0])).toBe(true)
    });
})
