<template>
  <pagina
    :editar="!!controle.exibir"
    :formulario="controle.formulario"
    :loading="loading"
    :mais-opcoes="!controle.inserir || controle.editar"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :titulo-toolbar="tituloToolbar"
    fechar
    titulo="Usuários"
    subtitulo="Listagem e Manutenção de Usuários"
    @cancelar="fechar"
    @editar="modoEditar"
    @fechar="fechar"
    @salvar="salvar"
  >
    <aviso
      v-model="aviso.modal"
      :options="aviso"
      @sim="aviso = { modal: false, key: null, text: '' }"
      @excluirRegistro="excluir()"
      @resetarSenha="resetarSenha(), (usuario.id = null)"
      @excluirEmpresa="
        excluirEmpresaUsuario(), (idRelacionamentoEmpresa = undefined)
      "
      @excluirPerfil="
        excluirPerfilUsuario(), (idRelacionamentoPerfil = undefined)
      "
    />

    <template v-slot:formulario>
      <validation-observer ref="observer">
        <v-row class="ma-1" dense>
          <v-col cols="12" lg="1" md="1" xs="12">
            <validation-provider
              v-slot="{ errors }"
              name="Código"
              rules="required"
              vid="codigo"
            >
              <v-text-field
                v-model="usuario.codigo"
                v-mask="'#####'"
                :disabled="controle.exibir"
                :error-messages="errors"
                class="required"
                dense
                hide-details
                label="Código"
                outlined
              />
            </validation-provider>
          </v-col>
          <v-col
            cols="12"
            :lg="controle.inserir ? '4' : '6'"
            :md="controle.inserir ? '4' : '6'"
            xs="12"
          >
            <validation-provider
              v-slot="{ errors }"
              name="Nome"
              rules="required"
              vid="nome"
            >
              <v-text-field
                v-model="usuario.nome"
                v-mask="mascara('T', 250)"
                :disabled="controle.exibir"
                :error-messages="errors"
                class="required"
                dense
                hide-details
                label="Nome"
                outlined
              />
            </validation-provider>
          </v-col>
          <v-col v-if="controle.inserir" cols="12" lg="3" md="3" xs="12">
            <validation-provider
              v-slot="{ errors }"
              name="Senha"
              rules="required"
              vid="senha"
            >
              <v-text-field
                ref="senha"
                v-model="usuario.senha"
                :append-icon="verSenha ? 'mdi-lock-open' : 'mdi-lock'"
                :error-messages="errors"
                :type="verSenha ? 'text' : 'password'"
                class="required"
                dense
                hide-details
                label="Senha"
                outlined
                @click:append="verSenha = !verSenha"
              />
            </validation-provider>
          </v-col>
          <v-col
            cols="12"
            :lg="controle.inserir ? '2' : '3'"
            :md="controle.inserir ? '2' : '3'"
            xs="12"
          >
            <validation-provider
              v-slot="{ errors }"
              name="Login"
              rules="required"
              vid="login"
            >
              <v-text-field
                v-model="usuario.login"
                v-mask="mascara('T', 250)"
                :disabled="controle.exibir"
                :error-messages="errors"
                class="required"
                dense
                hide-details
                label="Login"
                outlined
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" lg="2" md="2" xs="12">
            <validation-provider
              v-slot="{ errors }"
              name="Ativo"
              rules="required"
              vid="ativo"
            >
              <v-select
                v-model="usuario.ativo"
                :disabled="controle.exibir"
                :error-messages="errors"
                :items="ativo"
                class="required"
                dense
                hide-details
                item-text="text"
                item-value="value"
                label="Ativo"
                outlined
              />
            </validation-provider>
          </v-col>
        </v-row>
      </validation-observer>
    </template>

    <template v-if="!controle.inserir" slot="maisOpcoes">
      <v-list dense class="pa-0">
        <v-list-item
          @click="
            aviso = {
              modal: true,
              key: 'excluirRegistro',
              text: 'Deseja excluir este <b>Usuário</b>?',
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
        <v-divider />
        <v-list-item
          @click="
            aviso = {
              modal: true,
              key: 'resetarSenha',
              text: 'A senha do usuário será redefinida para <b>123</b>!',
            }
          "
        >
          <v-list-item-icon class="mr-3">
            <v-icon color="primary"> mdi-lock-reset </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Redefinir senha </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <template slot="listagem">
      <filtro
        v-if="!$vuetify.breakpoint.mobile"
        :options="optionsFilter"
        @adicionar="modoInserir"
        @clearFilters="limparFiltros(), listar()"
        @search="listar()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row dense>
              <v-col cols="12" xl="2" lg="2" md="2" xs="12">
                <v-text-field
                  v-model="filtro.codigo"
                  v-mask="'#######'"
                  dense
                  hide-details
                  outlined
                  label="Código"
                  @keydown.enter="listar()"
                />
              </v-col>
              <v-col cols="12" xl="8" lg="8" md="8" xs="12">
                <v-text-field
                  v-model="filtro.nome"
                  dense
                  hide-details
                  outlined
                  label="Nome"
                  @keydown.enter="listar()"
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="2" xs="12">
                <select-all
                  v-model="filtro.ativo"
                  :items="ativo"
                  item-text="text"
                  item-value="value"
                  dense
                  hide-details
                  outlined
                  label="Ativo"
                  @input="listar()"
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro>

      <filtro-mobile
        v-if="$vuetify.breakpoint.mobile"
        :options="optionsFilter"
        @adicionar="modoInserir"
        @clearFilters="limparFiltros(), listar()"
        @search="listar()"
      >
        <template slot="filtros">
          <v-row dense>
            <v-col cols="12" xl="2" lg="2" md="2" xs="12">
              <v-text-field
                v-model="filtro.codigo"
                v-mask="'#######'"
                dense
                hide-details
                outlined
                label="Código"
                @keydown.enter="listar()"
              />
            </v-col>
            <v-col cols="12" xl="8" lg="8" md="8" xs="12">
              <v-text-field
                v-model="filtro.nome"
                dense
                hide-details
                outlined
                label="Nome"
                @keydown.enter="listar()"
              />
            </v-col>
            <v-col cols="12" xl="2" lg="2" md="2" xs="12">
              <select-all
                v-model="filtro.ativo"
                :items="ativo"
                item-text="text"
                item-value="value"
                dense
                hide-details
                outlined
                label="Ativo"
                @input="listar()"
              />
            </v-col>
          </v-row>
        </template>
      </filtro-mobile>

      <tabela
        :colunas="colunas"
        :loading="loading"
        :registros="usuarios"
        :registros-por-pagina="100"
        reset-senha-usuario
        class="mt-4"
        exibir
        height-auto
        titulo="Lista de Usuários"
        toolbar-grid
        @exibir="exibir($event)"
        @resetSenhaUsuario="
          (usuario.id = $event),
            (aviso = {
              modal: true,
              key: 'resetarSenha',
              text: 'A senha do usuário será redefinida para <b>123</b>!',
            })
        "
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaginaCadastroUsuario",

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
        align: "start",
        text: "Ativo",
        value: "ativo",
        width: 100,
      },
      {
        align: "start",
        text: "Login",
        value: "login",
        width: 180,
      },
      {
        align: "end",
        text: "Código",
        value: "codigo",
        width: 100,
      },
      {
        align: "start",
        text: "Nome",
        value: "nome",
      },
    ],
    controle: {
      formulario: false,
      inserir: false,
      exibir: false,
      editar: false,
    },
    empresaId: undefined,
    filtros: {
      codigo: "",
      nome: "",
      ativo: "",
    },
    filtro: {
      codigo: "",
      nome: "",
      ativo: "",
    },
    filtrosLimpos: {},
    idRelacionamentoEmpresa: undefined,
    idRelacionamentoPerfil: undefined,
    loading: false,
    modalAviso: false,
    modalAvisoResetSenha: false,
    perfilId: undefined,
    textoDeletar: "",
    usuario: {
      id: null,
      ativo: 1,
      codigo: "",
      login: "",
      nome: "",
      senha: "",
    },
    usuarioLimpo: {},
    verSenha: false,
  }),

  computed: {
    ...mapState("paginaCadastroUsuario", ["ativo", "usuarios"]),
    ...mapState("app", []),
    filtrosPreenchidos() {
      return this.temFiltros(this.filtros);
    },
    tituloToolbar() {
      let msg = "";
      if (this.controle.exibir) msg = "Visualizar Usuário";
      if (this.controle.editar) msg = "Editar Usuário";
      if (this.controle.inserir) msg = "Cadastrar Usuário";
      return msg;
    },
    optionsFilter() {
      return {
        values:
          this.filtro.codigo || this.filtro.nome || this.filtro.ativo.length,
        adicionar: true,
      };
    },
  },

  watch: {
    "usuario.codigo": {
      handler(val) {
        this.usuario.login = this.formatLogin(val, this.usuario.nome);
      },
    },
    "usuario.nome": {
      handler(val) {
        this.usuario.login = this.formatLogin(this.usuario.codigo, val);
      },
    },
  },

  async created() {
    await this.listarUsuarios();
    Object.assign(this.filtrosLimpos, this.filtros);
    Object.assign(this.usuarioLimpo, this.usuario);
  },

  methods: {
    ...mapActions("paginaCadastroUsuario", [
      "editarUsuario",
      "exibirUsuario",
      "listarUsuarios",
      "removerUsuario",
      "salvarUsuario",
      "senhaReset",
    ]),
    async excluir() {
      this.loading = true;

      await this.removerUsuario(this.usuario.id);
      this.reset();

      this.loading = false;
    },
    async exibir(id) {
      this.loading = true;

      this.usuario = await this.exibirUsuario(id);
      this.modoExibir();

      this.loading = false;
    },
    async listar() {
      this.loading = true;
      let aux = {};
      for (let key in this.filtro) {
        aux[key] =
          this.filtro[key] || this.filtro[key] === 0
            ? `${this.filtro[key]}`
            : undefined;
      }
      await this.listarUsuarios({
        filtro: {
          ...aux,
        },
      });
      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        codigo: "",
        nome: "",
        ativo: "",
      };
    },
    fechar() {
      this.reset();
    },
    modoEditar() {
      this.controle.editar = true;
      this.controle.formulario = true;
      this.controle.inserir = false;
      this.controle.exibir = false;
    },
    modoInserir() {
      this.controle.editar = false;
      this.controle.formulario = true;
      this.controle.inserir = true;
      this.controle.exibir = false;
      this.usuario.id = null;
    },
    modoExibir() {
      this.controle.editar = false;
      this.controle.formulario = true;
      this.controle.inserir = false;
      this.controle.exibir = true;
    },
    async resetarSenha() {
      this.loading = true;
      let res = await this.senhaReset(this.usuario.id || undefined);

      if (res && !res.erro) {
        this.modalAviso = false;
        this.modalAvisoResetSenha = false;
      }

      this.loading = false;
    },
    async reset() {
      this.modalAviso = false;
      this.$refs.observer.reset();
      this.controle = {
        formulario: false,
        editar: false,
        exibir: false,
        inserir: false,
      };
      this.usuario = {
        ativo: 1,
        codigo: "",
        id: null,
        login: "",
        nome: "",
        senha: "",
      };

      this.listar();
    },
    async salvar() {
      this.loading = true;

      if (await this.$refs.observer.validate()) {
        let aux = {
          id: this.usuario.id ? this.usuario.id : undefined,
          ativo: this.usuario.ativo ? this.usuario.ativo : 0,
          codigo: this.usuario.codigo ? this.usuario.codigo : undefined,
          nome: this.usuario.nome ? this.usuario.nome : undefined,
          login: this.usuario.login ? this.usuario.login : undefined,
          senha: this.usuario.senha
            ? this.$crypto(this.usuario.senha, "sha1")
            : undefined,
        };
        let res;
        if (aux.id) {
          res = await this.editarUsuario(aux);
        } else {
          res = await this.salvarUsuario(aux);
        }
        if (res.erro) {
          this.$refs.observer.setErrors(res.erro);
        } else {
          if (res.id) {
            this.usuario.id = res.id;
            this.modoEditar();
          } else {
            this.fechar();
          }
        }
      }
      this.loading = false;
    },
    temFiltros(filtros) {
      return Object.values(filtros)
        .map((e) => String(e))
        .some((e) => !!e === true);
    },
    formatLogin(codigo, nome) {
      let sep = "";
      if (!!codigo && !!nome) sep = "-";
      return `${codigo.trim()}${sep}${nome.trim().split(" ")[0]}`;
    },
  },
};
</script>

<style>
.desabilitado {
  color: #bbb !important;
  pointer-events: none;
}
</style>
