<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        :data-cy="dataCy"
        v-bind="$attrs"
        v-on="on"
        @click="$emit('click')"
      >
        <v-icon v-if="icone">
          {{ icone }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ tooltipLabel }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "ComponenteBotoTooltip",
  props: {
    icone: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 20,
    },
    tooltipLabel: {
      type: String,
      required: true,
    },
    dataCy: {
      type: String,
      required: false,
      default: "tooltip-btn",
    },
  },
};
</script>
