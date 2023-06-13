<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Listagem dos ruas"
    titulo-toolbar="Informações da Rua"
    titulo="Ruas"
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
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.id"
                  disabled
                  hide-details
                  dense
                  label="Rua"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.codigo"
                  v-mask="mascara('T', 250)"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Código"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Confinamento"
                  rules="required"
                  vid="cofninamento"
                >
                  <v-autocomplete
                    v-model="formulario.confinamentoId"
                    :items="confinamentos"
                    :error-messages="errors"
                    :disabled="controle.exibir"
                    item-text="descricao"
                    item-value="id"
                    class="required"
                    dense
                    hide-details
                    label="Confinamento"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.descricao"
                  v-mask="mascara('T', 250)"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Descrição"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.tag"
                  v-mask="mascara('T', 250)"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Tag"
                  outlined
                />
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
                <v-text-field
                  v-model="filtro.codigo"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Código"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4" xs="12">
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
              <v-col cols="12" xl="4" lg="4" md="4" xs="12">
                <v-text-field
                  v-model="filtro.tag"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Tag"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro-mobile>

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
                <v-text-field
                  v-model="filtro.codigo"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Código"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
            </v-row>
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
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <v-text-field
                  v-model="filtro.tag"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Tag"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro-mobile>

      <tabela
        ref="paginacaoFake"
        :colunas="colunas"
        :registros="registros"
        :paginacao="paginacaoFake"
        :registros-por-pagina="100"
        class="mt-2"
        height-auto
        exibir
        toolbar-grid
        titulo="Listagem das Ruas"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaginaConfinamentoRua",

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
        text: "Código",
        align: "center",
        sortable: true,
        value: "codigo",
        width: 50,
      },
      {
        text: "Confinamento",
        align: "start",
        sortable: true,
        value: "confinamento.descricao",
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
        text: "Tag",
        align: "start",
        sortable: true,
        value: "tag",
        width: 50,
      },
      {},
    ],
    modal: false,
    controle: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    filtro: {
      codigo: null,
      linhaId: null,
      tagInicio: null,
    },
    formulario: {
      id: null,
      confinamentoId: null,
      descricao: null,
      codigo: null,
      tag: null,
    },
    loading: false,
    paginacaoFake: {
      pagina: 1,
      registros: 20,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("paginaConfinamentoRua", ["registros", "confinamentos"]),
    optionsFilter() {
      return {
        adicionar: true,
        valueInMore: true,
        values:
          !!this.filtro.codigo || !!this.filtro.tag || !!this.filtro.descricao,
      };
    },
  },

  async created() {
    this.dropdownConfinamento();
    this.listarRegistros();
  },

  methods: {
    ...mapActions("paginaConfinamentoRua", [
      "listar",
      "editar",
      "salvar",
      "exibir",
      "excluir",
      "dropdownConfinamento",
    ]),
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        codigo: this.filtro.codigo || undefined,
        descricao: this.filtro.descricao || undefined,
        tag: this.filtro.tag || undefined,
      });

      this.loading = false;
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          confinamentoId: this.formulario.confinamentoId || undefined,
          codigo: this.formulario.codigo || undefined,
          descricao: this.formulario.descricao || undefined,
          tag: this.formulario.tag || undefined,
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
    async excluirRegistro() {
      this.loading = true;

      const res = await this.excluir(this.formulario.id);

      if (res && !res.erro) this.resetFormulario();

      this.loading = false;
    },
    async exibirRegistro(id) {
      this.loading = true;

      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          confinamentoId: res.confinamentoId || null,
          descricao: res.descricao || null,
          codigo: res.codigo || null,
          tag: res.tag || null,
        };
      }

      this.modal = true;
      this.controle.exibir = true;
      this.loading = false;
    },
    resetFormulario() {
      this.controle = {
        inserir: false,
        exibir: false,
        editar: false,
      };
      this.formulario = {
        id: null,
        confinamentoId: null,
        descricao: null,
        tag: null,
        codigo: null,
      };

      this.modal = false;
      this.listarRegistros();
    },
    limparFiltros() {
      this.filtro = {
        codigo: null,
        descricao: null,
        tag: null,
      };
    },
  },
};
</script>
