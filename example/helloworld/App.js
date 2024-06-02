import { h } from '../../lib/guide-my-vue.esm.js'

export const App = {
  // <template></template>
  // render 
  render() {
    return h(
        'div',
        {
          id: 'root',
          class: ['red', 'hard']
        },
        // string
        // 'hi! my-vue',
        // Array
        [
          h('p', { class: ['red'] }, 'hi! '),
          h('p', { class: ['blue'] }, 'my-vue')
        ]
    )
  },
  setup() {
    // composition api
    return {
      msg: 'my-vue'
    }
  }
}