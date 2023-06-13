<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Lançamento leitura de cocho"
    titulo-toolbar="Novo Lançamento de Leitura de Cocho"
    titulo="Lançamento Leitura de Cocho"
    fechar
    @cancelar="resetFormulario()"
    @editar="(controle.exibir = false), (controle.editar = true)"
    @fechar="resetFormulario()"
    @salvar="salvarRegistro()"
  >
    <aviso
      v-model="aviso.modal"
      :options="aviso"
      @sim="aviso = { modal: false, key: null, text: '' }"
      @excluir="
        (aviso = { modal: false, key: null, text: '' }), excluirRegistro()
      "
    />

    <template slot="formulario">
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observer">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12" xl="2" lg="4" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Data da Leitura"
                  rules="required"
                  vid="dataLeitura"
                >
                  <date-picker
                    v-model="filtro.dataLeitura"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    controlar-dia
                    dense
                    label="Data da Leitura"
                    outlined
                    @input="listarRegistros()"
                  />
                </validation-provider>
              </v-col>
            </v-row>
            <v-row dense>
              <!-- TODO: Piquete Selecionado -->
              <v-col cols="12" xl="6" lg="6" md="12" xs="12">
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
                    <div
                      class="pb-0 pt-2 px-4 body-1 grey--text font-weight-bold"
                    >
                      Piquete
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
                          :class="
                            active ? 'white--text' : 'balanca_primary--text'
                          "
                          class="font-weight-bold justify-space-between ma-4"
                          min-height="150"
                          width="300"
                          @click="toggle"
                        >
                          <v-card-title class="pb-0 pt-1">
                            Piquete - {{ item.codigo }}
                          </v-card-title>
                          <v-card-text
                            class="py-0 justify-space-between d-inline-flex sub-title-1"
                            :class="
                              active ? 'white--text' : 'balanca_primary--text'
                            "
                          >
                            <span>{{ item.loteDescricao }}</span>
                          </v-card-text>
                          <v-card-text
                            class="pb-0 justify-space-between d-inline-flex font-weight-bold"
                          >
                            Quantidade Animais
                            <span>{{ item.loteQuantidadeAnimais }}</span>
                          </v-card-text>
                          <v-card-text
                            class="py-0 justify-space-between d-inline-flex font-weight-bold"
                          >
                            Data Entrada
                            <span>{{ item.loteDataEntrada }}</span>
                          </v-card-text>
                          <v-card-text
                            class="py-0 justify-space-between d-inline-flex font-weight-bold"
                          >
                            Peso Médio Entrada
                            <span>{{ item.lotePesoMedioEntrada }} (Kg)</span>
                          </v-card-text>
                        </v-card>
                      </v-slide-item>
                    </v-slide-group>
                  </v-sheet>
                </validation-provider>
              </v-col>

              <!-- TODO: Valor Coletado -->
              <v-col cols="12" xl="6" lg="6" md="12" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Valor Selecionado"
                  vid="modelValorSelecionado"
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
                    <v-item-group
                      v-model="modelValorSelecionado"
                      active-class="blue"
                    >
                      <v-card dense flat class="mb-1">
                        <v-card-title
                          class="pb-0 pt-2 body-1 grey--text font-weight-bold"
                        >
                          Decisão
                        </v-card-title>
                      </v-card>
                      <v-row dense class="px-4">
                        <v-col
                          v-for="(item, idx) in dropdownTipoLeituraCocho"
                          :key="idx"
                        >
                          <v-item v-slot="{ active, toggle }">
                            <v-card
                              :color="
                                active
                                  ? 'blue'
                                  : $vuetify.theme.dark
                                  ? 'grey'
                                  : 'grey lighten-3'
                              "
                              :class="active ? 'white--text' : ''"
                              height="70"
                              min-width="150"
                              class="d-flex align-center py-8 my-1"
                              style="border-radius: 15px !important"
                              @click="toggle()"
                            >
                              <v-scroll-y-transition>
                                <div
                                  class="flex-grow-1 text-center font-weight-bold mx-2 sub-title-1"
                                >
                                  ({{ item.nota }})
                                  {{ item.descricao }}
                                </div>
                              </v-scroll-y-transition>
                            </v-card>
                          </v-item>
                        </v-col>
                      </v-row>
                    </v-item-group>
                  </v-sheet>
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </template>

    <template slot="relacionamento">
      <v-row dense>
        <v-col cols="12">
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
            <line-chart
              v-show="exibirGrafico"
              :precision="4"
              :data="dataChartMS"
              :zeros="true"
              :download="true"
              suffix=" Kg"
              decimal=","
              thousands="."
              xtitle="Data/Piquete"
              ytitle="Valor"
            />
            <v-divider />
            <line-chart
              v-show="exibirGrafico"
              :precision="4"
              :data="dataChartIPV"
              :zeros="true"
              :download="true"
              class="mt-2"
              suffix=" %"
              decimal=","
              thousands="."
              xtitle="Data/Piquete"
              ytitle="Valor"
            />
          </v-card>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="4">
          <tabela
            :colunas="colunas"
            :loading="loading"
            :paginacao="paginacaoFake"
            :registros="registros"
            :registros-por-pagina="100"
            class="mt-2"
            excluir
            toolbar-grid
            titulo="Lançamentos das Leituras de Cocho"
            @paginacao="paginacaoFake = $event"
            @excluir="
              (leituraCochoId = $event),
                (aviso = {
                  modal: true,
                  key: 'excluir',
                  text: 'Deseja realmente excluir essa leitura de cocho?',
                })
            "
            @select="
              $vuetify.breakpoint.mobile ? exibirRegistro($event.id) : ''
            "
          />
        </v-col>
        <v-col cols="8">
          <v-row dense>
            <!-- TODO: Ultimos lançamentos de leitura de cocho para esse piquete -->
            <v-col cols="12">
              <tabela
                ref="paginacaoFake"
                :colunas="colunasUltimasLeituras"
                :registros="ultimasLeituras"
                :paginacao="paginacaoFake"
                :registros-por-pagina="100"
                class="mt-2"
                toolbar-grid
                titulo="Ultimas Leituras de Cocho"
                @paginacao="paginacaoFake = $event"
              />
            </v-col>
            <!-- TODO: Coleta Leitura de Cocho -->
            <v-col cols="12">
              <tabela
                ref="paginacaoFake"
                :colunas="colunasColetaCocho"
                :registros="coletaCocho"
                :paginacao="paginacaoFake"
                :registros-por-pagina="100"
                class="mt-2"
                toolbar-grid
                titulo="Histórico de Coleta de Cocho"
                @paginacao="paginacaoFake = $event"
              />
            </v-col>
            <!-- TODO: Ocorrencias do piquete -->
            <v-col cols="12">
              <tabela
                ref="paginacaoFake"
                :colunas="colunasHistoricoOcorrencias"
                :registros="historicoOcorrencias"
                :paginacao="paginacaoFake"
                :registros-por-pagina="100"
                class="mt-2"
                toolbar-grid
                titulo="Histórico de Ocorrência"
                @paginacao="paginacaoFake = $event"
              />
            </v-col>
            <!-- TODO: Historico de Consumo -->
            <v-col cols="12">
              <tabela
                ref="paginacaoFake"
                :colunas="colunasHistoricoConsumo"
                :registros="historicoConsumo"
                :paginacao="paginacaoFake"
                :registros-por-pagina="100"
                class="mt-2"
                toolbar-grid
                titulo="Histórico de Consumo"
                @paginacao="paginacaoFake = $event"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>

    <template slot="maisOpcoes">
      <v-list class="pa-0" dense>
        <v-list-item
          @click="
            aviso = {
              modal: true,
              key: 'excluir',
              text: 'Deseja realmente excluir esse registro?',
            }
          "
        >
          <v-list-item-icon class="mr-3">
            <v-icon color="primary"> mdi-delete </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Excluir registro </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <template slot="listagem">
      <filtro
        v-if="!$vuetify.breakpoint.mobile"
        :options="optionsFilter"
        @adicionar="(modal = true), (controle.inserir = true)"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row class="pa-0" dense>
              <v-col cols="12" xl="4" lg="4" md="4" xs="12">
                <v-autocomplete
                  v-model="filtro.piqueteId"
                  :items="dropdownLotesAtivos"
                  :disabled="controle.exibir"
                  item-text="codigo"
                  item-value="piqueteId"
                  dense
                  hide-details
                  label="Piquete"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4" xs="12">
                <v-autocomplete
                  v-model="filtro.tipoLeituraCochoId"
                  :items="dropdownTipoLeituraCocho"
                  :disabled="controle.exibir"
                  item-text="descricao"
                  item-value="id"
                  dense
                  hide-details
                  label="Tipo Leitura"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4" xs="12">
                <date-picker
                  v-model="filtro.dataLeitura"
                  dense
                  not-full-screen
                  :clearable="false"
                  hide-details
                  label="Data Leitura"
                  outlined
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro>

      <filtro-mobile
        v-if="$vuetify.breakpoint.mobile"
        :options="optionsFilter"
        @adicionar="(modal = true), (controle.inserir = true)"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="filtro.piqueteId"
                  :items="dropdownLotesAtivos"
                  :disabled="controle.exibir"
                  item-text="codigo"
                  item-value="piqueteId"
                  dense
                  hide-details
                  label="Piquete"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="filtro.tipoLeituraCochoId"
                  :items="dropdownTipoLeituraCocho"
                  :disabled="controle.exibir"
                  item-text="descricao"
                  item-value="id"
                  dense
                  hide-details
                  label="Tipo Leitura"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <date-picker
                  v-model="filtro.dataLeitura"
                  dense
                  not-full-screen
                  :clearable="false"
                  hide-details
                  label="Data Leitura"
                  outlined
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro-mobile>

      <tabela
        :colunas="colunas"
        :loading="loading"
        :paginacao="paginacaoFake"
        :registros="registros"
        :registros-por-pagina="100"
        class="mt-4"
        height-auto
        excluir
        toolbar-grid
        titulo="Lançamentos das Leituras de Cocho"
        @paginacao="paginacaoFake = $event"
        @excluir="
          (leituraCochoId = $event),
            (aviso = {
              modal: true,
              key: 'excluir',
              text: 'Deseja realmente excluir essa leitura de cocho?',
            })
        "
        @select="$vuetify.breakpoint.mobile ? exibirRegistro($event.id) : ''"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";
import day from "@/plugins/dayjs";
import moeda from "@tiig/moeda";

export default {
  name: "PaginaConfinamentoLeituraCocho",

  data: () => ({
    dataChartMS: null,
    dataChartIPV: null,
    exibirGrafico: false,
    aviso: {
      modal: false,
      key: null,
      text: "",
    },
    colunas: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Piquete",
        align: "center",
        sortable: true,
        value: "piqueteDescricao",
        width: 100,
      },
      {
        text: "Tipo Leitura",
        align: "start",
        sortable: true,
        value: "tipoLeituraDescricao",
        width: 150,
      },
      {
        text: "Data Leitura",
        align: "start",
        sortable: true,
        value: "dataLeitura",
      },
    ],
    colunasUltimasLeituras: [
      {
        text: "Piquete",
        align: "center",
        sortable: true,
        value: "piqueteDescricao",
        width: 100,
      },
      {
        text: "Tipo Leitura",
        align: "start",
        sortable: true,
        value: "tipoLeituraCochoDescricao",
        width: 150,
      },
      {
        text: "Data Coleta",
        align: "start",
        sortable: true,
        value: "dataLeitura",
        width: 150,
      },
      {},
    ],
    colunasColetaCocho: [
      {
        text: "Piquete",
        align: "center",
        sortable: true,
        value: "piqueteDescricao",
        width: 100,
      },
      {
        text: "Tipo Coleta",
        align: "start",
        sortable: true,
        value: "tipoColetaDescricao",
        width: 150,
      },
      {
        text: "Data Coleta",
        align: "start",
        sortable: true,
        value: "data",
        width: 150,
      },
      {
        text: "Valor Coleta",
        align: "start",
        sortable: true,
        value: "valorColeta",
      },
    ],
    colunasHistoricoOcorrencias: [
      {
        text: "Data",
        align: "start",
        sortable: true,
        value: "data",
        width: 100,
      },
      {
        text: "Tipo Ocorrência",
        align: "start",
        sortable: true,
        value: "tipoOcorrenciaDescricao",
        width: 100,
      },
      {
        text: "Piquete",
        align: "start",
        sortable: true,
        value: "piqueteDescricao",
        width: 100,
      },
      {
        text: "Lote",
        align: "start",
        sortable: true,
        value: "loteDescricao",
        width: 100,
      },
      {
        text: "Observação",
        align: "start",
        sortable: true,
        value: "observacao",
      },
    ],
    colunasHistoricoConsumo: [
      {
        text: "Movimento",
        align: "center",
        sortable: true,
        sort: "date",
        value: "movimento",
        width: 50,
      },
      {
        text: "Qtd. Animais",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdAnimais",
        width: 50,
      },
      {
        text: "Ingestão MS/PV (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "ingestaoMassaSeca",
        width: 50,
      },
      {
        text: "Peso Médio Anterior",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoMedioAnterior",
        width: 50,
      },
      {
        text: "Peso Médio Atual",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoMedioAtual",
        width: 50,
      },
      {
        text: "Qtd MS/Animal (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMsAnimalBase",
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
        text: "Qtd MS  + Aumento (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMsAnimalRealizada",
        width: 50,
      },
      // {
      //   text: "Qtd MS Lote (Kg)",
      //   align: "end",
      //   sortable: true,
      //   sort: "money",
      //   value: "qtdMsLote",
      //   width: 50,
      // },
      {
        text: "Percentual MS (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "percentualMs",
        width: 50,
      },
      {
        text: "Qtd MO/Animal (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMoAnimal",
        width: 50,
      },
      {
        text: "Qtd MO/Lote (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMoLote",
      },
    ],
    modal: false,
    controle: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    filtro: {
      tipoLeituraCochoId: null,
      piqueteId: null,
      dataLeitura: null,
    },
    loading: false,
    paginacaoFake: {
      pagina: 1,
      registros: 20,
      totalRegistros: 0,
    },

    modelPiqueteSelecionado: null,
    modelValorSelecionado: null,
    leituraCochoId: null,
  }),

  computed: {
    ...mapState("paginaConfinamentoLeituraCocho", [
      "registros",
      "dropdownLotesAtivos",
      "dropdownTipoLeituraCocho",

      "ultimasLeituras",
      "historicoConsumo",
      "historicoOcorrencias",
      "coletaCocho",
    ]),
    optionsFilter() {
      return {
        adicionar: true,
        valueInMore: true,
        values:
          !!this.filtro.tipoLeituraCochoId ||
          !!this.filtro.piqueteId ||
          !!this.filtro.dataAbertura,
      };
    },
  },

  watch: {
    modelPiqueteSelecionado(value) {
      if (![null, undefined].includes(this.modelPiqueteSelecionado)) {
        // Deve listar as coletas de cocho e o historico de consumo do piquete selecionado
        this.listarUltimasLeituras();
        this.listarHistoricoConsumoCocho();
        this.listarHistoricoOcorrencias();
        this.listarColetaCocho();
        setTimeout(() => {
          this.atualizarChart();
          // this.exibirGrafico = true;
        }, 500);
      } else {
        this.exibirGrafico = false;
        this.$store.commit(
          "paginaConfinamentoLeituraCocho/historicoConsumo",
          []
        );
        this.$store.commit("paginaConfinamentoLeituraCocho/coletaCocho", []);
      }
    },
  },

  async created() {
    this.filtro.dataLeitura = day().format("YYYY-MM-DD");
    this.listarRegistros();
    this.dropdownLotesAtivosListar();
    this.dropdownTipoLeituraCochoListar();
    // this.dropdownTipoLeitura();
    // this.dropdownPiquete();
    // this.dropdownLinhas();
    // this.listarDia();
    // setTimeout(() => {
    //   this.atualizarData();
    // }, 200);
  },

  methods: {
    ...mapActions("paginaConfinamentoLeituraCocho", [
      "dropdownLotesAtivosListar",
      "dropdownTipoLeituraCochoListar",
      "listar",
      "salvar",
      "excluir",

      "ultimasLeiturasListar",
      "historicoConsumoListar",
      "historicoOcorrenciasListar",
      "coletaCochoListar",
    ]),
    async listarRegistros() {
      this.loading = true;

      // this.modelPiqueteSelecionado = null;
      this.modelValorSelecionado = null;

      await this.listar({
        tipoLeituraCochoId: this.filtro.tipoLeituraCochoId || undefined,
        piqueteId: this.filtro.piqueteId || undefined,
        dataLeitura: this.filtro.dataLeitura || undefined,
      });

      // await this.listarDia();
      this.loading = false;
    },
    resetFormulario() {
      this.modal = false;
      this.modelPiqueteSelecionado = null;
      this.modelValorSelecionado = null;
      this.listarRegistros();
    },

    async listarHistoricoConsumoCocho() {
      this.loading = true;
      await this.historicoConsumoListar(
        this.dropdownLotesAtivos[this.modelPiqueteSelecionado].loteId ||
          undefined
      );
      this.loading = false;
    },
    async listarUltimasLeituras() {
      this.loading = true;
      await this.ultimasLeiturasListar(
        this.dropdownLotesAtivos[this.modelPiqueteSelecionado].piqueteId ||
          undefined
      );
      this.loading = false;
    },
    async listarHistoricoOcorrencias() {
      this.loading = true;
      await this.historicoOcorrenciasListar({
        loteId:
          this.dropdownLotesAtivos[this.modelPiqueteSelecionado].loteId ||
          undefined,
      });
      this.loading = false;
    },
    async listarColetaCocho() {
      this.loading = true;
      await this.coletaCochoListar(
        this.dropdownLotesAtivos[this.modelPiqueteSelecionado].piqueteId ||
          undefined
      );
      this.loading = false;
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        if (!this.dropdownLotesAtivos[this.modelPiqueteSelecionado]) {
          this.modelPiqueteSelecionado = null;
          return;
        }
        this.loading = true;

        const piquete =
          this.dropdownLotesAtivos[this.modelPiqueteSelecionado].piqueteId;
        const tipoLeituraCochoId =
          this.dropdownTipoLeituraCocho[this.modelValorSelecionado].id;

        const res = await this.salvar({
          piqueteId: piquete || undefined,
          tipoLeituraCochoId: tipoLeituraCochoId || undefined,
          dataLeitura: this.filtro.dataLeitura || undefined,
        });

        if (res && !res.erro) {
          this.modelPiqueteSelecionado =
            Number(this.modelPiqueteSelecionado) + 1;
          this.modelValorSelecionado = null;
          this.listarRegistros();
        } else if (typeof res.erro === "object") {
          this.$refs.observer.setErrors(res.erro);
          this.$setError({}, res.erro);
        }

        this.loading = false;
      }
    },
    async excluirRegistro() {
      this.loading = true;

      const res = await this.excluir(this.leituraCochoId);

      if (res && !res.erro) {
        this.modelPiqueteSelecionado = null;
        this.modelValorSelecionado = null;
        this.listarRegistros();
      }

      this.loading = false;
    },

    async atualizarChart() {
      let qtdMsAnimalBase = {};
      let qtdMsAnimalRealizadaO = {};
      let ipv = {};
      for (let i = 0; i < this.historicoConsumo.length; i++) {
        qtdMsAnimalRealizadaO = {
          ...qtdMsAnimalRealizadaO,
          [`${this.historicoConsumo[i].movimento} - ${this.historicoConsumo[i].loteDescricao}`]:
            moeda.strip(this.historicoConsumo[i].qtdMsAnimalRealizada),
        };
        qtdMsAnimalBase = {
          ...qtdMsAnimalBase,
          [`${this.historicoConsumo[i].movimento} - ${this.historicoConsumo[i].loteDescricao}`]:
            moeda.strip(this.historicoConsumo[i].qtdMsAnimalBase),
        };
        ipv = {
          ...ipv,
          [`${this.historicoConsumo[i].movimento} - ${this.historicoConsumo[i].loteDescricao}`]:
            moeda.strip(this.historicoConsumo[i].ingestaoMassaSeca),
        };
      }

      this.dataChartIPV = [
        {
          name: "Ingestão Peso Vivo (%)",
          data: { ...ipv },
        },
      ];
      this.dataChartMS = [
        {
          name: "Qtd. MS Animal Previsto (Kg)",
          data: { ...qtdMsAnimalBase },
        },
        {
          name: "Qtd. MS Animal Ajustado (Kg)",
          data: { ...qtdMsAnimalRealizadaO },
        },
      ];
    },
  },
};
</script>
