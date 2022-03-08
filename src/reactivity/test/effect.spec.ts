import {reactive} from "../reactive";
import {effect} from "../effect";

describe('effect', () => {

    it("happy path", () => {
        let dummy;
        const counter = reactive({num: 0});
        effect(() => (dummy = counter.num));

        expect(dummy).toBe(0);
        // Todo
        counter.num = 7;
        expect(dummy).toBe(7);
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
})
