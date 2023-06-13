<template>
  <pagina
    :formulario="false"
    :loading="loading"
    subtitulo="Relatório Eficiência de Trato"
    titulo="Relatório Eficiência de Trato"
  >
    <template slot="listagem">
      <filtro
        :options="optionsFilter"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row class="pa-0" dense>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <dateRange
                  v-model="filtro.periodo"
                  :error-messages="[]"
                  required
                />
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
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <select-all
                  v-model="filtro.agendaTratoId"
                  :items="agendaTratoDropdown"
                  clearable
                  dense
                  hide-details
                  item-value="id"
                  item-text="hora"
                  label="Agenda de Trato"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="6" xs="12">
                <v-checkbox
                  v-model="filtro.listarMedia"
                  :color="$vuetify.theme.dark ? 'white' : 'primary'"
                  :ripple="false"
                  class="my-1 mx-1"
                  label="Listar Média do Período"
                  hide-details
                />
              </v-col>
            </v-row>
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
        <column-chart
          v-show="exibirGrafico"
          :precision="4"
          :data="dataChartMS"
          :zeros="true"
          :download="true"
          suffix=" Kg"
          decimal=","
          thousands="."
          xtitle="Data/Piquete"
          ytitle="Qtd MS Previsto (Kg)"
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
        titulo="Listagem dos Tratos po Período"
        @paginacao="paginacaoFake = $event"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moeda from "@tiig/moeda";

export default {
  name: "RelatorioEficienciaDeTratos",

  data: () => ({
    modelPiqueteSelecionado: null,

    dataChartMS: null,
    dataChartIPV: null,
    exibirGrafico: true,
    colunas: [
      {
        text: "Data",
        align: "start",
        sortable: true,
        sort: "date",
        value: "data",
        width: 50,
      },
      {
        text: "Agenda Trato",
        align: "center",
        sortable: true,
        value: "hora",
        width: 50,
      },
      {
        text: "Lote",
        align: "start",
        sortable: true,
        value: "loteDescricao",
        width: 50,
      },
      {
        text: "Status Lote",
        align: "start",
        sortable: true,
        value: "status",
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
        text: "Qtd. Animais",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeAnimais",
        width: 50,
      },
      {
        text: "Qtd. MS Base (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMsBase",
        width: 50,
      },
      {
        text: "Aumento (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "percentualAumento",
        width: 50,
      },
      {
        text: "Qtd. Aumento (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMsAumento",
        width: 50,
      },
      {
        text: "Qtd. MS (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMs",
        width: 50,
      },
      {
        text: "Qtd. MO (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMo",
        width: 50,
      },
      {
        text: "Qtd. MO Ajustado (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMoAjustado",
        width: 50,
      },
      {
        text: "Qtd. MS Realizado (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMsRealizado",
        width: 50,
      },
      {
        text: "Qtd. MO Realizado (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMoRealizado",
        width: 50,
      },
      {
        text: "Diferença MO (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "diferenca",
        width: 50,
      },
      {
        text: "Percentual Atendido MO (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "percentualAtendimento",
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
      listarMedia: false,
    },
    loading: false,
    paginacaoFake: {
      pagina: 1,
      registros: 20,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("app", ["opcoes"]),
    ...mapState("relatorioEficienciaTrato", [
      "dropdownLotesAtivos",
      "registros",
      "agendaTratoDropdown",
    ]),
    filtroValor() {
      return !!(
        this.filtro.loteId ||
        this.filtro.status ||
        this.filtro.listarMedia ||
        this.filtro.agendaTratoId.length
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
        this.modelPiqueteSelecionado = null;
        this.exibirGrafico = false;
        this.$store.commit("relatorioEficienciaTrato/registros", []);
      }
    },
  },

  async created() {
    this.filtro = {
      periodo: {
        dataInicio: this.$day().subtract(1, "month").format("YYYY-MM-DD"),
        dataFim: this.$day().format("YYYY-MM-DD"),
      },
      loteId: null,
      status: 1,
      agendaTratoId: [],
      listarMedia: false,
    };
    this.obterOpcoes(9); // 9- Status do Lote
    this.agendaTratoDropdownListar();
    this.dropdownLotesAtivosListar();
  },

  methods: {
    ...mapActions("app", ["obterOpcoes"]),
    ...mapActions("relatorioEficienciaTrato", [
      "dropdownLotesAtivosListar",
      "listar",
      "agendaTratoDropdownListar",
    ]),
    async listarLotes() {
      this.modelPiqueteSelecionado = null;
      this.exibirGrafico = false;
      this.$store.commit("relatorioEficienciaTrato/registros", []);

      this.dropdownLotesAtivosListar({
        status: this.filtro.status || undefined,
      });
    },
    async listarRegistros() {
      if (!this.dropdownLotesAtivos[this.modelPiqueteSelecionado]) {
        this.modelPiqueteSelecionado = null;
        this.listarLotes();
        return;
      }
      this.loading = true;

      await this.listar({
        loteId:
          this.dropdownLotesAtivos[this.modelPiqueteSelecionado].loteId ||
          undefined,
        dataInicio: this.filtro.periodo.dataInicio || undefined,
        dataFim: this.filtro.periodo.dataFim || undefined,
        listarMedia: this.filtro.listarMedia || undefined,
        agendaTratoId: this.filtro.agendaTratoId || undefined,
      });

      setTimeout(() => {
        this.atualizarChart();
      }, 200);

      this.loading = false;
    },
    async atualizarChart() {
      let qtdMo = {};
      let qtdMoRealizado = {};
      for (let i = 0; i < this.registros.length; i++) {
        qtdMo = {
          ...qtdMo,
          [`${this.registros[i].data} ${this.registros[i].loteDescricao} (${
            this.registros[i].hora || "-"
          })`]: moeda.strip(this.registros[i].qtdMoAjustado),
        };
        qtdMoRealizado = {
          ...qtdMoRealizado,
          [`${this.registros[i].data} ${this.registros[i].loteDescricao} (${
            this.registros[i].hora || "-"
          })`]: moeda.strip(this.registros[i].qtdMoRealizado),
        };
      }

      this.dataChartMS = [
        {
          name: "Qtd. MO Previsto (Kg)",
          data: { ...qtdMo },
        },
        {
          name: "Qtd. MO Realizado (Kg)",
          data: { ...qtdMoRealizado },
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
        listarMedia: false,
      };
    },
  },
};
</script>
