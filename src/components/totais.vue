<template>
  <div>
    <v-divider color="#ddd" />
    <v-row class="ma-0">
      <v-col cols="12 ma-0 pa-0">
        <v-card
          :flat="flat"
          class="pb-1"
          height="100%"
          width="100%"
          style="border-radius: 0px"
        >
          <v-chip
            class="mr-2 mt-1"
            :color="$vuetify.theme.dark ? '' : ''"
            label
            text-color="primary"
            style="border-radius: 0px !important"
          >
            <span class="pl-0 py-1 pr-2 title">
              <i>Totais:</i>
            </span>
          </v-chip>
          <v-chip
            v-for="(registro, index) in items"
            :key="index"
            :color="$vuetify.theme.dark ? '' : ''"
            class="mr-2 mt-1"
            text-color="primary"
          >
            <span :class="registro.color ? `${registro.color}--text` : ''">
              {{ registro.text }}:<b class="pl-1">{{ registro.value }}</b>
            </span>
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ComponenteTotais",

  props: {
    items: {
      required: true,
      type: Array,
    },
    flat: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
