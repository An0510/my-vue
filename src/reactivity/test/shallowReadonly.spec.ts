import {isProxy, isReadonly, shallowReadonly} from '../reactive'

describe('reactivity/shallowReadonly', () => {
    test('should not make non-reactive properties reactive',() => {
        const props = shallowReadonly({n:{foo:1}})
      expect(isReadonly(props)).toBe(true)
      expect(isReadonly(props.n)).toBe(false)
    })
  }
)
