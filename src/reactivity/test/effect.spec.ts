import {reactive} from "../reactive";
import {effect,stop} from "../effect";

describe('effect', () => {

    it("happy path", () => {
        const original = {foo:1}
        const observed = reactive(original)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
    })

    it("should return runner when call effect", () => {
        // ! effect(fn) => function(runner) => fn => return
        let foo = 10
        const runner = effect(() => {
            foo++
            return "foo"
        })
        expect(foo).toBe(11)
        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe("foo")
    })

    it("scheduler", () => {
        //! 1.通过effect的第二个参数给一个叫做scheduler的fn
        //! 2.effect 第一次执行的时候,还会执行fn
        //! 3.当响应式set更新的时候不会执行fn而是scheduler
        //! 4.当执行runner的时候,会再次执行fn
        let dummy
        let run
        // 通过jest模拟一个函数给一个变量
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({foo: 1})
        const runner = effect(() => {
                dummy = obj.foo
            },
            {scheduler}
        )
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // 触发set 然后触发 trigger
        obj.foo++
        // 这时候调用不是fn而是schedule
        expect(scheduler).toHaveBeenCalledTimes(1)
        // 值未发生改变
        expect(dummy).toBe(1)
        // 执行runner
        run()
        // 此时执行fn, 值发生改变
        expect(dummy).toBe(2)
    })

    it("events:stop",() => {
        let dummy
        const obj = reactive({prop:1})
        const runner = effect(() => {
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        stop(runner) // 当runner停止后,不再触发effect
        obj.prop = 3
        expect(dummy).toBe(2)
        runner()
        expect(dummy).toBe(3)
    })

    it('events: onStop', () => {
        const onStop = jest.fn()
        const runner = effect(() => {}, {
            onStop
        })

        stop(runner)
        expect(onStop).toHaveBeenCalled()
    })
})
