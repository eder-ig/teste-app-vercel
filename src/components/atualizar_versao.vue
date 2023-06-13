<template>
  <div>
    <v-snackbar
      :value="snackbar"
      :timeout="-1"
      :vertical="true"
      color="orange darken-3"
      right
      tile
      outlined
    >
      <span class="title font-weight-bold"> Atualizar versão! </span>
      <br />
      <span class="caption font-weight-bold">
        A página precisa ser recarregada!
      </span>

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue darken-4"
          text
          v-bind="attrs"
          @click="$emit('atualizarVersao')"
        >
          <v-icon> mdi-refresh </v-icon>
          Atualizar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "ComponenteAtualizarVersao",

  props: {
    snackbar: {
      default: false,
      type: Boolean,
    },
  },
};
</script>
