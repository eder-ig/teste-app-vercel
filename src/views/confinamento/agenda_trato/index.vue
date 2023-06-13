<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    subtitulo="Listagem e manutenção da agenda de trato"
    titulo-toolbar="Cadastro de Agenda de Trato"
    titulo="Agenda Trato"
    fechar
    @cancelar="resetFormulario()"
    @fechar="resetFormulario()"
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

    <!-- TODO: Modal Adicionar Alimento -->
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
              <v-col cols="12">
                <v-text-field
                  v-model="formularioRelacionamento.id"
                  disabled
                  hide-details
                  dense
                  label="Código"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formularioRelacionamento.sequencia"
                  disabled
                  hide-details
                  dense
                  label="Sequência"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Hora"
                  rules="required"
                  vid="hora"
                >
                  <v-text-field
                    v-model="formularioRelacionamento.hora"
                    v-mask="'##:##'"
                    :disabled="controleModal.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    clearable
                    dense
                    label="Hora"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Percentual Distribuição"
                  rules="required"
                  vid="percentualDistribuicao"
                >
                  <v-text-field
                    v-model="formularioRelacionamento.percentualDistribuicao"
                    v-moeda="{ negativo: false, decimal: 2 }"
                    :disabled="controleModal.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    clearable
                    dense
                    label="Percentual Distribuição (%)"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Permitir Correção"
                  rules="required"
                  vid="correcao"
                >
                  <v-select
                    v-model="formularioRelacionamento.correcao"
                    :items="[
                      {
                        valor: 0,
                        descricao: 'NÃO',
                      },
                      {
                        valor: 1,
                        descricao: 'SIM',
                      },
                    ]"
                    :disabled="controleModal.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="valor"
                    item-text="descricao"
                    label="Permitir Correção"
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
              <v-col cols="12" xl="1" lg="1" md="2" xs="12">
                <v-text-field
                  v-model="formulario.id"
                  disabled
                  hide-details
                  dense
                  label="Confinamento"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="6" lg="6" md="5" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Nome Confinamento"
                  rules="required"
                  vid="descricao"
                >
                  <v-text-field
                    v-model="formulario.descricao"
                    v-mask="mascara('T', 250)"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Nome Confinamento"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="5" lg="5" md="5" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Propriedade"
                  rules="required"
                  vid="propriedadeId"
                >
                  <v-autocomplete
                    v-model="formulario.propriedadeId"
                    :items="propriedadeDropdown"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Propriedade"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </template>

    <template v-if="formulario.id" slot="relacionamento">
      <tabela
        ref="paginacaoFake"
        :colunas="colunasRelacionamento"
        :registros="registrosRelacionamento"
        :paginacao="paginacaoFake"
        :registros-por-pagina="100"
        :sort-by-cli="'sequencia'"
        class="mt-2"
        exibir
        height-auto
        sortable
        toolbar-grid
        toolbar-hight="45"
        titulo="Agenda de Trato"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRelacionamento($event)"
        @sorted="editarSequencia($event)"
      >
        <template slot="botoes">
          <v-btn
            color="primary"
            class="mx-2"
            title="Adicionar"
            @click="
              (controleModal = {
                inserir: true,
                exibir: false,
                editar: false,
              }),
                (modalRelacionamento = true),
                alimentoDropdownListar()
            "
          >
            <v-icon left> mdi-plus-thick </v-icon>
            Adicionar
          </v-btn>
          <v-btn
            color="primary"
            outlined
            title="Atualizar"
            @click="listarRelacionamento()"
          >
            <v-icon left> mdi-reload </v-icon>
            Atualizar
          </v-btn>
        </template>
      </tabela>
    </template>

    <template slot="listagem">
      <filtro
        :options="optionsFilter"
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
                  label="Descricao"
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
        titulo="Listagem dos Confinamento para Agenda de Trato"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import moeda from "@tiig/moeda";

export default {
  name: "PaginaConfinamentoAgendaTrato",

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
        width: 50,
      },
      {
        text: "Nome Confinamento",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 250,
      },
      {
        text: "Propriedade",
        align: "start",
        sortable: true,
        value: "propriedadeDescricao",
      },
    ],
    colunasRelacionamento: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 50,
      },
      {
        text: "Sequência",
        align: "center",
        sortable: true,
        value: "sequencia",
        width: 50,
      },
      {
        text: "Hora",
        align: "center",
        sortable: true,
        value: "hora",
        width: 50,
      },
      {
        text: "Percentual Distribuição (%)",
        align: "end",
        sortable: true,
        value: "percentualDistribuicao",
        width: 50,
      },
      {
        text: "Permitir Correção",
        align: "center",
        sortable: true,
        value: "correcao",
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
      propriedadeId: null,
    },
    formularioRelacionamento: {
      id: null,
      sequencia: null,
      confinamentoId: null,
      hora: null,
      percentualDistribuicao: null,
      correcao: null,
    },
    modal: false,
    modalRelacionamento: false,
    loading: false,
    paginacaoFake: {
      pagina: 1,
      registros: 20,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("paginaConfinamentoAgendamentoTrato", [
      "registros",
      "propriedadeDropdown",
      "registrosRelacionamento",
    ]),
    optionsFilter() {
      return {
        values: !!this.filtro.descricao,
      };
    },
    optionsModal() {
      return {
        title: this.controleModal.inserir
          ? "Adicionar Informação"
          : "Informações",
        width: 700,
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
    this.listarRegistros();
    await this.propriedadeDropdownListar();
  },

  methods: {
    ...mapActions("paginaConfinamentoAgendamentoTrato", [
      "listar",
      "exibir",
      "propriedadeDropdownListar",

      "relacionamentoListar",
      "relacionamentoExibir",
      "relacionamentoSalvar",
      "relacionamentoEditar",
      "relacionamentoExcluir",

      "sequenciaEditar",
    ]),
    ...mapMutations("paginaConfinamentoAgendamentoTrato", ["updateRegistros"]),
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        descricao: this.filtro.descricao || undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        descricao: null,
      };
    },
    async exibirRegistro(id) {
      this.loading = true;

      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          descricao: res.descricao || null,
          propriedadeId: res.propriedadeId || null,
        };

        this.listarRelacionamento();
      }

      this.modal = true;
      this.controle.exibir = true;
      this.loading = false;
    },
    resetFormulario() {
      this.modal = false;
      this.formulario = {
        id: null,
        descricao: null,
        tipoDietaId: null,
        ganhoMedioDia: null,
        quantidadeDiasUso: null,
      };
      this.controle = {
        inserir: false,
        exibir: false,
        editar: false,
      };
      this.listarRegistros();
    },

    async listarRelacionamento() {
      this.loading = true;
      await this.relacionamentoListar(this.formulario.id);
      this.loading = false;
    },
    async exibirRelacionamento(id) {
      this.loading = true;
      const res = await this.relacionamentoExibir(id);
      if (res && !res.erro) {
        this.formularioRelacionamento = {
          id: res.id || null,
          sequencia: res.sequencia || null,
          confinamentoId: res.confinamentoId || null,
          hora: res.hora || null,
          percentualDistribuicao:
            moeda.format(Number(res.percentualDistribuicao), 2) || null,
          correcao: res.correcao || 0,
        };

        this.controleModal.exibir = true;
        this.modalRelacionamento = true;
      }
      this.loading = false;
    },
    async salvarRelacionamento() {
      if (await this.$refs.observerRelacionamento.validate()) {
        this.loading = true;
        const form = {
          confinamentoId: this.formulario.id || undefined,

          id: this.formularioRelacionamento.id || undefined,
          sequencia: this.formularioRelacionamento.sequencia || undefined,
          hora: String(this.formularioRelacionamento.hora) || undefined,
          percentualDistribuicao:
            moeda.strip(this.formularioRelacionamento.percentualDistribuicao) ||
            undefined,
          correcao: this.formularioRelacionamento.correcao || 0,
        };
        let res;

        if (form.id) res = await this.relacionamentoEditar(form);
        else if (!form.id) res = await this.relacionamentoSalvar(form);

        if (res) {
          if (!res.erro) {
            this.resetModalRelacionamento();
          } else if (typeof res.erro === "object") {
            this.$refs.observerRelacionamento.setErrors(res.erro);
            this.$setError({}, res.erro);
          }
        }

        this.loading = false;
      }
    },
    async excluirRelacionamento() {
      this.loading = true;
      const res = await this.relacionamentoExcluir(
        this.formularioRelacionamento.id
      );
      if (res && !res.erro) this.resetModalRelacionamento();
      this.loading = false;
    },
    resetModalRelacionamento() {
      this.modalRelacionamento = false;
      this.formularioRelacionamento = {
        id: null,
        sequencia: null,
        confinamentoId: null,
        hora: null,
        percentualDistribuicao: null,
        correcao: null,
      };
      this.controleModal = {
        inserir: false,
        exibir: false,
        editar: false,
      };

      this.listarRelacionamento();
    },

    async editarSequencia({ oldIndex, newIndex }) {
      this.loading = true;

      const res = await this.sequenciaEditar({
        oldIndex: {
          id: this.registrosRelacionamento[oldIndex].id,
          sequencia: this.registrosRelacionamento[oldIndex].sequencia,
        },
        newIndex: {
          id: this.registrosRelacionamento[newIndex].id,
          sequencia: this.registrosRelacionamento[newIndex].sequencia,
        },
      });

      this.updateRegistros({ oldIndex, newIndex });
      if (res && !res.erro) {
        this.listarRelacionamento();
      }

      this.loading = false;
    },
  },
};
</script>
