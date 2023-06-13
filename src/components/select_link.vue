<template>
  <v-row dense>
    <v-col cols="12" class="py-1">
      <v-autocomplete
        v-model="model"
        :items="items"
        :clearable="clearable"
        :disabled="disabled"
        :data-cy="dataCy"
        :error-messages="parentErrors"
        :dense="dense"
        :item-value="itemValue"
        :item-text="itemText"
        :label="label"
        :multiple="multiple"
        :outlined="outlined"
        :rounded="rounded"
        hide-details
        no-data-text="Nada encontrado!"
        @input="$emit('input', model)"
      >
        <template v-slot:append-item>
          <v-divider class="my-0" />

          <v-row dense>
            <v-col cols="6" class="px-0">
              <v-list-item
                class="grey lighten-3 px-1"
                ripple
                @click="abrirLink()"
              >
                <v-list-item-action class="px-0 mx-1 my-0">
                  <v-icon
                    :color="$vuetify.theme.dark ? 'green darken-4' : 'primary'"
                  >
                    mdi-plus-box
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content class="px-0 mx-0 my-0">
                  <v-list-item-title>
                    <span
                      :class="
                        $vuetify.theme.dark ? 'green--text text--darken-4' : ''
                      "
                      >Adicionar</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="6" class="px-0">
              <v-list-item
                class="grey lighten-3 px-1"
                ripple
                @click="$emit('atualizar')"
              >
                <v-list-item-action class="px-0 mx-1 my-0">
                  <v-icon
                    :color="$vuetify.theme.dark ? 'green darken-4' : 'primary'"
                  >
                    mdi-refresh
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content class="px-0 mx-0 my-0">
                  <v-list-item-title>
                    <span
                      :class="
                        $vuetify.theme.dark ? 'green--text text--darken-4' : ''
                      "
                      >Atualizar</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>

          <v-divider class="my-0" />
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ComponenteSelectLink",

  props: {
    clearable: {
      default: false,
      type: Boolean,
    },
    dense: {
      default: false,
      type: Boolean,
    },
    dataCy: {
      default: "",
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    items: {
      required: true,
      validator: function (value) {
        return (
          typeof value === "undefined" || Array.isArray(value) || value === null
        );
      },
    },
    itemText: {
      default: "",
      type: String,
    },
    itemValue: {
      default: "",
      type: String,
    },
    hideDetails: {
      default: false,
      type: Boolean,
    },
    label: {
      default: "Descrição",
      type: String,
    },
    multiple: {
      default: false,
      type: Boolean,
    },
    outlined: {
      default: false,
      type: Boolean,
    },
    rota: {
      default: () => {},
      type: Object,
    },
    rounded: {
      default: false,
      type: Boolean,
    },
    value: {
      default: null,
      validator: function (value) {
        return (
          typeof value === "object" ||
          typeof value === "undefined" ||
          typeof value === "string" ||
          typeof value === "number" ||
          value === null
        );
      },
    },
  },

  data: () => ({
    model: null,
  }),

  computed: {
    parentErrors() {
      if (this.$attrs["error-messages"]) {
        return this.$attrs["error-messages"];
      } else return [];
    },
  },

  watch: {
    value(v) {
      this.model = v;
    },
  },

  created() {
    this.model = this.value;
  },

  methods: {
    abrirLink() {
      if (this.rota) {
        const route = this.$router.resolve(this.rota);
        window.open(route.href, "_blank");
      } else {
        this.$notificacao("Página de cadastro não informada!", "erro");
      }
    },
  },
};
</script>
