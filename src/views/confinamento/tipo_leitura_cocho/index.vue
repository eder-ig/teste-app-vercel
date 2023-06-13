<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Pagina de cadastro e manutenção"
    titulo-toolbar="Tipo de Leitura de Cocho"
    titulo="Tipo Leitura de Cocho"
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
              <v-col cols="2">
                <v-text-field
                  v-model="formulario.id"
                  disabled
                  hide-details
                  dense
                  label="Código"
                  outlined
                />
              </v-col>
              <v-col cols="3">
                <validation-provider
                  v-slot="{ errors }"
                  name="Nota"
                  rules="required"
                  vid="nota"
                >
                  <v-text-field
                    v-model="formulario.nota"
                    v-mask="mascara('T', 250)"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Nota"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="4">
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
                    label="Descrição"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantidade Ajuste (%)"
                  rules="required"
                  vid="quantidadeAjuste"
                >
                  <v-text-field
                    v-model="formulario.quantidadeAjuste"
                    v-moeda="{ negativo: true, decimal: 0 }"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Quantidade Ajuste (%)"
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
        titulo="Listagem dos Tipos de Leitura de Cocho"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaginaCadastroTipoLeituraCocho",

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
        text: "Código",
        align: "center",
        sortable: true,
        value: "id",
        width: 50,
      },
      {
        text: "Nota",
        align: "center",
        sortable: true,
        value: "nota",
        width: 50,
      },
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 150,
      },
      {
        text: "Ajuste (%)",
        align: "center",
        sortable: true,
        value: "quantidadeAjuste",
        width: 50,
      },
      {},
    ],
    controle: {
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
      nota: null,
      quantidadeAjuste: null,
    },
    loading: false,
    modal: false,
    paginacaoFake: {
      pagina: 1,
      registros: 100,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("paginaConfinamentoTipoLeituraCocho", ["registros"]),
    optionsFilter() {
      return {
        adicionar: true,
        values: !!this.filtro.descricao,
      };
    },
  },

  async created() {
    this.listarRegistros();
  },

  methods: {
    ...mapActions("paginaConfinamentoTipoLeituraCocho", [
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
          descricao: res.descricao || null,
          nota: res.nota || null,
          quantidadeAjuste: res.quantidadeAjuste || null,
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
        descricao: this.filtro.descricao || undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        descricao: null,
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
        nota: null,
        quantidadeAjuste: null,
      };

      this.modal = false;
      this.listarRegistros();
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          descricao: this.formulario.descricao || undefined,
          nota: this.formulario.nota || undefined,
          quantidadeAjuste: this.formulario.quantidadeAjuste || undefined,
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
