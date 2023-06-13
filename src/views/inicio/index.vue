<template>
  <v-container class="pa-0">
    <v-row dense class="ma-0">
      <v-col cols="12">
        <div v-if="!!paginasUsuarioGroup.length" class="headline px-4">
          Páginas do Usuário
        </div>
        <v-card
          v-for="grupoPaginas in paginasUsuarioGroup"
          :key="grupoPaginas.id"
          flat
        >
          <v-card-title>
            <v-icon
              v-if="String(grupoPaginas.icone).includes('mdi')"
              :color="grupoPaginas.corIcone"
              left
            >
              {{ grupoPaginas.icone }}
            </v-icon>
            <v-img
              v-else
              :src="require(`@/assets/icones/${grupoPaginas.icone}.png`)"
              width="35"
              alt="IMG"
              class="shrink mr-2"
              transition="scale-transition"
              contain
            />
            {{ grupoPaginas.descricao }}
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap" elevation="0">
              <v-row dense>
                <v-col
                  v-for="(fav, idx) in grupoPaginas.paginas || []"
                  v-show="fav.url !== '/inicio'"
                  :key="idx"
                  :cols="xl ? 1 : lg ? 2 : md ? 2 : xs ? 6 : 3"
                  class="pa-0 elevation-0"
                >
                  <v-card
                    :to="fav.url"
                    class="pa-1 elevation-0"
                    width="100%"
                    height="100%"
                  >
                    <v-card-text
                      class="d-flex text-center justify-center align-center pa-0"
                    >
                      <v-icon
                        v-if="String(fav.icone).includes('mdi')"
                        :color="fav.corIcone || 'secondary'"
                        size="50"
                      >
                        {{ fav.icone }}
                      </v-icon>
                      <v-img
                        v-else
                        :src="require(`@/assets/icones/${fav.icone}.png`)"
                        width="65"
                        alt="IMG"
                        class="shrink mt-1"
                        transition="scale-transition"
                        contain
                      />
                    </v-card-text>
                    <v-card-text
                      class="sub-title d-flex text-center justify-center align-center font-weight-bold py-0"
                    >
                      {{ fav.descricao }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card
      v-if="!paginasUsuarioGroup.length"
      flat
      :color="$vuetify.theme.dark ? '#121212' : ''"
      :class="
        $vuetify.theme.dark
          ? 'd-flex text-center'
          : 'd-flex text-center grey lighten-5'
      "
      style="height: 100%; padding-top: 10vw"
    >
      <v-row class="justify-center">
        <v-col xs="12">
          <span class="display-4 font-weight-bold pr-1 grey--text">
            <v-icon color="error" size="100">
              mdi-file-question-outline
            </v-icon>
          </span>
          <p class="display-1 pt-3">
            Desculpe, você não possui páginas liberadas nesse sistema.
          </p>
          <span>Pos favor entre em contato com o departamento de TI!</span>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "HomePage",

  computed: {
    ...mapState("app", ["paginasUsuarioGroup"]),
    xs() {
      return this.$vuetify.breakpoint.xs;
    },
    md() {
      return this.$vuetify.breakpoint.md;
    },
    lg() {
      return this.$vuetify.breakpoint.lg;
    },
    xl() {
      return this.$vuetify.breakpoint.xl;
    },
  },

  async created() {
    await this.paginasListar();
    this.paginasListarGroup();
  },

  methods: {
    ...mapActions("app", ["paginasListarGroup", "paginasListar"]),
  },
};
</script>
