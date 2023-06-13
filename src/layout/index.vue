<template>
  <v-main>
    <!-- TODO: Toolbar do sistema -->
    <v-app-bar
      :color="$vuetify.theme.dark ? 'appbar' : 'primary'"
      :dense="$vuetify.breakpoint.mobile"
      app
      class="elevation-0"
    >
      <div class="d-flex align-center">
        <!-- <v-img
          :src="require('@/assets/logo_branca.png')"
          :width="$vuetify.breakpoint.mdAndDown ? '150' : '220'"
          alt="Logo IG"
          class="shrink mr-1"
          contain
          transition="scale-transition"
          @click="
            $router.currentRoute.path !== '/inicio'
              ? $router.push('/inicio')
              : ''
          "
        /> -->
        <v-avatar size="40">
          <v-img
            :src="require('@/assets/logo_branca.png')"
            alt="Logo IG"
            transition="scale-transition"
            @click="
              $router.currentRoute.path !== '/inicio'
                ? $router.push('/inicio')
                : ''
            "
          />
        </v-avatar>
      </div>
      <span
        class="white--text px-2 font-weight-bold headline"
        @click="
          $router.currentRoute.path !== '/inicio' ? $router.push('/inicio') : ''
        "
        >CONFINAMENTO</span
      >

      <v-spacer />
      <!-- TODO: Descrição Modo Desenvolviment -->
      <v-btn
        v-if="envModo === 'development' && !$vuetify.breakpoint.mobile"
        :large="!$vuetify.breakpoint.mobile"
        color="orange darken-4"
        dark
      >
        <v-icon size="30" class="m-2"> mdi-dev-to </v-icon>
        Ambiente de Desenvolvimento
      </v-btn>
      <v-icon
        v-if="$vuetify.breakpoint.mobile"
        size="30"
        class="m-2"
        color="orange darken-4"
        dark
      >
        mdi-dev-to
      </v-icon>
      <v-spacer v-if="envModo === 'development'" />

      <v-autocomplete
        v-if="!$vuetify.breakpoint.mobile"
        ref="camposPesquisa"
        v-model="pesquisaMenu"
        :search-input.sync="pesquisa"
        :items="paginasUsuarioFiltered"
        :background-color="$vuetify.theme.dark ? 'accent' : 'grey lighten-3'"
        class="mt-1 mx-2"
        clearable
        dense
        filled
        hide-details
        item-text="descricao"
        item-value="url"
        no-filter
        no-data-text="Nada encontrado!"
        placeholder="Pesquise pela descrição da pagina..."
        rounded
        @input="$event ? openUrlNew($event) : ''"
        @keydown.esc="resetPesquisaMenu()"
      >
        <template v-slot:item="{ item }">
          <v-list-item-icon>
            <v-icon
              v-if="String(item.icone).includes('mdi')"
              :color="$vuetify.theme.dark ? 'white' : 'primary darken-1'"
              class="mt-2"
              v-text="item.icone"
            />
            <v-img
              v-else
              :src="require(`@/assets/icones/${item.icone}.png`)"
              width="35"
              alt="IMG"
              class="shrink"
              transition="scale-transition"
              contain
            />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="body-2"
              v-text="item.descricao"
              v-html="$options.filters.highlight(item.descricao, pesquisa)"
            />
          </v-list-item-content>
          <!-- <v-list-item-action>
            <v-list-item-action-text
              v-html="$options.filters.highlight(item.id, pesquisa)"
            >
              {{ item.id }}
            </v-list-item-action-text>
          </v-list-item-action> -->
        </template>
      </v-autocomplete>

      <div class="d-flex d-inline-flex">
        <v-menu bottom left offset-y>
          <template v-slot:activator="{ on }">
            <v-avatar
              :color="$vuetify.theme.dark ? 'grey lighten-1' : 'white'"
              :class="
                $vuetify.theme.dark
                  ? ''
                  : $vuetify.breakpoint.mobile
                  ? 'subtitle-1 orange--text text--darken-4'
                  : 'title orange--text text--darken-4'
              "
              :size="$vuetify.breakpoint.mobile ? 35 : 45"
              class="orange--text text--darken-4 font-weight-black headline"
              v-on="on"
            >
              {{ (nome && nome.substring(0, 2)) || "NA" }}
            </v-avatar>
          </template>
          <v-card min-width="250">
            <v-card-title class="subtitle justify-space-between mb-3">
              {{ login }}
            </v-card-title>
            <v-card-subtitle>
              {{ nome }}
            </v-card-subtitle>
            <v-divider class="mb-1" />
            <v-card-actions>
              <v-btn
                :color="$vuetify.theme.dark ? '' : 'primary'"
                block
                @click="deslogar()"
              >
                <v-icon left size="28"> mdi-logout-variant </v-icon>
                SAIR
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <v-divider />

    <!-- TODO: Transição do router -->
    <v-container class="pa-0 ma-0" fluid>
      <router-view />
    </v-container>

    <!-- TODO: Footer -->
    <v-footer
      :color="$vuetify.theme.dark ? '' : 'primary darken-1'"
      app
      class="pa-0"
      dark
      height="20"
    >
      <v-col class="text-center ma-0 pa-0 caption" cols="12">
        <span class="caption font-weight-bold mr-10">
          {{ dataAtual }}
        </span>
        <strong v-if="!$vuetify.breakpoint.mobile">IG - CONFINAMENTO</strong>
        <span v-if="!$vuetify.breakpoint.mobile"> - Versão {{ versao }}</span>
      </v-col>
    </v-footer>
  </v-main>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "LayoutPage",

  data: () => ({
    dataAtual: "",
    pesquisaMenu: null,
    pesquisa: null,
    loading: false,
    login: localStorage.getItem("igtrato:login")
      ? window.atob(localStorage.getItem("igtrato:login"))
      : "",
    nome: localStorage.getItem("igtrato:nome")
      ? window.atob(localStorage.getItem("igtrato:nome"))
      : "",
  }),

  computed: {
    ...mapState("app", ["paginasUsuario"]),
    envModo() {
      return `${process.env.VUE_NODE_ENV}`;
    },
    versao() {
      return process.env.VUE_APP_VERSION;
    },
    paginasUsuarioFiltered() {
      // return items
      if (this.pesquisa) {
        const regex = new RegExp(
          `(?=(${this.pesquisa
            .split(" ")
            .filter((el) => {
              return !!el;
            })
            .join(".*")}+))+\\1`,
          "gi"
        );
        return this.paginasUsuario.filter(
          (item) => regex.test(item.descricao) || regex.test(item.observacao)
        );
      } else return this.paginasUsuario;
    },
  },

  async created() {
    await this.paginasListar();
    setTimeout(() => {
      this.atualizarData();
    }, 200);
  },

  methods: {
    ...mapActions("app", ["logout", "paginasListar"]),
    atualizarData() {
      this.dataAtual = this.$day().format("dddd - DD - MMMM - YYYY HH:mm:ss");

      setTimeout(() => {
        this.atualizarData();
      }, 1000);
    },
    alterarTema() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem(
        "igtrato:tema",
        window.btoa(this.$vuetify.theme.dark ? "dark" : "light")
      );
    },
    openUrlNew(url) {
      window.open(url, "_blank");
      setTimeout(() => {
        this.pesquisa = null;
        this.pesquisaMenu = null;
      }, 200);
    },
    openUrl(menu) {
      setTimeout(() => {
        this.pesquisaMenu = null;
      }, 200);

      const pagi = this.menusUsuario.find((el) => el.id === menu);

      if (pagi && pagi.url && this.$router.currentRoute.path !== "/") {
        this.$router.push(pagi.url);
      }
    },
    resetPesquisaMenu() {
      setTimeout(() => {
        this.pesquisa = null;
        this.pesquisaMenu = null;
      }, 200);
    },
    async deslogar() {
      this.loading = true;
      const res = await this.logout();
      if (!res.erro) this.$router.push("/login");
      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
.highlight_word {
  color: cadetblue;
  background: transparent;
  font-weight: bold;
}
</style>
