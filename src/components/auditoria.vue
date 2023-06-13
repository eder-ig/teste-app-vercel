<template>
  <v-footer color="transparent" dense>
    <v-spacer />
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <span
          class="text-caption font-weight-medium"
          style="cursor: help"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small color="primary"> mdi-shield-edit-outline </v-icon>
          <span v-if="auditoria && auditoria.length"> {{ auditoria }} </span>
          <span
            v-if="
              usuarioAuditoria &&
              usuarioAuditoria.length &&
              dataAuditoria &&
              dataAuditoria.length
            "
            >{{ usuarioAuditoria }} | {{ dataAuditoria }} | ID: {{ id }}</span
          >
        </span>
      </template>
      <span> Última alteração </span>
    </v-tooltip>
  </v-footer>
</template>

<script>
export default {
  name: "ComponenteAuditoria",
  props: {
    dataAuditoria: {
      type: String,
      default: "",
    },
    usuarioAuditoria: {
      type: String,
      default: "",
    },
    id: {
      type: [String, Number],
      default: "",
    },
    auditoria: {
      type: String,
      default: "",
    },
  },
};
</script>

<style></style>
