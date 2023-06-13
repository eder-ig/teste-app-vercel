<template>
  <!-- <v-alert
    v-model="ativo"
    :type="notificacao.cor"
    :icon="notificacao.icone"
    app
    border="left"
    class="mt-1"
    dismissible
    width="100%"
    style="z-index: 1000000; position: fixed; border-radius: 15px"
    @input="ativo = false"
  >
    <span v-html="notificacao.mensagem" />
  </v-alert> -->
  <v-snackbar
    v-model="ativo"
    :color="notificacao.cor"
    :timeout="notificacao.tempo"
    multi-line
    style="z-index: 10000 !important"
    top
  >
    <v-icon dark left size="30">
      {{ notificacao.icone }}
    </v-icon>
    <span v-html="notificacao.mensagem" />

    <template v-slot:action="{ attrs }">
      <v-btn v-bind="attrs" dark text @click="ativo = false">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "ComponenteNotificacao",

  // watch: {
  //   "notificacao.tempo"(v) {
  //     if (v) {
  //       setTimeout(
  //         () => {
  //           this.ativo = false;
  //         },
  //         v === -1 ? 100000 : v
  //       );
  //     }
  //   },
  // },

  computed: {
    ...mapState("app", ["notificacao"]),
    ativo: {
      get() {
        return this.notificacao.ativo;
      },
      set(valor) {
        if (!valor) {
          this.setNotificacao({
            ativo: false,
            cor: null,
            icone: null,
            mensagem: null,
            tempo: null,
          });
        }
      },
    },
  },

  methods: {
    ...mapMutations("app", ["setNotificacao"]),
  },
};
</script>
