<template>
  <v-dialog
    v-model="dialog"
    width="600"
    :fullscreen="$vuetify.breakpoint.mobile"
  >
    <template v-slot:activator="{ on }">
      <slot :on="on" name="activator" />
    </template>
    <v-card>
      <v-toolbar class="mb-5" color="#e4e4e4" flat>
        <v-btn class="ml-0" icon @click="dialog = false">
          <v-icon size="40" color="#e74c3c"> mdi-close-circle </v-icon>
        </v-btn>
        <v-toolbar-title class="headline font-weight-bold">
          <span style="color: #333333">{{ label }}</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row class="mb-2" dense>
          <v-col cols="12">
            <input
              v-model="string"
              class="display elevation-3 px-5 mb-3"
              disabled
            />
          </v-col>
        </v-row>
        <div
          dense
          class="d-flex flex-wrap elevation-3"
          style="
            border-radius: 8px;
            width: 100%;
            border-radius: 4px;
            overflow: hidden;
          "
        >
          <v-col
            v-for="val in [
              7,
              8,
              9,
              4,
              5,
              6,
              1,
              2,
              3,
              'magnify',
              0,
              'backspace',
            ]"
            :key="val"
            cols="4"
            class="btn-container ma-0 pa-0"
          >
            <v-btn
              :color="
                val === 'magnify'
                  ? '#74b9ff'
                  : val === 'backspace'
                  ? '#ff7675'
                  : '#606060'
              "
              :disabled="
                (val === 'magnify' && !search) || (val === 0 && disableZero)
              "
              block
              class="btn elevation-0"
              height="100%"
              :style="{
                border: typeof val === 'number' ? '1px solid #848484' : '',
              }"
              tile
              x-large
              @click="handleKeypressed(val)"
            >
              <v-icon :size="typeof val === 'number' ? 60 : 40" color="#fff">
                {{
                  typeof val === "number" ? `mdi-numeric-${val}` : `mdi-${val}`
                }}
              </v-icon>
            </v-btn>
          </v-col>
        </div>
        <v-row>
          <v-col>
            <div style="display: flex">
              <v-col cols="4" class="py-0 pl-0 pr-1">
                <v-btn
                  color="#ff7675"
                  block
                  height="120"
                  @click="handleClose()"
                >
                  <b style="font-size: 40px; font-weight: bold; color: #fafafa">
                    C
                  </b>
                </v-btn>
              </v-col>
              <v-col cols="8" class="py-0 pr-0 pl-1">
                <v-btn
                  block
                  color="#68BBB6"
                  height="120"
                  @click="handleKeypressed('check')"
                >
                  <v-icon size="40" color="#fff"> mdi-check-bold </v-icon>
                </v-btn>
              </v-col>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ComponenteTeclado",
  props: {
    value: {
      required: true,
      validator: function (value) {
        return (
          typeof value === "undefined" ||
          typeof value === "number" ||
          typeof value === "string" ||
          value === null
        );
      },
    },
    label: {
      type: String,
      default: "Teclado",
    },
    search: {
      defalt: false,
      type: Boolean,
    },
    disableZero: {
      default: false,
      type: Boolean,
    },
  },
  data: () => ({
    dialog: false,
    string: "",
  }),
  computed: {},

  created() {
    this.string = "";
  },
  methods: {
    handleBackspace() {
      if (this.string.length) {
        this.string = this.string.slice(0, this.string.length - 1);
      }
    },
    handleClose() {
      this.dialog = false;
      this.string = "";
      this.$emit("input", this.string);
      this.$emit("cancel");
    },
    handleKeypressed(key) {
      if (typeof key === "number") {
        this.string = `${this.string}${key}`;
      } else if (typeof key === "string" && key === "backspace") {
        this.handleBackspace();
      } else if (typeof key === "string" && key === "magnify") {
        this.string = "";
        this.dialog = false;
        this.$emit("search");
      } else if (typeof key === "string" && key === "check") {
        this.dialog = false;
        if (this.string.length) {
          this.updateString();
          this.$emit("confirm");
        }
      }
    },
    updateString() {
      this.$emit("input", this.string);
      this.string = "";
    },
  },
};
</script>

<style lang="scss">
.display {
  width: 100%;
  height: 100px;
  border-radius: 4px;
  font-size: 42px;
  padding: 10px;
}
.btn-container {
  height: 120px;
}
</style>
