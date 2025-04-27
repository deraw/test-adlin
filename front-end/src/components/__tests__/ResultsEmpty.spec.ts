import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ResultsEmpty from '../ResultsEmpty.vue'

const vuetify = createVuetify({
  components,
  directives,
})

describe('ResultsEmpty', () => {
  it('renders properly', () => {
    const wrapper = mount(ResultsEmpty, {
      global: {
        plugins: [vuetify],
      },
    })
    expect(wrapper.text()).toContain('Pas de salle disponible.')
    expect(wrapper.text()).toContain('Recherchez une autre date ou un autre créneau horaire.')
  })
})
