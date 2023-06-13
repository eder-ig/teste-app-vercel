<template>
  <div class="text-center">
    <v-dialog
      :value="value"
      :width="(options && options.width) || optionsDefalt.width"
      :content-class="
        moving ? 'ig-dialog__custon ig-no-transitions' : 'ig-dialog__custon'
      "
      :persistent="persistent"
      :fullscreen="$vuetify.breakpoint.mobile || fullscreen"
      scrollable
      @input="$emit('input', value)"
    >
      <!-- transition="dialog-top-transition" -->
      <v-card>
        <v-card-title
          :class="
            $vuetify.theme.dark
              ? colorToolbar || 'accent'
              : colorToolbar || 'white back--text'
          "
          class="title ig-toolbar__custon py-1 px-2"
          dark
        >
          <v-btn
            :color="
              $vuetify.theme.dark
                ? colorToolbar && 'white'
                : colorToolbar
                ? 'white'
                : 'primary'
            "
            :small="!$vuetify.breakpoint.mobile"
            class="mr-2"
            left
            size="35"
            outlined
            @click="$emit('input', false)"
          >
            <v-icon class="pa-0 ma-0"> mdi-close </v-icon>
          </v-btn>
          {{ options && options.title ? options.title : optionsDefalt.title }}

          <v-spacer />
          <slot name="acaoToolbar" />
          <v-menu v-if="options && options.maisOpcoes" offset-y left>
            <template v-slot:activator="{ on }">
              <v-tooltip activator="#mo-modal-tooltip" bottom>
                <span>Mais Opções</span>
              </v-tooltip>
              <v-btn
                id="mo-modal-tooltip"
                :color="$vuetify.theme.dark ? '' : 'primary darken-3'"
                class="mx-0"
                data-cy="btnMaisOpcoes"
                dark
                icon
                v-on="on"
              >
                <v-icon> mdi-dots-vertical </v-icon>
              </v-btn>
            </template>
            <slot name="maisOpcoes" />
          </v-menu>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-0">
          <slot />
        </v-card-text>

        <v-divider />
        <template v-if="acaoForm">
          <v-card-actions
            v-if="options && options.actions && options.actions.length"
            class="pa-1"
          >
            <span v-if="options && options.labelFooter" class="caption">
              {{ options.labelFooter }}
            </span>
            <slot name="totais" />

            <template v-for="btn in options.actions">
              <v-btn
                v-if="btn.left && !btn.hide"
                :key="btn.title"
                :color="
                  $vuetify.theme.dark && btn.color !== 'error'
                    ? 'accent'
                    : btn.color || 'primary'
                "
                :class="btn.class || ''"
                :large="$vuetify.breakpoint.mobile"
                :data-cy="btn.dataCy"
                :outlined="btn.outlined"
                :disabled="btn.disabled || options.loading"
                @click="$emit(`${btn.emit}`)"
              >
                <v-icon left size="20">
                  {{ btn.icon }}
                </v-icon>
                {{ btn.title }}
              </v-btn>
            </template>

            <v-spacer />

            <template v-for="btn in options.actions">
              <v-btn
                v-if="!btn.left && !btn.hide"
                :key="btn.title"
                :color="
                  $vuetify.theme.dark && btn.color !== 'error'
                    ? 'accent'
                    : btn.color || 'primary'
                "
                :class="btn.class || ''"
                :data-cy="btn.dataCy"
                :outlined="btn.outlined"
                :large="$vuetify.breakpoint.mobile"
                :disabled="btn.disabled || options.loading"
                @click="$emit(`${btn.emit}`)"
              >
                <v-icon left size="20">
                  {{ btn.icon }}
                </v-icon>
                {{ btn.title }}
              </v-btn>
            </template>
          </v-card-actions>
          <v-card-actions v-else-if="!options.noactions" class="pa-1">
            <v-spacer />
            <v-btn
              v-for="def in optionsDefalt.actions"
              :key="def.title"
              :color="
                $vuetify.theme.dark && def.color !== 'error'
                  ? 'accent'
                  : def.color || 'primary'
              "
              :data-cy="def.dataCy"
              :outlined="def.outlined"
              :disabled="def.disabled || optionsDefalt.loading"
              :large="$vuetify.breakpoint.mobile"
              @click="$emit(`${def.emit}`)"
            >
              <v-icon left size="20">
                {{ def.icon }}
              </v-icon>
              {{ def.title }}
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "DialogComponent",

  props: {
    options: {
      type: Object,
      default: () => {},
    },
    value: {
      required: true,
      type: Boolean,
    },
    colorToolbar: {
      default: "",
      type: String,
    },
    acaoForm: {
      default: true,
      type: Boolean,
    },
    fullscreen: {
      default: false,
      type: Boolean,
    },
    persistent: {
      default: true,
      type: Boolean,
    },
  },

  data: () => ({
    /**
     * @author Eder Ferraz Caciano
     * @summary optionsDefalt
     * @description Objeto padrão para carregamento do componente modal. Cada opção pode
     * ser passado de forma dinamica dentro da prop options.
     * Os valores aceitos na prop options são os mesmos da variavel optionsDefault.
     * Caso seja passado valor em options será renderizado, caso não o valor padrão será carregado.
     */
    optionsDefalt: {
      title: "Form Title",
      width: 600,
      loading: false,
      labelFooter: "",
      actions: [
        {
          title: "Salvar",
          color: "primary",
          dataCy: "btnSalvar",
          icon: "mdi-content-save",
          emit: "salvar",
          outlined: false,
        },
        {
          title: "Cancelar",
          color: "error",
          dataCy: "btnCancelar",
          icon: "mdi-cancel",
          emit: "input",
          outlined: false,
        },
      ],
    },
    toolbar: null,
    dialog: null,
    clickPosition: {
      x: null,
      y: null,
    },
    moving: false,
  }),

  watch: {
    value(val) {
      if (val) {
        this.$nextTick(() => {
          this.toolbar = document.querySelector(".ig-toolbar__custon");
          this.dialog = document.querySelector(".ig-dialog__custon");
          this.toolbar &&
            this.toolbar.addEventListener("mousedown", this.mouseDown);
        });
      } else {
        this.$nextTick(() => {
          this.toolbar &&
            this.toolbar.removeEventListener("mousedown", this.mouseDown);
          this.toolbar = null;
          this.dialog = null;
        });
      }
    },
  },

  destroyed() {
    window.removeEventListener("keydown", this.checkKeys);
  },

  mounted() {
    window.addEventListener("keydown", this.checkKeys);

    this.$nextTick(() => {
      this.toolbar = document.querySelector(".ig-toolbar__custon");
      this.dialog = document.querySelector(".ig-dialog__custon");
    });
  },

  methods: {
    checkKeys(event) {
      if (event.keyCode === 27) {
        // O evento input está sobrescrevendo o evento do componente pagina
        // Preciso descobrir uma forma de resolver isso
        // this.$emit('input', false)
      }
    },
    mouseDown(e) {
      this.moving = true;

      this.toolbar.classList.add("ig-dialog__moving");

      const toolbarRect = this.toolbar.getBoundingClientRect();

      this.clickPosition = {
        x: e.clientX - toolbarRect.left,
        y: e.clientY - toolbarRect.top,
      };

      document.addEventListener("mousemove", this.mouseMove);
      document.addEventListener("mouseup", this.mouseUp);
    },
    mouseMove(e) {
      const newPosition = {
        x: e.clientX - this.clickPosition.x,
        y: e.clientY - this.clickPosition.y,
      };
      this.dialog.style.left = `${newPosition.x}px`;
      this.dialog.style.top = `${newPosition.y}px`;

      this.checkBoundings();
    },
    mouseUp() {
      this.moving = false;

      this.toolbar.classList.remove("ig-dialog__moving");
      document.removeEventListener("mousemove", this.mouseMove);
      document.removeEventListener("mouseup", this.mouseUp);
    },
    checkBoundings() {
      const dialogRect = this.dialog.getBoundingClientRect();

      if (dialogRect.left < 0) {
        this.dialog.style.left = "0";
      }
      if (dialogRect.top < 0) {
        this.dialog.style.top = "0";
      }
      if (dialogRect.right > window.innerWidth) {
        this.dialog.style.left = `${window.innerWidth - dialogRect.width}px`;
      }
      if (dialogRect.bottom > window.innerHeight) {
        this.dialog.style.top = `${window.innerHeight - dialogRect.height}px`;
      }
    },
  },
};
</script>

<style>
.ig-dialog__custon {
  position: absolute;
  margin: 0;
}
.ig-dialog__moving {
  cursor: move !important;
  user-select: none !important;
}
.ig-no-transitions {
  transition: none !important;
}
</style>
