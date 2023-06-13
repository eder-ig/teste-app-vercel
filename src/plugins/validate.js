/* eslint-disable  */

import { ValidationObserver, ValidationProvider, extend, setInteractionMode } from 'vee-validate'
import { length, max, min, max_value, min_value, numeric, required } from 'vee-validate/dist/rules'
import Vue from 'vue'
import moeda from '@tiig/moeda'

extend('length', {
  ...length,
  message: 'O campo {_field_} deve ter {length} caracteres'
})
extend('numeric', {
  ...numeric,
  message: 'O campo {_field_} requer somente números'
})
extend('required', {
  ...required,
  message: 'O campo {_field_} é obrigatório'
})

extend('max', {
  ...max,
  message: (campo, valor) => {
    return `Valor máximo para ${campo} é: ${valor.length}`
  }
})

extend('min', {
  ...min,
  message: (campo, valor) => {
    return `Valor mínimo para ${campo} é: ${valor.length}`
  }
})

extend('max_value', {
  ...max_value,
  message: 'Valor máximo para {_field_} é: {max}'
})

extend('min_value', {
  ...min_value,
  message: 'Valor mínimo para {_field_} é: {min}'
})

extend('maskedNumber', value => {
  if (moeda.strip(value) !== 0.00) {
    return true
  }
  return '{_field_} não informado'
})

extend('dateValid', value => {
  const [day, month, year] = String(value).split('/')

  if ((Number(day) <= 31 && Number(month) <= 12 && Number(year) >= 1900)) {
    return true
  } else {
    return 'Data inválida'
  }
})

setInteractionMode('passive')

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
