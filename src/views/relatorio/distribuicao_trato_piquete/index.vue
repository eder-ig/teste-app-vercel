<template>
  <pagina
    :formulario="false"
    :loading="loading"
    subtitulo="Variação da distribuição de trato nos piquetes"
    titulo="Relatório Distribuição de Trato Por Piquete"
  >
    <template slot="listagem">
      <filtro
        :options="optionsFilter"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <validation-observer ref="observerFiltro">
              <v-row class="pa-0" dense>
                <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Período"
                    rules="required"
                    vid="periodo"
                  >
                    <dateRange
                      v-model="filtro.periodo"
                      :error-messages="errors"
                      required
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Agenda de Trato"
                    rules="required"
                    vid="agendaTratoId"
                  >
                    <select-all
                      v-model="filtro.agendaTratoId"
                      :items="agendaTratoDropdown"
                      :error-messages="errors"
                      :erro="errors"
                      :hide-details="!errors.length"
                      class="required"
                      clearable
                      dense
                      item-value="id"
                      item-text="hora"
                      label="Agenda de Trato"
                      outlined
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Dieta do Lote"
                    rules="required"
                    vid="dietaId"
                  >
                    <select-all
                      v-model="filtro.dietaId"
                      :items="dropdownDietas"
                      :error-messages="errors"
                      :erro="errors"
                      :hide-details="!errors.length"
                      clearable
                      class="required"
                      dense
                      item-value="id"
                      item-text="descricao"
                      label="Dieta do Lote"
                      outlined
                      @input="listarLotes()"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                  <v-select
                    v-model="filtro.status"
                    :items="opcoes[9]"
                    clearable
                    dense
                    hide-details
                    item-value="item"
                    item-text="descricao"
                    label="Status do Lote"
                    outlined
                    @input="listarLotes()"
                  />
                </v-col>
              </v-row>
            </validation-observer>
          </v-container>
        </template>
      </filtro>

      <v-row dense>
        <!-- TODO: Piquete Selecionado -->
        <v-col cols="12">
          <validation-provider
            v-slot="{ errors }"
            name="Piquete Selecionado"
            vid="modelPiqueteSelecionado"
            rules="required"
          >
            <v-sheet
              class="mx-auto"
              elevation="1"
              min-width="300"
              height="100%"
              style="border-radius: 15px"
            >
              <span v-show="errors.length" class="error--text pa-4">
                {{ errors[0] }}
              </span>
              <div class="pb-0 pt-2 px-4 body-1 grey--text font-weight-bold">
                Filtro por Lotes/Piquetes
              </div>
              <v-slide-group
                v-model="modelPiqueteSelecionado"
                class="px-4"
                multiple
                show-arrows
                center-active
              >
                <v-slide-item
                  v-for="(item, idx) in dropdownLotesAtivos"
                  :key="idx"
                  v-slot="{ active, toggle }"
                >
                  <v-card
                    :color="active ? 'blue' : 'white'"
                    :class="active ? 'white--text' : 'balanca_primary--text'"
                    class="font-weight-bold justify-space-between ma-4"
                    min-height="80"
                    width="200"
                    @click="toggle"
                  >
                    <v-card-text
                      class="pt-1 pb-0 justify-space-between d-inline-flex title"
                      :class="active ? 'white--text' : 'balanca_primary--text'"
                    >
                      Piquete <span>{{ item.codigo }}</span>
                    </v-card-text>
                    <v-card-text
                      class="py-0 justify-space-between d-inline-flex title"
                      :class="active ? 'white--text' : 'balanca_primary--text'"
                    >
                      Lote <span>{{ item.loteDescricao }}</span>
                    </v-card-text>
                    <v-card-text
                      class="py-0 justify-space-between d-inline-flex font-weight-bold"
                      :class="active ? 'white--text' : ''"
                    >
                      Quantidade Animais
                      <span>{{ item.loteQuantidadeAnimais }}</span>
                    </v-card-text>
                    <v-card-text
                      class="py-0 justify-space-between d-inline-flex font-weight-bold"
                      :class="active ? 'white--text' : ''"
                    >
                      Data Entrada
                      <span>{{ item.loteDataEntrada }}</span>
                    </v-card-text>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            </v-sheet>
          </validation-provider>
        </v-col>
      </v-row>

      <v-card class="overflow-auto text-center mt-2 pa-2">
        <v-btn
          color="blue"
          dark
          title="Exibir Gráfico"
          @click="(exibirGrafico = !exibirGrafico), listarRegistros()"
        >
          <v-icon left>mdi-chart-areaspline</v-icon>
          {{ exibirGrafico ? "Esconder Gráfico" : "Exibir Gráfico" }}
        </v-btn>
        <!-- :colors="['#303F9F', '#004D40', '#EF6C00']" -->
        <area-chart
          v-show="exibirGrafico"
          :data="dataCharPesoDescarregado"
          :zeros="true"
          :download="true"
          :legend="true"
          :curve="false"
          suffix=" Kg"
          decimal=","
          thousands="."
          xtitle="Piquete/Hora"
          ytitle="Qtd Descarregado (Kg)"
        />
        <area-chart
          v-show="exibirGrafico"
          decimal=","
          thousands="."
          :data="dataCharVariacao"
          :zeros="true"
          :download="true"
          :legend="true"
          :curve="false"
          :colors="['#EF6C00']"
          class="pt-2"
          suffix=" Kg"
          xtitle="Piquete/Hora"
          ytitle="Qtd Descarregado (Kg)"
        />
      </v-card>

      <tabela
        ref="paginacaoFake"
        :colunas="colunas"
        :registros="registros"
        :paginacao="paginacaoFake"
        :registros-por-pagina="100"
        class="mt-2"
        toolbar-grid
        titulo="Listagem das Distribuições de Trato Por Piquete"
        @paginacao="paginacaoFake = $event"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moeda from "@tiig/moeda";

export default {
  name: "RelatorioDistribuicaoTratoPiquete",

  data: () => ({
    modelPiqueteSelecionado: null,

    dataCharPesoDescarregado: null,
    dataCharVariacao: null,
    exibirGrafico: false,
    colunas: [
      {
        text: "Receita",
        align: "start",
        sortable: true,
        value: "receita",
        width: 50,
      },
      {
        text: "Agenda Trato",
        align: "center",
        sortable: true,
        value: "agendaTrato",
        width: 50,
      },
      {
        text: "Data",
        align: "start",
        sortable: true,
        sort: "date",
        value: "data",
        width: 50,
      },
      {
        text: "Piquete",
        align: "start",
        sortable: true,
        value: "piqueteDescricao",
        width: 50,
      },
      {
        text: "Peso Balança",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoBalanca",
        width: 50,
      },
      {
        text: "Peso Descarregado (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoDescarregado",
        width: 50,
      },
      {
        text: "Variação (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "variacao",
        width: 50,
      },
      {
        text: "Qtd MO (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginal",
        width: 50,
      },
      {
        text: "Qtd MO Corrigida (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginalCorrigida",
        width: 50,
      },
      {
        text: "Qtd. MO Realizada (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeRealMassaOriginalTrato",
        width: 50,
      },
      {},
    ],
    filtro: {
      periodo: {
        dataInicio: null,
        dataFim: null,
      },
      loteId: null,
      status: null,
      agendaTratoId: [],
      dietaId: [],
    },
    loading: false,
    paginacaoFake: {
      pagina: 1,
      registros: 100,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("app", ["opcoes"]),
    ...mapState("relatorioDistribuicaoTratoPiquete", [
      "dropdownDietas",
      "dropdownLotesAtivos",
      "registros",
      "agendaTratoDropdown",
    ]),
    filtroValor() {
      return !!(
        this.filtro.loteId ||
        this.filtro.status ||
        this.filtro.agendaTratoId.length ||
        this.filtro.dietaId.length
      );
    },
    optionsFilter() {
      return {
        values: this.filtroValor,
      };
    },
  },

  watch: {
    modelPiqueteSelecionado(value) {
      if (![null, undefined].includes(this.modelPiqueteSelecionado)) {
        this.listarRegistros();
        setTimeout(() => {
          this.atualizarChart();
          this.exibirGrafico = true;
        }, 500);
      } else {
        this.listarRegistros();
        this.modelPiqueteSelecionado = null;
        setTimeout(() => {
          this.atualizarChart();
          this.exibirGrafico = true;
        }, 500);
        // this.exibirGrafico = false;
        // this.$store.commit("relatorioDistribuicaoTratoPiquete/registros", []);
      }
    },
  },

  async created() {
    this.obterOpcoes(9); // 9- Status do Lote
    await this.dropdownDietasListar();
    await this.agendaTratoDropdownListar();

    this.filtro = {
      periodo: {
        dataInicio: this.$day().format("YYYY-MM-DD"),
        dataFim: this.$day().format("YYYY-MM-DD"),
      },
      loteId: null,
      status: 1,
      agendaTratoId: [1],
      dietaId: this.dropdownDietas.map((el) => el.id),
    };

    await this.dropdownLotesAtivosListar({
      dietaId: this.dropdownDietas.map((el) => el.id) || undefined,
    });
  },

  methods: {
    ...mapActions("app", ["obterOpcoes"]),
    ...mapActions("relatorioDistribuicaoTratoPiquete", [
      "dropdownDietasListar",
      "dropdownLotesAtivosListar",
      "listar",
      "agendaTratoDropdownListar",
    ]),
    async listarLotes() {
      this.modelPiqueteSelecionado = null;
      this.exibirGrafico = false;
      this.$store.commit("relatorioDistribuicaoTratoPiquete/registros", []);

      this.dropdownLotesAtivosListar({
        status: this.filtro.status || undefined,
        dietaId: this.filtro.dietaId || undefined,
      });
    },
    async listarRegistros() {
      if (await this.$refs.observerFiltro.validate()) {
        // if (!this.dropdownLotesAtivos[this.modelPiqueteSelecionado]) {
        //   this.modelPiqueteSelecionado = null;
        //   this.listarLotes();
        //   return;
        // }
        this.loading = true;
        const piquetesIds = [];
        if (![null, undefined].includes(this.modelPiqueteSelecionado)) {
          for (const posicaoArray of this.modelPiqueteSelecionado) {
            const p = this.dropdownLotesAtivos[posicaoArray].piqueteId;
            if (p) piquetesIds.push(p);
          }
        }

        await this.listar({
          // piqueteId: ![null, undefined].includes(this.modelPiqueteSelecionado)
          //   ? this.dropdownLotesAtivos[this.modelPiqueteSelecionado].piqueteId
          //   : undefined,
          piqueteId: piquetesIds || undefined,
          dataInicio: this.filtro.periodo.dataInicio || undefined,
          dataFim: this.filtro.periodo.dataFim || undefined,
          agendaTratoId: this.filtro.agendaTratoId || undefined,
        });

        setTimeout(() => {
          this.atualizarChart();
        }, 200);

        this.loading = false;
      }
    },
    async atualizarChart() {
      let pesoBalanca = {};
      let pesoDescarregado = {};
      let variacao = {};
      for (let i = 0; i < this.registros.length; i++) {
        pesoBalanca = {
          ...pesoBalanca,
          [`${i}-${this.registros[i].piqueteDescricao} - ${this.$day(
            this.registros[i].data,
            "DD/MM/YYYY HH:mm:ss"
          ).format("HH:mm:ss")}`]: moeda.strip(this.registros[i].pesoBalanca),
        };
        pesoDescarregado = {
          ...pesoDescarregado,
          [`${i}-${this.registros[i].piqueteDescricao} - ${this.$day(
            this.registros[i].data,
            "DD/MM/YYYY HH:mm:ss"
          ).format("HH:mm:ss")}`]: moeda.strip(
            this.registros[i].pesoDescarregado
          ),
        };
        variacao = {
          ...variacao,
          [`${i}-${this.registros[i].piqueteDescricao} - ${this.$day(
            this.registros[i].data,
            "DD/MM/YYYY HH:mm:ss"
          ).format("HH:mm:ss")}`]: moeda.strip(this.registros[i].variacao),
        };
      }

      this.dataCharPesoDescarregado = [
        {
          name: "Peso Balança (Kg)",
          data: { ...pesoBalanca },
        },
        {
          name: "Peso Descarregado (Kg)",
          data: { ...pesoDescarregado },
        },
        {
          name: "Variação (Kg)",
          data: { ...variacao },
        },
      ];
      this.dataCharVariacao = [
        {
          name: "Variação (Kg)",
          data: { ...variacao },
        },
      ];
    },
    limparFiltros() {
      this.filtro = {
        periodo: {
          dataInicio: null,
          dataFim: null,
        },
        loteId: null,
        status: null,
        agendaTratoId: [],
        dietaId: [],
      };
    },
  },
};
</script>
