import { createVuetify } from 'vuetify'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export default createVuetify({
  components: {
    VTimePicker,
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})
