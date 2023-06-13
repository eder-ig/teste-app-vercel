<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Cadastro de Plano de Transição de Dieta"
    titulo-toolbar="Informações do Plano de Transição"
    titulo="Cadastro de Plano de Transição de Dieta"
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
      @excluirRelacionamento="
        (aviso = { modal: false, key: null, text: '' }), excluirRelacionamento()
      "
    />
    <modal
      v-model="modalRelacionamento"
      :options="optionsModal"
      @input="(modalRelacionamento = false), resetModalRelacionamento()"
      @salvar="salvarRelacionamento()"
      @editar="(controleModal.exibir = false), (controleModal.editar = true)"
    >
      <template slot="maisOpcoes">
        <v-list class="pa-0" dense>
          <v-list-item
            @click="
              aviso = {
                modal: true,
                key: 'excluirRelacionamento',
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
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observerRelacionamento">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <v-text-field
                  v-model="formularioRelacionamento.id"
                  disabled
                  hide-details
                  dense
                  label="Configuração"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Dia"
                  rules="required"
                  vid="dia"
                >
                  <v-text-field
                    v-model="formularioRelacionamento.dia"
                    v-mask="'##'"
                    :disabled="controleModal.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Dia"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Agenda Trato"
                  rules="required"
                  vid="agendaTratoId"
                >
                  <v-select
                    v-model="formularioRelacionamento.agendaTratoId"
                    :items="agendaTratoDropdown"
                    :disabled="controleModal.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="hora"
                    label="Agenda de Trato"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Dieta"
                  rules="required"
                  vid="dietaId"
                >
                  <v-select
                    v-model="formularioRelacionamento.dietaId"
                    :items="dietaDropdown"
                    :disabled="controleModal.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Dieta"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </modal>

    <template slot="formulario">
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observer">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <validation-provider v-slot="{ errors }" name="Plano" vid="id">
                  <v-text-field
                    v-model="formulario.id"
                    disabled
                    :error-messages="errors"
                    hide-details
                    dense
                    label="Plano"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Descrição"
                  vid="descricao"
                  rules="required"
                >
                  <v-text-field
                    v-model="formulario.descricao"
                    v-mask="mascara('T', 250)"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Descrição"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantidade Dias"
                  vid="quantidadeDias"
                  rules="required"
                >
                  <v-text-field
                    v-model="formulario.quantidadeDias"
                    v-mask="mascara('T', 250)"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Quantidade Dias"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Dieta Inicial"
                  vid="dietaIdInicial"
                  rules="required"
                >
                  <v-select
                    v-model="formulario.dietaIdInicial"
                    :items="dietaDropdown"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Dieta Inicial"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Dieta Final"
                  vid="dietaIdFinal"
                  rules="required"
                >
                  <v-select
                    v-model="formulario.dietaIdFinal"
                    :items="dietaDropdown"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Dieta Final"
                    outlined
                  />
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

    <template v-if="formulario.id" slot="relacionamento">
      <tabela
        ref="paginacaoFake"
        :colunas="colunasRelacionamento"
        :registros="registrosRelacionamento"
        :paginacao="paginacaoFake"
        :registros-por-pagina="100"
        exibir
        height-auto
        toolbar-grid
        titulo="Configuração do Plano de Transição"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRelacionamento($event)"
        @dblclick="exibirRelacionamento($event.id)"
      >
        <template slot="botoes">
          <v-btn
            color="primary"
            title="Adicionar"
            @click="
              (controleModal.inserir = true), (modalRelacionamento = true)
            "
          >
            <v-icon left> mdi-plus-thick </v-icon>
            Nova Configuração
          </v-btn>
        </template>
      </tabela>
    </template>

    <template slot="listagem">
      <filtro
        :options="optionsFilter"
        @adicionar="(modal = true), (controle.inserir = true)"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <v-text-field
                  v-model="filtro.descricao"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Descrição"
                  outlined
                  @keypress.enter="listarRegistros()"
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
        :registros-por-pagina="100"
        class="mt-2"
        exibir
        height-auto
        toolbar-grid
        titulo="Listagem Dos Planos de Transição"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaginaCadastroPlanoTransiçãoDieta",

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
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 50,
      },
      {
        text: "Quantidade Dias Duração",
        align: "center",
        sortable: true,
        value: "quantidadeDias",
        width: 50,
      },
      {
        text: "Dieta Inicial",
        align: "start",
        sortable: true,
        value: "dietaInicial",
        width: 50,
      },
      {
        text: "Dieta Final",
        align: "start",
        sortable: true,
        value: "dietaFinal",
        width: 50,
      },
      {},
    ],
    colunasRelacionamento: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Dia",
        align: "center",
        sortable: true,
        value: "dia",
        width: 50,
      },
      {
        text: "Agenda de Trato",
        align: "center",
        sortable: true,
        value: "agendaTratoHora",
        width: 50,
      },
      {
        text: "Dieta",
        align: "start",
        sortable: true,
        value: "dietaDescricao",
        width: 50,
      },
      {},
    ],
    controle: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    controleModal: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    filtro: {
      descricao: null,
    },
    formulario: {
      id: null,
      descricao: null,
      dietaFinal: null,
      dietaIdFinal: null,
      dietaIdInicial: null,
      dietaInicial: null,
      quantidadeDias: null,
    },
    formularioRelacionamento: {
      id: null,
      dia: null,
      agendaTratoId: null,
      dietaId: null,
    },
    loading: false,
    modal: false,
    modalRelacionamento: false,
    paginacaoFake: {
      pagina: 1,
      registros: 20,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("paginaPlanoTransicaoDieta", [
      "dietaDropdown",
      "agendaTratoDropdown",
      "registros",
      "registrosRelacionamento",
    ]),
    filtroValor() {
      return !!this.filtro.id;
    },
    optionsFilter() {
      return {
        adicionar: true,
        values: this.filtroValor,
      };
    },
    optionsModal() {
      return {
        title: this.controleModal.inserir
          ? "Adicionar Configuração de Transição"
          : "Informações de Configuração",
        width: 900,
        maisOpcoes: this.controleModal.editar,
        actions: [
          {
            title:
              this.controleModal.exibir && !this.controleModal.inserir
                ? "Editar"
                : "Salvar",
            color: this.$vuetify.theme.dark ? "accent" : "primary",
            icon:
              this.controleModal.exibir && !this.controleModal.inserir
                ? "mdi-pencil"
                : "mdi-content-save",
            emit:
              this.controleModal.exibir && !this.controleModal.inserir
                ? "editar"
                : "salvar",
            outlined: false,
          },
          {
            title: "Cancelar",
            color: "error",
            icon: "mdi-cancel",
            emit: "input",
            outlined: false,
          },
        ],
      };
    },
  },

  async created() {
    await this.dietaDropdownListar();
    await this.agendaTratoDropdownListar();
    await this.listarRegistros();
  },

  methods: {
    ...mapActions("paginaPlanoTransicaoDieta", [
      "dietaDropdownListar",
      "agendaTratoDropdownListar",

      "listar",
      "exibir",
      "editar",
      "salvar",
      "excluir",

      "relacionamentoListar",
      "relacionamentoExibir",
      "relacionamentoExcluir",
      "relacionamentoEditar",
      "relacionamentoSalvar",
    ]),
    async exibirRegistro(id) {
      this.loading = true;

      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          descricao: res.descricao || null,
          dietaFinal: res.dietaFinal || null,
          dietaIdFinal: res.dietaIdFinal || null,
          dietaIdInicial: res.dietaIdInicial || null,
          dietaInicial: res.dietaInicial || null,
          quantidadeDias: res.quantidadeDias || null,
        };

        this.listarRelacionamento();
      }

      this.modal = true;
      this.controle.exibir = true;
      this.loading = false;
    },
    async excluirRegistro() {
      this.loading = true;

      const res = await this.excluir(this.formulario.id);

      if (res && !res.erro) this.resetFormulario();

      this.loading = false;
    },
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        descricao: this.filtro.descricao || undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        //
      };
    },
    resetFormulario() {
      this.controle = {
        inserir: false,
        exibir: false,
        editar: false,
      };
      this.formulario = {
        id: null,
        descricao: null,
        dietaFinal: null,
        dietaIdFinal: null,
        dietaIdInicial: null,
        dietaInicial: null,
        quantidadeDias: null,
      };

      this.modal = false;
      this.listarRegistros();

      this.$store.commit(
        "paginaPlanoTransicaoDieta/registrosRelacionamento",
        []
      );
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          descricao: this.formulario.descricao || undefined,
          dietaFinal: this.formulario.dietaFinal || undefined,
          dietaIdFinal: this.formulario.dietaIdFinal || undefined,
          dietaIdInicial: this.formulario.dietaIdInicial || undefined,
          dietaInicial: this.formulario.dietaInicial || undefined,
          quantidadeDias: this.formulario.quantidadeDias || undefined,
        };
        let res;

        if (form.id) res = await this.editar(form);
        else if (!form.id) res = await this.salvar(form);

        if (res) {
          if (!res.erro) {
            if (res.id) this.exibirRegistro(res.id);
            else this.resetFormulario();
          } else if (typeof res.erro === "object") {
            this.$refs.observer.setErrors(res.erro);
            this.$setError({}, res.erro);
          }
        }

        this.loading = false;
      }
    },

    async listarRelacionamento() {
      this.loading = true;
      await this.relacionamentoListar({
        planoTransicaoId: this.formulario.id,
      });
      this.loading = false;
    },
    async exibirRelacionamento(planoTransicaoConfiguracaoId) {
      this.loading = true;

      const res = await this.relacionamentoExibir(planoTransicaoConfiguracaoId);
      if (res && !res.erro) {
        this.formularioRelacionamento = {
          id: res.id || null,
          dia: res.dia || null,
          agendaTratoId: res.agendaTratoId || null,
          dietaId: res.dietaId || null,
        };

        this.modalRelacionamento = true;
        this.controleModal.exibir = true;
      }

      this.loading = false;
    },
    async excluirRelacionamento() {
      this.loading = true;

      const res = await this.relacionamentoExcluir(
        this.formularioRelacionamento.id
      );
      if (res && !res.erro) {
        this.resetModalRelacionamento();
        this.listarRelacionamento();
      }

      this.loading = false;
    },
    async salvarRelacionamento() {
      if (await this.$refs.observerRelacionamento.validate()) {
        this.loading = true;

        const form = {
          planoTransicaoId: this.formulario.id,

          id: this.formularioRelacionamento.id || null,
          dia: this.formularioRelacionamento.dia || null,
          agendaTratoId: this.formularioRelacionamento.agendaTratoId || null,
          dietaId: this.formularioRelacionamento.dietaId || null,
        };
        let res;

        if (form.id) res = await this.relacionamentoEditar(form);
        else if (!form.id) res = await this.relacionamentoSalvar(form);

        if (res) {
          if (!res.erro) {
            this.resetModalRelacionamento();
            this.listarRelacionamento();
          } else if (typeof res.erro === "object") {
            this.$refs.observerRelacionamento.setErrors(res.erro);
            this.$setError({}, res.erro);
          }
        }

        this.loading = false;
      }
    },
    resetModalRelacionamento() {
      if (this.$refs.observerRelacionamento) {
        this.$refs.observerRelacionamento.reset();
      }
      this.modalRelacionamento = false;
      this.formularioRelacionamento = {
        id: null,
        dia: null,
        agendaTratoId: null,
        dietaId: null,
      };
      this.controleModal = {
        inserir: false,
        exibir: false,
        editar: false,
      };
    },
  },
};
</script>
