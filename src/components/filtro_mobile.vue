<template>
  <v-container
    :class="$vuetify.breakpoint ? 'white' : 'white py-0 mx-0 pr-0 pl-1 d-flex'"
    fluid
    style="border: 1px solid #ccc"
  >
    <v-row
      dense
      class="d-flex d-inline-flex py-0"
      style="width: 100% !important"
    >
      <v-col v-if="options.title" class="subtitle-2 py-1" cols="12">
        {{ options.title }}
      </v-col>
      <v-divider v-if="options.title" />

      <div
        :style="`width: ${
          $vuetify.breakpoint.width < '720' ? '75px' : '220px'
        } !important`"
        class="py-1 px-0"
      >
        <v-btn
          v-if="options.botaoGenerico"
          class="ma-1"
          height="41"
          width="61"
          outlined
          :title="
            options.botaoGenerico.title
              ? options.botaoGenerico.title
              : 'Adicionar'
          "
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
          <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
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
          class="ma-1"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="options && options.adicionar && options.adicionar.disabled"
          outlined
          height="41"
          width="61"
          :title="
            (options && options.adicionar && options.adicionar.title) ||
            'Adicionar'
          "
          data-cy="btnAdicionar"
          @click="$emit('adicionar')"
        >
          <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
            mdi-plus-thick
          </v-icon>
        </v-btn>
        <v-btn
          v-if="options && !options.valueInMore"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="!options.moreFilters"
          class="ma-1"
          height="41"
          width="61"
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
            class="ma-1"
            height="41"
            width="61"
            title="Mais Filtros"
            outlined
            data-cy="btnMaisOpcoes"
            @click="expandirMaisFiltros()"
          >
            <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
              {{ expandido ? "mdi-filter-minus-outline" : "mdi-filter-plus" }}
            </v-icon>
          </v-btn>
        </v-badge>
        <v-btn
          v-if="!options.notClearFilter"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="options && !options.values"
          class="ma-1"
          height="41"
          width="61"
          title="Limpar Filtros"
          data-cy="btnLimparFiltros"
          data-v-step="btnLimparFiltros"
          outlined
          @click="
            $emit('clearFilters'),
              // ($refs.expand.isActive = false),
              (expandido = false)
          "
        >
          <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
            mdi-filter-remove
          </v-icon>
        </v-btn>
        <v-btn
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          class="ma-1"
          height="41"
          width="61"
          title="Pesquisar"
          data-cy="btnPesquisar"
          data-v-step="btnPesquisar"
          outlined
          @click="$emit('search')"
        >
          <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">
            mdi-magnify
          </v-icon>
        </v-btn>
      </div>
      <div
        :style="`width: ${
          $vuetify.breakpoint.width < '720'
            ? 'calc(100% - 75px)'
            : 'calc(100% - 220px)'
        } !important`"
        class="py-2 px-0"
      >
        <slot name="filtros" />
      </div>
      <div
        v-if="options && options.moreFilters && expandido"
        style="width: 100%"
      >
        <slot name="maisFiltros" />
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ComponenteFiltroMobile",

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
      this.expandido = !this.expandido;
      this.$emit("expanded", this.expandido);
    },
  },
};
</script>

<style></style>
