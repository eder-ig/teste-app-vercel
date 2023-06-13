<template>
  <div ref="container" class="v-data-table v-data-table--dense">
    <v-divider style="border-bottom: 1px solid #bbb" />
    <div
      ref="overflowContainer"
      class="v-data-table__wrapper my-table"
      style="height: 35px; max-height: 35px"
    >
      <table>
        <thead>
          <tr>
            <td
              v-for="header in headers"
              :key="header.value"
              :class="
                $vuetify.theme.dark
                  ? `white--text ${custonClass} text-${header.align}`
                  : `grey--text text--darken-2 ${custonClass} text-${header.align}`
              "
              :width="header.width ? header.width : ''"
              :style="{ minWidth: `${header.width}px` }"
              class="font-weight-black body px-1 mx-1"
            >
              {{ getColumnTotal(header.value) }}
            </td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponenteTotaisTable",

  props: {
    headers: {
      required: true,
      type: Array,
    },
    totais: {
      required: true,
      type: [Array, Object],
    },
    custonClass: {
      type: String,
      default: "",
    },
  },

  data: () => ({
    target: null,
    targetOverflow: null,
  }),

  mounted() {
    this.syncScrollbars();
  },

  methods: {
    getColumnTotal(key) {
      const column = this.totais.find((total) => total.key === key);

      if (column) {
        return column.value;
      }
    },
    syncScrollbars() {
      this.target = this.$refs.container;
      this.targetOverflow = this.$refs.overflowContainer;

      if (!this.target || !this.targetOverflow) return;

      const prev = this.target.previousElementSibling;

      prev.addEventListener("scroll", this.getScrollposition);
    },
    getScrollposition(e) {
      const valor = e.target.scrollLeft;

      this.targetOverflow.scrollTo(valor, 0);
    },
  },
};
</script>

<style lang="scss">
.my-table {
  overflow-x: hidden;
}
</style>
