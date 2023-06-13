<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Listagem das dietas"
    titulo-toolbar="Cadastro de Dieta"
    titulo="Dieta"
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
                <validation-provider
                  v-slot="{ errors }"
                  name="Alimento"
                  rules="required"
                  vid="alimentoId"
                >
                  <v-autocomplete
                    v-model="formularioRelacionamento.alimentoId"
                    :items="alimentoDropdown"
                    :disabled="controleModal.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    clearable
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Alimento"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Composição (%)"
                  rules="required"
                  vid="quantidade"
                >
                  <v-text-field
                    v-model="formularioRelacionamento.quantidade"
                    v-moeda="{ decimal: 2, negativo: false }"
                    :disabled="controleModal.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    clearable
                    dense
                    label="Composição (%)"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Tolerancia Preparo %"
                  rules="required"
                  vid="toleranciaPreparo"
                >
                  <v-text-field
                    v-model="formularioRelacionamento.toleranciaPreparo"
                    v-mask="mascara('T', 250)"
                    :disabled="controleModal.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Tolerância Preparo %"
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
              <v-col cols="12" xl="1" lg="1" md="2" xs="4">
                <v-text-field
                  v-model="formulario.id"
                  disabled
                  hide-details
                  dense
                  label="Dieta"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="6" xs="8">
                <validation-provider
                  v-slot="{ errors }"
                  name="Descrição"
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
                    label="Descricao"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="4" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Tipo Dieta"
                  rules="required"
                  vid="tipoDietaId"
                >
                  <v-select
                    v-model="formulario.tipoDietaId"
                    :items="tipoDietaDropdown"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Tipo Dieta"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="4" xs="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="GPD (Kg)"
                  rules="required"
                  vid="ganhoMedioDia"
                >
                  <v-text-field
                    v-model="formulario.ganhoMedioDia"
                    v-moeda="{ decimal: 2, negativo: false }"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="GPD (Kg)"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="4" xs="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="Ingestão MS %/Peso Vivo"
                  rules="required"
                  vid="ingestaoMassaSeca"
                >
                  <v-text-field
                    v-model="formulario.ingestaoMassaSeca"
                    v-moeda="{ decimal: 2, negativo: false }"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Ingestão MS %/Peso Vivo"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="4" xs="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantidade Dias Uso"
                  rules="required"
                  vid="quantidadeDiasUso"
                >
                  <v-text-field
                    v-model="formulario.quantidadeDiasUso"
                    v-mask="'###########'"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Quantidade Dias Uso"
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
        class="mt-2"
        exibir
        height-auto
        toolbar-grid
        toolbar-hight="45"
        titulo="Alimentos da Dieta"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRelacionamento($event)"
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
        titulo="Listagem das Dietas"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moeda from "@tiig/moeda";

export default {
  name: "PaginaConfinamentoDieta",

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
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 50,
      },
      {
        text: "Tipo Dieta",
        align: "start",
        sortable: true,
        value: "tipoDietaDescricao",
        width: 50,
      },
      {
        text: "GPD (Kg)",
        align: "center",
        sortable: true,
        value: "ganhoMedioDia",
        width: 50,
      },
      {
        text: "Ingestão MS %/Peso Vivo",
        align: "center",
        sortable: true,
        value: "ingestaoMassaSeca",
        width: 50,
      },
      {
        text: "QTD Dias Uso",
        align: "center",
        sortable: true,
        value: "quantidadeDiasUso",
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
        width: 50,
      },
      {
        text: "Descrição Alimento",
        align: "start",
        sortable: true,
        value: "alimentoDescricao",
        width: 50,
      },
      {
        text: "Composição (%)",
        align: "end",
        sortable: true,
        value: "quantidade",
        width: 50,
      },
      {
        text: "Tolerância Preparo %",
        align: "end",
        sortable: true,
        value: "toleranciaPreparo",
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
      tipoDietaId: null,
      ganhoMedioDia: null,
      ingestaoMassaSeca: null,
      quantidadeDiasUso: null,
    },
    formularioRelacionamento: {
      id: null,
      dietaId: null,
      alimentoId: null,
      quantidade: null,
      toleranciaPreparo: null,
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
    ...mapState("paginaConfinamentoDieta", [
      "registros",
      "tipoDietaDropdown",
      "alimentoDropdown",
      "registrosRelacionamento",
    ]),
    optionsFilter() {
      return {
        adicionar: true,
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
    await this.tipoDietaDropdownListar();
    await this.alimentoDropdownListar();
  },

  methods: {
    ...mapActions("paginaConfinamentoDieta", [
      "listar",
      "exibir",
      "salvar",
      "editar",
      "excluir",
      "tipoDietaDropdownListar",
      "alimentoDropdownListar",

      "relacionamentoListar",
      "relacionamentoExibir",
      "relacionamentoSalvar",
      "relacionamentoEditar",
      "relacionamentoExcluir",
    ]),
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
          tipoDietaId: res.tipoDietaId || null,
          ganhoMedioDia: Number(res.ganhoMedioDia) || null,
          ingestaoMassaSeca: Number(res.ingestaoMassaSeca) || null,
          quantidadeDiasUso: res.quantidadeDiasUso || null,
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
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          descricao: this.formulario.descricao || undefined,
          tipoDietaId: this.formulario.tipoDietaId || undefined,
          ganhoMedioDia:
            moeda.strip(this.formulario.ganhoMedioDia) || undefined,
          ingestaoMassaSeca:
            moeda.strip(this.formulario.ingestaoMassaSeca) || undefined,
          quantidadeDiasUso: this.formulario.quantidadeDiasUso || undefined,
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
    resetFormulario() {
      this.modal = false;
      this.formulario = {
        id: null,
        descricao: null,
        tipoDietaId: null,
        ganhoMedioDia: null,
        ingestaoMassaSeca: null,
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
          dietaId: res.dietaId || null,
          alimentoId: res.alimentoId || null,
          quantidade: moeda.format(Number(res.quantidade), 2) || null,
          toleranciaPreparo: res.toleranciaPreparo || null,
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
          dietaId: this.formulario.id || undefined,

          id: this.formularioRelacionamento.id || undefined,
          alimentoId: this.formularioRelacionamento.alimentoId || undefined,
          toleranciaPreparo:
            this.formularioRelacionamento.toleranciaPreparo || undefined,
          quantidade:
            moeda.strip(this.formularioRelacionamento.quantidade) || undefined,
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
        dietaId: null,
        alimentoId: null,
        quantidade: null,
        toleranciaPreparo: null,
      };
      this.controleModal = {
        inserir: false,
        exibir: false,
        editar: false,
      };

      this.listarRelacionamento();
    },
  },
};
</script>
