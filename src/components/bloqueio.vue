<template>
  <v-dialog :value="bloqueioTela" persistent fullscreen>
    <v-container
      v-if="bloqueioTela"
      fill-height
      fluid
      class="justify-center"
      :style="
        $vuetify.theme.dark
          ? 'background-color: #272727;'
          : 'background-color: white'
      "
    >
      <v-card flat width="350" :class="$vuetify.theme.dark ? '' : 'white'">
        <v-row dense>
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
                  : 'background-color: white; box-shadow: 0 -2px 1px #ddd;'
              "
              class="pa-6"
              style="border-radius: 50% !important; width: 250px; height: 200"
            >
              <v-img
                :src="
                  $vuetify.theme.dark
                    ? require('@/assets/logo_branca.png')
                    : require('@/assets/logo.png')
                "
                class="ma-0 pa-2 shrink"
                contain
                transition="scale-transition"
                width="300"
              />
            </span>
          </v-col>
          <v-col cols="12" class="d-flex align-center justify-center mb-10">
            <v-card width="350" class="pa-4" :flat="$vuetify.theme.dark">
              <v-card-title
                class="display-1 mt-10 justify-center text-center font-weight-bold"
                :class="$vuetify.theme.dark ? 'white--text' : 'grey--text'"
              >
                {{ formulario.login }}
              </v-card-title>
              <v-card-text>
                <validation-observer ref="observer">
                  <v-row dense>
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
                          @keydown.enter="desbloquearUsuario()"
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
                    :class="$vuetify.theme.dark ? '' : 'white--text'"
                    block
                    class="my-2"
                    rounded
                    x-large
                    @click="desbloquearUsuario()"
                  >
                    <v-icon left size="30">mdi-lock-open-outline</v-icon>
                    Desbloquear
                  </v-btn>
                  <v-btn
                    :color="$vuetify.theme.dark ? '' : 'primary'"
                    :class="$vuetify.theme.dark ? '' : 'white--text'"
                    block
                    class="my-2"
                    rounded
                    x-large
                    @click="deslogar()"
                  >
                    <v-icon left size="30">mdi-swap-horizontal</v-icon>
                    Trocar Usuário
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LockedPage",

  props: {
    value: {
      default: false,
      type: Boolean,
    },
  },

  data: () => ({
    formulario: {
      login: "",
      senha: "",
    },
    logo: require("@/assets/logo.png"),

    intervalAtividadeMouse: null,
    ultimaAtividadeMouse: null,
    bloqueioTela: false,
  }),

  mounted() {
    const body = document.getElementById("app");
    body.addEventListener("mouseover", this.eventoMouse);

    window.addEventListener("keydown", this.verificarTeclas, false, true);
  },
  destroyed() {
    const body = document.getElementById("app");
    body.removeEventListener("mouseover", this.eventoMouse);

    window.removeEventListener("keydown", this.verificarTeclas);
    clearInterval(this.intervalAtividadeMouse);
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

    this.intervalAtividadeMouse = setInterval(() => {
      if (
        this.ultimaAtividadeMouse &&
        !this.bloqueioTela &&
        this.$day().diff(this.ultimaAtividadeMouse, "m") >= 30
      ) {
        this.bloqueioTela = true;
      }
    }, 1000);

    if (!this.bloqueioTela) this.ultimaAtividadeMouse = this.$day();
  },

  methods: {
    ...mapActions("app", ["desbloquear", "logout"]),
    async desbloquearUsuario() {
      if (await this.$refs.observer.validate()) {
        const res = await this.desbloquear({
          login: this.formulario.login || undefined,
          senha: this.formulario.senha
            ? this.$crypto(this.formulario.senha, "sha1")
            : undefined,
          empresa: 2, //primary
        });

        if (res && !res.erro && res.token) {
          this.bloqueioTela = false;
          this.formulario.senha = "";
        } else if (typeof res.erro === "object") {
          this.$refs.observer.reset();

          Object.keys(res.erro).forEach((item) => {
            this.$refs.observer.setErrors(res.erro);
          });
        }
      }
    },
    async deslogar() {
      const res = await this.logout();
      if (!res.erro) this.$router.push("/login");
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

    eventoMouse(event) {
      if (!this.bloqueioTela) {
        this.ultimaAtividadeMouse = this.$day();
      }
    },
    verificarTeclas(event) {
      if (event.keyCode === 116 && this.bloqueioTela) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  },
};
</script>
