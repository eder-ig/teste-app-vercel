<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Pagina de cadastro e manutenção de propriedades"
    titulo-toolbar="Cadastro de Propriedade"
    titulo="Propriedade"
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
                  label="Propriedade"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Nome Propriedade"
                  rules="required"
                  vid="nomeFazenda"
                >
                  <v-text-field
                    v-model="formulario.nomeFazenda"
                    v-mask="mascara('T', 250)"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Nome Propriedade"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Marca"
                  rules="required"
                  vid="marca"
                >
                  <v-text-field
                    v-model="formulario.marca"
                    v-mask="mascara('T', 250)"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Marca"
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
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <v-text-field
                  v-model="filtro.nomeFazenda"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Nome"
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
        titulo="Listagem das Propriedades"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaginaCadastroPropriedades",

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
        text: "Nome",
        align: "start",
        sortable: true,
        value: "nomeFazenda",
        width: 250,
      },
      {
        text: "Marca",
        align: "start",
        sortable: true,
        value: "marca",
      },
    ],
    controle: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    filtro: {
      nomeFazenda: null,
      marca: null,
    },
    formulario: {
      id: null,
      nomeFazenda: null,
      marca: null,
    },
    loading: false,
    modal: false,
    paginacaoFake: {
      pagina: 1,
      registros: 20,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("paginaConfinamentoPropriedade", ["registros"]),
    optionsFilter() {
      return {
        adicionar: true,
        values: !!(this.filtro.nomeFazenda || this.filtro.marca),
      };
    },
  },

  async created() {
    this.listarRegistros();
  },

  methods: {
    ...mapActions("paginaConfinamentoPropriedade", [
      "listar",
      "exibir",
      "editar",
      "salvar",
      "excluir",
    ]),
    async exibirRegistro(id) {
      this.loading = true;

      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          nomeFazenda: res.nomeFazenda || null,
          marca: res.marca || null,
        };
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
        nomeFazenda: this.filtro.nomeFazenda || undefined,
        marca: this.filtro.marca || undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        nomeFazenda: null,
        marca: null,
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
        nomeFazenda: null,
        marca: null,
      };

      this.modal = false;
      this.listarRegistros();
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          nomeFazenda: this.formulario.nomeFazenda || undefined,
          marca: this.formulario.marca || undefined,
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
  },
};
</script>
