<template>
  <v-card
    class="mt-0 elevation-0"
    outlined
    style="border-radius: 0px; !important;"
  >
    <v-card-title v-if="options.title" class="subtitle-2 py-1">
      {{ options.title }}
    </v-card-title>

    <v-divider v-if="options.title" />

    <v-card-text class="mb-0 py-0 px-1">
      <v-expansion-panels flat>
        <v-expansion-panel ref="expand" class="filtro-expand" readonly eager>
          <v-expansion-panel-header class="pa-0 mx-0 my-1" disable-icon-rotate>
            <v-menu v-if="options && !!options.maisOpcoes" right offset-y dense>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  title="Mais Opções"
                  data-cy="Mais Opções"
                  class="ml-1"
                  v-on="on"
                >
                  <v-icon
                    class="pa-1"
                    :color="$vuetify.theme.dark ? 'white' : 'primary'"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </v-btn>
              </template>
              <slot name="maisOpcoes" />
              <v-list dense>
                <v-menu v-model="menu" :close-on-content-click="false" offset-x>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item
                      dense
                      :disabled="options && !options.values"
                      data-cy="btnLimparFiltros"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-list-item-icon class="mr-3">
                        <v-icon
                          :disabled="options && !options.values"
                          :color="$vuetify.theme.dark ? 'white' : 'primary'"
                        >
                          mdi-filter-remove
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title> Limpar Filtros </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>

                  <v-card dense>
                    <v-card-subtitle>
                      Deseja limpar todos os filtros?
                    </v-card-subtitle>
                    <v-divider />
                    <v-card-actions>
                      <v-btn
                        color="primary"
                        data-cy="confirmarLimparFiltros"
                        text
                        small
                        @click="
                          (menu = false),
                            $emit('clearFilters'),
                            ($refs.expand.isActive = false),
                            (expandido = $refs.expand.isActive)
                        "
                      >
                        Confirmar
                      </v-btn>
                      <v-btn text small @click="menu = false"> Cancelar </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>

                <v-list-item
                  v-for="(option, idx) in options.maisOpcoes"
                  :key="idx"
                  :disabled="option.disabled"
                  dense
                  @click="$emit(`${option.emit}`)"
                >
                  <v-list-item-icon class="mr-3">
                    <v-icon
                      :color="
                        $vuetify.theme.dark ? 'white' : option.color || 'error'
                      "
                      :disabled="option.disabled"
                    >
                      {{ option.icon || "mdi-check" }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title :title="option.hint ? option.hint : ''">
                      {{ option.title || "Titulo" }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn
              v-if="options.botaoGenerico"
              outlined
              :title="
                options.botaoGenerico.title
                  ? options.botaoGenerico.title
                  : 'Adicionar'
              "
              class=""
              @click="
                $emit(
                  `${
                    options.botaoGenerico.emit
                      ? options.botaoGenerico.emit
                      : 'adicionar'
                  }`
                )
              "
            >
              <v-icon
                class="pa-1"
                :color="$vuetify.theme.dark ? 'white' : 'primary'"
              >
                {{
                  options.botaoGenerico.icon
                    ? options.botaoGenerico.icon
                    : "mdi-plus"
                }}
              </v-icon>
            </v-btn>

            <v-btn
              v-if="
                (options && options.adicionar) ||
                (options && options.adicionar && options.adicionar.value)
              "
              :color="$vuetify.theme.dark ? 'white' : 'primary'"
              :disabled="
                options && options.adicionar && options.adicionar.disabled
              "
              :title="
                (options && options.adicionar && options.adicionar.title) ||
                'Adicionar'
              "
              class="my-auto"
              outlined
              data-cy="btnAdicionar"
              @click="$emit('adicionar')"
            >
              <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
                mdi-plus-thick
              </v-icon>
            </v-btn>

            <v-btn
              v-if="options && options.moreFilters && !options.valueInMore"
              :color="$vuetify.theme.dark ? 'white' : 'primary'"
              class="my-auto ml-3 pa-1"
              title="Mais Filtros"
              outlined
              data-cy="btnMaisFiltros"
              @click="expandirMaisFiltros()"
            >
              <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
                {{ expandido ? "mdi-filter-minus-outline" : "mdi-filter-plus" }}
              </v-icon>
            </v-btn>

            <v-badge
              v-if="options && options.moreFilters && options.valueInMore"
              color="blue darken-3"
              dot
              offset-x="15"
              offset-y="8"
            >
              <v-btn
                :color="$vuetify.theme.dark ? 'white' : 'primary'"
                class="my-auto pa-1 mr-1 ml-3"
                title="Mais Filtros"
                outlined
                data-cy="btnMaisOpcoes"
                @click="expandirMaisFiltros()"
              >
                <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
                  {{
                    expandido ? "mdi-filter-minus-outline" : "mdi-filter-plus"
                  }}
                </v-icon>
              </v-btn>
            </v-badge>

            <slot name="acao" />
            <v-btn
              :color="$vuetify.theme.dark ? 'white' : 'primary'"
              :disabled="options && !options.values"
              title="Limpar Filtros"
              class="my-auto mx-2"
              data-cy="btnLimparFiltros"
              data-v-step="btnLimparFiltros"
              outlined
              @click="
                $emit('clearFilters'),
                  ($refs.expand.isActive = false),
                  (expandido = $refs.expand.isActive)
              "
            >
              <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
                mdi-filter-remove
              </v-icon>
            </v-btn>

            <v-btn
              :color="$vuetify.theme.dark ? 'white' : 'primary'"
              title="Pesquisar"
              class="my-auto mr-2"
              data-cy="btnPesquisar"
              data-v-step="btnPesquisar"
              outlined
              @click="$emit('search')"
            >
              <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
                mdi-magnify
              </v-icon>
            </v-btn>

            <v-btn
              v-if="options && options.qrcode"
              :color="$vuetify.theme.dark ? 'white' : 'primary'"
              title="Ler QRCode"
              class="my-auto ml-2"
              data-cy="qrcodeStart"
              data-v-step="qrcodeStart"
              outlined
              @click="$emit('qrcodeStart')"
            >
              <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
                mdi-qrcode
              </v-icon>
            </v-btn>

            <v-btn
              v-if="options && options.imprimir"
              :disabled="options.imprimir && options.imprimir.disabled"
              :color="$vuetify.theme.dark ? 'white' : 'primary'"
              :title="
                options.imprimir.title ? options.imprimir.title : 'Imprimir'
              "
              class="my-auto ml-2"
              outlined
              @click="
                $emit(
                  `${
                    options.imprimir && options.imprimir.emit
                      ? options.imprimir.emit
                      : 'imprimir'
                  }`
                )
              "
            >
              <v-icon
                :color="
                  options.imprimir && options.imprimir.color
                    ? options.imprimir.color
                    : 'primary'
                "
              >
                mdi-printer
              </v-icon>
            </v-btn>

            <template v-slot:actions>
              <div style="display: none" />
            </template>

            <slot name="filtros" />
          </v-expansion-panel-header>
          <v-expansion-panel-content
            key="1"
            :hide-actions="options && !options.moreFilters"
            eager
          >
            <slot name="maisFiltros" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-toolbar height="2" color="#ddd" flat />
  </v-card>
</template>

<script>
export default {
  name: "ComponenteFiltroNovo",

  props: {
    /**
     * @author Eder Ferraz Caciano
     * @description Componente Filtro
     */
    // options: {
    //   values: false,
    //   valueInMore: false,
    //   adicionar: true,
    //   search: false,
    //   moreFilters: true,
    //   maisOpcoes: [
    //     {
    //       icon: 'mdi-delete',
    //       color: 'error',
    //       title: 'Excluir registro',
    //       emit: 'excluir'
    //     }
    //   ]
    // }
    options: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    expandido: false,
    menu: false,
  }),

  methods: {
    expandirMaisFiltros() {
      this.$refs.expand.isActive = !this.$refs.expand.isActive;
      this.expandido = this.$refs.expand.isActive;
      this.$emit("expanded", !!this.$refs.expand.isActive);
    },
  },
};
</script>

<style lang="scss">
.filtro-expand {
  .v-expansion-panel__header {
    padding: 8px !important;
  }
}
.v-expansion-panel-content__wrap {
  padding: 0 !important;
  padding-bottom: 4px !important;
}
</style>
