import Nodata from './nodata.vue'
import Loading from './loading.vue'

const comps = [Nodata, Loading]

const MyPlugin = {
  install: function (Vue, options) {
    comps.map(item => {
      Vue.component(item.name, item)
    })
  }
}

export default MyPlugin
