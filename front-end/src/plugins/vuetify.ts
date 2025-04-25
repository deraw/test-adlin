import { createVuetify } from 'vuetify'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { fr } from 'vuetify/locale'

export default createVuetify({
  locale: {
    locale: 'fr',
    fallback: 'fr',
    messages: { fr },
  },
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
