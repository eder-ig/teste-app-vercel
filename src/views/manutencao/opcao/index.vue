<template>
  <pagina
    :editar="!!(exibicao && !inserir)"
    :formulario.sync="modal"
    :loading="loading"
    :mais-opcoes="!inserir"
    :campo-obrigatorio-title="false"
    :salvar="!!(!exibicao && (inserir || edicao))"
    :titulo-toolbar="
      inserir && !edicao
        ? 'Cadastrar Nova Opção do Sistema'
        : !inserir && !exibicao
        ? 'Editar Opção'
        : 'Opção do Sistema'
    "
    fechar
    subtitulo="Cadastro e manutenção"
    titulo="Cadastro de Opções do Sistema"
    @cancelar="resetFormulario()"
    @editar="(exibicao = false), (edicao = true)"
    @fechar="resetFormulario()"
    @salvar="salvar()"
  >
    <aviso
      v-model="aviso.modal"
      :options="aviso"
      @sim="(aviso.modal = false), deletarRegistro(formulario.id)"
    />
    <template v-slot:formulario>
      <loading :value="loading" />
      <v-form>
        <validation-observer ref="observer">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12" lg="2" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Item"
                  rules="required"
                  vid="item"
                >
                  <v-text-field
                    ref="codigo"
                    v-model="formulario.item"
                    v-mask="'####'"
                    :disabled="exibicao && !inserir"
                    :error-messages="errors"
                    class="required"
                    dense
                    hide-details
                    label="Item"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" lg="10" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Descrição"
                  rules="required"
                  vid="descricao"
                >
                  <v-text-field
                    ref="formDescricao"
                    v-model="formulario.descricao"
                    v-mask="mascara('T', 250)"
                    :disabled="exibicao && !inserir"
                    :error-messages="errors"
                    class="required"
                    dense
                    hide-details
                    label="Descrição"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" lg="12" md="12" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Observação"
                  vid="observacao"
                >
                  <v-textarea
                    v-model="formulario.observacao"
                    v-mask="mascara('T', 250)"
                    :disabled="exibicao && !inserir"
                    :error-messages="errors"
                    auto-grow
                    hide-details
                    label="Observação"
                    outlined
                    row-height="24"
                    rows="1"
                    spellcheck="false"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </template>

    <template v-slot:maisOpcoes>
      <v-list class="pa-0" dense>
        <v-list-item @click="aviso.modal = true">
          <v-list-item-icon class="mr-3">
            <v-icon color="primary"> mdi-delete </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Excluir registro </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <template v-slot:relacionamento>
      <modal
        ref="modalItens"
        v-model="modalItens"
        :options="optionsModal"
        @input="resetItens()"
        @salvar="alterarDescricaoItem()"
      >
        <template v-slot:maisOpcoes>
          <v-list class="pa-0" dense>
            <v-list-item @click="deletarItens()">
              <v-list-item-icon class="mr-3">
                <v-icon color="primary"> mdi-delete </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> Excluir registro </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
        <v-form>
          <validation-observer ref="observerDescricaoItem">
            <v-container fluid grid-list-xs>
              <v-row dense>
                <v-col cols="2">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Item"
                    vid="item"
                  >
                    <v-text-field
                      v-model="formEditarItem.item"
                      :error-messages="errors"
                      disabled
                      dense
                      hide-details
                      label="Item"
                      outlined
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="10">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Descrição"
                    rules="required"
                    vid="descricao"
                  >
                    <v-text-field
                      v-model="formEditarItem.descricao"
                      v-mask="mascara('T', 100)"
                      :error-messages="errors"
                      class="required"
                      dense
                      hide-details
                      label="Descrição"
                      outlined
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-container>
          </validation-observer>
        </v-form>
      </modal>
      <tabela
        v-if="modal"
        :colunas="colunasItens"
        :desabilitado="!formulario.id || !edicaoItens"
        :loading="loading"
        :registros="opcoesRelacionadas"
        dense
        editar
        height-auto
        toolbar-grid
        titulo="Itens da opção"
        @editar="exibirItem($event)"
      >
        <template v-slot:botoes>
          <div class="pb-3">
            <v-btn
              v-if="formulario.id && !edicaoItens"
              :loading="loading"
              elevation="0"
              outlined
              small
              @click="habilitaEdicaoItem()"
            >
              <v-icon left> mdi-pencil </v-icon>
              Editar Itens
            </v-btn>
          </div>
          <div class="pb-3">
            <v-btn
              v-if="edicaoItens"
              :loading="loading"
              color="error"
              outlined
              small
              @click="edicaoItens = false"
            >
              <v-icon left> mdi-cancel </v-icon>
              CANCELAR
            </v-btn>
          </div>
        </template>

        <template v-slot:cabecalho>
          <v-form>
            <validation-observer ref="observerItens">
              <v-row dense>
                <v-col cols="12" lg="3" md="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Item"
                    rules="required"
                    vid="item"
                  >
                    <v-text-field
                      ref="itemCodigo"
                      v-model="itens.item"
                      v-mask="'####'"
                      :disabled="!formulario.id || !edicaoItens"
                      :error-messages="errors"
                      class="required"
                      dense
                      hide-details
                      label="Item"
                      outlined
                      @keydown.enter="salvarItens()"
                    />
                  </validation-provider>
                </v-col>
                <v-col block>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Descrição"
                    rules="required"
                    vid="descricao"
                  >
                    <v-text-field
                      ref="itemDescricao"
                      v-model="itens.descricao"
                      v-mask="mascara('T', 250)"
                      :disabled="!formulario.id || !edicaoItens"
                      :error-messages="errors"
                      class="required"
                      dense
                      hide-details
                      label="Descrição"
                      outlined
                      @keydown.enter="salvarItens()"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    v-if="(!exibicao && !inserir) || edicaoItens"
                    :disabled="!formulario.id"
                    color="primary"
                    height="40"
                    outlined
                    @click="salvarItens()"
                  >
                    <v-icon size="20" left> mdi-arrow-down-bold-box </v-icon>
                    Adicionar
                  </v-btn>
                </v-col>
              </v-row>
            </validation-observer>
          </v-form>
        </template>
      </tabela>
    </template>

    <template v-slot:listagem>
      <filtro
        :options="optionsFilter"
        @adicionar="abrirFormularuiNovo()"
        @clearFilters="limparFiltro()"
        @search="listar()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row dense>
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="filtro.item"
                  v-mask="'###########'"
                  auto-focus
                  clearable
                  dense
                  hide-details
                  outlined
                  label="Item"
                  @keydown.enter="listar()"
                  @click:clear="limparFiltro()"
                />
              </v-col>
              <v-col cols="12" sm="9">
                <v-text-field
                  v-model="filtro.descricao"
                  v-mask="mascara('T', 250)"
                  auto-focus
                  clearable
                  dense
                  hide-details
                  outlined
                  label="Descrição"
                  @keydown.enter="listar()"
                  @click:clear="limparFiltro()"
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro>
      <tabela
        :colunas="colunas"
        :loading="loading"
        :registros="registros"
        height-auto
        class="mt-4"
        toolbar-grid
        titulo="Registros"
        exibir
        @exibir="exibirRegistro($event)"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaginaCadastroDeOpcoes",

  data: () => ({
    aviso: {
      modal: false,
      text: "Deseja excluir esse <b>Registro</b>?",
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
        text: "Grupo",
        align: "end",
        sortable: true,
        value: "grupo",
        width: 70,
      },
      {
        text: "Item",
        align: "end",
        sortable: true,
        value: "item",
        width: 70,
      },
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
      },
    ],
    edicao: false,
    edicaoItens: false,
    exibicao: false,
    filtro: {
      item: null,
      descricao: null,
    },
    formulario: {
      id: null,
      item: null,
      grupo: null,
      descricao: null,
      observacao: null,
    },
    formEditarItem: {
      id: null,
      grupo: null,
      item: null,
      descricao: null,
    },
    itens: {
      item: null,
      descricao: null,
    },
    inserir: false,
    loading: false,
    modal: false,
    modalItens: false,
    opcoesRelacionadas: [],
  }),

  computed: {
    ...mapState("paginaCadastroOpcao", ["registros"]),
    optionsFilter() {
      return {
        adicionar: true,
        values: !!(this.filtro.item || this.filtro.descricao),
      };
    },
    optionsModal() {
      return {
        title: "Editar Item",
        width: 700,
        maisOpcoes: !!(this.formulario.id || !this.edicaoItens),
      };
    },
    colunasItens() {
      let coluna = [
        {
          text: "Ação",
          align: "center",
          sortable: false,
          value: "acao",
          width: 61,
        },
        {
          text: "Grupo",
          align: "end",
          sortable: true,
          value: "grupo",
          width: 70,
        },
        {
          text: "Item",
          align: "end",
          sortable: true,
          value: "item",
          width: 70,
        },
        {
          text: "Descrição",
          align: "start",
          sortable: true,
          value: "descricao",
        },
      ];

      if (!this.edicaoItens) coluna.shift();

      return coluna;
    },
  },

  watch: {
    modal(valor) {
      if (valor) {
        setTimeout(() => {
          this.$refs.formDescricao.focus();
        }, 500);
      }
    },
  },

  created() {
    this.listar();
  },

  async mounted() {
    if (this.$route.query.opcao && this.$route.query.itemId) {
      await this.exibirRegistro(this.$route.query.opcao);
      this.habilitaEdicaoItem();
      this.exibirItem(Number(this.$route.query.itemId));
    }
  },

  methods: {
    ...mapActions("paginaCadastroOpcao", [
      "deletar",
      "editarRegistro",
      "exibir",
      "listarRegistros",
      "proximoItem",
      "salvarRegistro",
    ]),
    async abrirFormularuiNovo() {
      this.loading = true;
      let res = await this.proximoItem();

      if (res && !res.erro) {
        this.formulario.item = res.item ? res.item : null;
        this.modal = true;
        this.inserir = true;
      }

      this.loading = false;
    },
    async alterarDescricaoItem() {
      if (await this.$refs.observerDescricaoItem.validate()) {
        this.loading = true;

        let form = {
          id: this.formEditarItem.id || undefined,
          item: this.formEditarItem.item || undefined,
          grupo: this.formEditarItem.id ? this.formEditarItem.grupo : 1,
          descricao: this.formEditarItem.descricao || undefined,
        };

        let res = await this.editarRegistro(form);

        if (res && !res.erro) {
          this.resetItens();
          this.exibirRegistro(this.formulario.id);
        }

        this.loading = false;
      }
    },
    async deletarRegistro(id) {
      this.loading = true;

      let res = await this.deletar(id);

      if (res && !res.erro) {
        this.resetFormulario();
      }

      this.loading = false;
    },
    async deletarItens() {
      this.loading = true;

      let res = await this.deletar(this.formEditarItem.id);

      if (res && !res.erro) {
        this.resetItens();
        this.exibirRegistro(this.formulario.id);
      }

      this.loading = false;
    },
    exibirItem(id) {
      this.loading = true;

      let registro = this.opcoesRelacionadas.find((item) => item.id === id);

      if (registro) {
        this.formEditarItem = {
          id: registro.id,
          grupo: registro.grupo,
          item: registro.item,
          descricao: registro.descricao,
        };

        this.modalItens = true;
      }

      this.loading = false;
    },
    async exibirRegistro(id) {
      this.loading = true;

      let res = await this.exibir(id);

      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          item: res.item || null,
          grupo: res.grupo || null,
          descricao: res.descricao || null,
          observacao: res.observacao || null,
        };
        this.opcoesRelacionadas = res.opcoesRelacionadas;

        if (this.opcoesRelacionadas) {
          this.itens.item = this.opcoesRelacionadas.length + 1;
        }

        this.exibicao = true;
        this.inserir = false;
        this.modal = true;
      }

      this.loading = false;
    },
    habilitaEdicaoItem() {
      this.edicaoItens = true;
      setTimeout(() => {
        this.$refs.itemDescricao.focus();
      }, 100);
    },
    async limparFiltro() {
      this.filtro = {
        item: null,
        descricao: null,
      };

      await this.listar();
    },
    async listar() {
      this.loading = true;

      await this.listarRegistros({
        filtro: JSON.stringify({
          item: this.filtro.item || undefined,
          descricao: this.filtro.descricao || undefined,
        }),
      });

      this.loading = false;
    },
    resetFormulario() {
      this.edicao = false;
      this.edicaoItens = false;
      this.exibicao = false;
      this.formulario = {
        id: null,
        item: null,
        grupo: null,
        descricao: null,
        observacao: null,
      };
      this.itens = {
        item: null,
        descricao: null,
      };
      this.inserir = false;
      this.loading = false;
      this.modal = false;
      this.opcoesRelacionadas = [];
      this.listar();
    },
    paginar(e) {
      this.pagi = e;
      this.listar();
    },
    resetItens() {
      this.modalItens = false;
      this.formEditarItem = {
        id: null,
        grupo: null,
        item: null,
        descricao: null,
      };
    },
    async salvar() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        let form = {
          id: this.formulario.id || undefined,
          item: this.formulario.item || undefined,
          grupo: this.formulario.id ? this.formulario.grupo : 1,
          descricao: this.formulario.descricao || undefined,
          observacao: this.formulario.observacao || undefined,
        };
        let res = "";

        if (!form.id) res = await this.salvarRegistro(form);
        else res = await this.editarRegistro(form);

        if (res.mensagem) {
          this.resetFormulario();
          if (!form.id && res.id) this.exibirRegistro(res.id);
        } else if (res.erro) {
          this.$refs.observer.setErrors(res.erro);
        }

        this.loading = false;
      }
    },
    async salvarItens() {
      if (await this.$refs.observerItens.validate()) {
        this.loading = true;

        let res = await this.salvarRegistro({
          item: this.itens.item || undefined,
          grupo: this.formulario.item || undefined,
          descricao: this.itens.descricao,
        });

        if (res && !res.erro) this.exibirRegistro(this.formulario.id);

        this.itens = {
          item: null,
          descricao: null,
        };

        this.$refs.itemDescricao.focus();

        this.loading = false;
      }
    },
  },
};
</script>
