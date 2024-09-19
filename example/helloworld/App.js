import { h } from '../../lib/guide-my-vue.esm.js'

export const App = {
  // <template></template>
  // render 
  render() {
    window.self = this
    return h(
        'div',
        {
          id: 'root',
          class: ['red', 'hard']
        },
        "hi! " + this.msg,
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
};