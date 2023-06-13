<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Coleta Leitura de Cocho"
    titulo-toolbar="Nova Coleta de Leitura de Cocho"
    titulo="Coleta Leitura de Cocho"
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
              <v-col cols="12" xl="3" lg="4" md="12" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Data da Leitura"
                  rules="required"
                  vid="data"
                >
                  <date-picker
                    v-model="filtro.data"
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
              <!-- TODO: Tipo da Coleta -->
              <v-col cols="12" xl="2" lg="4" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Tipo da Coleta"
                  vid="modelTipoColetaSelecionada"
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
                      v-model="modelTipoColetaSelecionada"
                      active-class="blue"
                    >
                      <v-card dense flat>
                        <v-card-title
                          class="pb-0 pt-2 body-1 grey--text font-weight-bold"
                        >
                          Tipo da Coleta
                        </v-card-title>
                      </v-card>
                      <v-row dense class="mx-3">
                        <v-col v-for="(item, idx) in opcoes[16]" :key="idx">
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
                              height="40"
                              min-width="100"
                              class="d-flex align-center py-8 my-1"
                              style="border-radius: 15px !important"
                              @click="toggle()"
                            >
                              <v-scroll-y-transition>
                                <div
                                  class="flex-grow-1 text-center font-weight-bold mx-2 title"
                                >
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

              <!-- TODO: Piquete Selecionado -->
              <v-col cols="12" xl="5" lg="8" md="6" xs="12">
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
              <v-col cols="12" xl="5" lg="12" md="12" xs="12">
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
                          Valor Coleta
                        </v-card-title>
                      </v-card>
                      <v-row
                        v-if="opcoes[16][modelTipoColetaSelecionada].item === 1"
                        dense
                        class="px-4"
                      >
                        <v-col
                          v-for="(item, idx) in dropdownValorSimNao"
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
                                  {{ item.descricao }}
                                </div>
                              </v-scroll-y-transition>
                            </v-card>
                          </v-item>
                        </v-col>
                      </v-row>
                      <v-row
                        v-if="opcoes[16][modelTipoColetaSelecionada].item === 2"
                        dense
                        class="px-4"
                      >
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
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <date-picker
                  v-model="filtro.data"
                  hide-details
                  controlar-dia
                  dense
                  label="Data"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <v-text-field
                  v-model="filtro.piqueteDescricao"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Piquete Descrição"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <select-all
                  v-model="filtro.tipoColeta"
                  :items="opcoes[16]"
                  clearable
                  dense
                  hide-details
                  item-value="item"
                  item-text="descricao"
                  label="Tipo Coleta"
                  outlined
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro-mobile>

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
              <v-col cols="12" xl="3" lg="3" md="6" xs="12">
                <date-picker
                  v-model="filtro.data"
                  hide-details
                  controlar-dia
                  dense
                  label="Data"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="6" xs="12">
                <v-text-field
                  v-model="filtro.piqueteDescricao"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Piquete Descrição"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="6" xs="12">
                <select-all
                  v-model="filtro.tipoColeta"
                  :items="opcoes[16]"
                  clearable
                  dense
                  hide-details
                  item-value="item"
                  item-text="descricao"
                  label="Tipo Coleta"
                  outlined
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro>

      <tabela
        ref="paginacaoFake"
        :colunas="colunas"
        :registros="registros"
        :paginacao="paginacaoFake"
        :registros-por-pagina="20"
        class="mt-2"
        excluir
        height-auto
        toolbar-grid
        titulo="Listagem Das Coletas de Leitura de Cocho"
        @paginacao="paginacaoFake = $event"
        @excluir="
          (leituraCochoId = $event),
            (aviso = {
              modal: true,
              key: 'excluir',
              text: 'Deseja realmente excluir essa leitura de cocho?',
            })
        "
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaginaColetaLeituraCocho",

  data: () => ({
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
        width: 50,
      },
      {
        text: "Data",
        align: "start",
        sortable: true,
        value: "data",
        width: 50,
      },
      {
        text: "Tipo da Coleta",
        align: "start",
        sortable: true,
        value: "tipoColetaDescricao",
        width: 50,
      },
      {
        text: "Valor Coletado",
        align: "start",
        sortable: true,
        value: "valorColeta",
      },
    ],
    controle: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    filtro: {
      piqueteDescricao: null,
      tipoColeta: null,
      data: null,
    },
    loading: false,
    modal: false,
    paginacaoFake: {
      pagina: 1,
      registros: 100,
      totalRegistros: 0,
    },

    leituraCochoId: null,

    modelPiqueteSelecionado: null,
    modelTipoColetaSelecionada: 0,
    modelValorSelecionado: null,
    dropdownValorSimNao: [
      {
        valor: 0,
        descricao: "NÃO",
      },
      {
        valor: 1,
        descricao: "SIM",
      },
    ],
  }),

  computed: {
    ...mapState("app", ["opcoes"]),
    ...mapState("paginaColetaLeituraCocho", [
      "registros",
      "dropdownLotesAtivos",
      "dropdownTipoLeituraCocho",
    ]),
    optionsFilter() {
      return {
        adicionar: true,
        values: !!(
          this.filtro.piqueteDescricao ||
          this.filtro.tipoColeta ||
          this.filtro.data
        ),
      };
    },
  },

  watch: {
    modelTipoColetaSelecionada(value) {
      this.modelPiqueteSelecionado = null;
      this.modelValorSelecionado = null;
    },
  },

  async created() {
    this.filtro.data = this.$day().format("YYYY-MM-DD");

    // this.modelTipoColetaSelecionada = this.$day()
    //   .format("HH:mm")
    //   .isBetween("18:00", "04:00", "hour")
    //   ? 0
    //   : 1;
    this.modelTipoColetaSelecionada = 0;

    await this.obterOpcoes(16); // Tipo da coleta de leitura de cocho
    this.listarRegistros();
    this.dropdownLotesAtivosListar();
    this.dropdownTipoLeituraCochoListar();
  },

  methods: {
    ...mapActions("app", ["obterOpcoes"]),
    ...mapActions("paginaColetaLeituraCocho", [
      "listar",
      "salvar",
      "excluir",

      "dropdownLotesAtivosListar",
      "dropdownTipoLeituraCochoListar",
    ]),
    async excluirRegistro() {
      this.loading = true;

      const res = await this.excluir(this.leituraCochoId);

      if (res && !res.erro) this.resetFormulario();

      this.loading = false;
    },
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        piqueteDescricao: this.filtro.piqueteDescricao || undefined,
        tipoColeta: this.filtro.tipoColeta || undefined,
        data: this.filtro.data || undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        piqueteDescricao: null,
        tipoColeta: null,
        data: null,
      };
    },
    resetFormulario() {
      this.controle = {
        inserir: false,
        exibir: false,
        editar: false,
      };

      this.leituraCochoId = null;

      this.modelPiqueteSelecionado = null;
      this.modelTipoColetaSelecionada = 0;
      this.modelValorSelecionado = null;

      this.modal = false;
      this.listarRegistros();
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        if (!this.dropdownLotesAtivos[this.modelPiqueteSelecionado]) {
          this.modelPiqueteSelecionado = null;
          return;
        }
        this.loading = true;

        const tipoColeta =
          this.opcoes[16][this.modelTipoColetaSelecionada].item;
        const piquete =
          this.dropdownLotesAtivos[this.modelPiqueteSelecionado].piqueteId;
        const valorColetado =
          this.opcoes[16][this.modelTipoColetaSelecionada].item === 1
            ? this.dropdownValorSimNao[this.modelValorSelecionado].descricao
            : `${
                this.dropdownTipoLeituraCocho[this.modelValorSelecionado].nota
              } - ${
                this.dropdownTipoLeituraCocho[this.modelValorSelecionado]
                  .descricao
              }`;

        const res = await this.salvar({
          tipoColeta,
          piqueteId: piquete,
          valorColeta: valorColetado,
          data: this.filtro.data || undefined,
        });

        if (res && !res.erro) {
          this.modelPiqueteSelecionado =
            Number(this.modelPiqueteSelecionado) + 1 || null;
          this.modelValorSelecionado = null;
        } else if (typeof res.erro === "object") {
          this.$refs.observer.setErrors(res.erro);
          this.$setError({}, res.erro);
        }

        this.loading = false;
      }
    },
  },
};
</script>
