<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Listagem das categorias"
    titulo="Categorias"
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
                  label="Categoria"
                  outlined
                />
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
                <validation-provider
                  v-slot="{ errors }"
                  name="Sexo"
                  rules="required"
                  vid="sexo"
                >
                  <v-autocomplete
                    v-model="formulario.sexo"
                    :items="opcoes[11]"
                    :error-messages="errors"
                    :disabled="controle.exibir"
                    item-text="descricao"
                    item-value="item"
                    class="required"
                    dense
                    hide-details
                    label="Sexo"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Tipo"
                  rules="required"
                  vid="tipo"
                >
                  <v-autocomplete
                    v-model="formulario.tipo"
                    :items="opcoes[12]"
                    :error-messages="errors"
                    :disabled="controle.exibir"
                    item-text="descricao"
                    item-value="item"
                    class="required"
                    dense
                    hide-details
                    label="Tipo"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.idade"
                  v-mask="mascara('T', 250)"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Idade"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.rendimento"
                  :disabled="controle.exibir"
                  hide-details
                  clearable
                  dense
                  label="Rendimento Carcaça"
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
              <v-col cols="6">
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
              <v-col cols="6">
                <v-autocomplete
                  v-model="filtro.tipo"
                  :items="opcoes[12]"
                  item-text="descricao"
                  item-value="item"
                  dense
                  clearable
                  hide-details
                  label="Tipo"
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
                <v-autocomplete
                  v-model="filtro.tipo"
                  :items="opcoes[12]"
                  item-text="descricao"
                  item-value="item"
                  dense
                  clearable
                  hide-details
                  label="Tipo"
                  outlined
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
        titulo="Listagem das Categorias"
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
  name: "PaginaConfinamentoCategoria",

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
        text: "Tipo",
        align: "start",
        sortable: true,
        value: "genericaTipo.descricao",
        width: 50,
      },
      {
        text: "Sexo",
        align: "start",
        sortable: true,
        value: "genericaSexo.descricao",
        width: 50,
      },
      {
        text: "Idade",
        align: "end",
        sortable: true,
        value: "idade",
        width: 50,
      },
      {
        text: "Rendimento",
        align: "end",
        sortable: true,
        value: "rendimentoCarcaca",
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
      tipo: null,
      descricao: null,
    },
    formulario: {
      id: null,
      tipo: null,
      descricao: null,
      sexo: null,
      idade: null,
      rendimento: null,
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
    ...mapState("paginaConfinamentoCategoria", ["registros", "confinamentos"]),
    optionsFilter() {
      return {
        adicionar: true,
        valueInMore: true,
        notClearFilter: true,
      };
    },
  },

  async created() {
    this.obterOpcoes(11);
    this.obterOpcoes(12);
    this.listarRegistros();
  },

  methods: {
    ...mapActions("app", ["obterOpcoes"]),
    ...mapActions("paginaConfinamentoCategoria", [
      "listar",
      "editar",
      "salvar",
      "exibir",
      "excluir",
    ]),
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        tipo: this.filtro.tipo || undefined,
        descricao: this.filtro.descricao || undefined,
      });

      this.loading = false;
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          tipo: this.formulario.tipo || undefined,
          descricao: this.formulario.descricao || undefined,
          idade: this.formulario.idade || undefined,
          sexo: this.formulario.sexo || undefined,
          rendimento: this.formulario.rendimento
            ? moeda.strip(this.formulario.rendimento)
            : undefined,
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
          tipo: res.tipo || null,
          descricao: res.descricao || null,
          sexo: res.sexo || null,
          idade: res.idade || null,
          rendimento: Number(res.rendimentoCarcaca) || null,
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
        tipo: null,
        descricao: null,
        sexo: null,
        idade: null,
        rendimento: null,
      };

      this.modal = false;
      this.listarRegistros();
    },
    limparFiltros() {
      this.filtro = {
        codigo: null,
        descricao: null,
        tipo: null,
      };
    },
  },
};
</script>
