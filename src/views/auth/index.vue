<template>
  <v-app id="inspire">
    <v-main class="d-flex align-self-center" justify="center">
      <v-container class="fill-height">
        <loading :value="loading" />
        <modal
          v-model="modalAlterarSenha"
          :options="optionsModal"
          @input="modalAlterarSenha = false"
        >
          <alterarSenha
            v-if="modalAlterarSenha"
            ref="alterarSenha"
            :login.sync="formulario.login"
            :modal-alterar-senha.sync="modalAlterarSenha"
            @proseguir="continuarLogin($event)"
          />
        </modal>

        <v-row>
          <v-col
            cols="12"
            class="d-flex align-center justify-center"
            style="
              bottom: -85px !important;
              position: relative !important;
              z-index: 10;
            "
          >
            <span
              :class="$vuetify.theme.dark ? '#1e1e1e' : 'white'"
              :style="
                $vuetify.theme.dark
                  ? 'background-color: #1e1e1e; box-shadow: 0 0;'
                  : 'background-color: grey; box-shadow: 0 -2px 1px #ddd;'
              "
              class="pa-6 ustify-center align-center text-center"
              style="border-radius: 50% !important; width: 250px; height: 200"
            >
              <!-- <v-img
                :src="
                  $vuetify.theme.dark
                    ? require('@/assets/logo_branca.png')
                    : require('@/assets/logo.png')
                "
                class="ma-0 pa-2 shrink"
                contain
                transition="scale-transition"
                width="300"
              /> -->
              <v-avatar size="200">
                <v-img
                  :src="require('@/assets/logo_branca.png')"
                  transition="scale-transition"
                />
              </v-avatar>
            </span>
          </v-col>
          <v-col cols="12" class="d-flex align-center justify-center">
            <v-card width="350" class="pa-4" flat>
              <v-card-title
                class="display-1 font-weight-bold grey--text mt-6 pt-4 text-center justify-center"
              >
                CONFINAMENTO
              </v-card-title>
              <v-card-text>
                <validation-observer ref="observer">
                  <v-row>
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
                          :error-messages="errors"
                          autofocus
                          append-icon="mdi-account"
                          class="required"
                          hide-details
                          placeholder="Login"
                          type="text"
                          @input="replaceLoginUser()"
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Senha"
                        rules="required"
                        vid="senha"
                      >
                        <v-text-field
                          id="senha"
                          ref="senha"
                          v-model="formulario.senha"
                          :error-messages="errors"
                          class="required"
                          hide-details
                          placeholder="Senha"
                          type="password"
                          @keydown.enter="efetuarLogin()"
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                </validation-observer>
              </v-card-text>

              <v-card-actions class="ma-2">
                <v-row class="text-center justify-center" dense>
                  <v-btn
                    :color="$vuetify.theme.dark ? '' : 'primary'"
                    block
                    class="my-2"
                    rounded
                    x-large
                    @click="efetuarLogin()"
                  >
                    Efetuar Login
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "PaginaLoginUsuario",

  components: {
    alterarSenha: () => import("./components/alterar_senha"),
  },

  data: () => ({
    formulario: {
      login: "",
      senha: "",
    },
    loading: false,
    logo: require("@/assets/logo.png"),
    modalAlterarSenha: false,
  }),

  computed: {
    optionsModal() {
      return {
        title: "Alterar a Senha",
        width: 650,
        noactions: true,
      };
    },
  },

  created() {
    setTimeout(() => {
      this.formulario.login = localStorage.getItem("igtrato:login")
        ? window.atob(localStorage.getItem("igtrato:login"))
        : "";
    }, 100);

    if (this.$refs.senha) {
      setTimeout(() => {
        this.$refs.senha.focus();
      }, 600);
    }
  },

  methods: {
    ...mapActions("app", ["login", "paginasListar"]),
    async continuarLogin(payload) {
      this.modalAlterarSenha = false;
      this.senha = "";

      const res = await this.login({
        login: this.formulario.login || undefined,
        senha: (payload && payload.senha) || undefined,
        empresa: 2, //FRIGON
      });

      if (res && !res.erro && res.senhaVencida) {
        this.modalAlterarSenha = true;
      } else {
        await this.paginasListar();

        this.$router.push("/");
      }
    },
    async efetuarLogin(payload) {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const res = await this.login({
          login: this.formulario.login || undefined,
          senha:
            (payload && payload.senha) || this.formulario.senha
              ? this.$crypto(this.formulario.senha, "sha1")
              : undefined,
          empresa: 2, //FRIGON
        });

        if (res && !res.erro && res.senhaVencida) {
          this.modalAlterarSenha = true;
        } else if (typeof res.erro === "object") {
          this.$refs.observer.reset();

          Object.keys(res.erro).forEach((item) => {
            this.$refs.observer.setErrors(res.erro);
          });
        } else {
          await this.paginasListar();

          this.$router.push("/");
        }

        this.loading = false;
      }
    },
    replaceLoginUser() {
      if (
        /^[0-9]+/gm.test(this.formulario.login) &&
        this.formulario.login.indexOf("-") < 0
      ) {
        this.formulario.login =
          this.formulario.login && this.formulario.login.length
            ? this.formulario.login.replace(
                /[a-zA-Z]+/gm,
                `-${this.formulario.login
                  .replace(/[^a-zA-Z]+/gm, "")
                  .toUpperCase()}`
              )
            : "";
      } else {
        if (this.formulario.login && this.formulario.login.length) {
          this.formulario.login = this.formulario.login.toUpperCase();
        }
      }
    },
  },
};
</script>
