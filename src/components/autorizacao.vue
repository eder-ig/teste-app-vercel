<template>
  <v-row justify="center">
    <v-dialog v-model="value" max-width="320px" persistent>
      <v-card class="pa-0">
        <v-card-title class="justify-center">
          <v-img :src="logo" class="ma-3" max-width="250" />
        </v-card-title>
        <v-card-text>
          <v-form autocomplete="off">
            <validation-observer ref="observer">
              <v-row v-if="!!options.mensagem" dense>
                <v-col cols="12">
                  <div v-html="options.mensagem" />
                </v-col>
              </v-row>
              <v-row v-if="!options.mensagem">
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Login"
                    rules="required"
                    vid="login"
                  >
                    <v-text-field
                      ref="login"
                      v-model="formulario.login"
                      v-mask="mascara('T', 250)"
                      :error-messages="errors"
                      autofocus
                      append-icon="mdi-account"
                      class="required"
                      dense
                      hide-details
                      label="Usuário"
                      outlined
                      placeholder="00000-USUARIO"
                      type="text"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Senhas"
                    rules="required"
                    vid="senha"
                  >
                    <v-text-field
                      ref="senha"
                      v-model="formulario.senha"
                      :append-icon="!verSenha ? 'mdi-lock' : 'mdi-lock-open'"
                      :error-messages="errors"
                      :type="!verSenha ? 'password' : 'text'"
                      class="required"
                      dense
                      hide-details
                      label="Senha"
                      outlined
                      placeholder="****"
                      @click:append="verSenha = !verSenha"
                      @keydown.enter="confirmar()"
                    />
                  </validation-provider>
                </v-col>
                <small>
                  <span class="red--text">*</span>
                  campos requeridos.
                </small>
              </v-row>
            </validation-observer>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row dense>
            <v-col cols="6" class="py-0">
              <v-btn
                block
                :color="$vuetify.theme.dark ? '' : 'primary'"
                dark
                small
                @click="
                  options.mensagem ? (options.mensagem = null) : confirmar()
                "
              >
                <v-icon left size="20">
                  {{ options.mensagem ? "mdi-lock-reset" : "mdi-check" }}
                </v-icon>
                {{ options.mensagem ? "Autorizar" : "Confirmar" }}
              </v-btn>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-btn block color="error" dark small @click="cancelar()">
                <v-icon left size="20"> mdi-cancel </v-icon>
                Cancelar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "ComponenteAutenticacao",

  props: {
    value: {
      required: true,
      type: Boolean,
    },
    options: {
      type: Object,
      default: () => ({
        mensagem: null,
        rotinaVerificacao: null,
        autenticacao: {
          login: null,
          senha: null,
          empresa: null,
          tipo: null,
        },
      }),
    },
  },

  data: () => ({
    logo: require("@/assets/logo.png"),
    formulario: {
      login: null,
      senha: null,
    },
    verSenha: false,
  }),

  created() {
    setTimeout(() => {
      this.formulario.login = localStorage.getItem("igtrato:login")
        ? window.atob(localStorage.getItem("igtrato:login"))
        : null;
    }, 100);
  },

  methods: {
    async confirmar() {
      if (await this.$refs.observer.validate()) {
        this.options.autenticacao = {
          login: this.formulario.login || undefined,
          senha: this.formulario.senha
            ? this.$crypto(this.formulario.senha, "sha1")
            : undefined,
          empresa: 2,
          tipo: 1,
        };
        this.$emit("autorizar", this.options.rotinaVerificacao);
        this.$emit("input", false);

        this.formulario.senha = null;
      }
    },
    cancelar() {
      this.formulario = {
        login: null,
        senha: null,
      };
      this.verSenha = false;
      this.$emit("input", false);
      this.$emit("update:options", {
        mensagem: null,
        rotinaVerificacao: null,
        autenticacao: {
          login: null,
          senha: null,
          empresa: 2,
          tipo: 1,
        },
      });
    },
  },
};
</script>
