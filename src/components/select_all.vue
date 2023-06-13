<template>
  <v-row dense>
    <v-col cols="12" class="py-1">
      <v-autocomplete
        v-model="vModel"
        :clearable="clearable"
        :dense="dense"
        :disabled="disabled"
        :error-messages="erro"
        :items="registros && registros.length ? registros : []"
        :item-text="itemText"
        :item-value="itemValue"
        :label="label"
        :multiple="multiple"
        :outlined="outlined"
        :solo="solo"
        hide-details
        no-data-text="Nada encontrado!"
        @input="$emit('input', vModel)"
      >
        <template v-if="vModel" v-slot:prepend-item>
          <v-list-item ripple @click="selecionarTodos()">
            <v-list-item-action>
              <v-icon :color="vModel.length > 0 ? 'primary' : ''">
                {{ icone }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Selecionar Todos </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="mt-2" />
        </template>
        <template v-slot:selection="{ item, index }">
          <span v-if="vModel.length === 1 && index === 0" class="body-2">
            {{ item[itemText] }}
          </span>
          <span v-if="registros.length !== vModel.length && index === 1">
            Vários
          </span>
          <span v-if="registros.length === vModel.length && index === 1">
            Todos
          </span>
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ComponenteVSelect",

  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    dense: {
      default: false,
      type: Boolean,
    },
    erro: {
      type: [String, Array],
      default: () => [],
    },
    clearable: {
      type: Boolean,
      defualt: false,
    },
    solo: {
      default: false,
      type: Boolean,
    },
    hideDetails: {
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
    label: {
      required: true,
      type: String,
    },
    multiple: {
      default: true,
      type: Boolean,
    },
    outlined: {
      default: false,
      type: Boolean,
    },
    value: {
      required: true,
      validator: function (value) {
        return (
          typeof value === "undefined" ||
          typeof value === "number" ||
          typeof value === "string" ||
          Array.isArray(value) ||
          value === null
        );
      },
    },
  },

  data: () => ({
    registros: [],
    vModel: [],
  }),

  computed: {
    icone() {
      if (this.tudoSelecionado) return "mdi-close-box";
      if (this.parcialSelecionado) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    tudoSelecionado() {
      return this.vModel.length === this.registros.length;
    },
    parcialSelecionado() {
      return this.vModel.length > 0 && !this.tudoSelecionado;
    },
  },

  watch: {
    items(valor) {
      setTimeout(() => {
        if (this.items && this.items.length) this.registros = this.items;
        else this.registros = [];
      }, 200);
    },
    value(valor) {
      if (this.value && this.value.length) {
        this.vModel = this.value;
      } else {
        this.vModel = [];
      }
    },
  },

  created() {
    setTimeout(() => {
      if (this.value && this.value.length) this.vModel = this.value;
      else this.vModel = [];

      if (this.items && this.items.length) this.registros = this.items;
      else this.registros = [];
    }, 600);
  },

  methods: {
    selecionarTodos() {
      if (this.tudoSelecionado || this.parcialSelecionado) {
        this.vModel = [];
        if (this.vModel.length) this.$emit("listar");
        this.$emit("input", this.vModel);
      } else {
        this.vModel = this.registros.map((element) => element[this.itemValue]);
        if (this.vModel.length) this.$emit("listar");
        this.$emit("input", this.vModel);
      }
    },
  },
};
</script>
