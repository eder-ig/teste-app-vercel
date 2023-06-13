<template>
  <div>
    <loading :value="loading" />
    <v-row
      :class="
        $vuetify.breakpoint.mobile
          ? $vuetify.theme.dark
            ? 'accent ma-0'
            : 'ma-0 grey lighten-4'
          : $vuetify.theme.dark
          ? 'accent ma-0 justify-center'
          : 'justify-center grey lighten-4'
      "
      :style="
        $vuetify.theme.dark
          ? ''
          : 'border-bottom: solid #ECEFF1 2px !important;'
      "
      dense
    >
      <v-col
        :class="$vuetify.breakpoint.mobile ? 'pt-0 mt-0 px-4' : 'px-4 pb-0'"
        :cols="$vuetify.breakpoint.mobile ? 12 : cols"
        class="text--center"
      >
        <v-container
          v-if="titulo && subtitulo"
          :style="
            $vuetify.theme.dark
              ? ''
              : 'border-left: solid 1px #ECEFF1 !important; border-right: solid 1px #ECEFF1 !important;'
          "
          class="py-0 px-3 elevation-0"
          fluid
        >
          <div class="headline font-weight-regular">
            <b>{{ titulo }}</b>
            <span
              v-if="!$vuetify.breakpoint.xs"
              class="body-1 font-weight-mediun"
            >
              | {{ subtitulo }}
            </span>
          </div>
          <v-spacer v-if="campoObrigatorioTitle && !$vuetify.breakpoint.xs" />
          <span
            v-if="campoObrigatorioTitle && !$vuetify.breakpoint.xs"
            class="caption pl-2 font-weight-bold"
          >
            <span class="red--text subtitle-1">*</span>
            Campos obrigatórios
          </span>
        </v-container>
      </v-col>
      <!-- <v-spacer />
      <v-col
        v-if="campoObrigatorioTitle && !$vuetify.breakpoint.xs"
        class="text-end px-5"
        cols="12"
        sm="auto"
      >
        <span class="caption pl-2 font-weight-bold">
          <span class="red--text subtitle-1">*</span>
          Campos obrigatórios
        </span>
      </v-col> -->
    </v-row>
    <v-row
      :class="$vuetify.breakpoint.mobile ? 'ma-0' : 'justify-center'"
      dense
    >
      <v-col cols="12" class="pb-0 mb-0">
        <slot />
      </v-col>
      <v-col
        :cols="$vuetify.breakpoint.mobile ? 12 : cols"
        :class="$vuetify.breakpoint.mobile ? 'pt-0 mt-0' : ''"
      >
        <v-container
          v-if="formulario"
          :class="
            formulario && !$vuetify.breakpoint.mobile
              ? 'pt-0 pb-0 mb-0'
              : $vuetify.breakpoint.mobile
              ? 'pa-0 mb-0'
              : 'pa-0 mb-0'
          "
          fluid
          grid-list-xs
        >
          <v-card
            v-if="formulario"
            class="elevation-1 pa-0"
            style="border-radius: 0px; !important;"
          >
            <v-toolbar
              :class="
                $vuetify.theme.dark || colorToolbar
                  ? 'white--text'
                  : 'grey--text text--darken-2'
              "
              :color="
                $vuetify.theme.dark
                  ? colorToolbar || 'accent'
                  : colorToolbar || 'white'
              "
              :height="$vuetify.breakpoint.mobile ? 45 : 33"
              class="font-weight-bold"
              flat
            >
              <v-btn
                v-if="fechar"
                :color="colorToolbar ? 'white' : 'error'"
                :small="!$vuetify.breakpoint.mobile"
                data-cy="btnFechar"
                title="Voltar"
                @click="$emit('fechar')"
              >
                <v-icon dark> mdi-arrow-left-bold </v-icon>
              </v-btn>
              <v-toolbar-title class="px-2">
                {{ tituloToolbar }}
              </v-toolbar-title>
              <slot name="titulo" />
              <v-spacer />
              <slot name="botoes" />
              <v-menu v-if="maisOpcoes" offset-y left>
                <template v-slot:activator="{ on }">
                  <v-tooltip activator="#pg-btn-mais-opcoes" bottom>
                    <span>Mais Opções</span>
                  </v-tooltip>
                  <v-btn
                    id="pg-btn-mais-opcoes"
                    :color="
                      $vuetify.theme.dark || colorToolbar
                        ? 'white'
                        : 'primary darken-1'
                    "
                    :loading="loading"
                    :small="!$vuetify.breakpoint.mobile"
                    class="mx-0"
                    dark
                    data-cy="btnMaisOpcoes"
                    outlined
                    v-on="on"
                  >
                    <v-icon> mdi-dots-vertical </v-icon>
                    Mais Opções
                  </v-btn>
                </template>
                <slot name="maisOpcoes" />
              </v-menu>
            </v-toolbar>
            <v-divider />
            <v-card-text class="pa-0 pr-1">
              <slot name="formulario" />
            </v-card-text>
            <v-divider v-if="acaoForm" />
            <v-card-actions
              v-if="acaoForm"
              :class="$vuetify.breakpoint.xs ? '' : 'py-1 pr-2 mx-2'"
            >
              <v-row class="pa-0 justify-end" dense>
                <v-col
                  cols="12"
                  sm="auto"
                  :class="$vuetify.breakpoint.xs ? '' : 'd-flex justify-end'"
                >
                  <slot name="acao" />
                </v-col>
                <v-col
                  v-if="!salvar"
                  cols="12"
                  sm="auto"
                  class="d-flex justify-end"
                >
                  <v-btn
                    :block="$vuetify.breakpoint.xsOnly"
                    :class="$vuetify.breakpoint.xsOnly ? 'my-1' : 'mx-1'"
                    :color="$vuetify.theme.dark ? 'accent' : 'primary'"
                    :large="$vuetify.breakpoint.mobile"
                    dark
                    data-cy="btnEditar"
                    @click="$emit('editar')"
                  >
                    <v-icon left size="20"> mdi-pencil </v-icon>
                    Editar
                  </v-btn>
                </v-col>
                <v-col
                  v-if="!editar"
                  cols="12"
                  sm="auto"
                  class="d-flex justify-end"
                >
                  <v-btn
                    :block="$vuetify.breakpoint.xsOnly"
                    :class="$vuetify.breakpoint.xsOnly ? 'my-1' : 'mx-1'"
                    :color="$vuetify.theme.dark ? 'accent' : 'primary'"
                    :large="$vuetify.breakpoint.mobile"
                    dark
                    data-cy="btnSalvar"
                    @click="$emit('salvar')"
                  >
                    <v-icon left size="20"> mdi-content-save </v-icon>
                    {{ salvarText }}
                  </v-btn>
                </v-col>
                <v-col
                  v-if="cancelar"
                  cols="12"
                  sm="auto"
                  class="d-flex justify-end"
                >
                  <v-btn
                    :block="$vuetify.breakpoint.xsOnly"
                    :large="$vuetify.breakpoint.mobile"
                    color="error"
                    dark
                    data-cy="btnCancelar"
                    @click="$emit('cancelar')"
                  >
                    <v-icon left size="20"> mdi-cancel </v-icon>
                    {{ cancelarTitle }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
          <div class="pt-4">
            <slot name="relacionamento" />
          </div>
        </v-container>
        <v-container
          v-if="!formulario"
          :class="$vuetify.breakpoint.xs ? 'px-0' : ''"
          class="mt-0 pt-0"
          fluid
          grid-list-xs
        >
          <slot name="listagem" />
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ComponentePagina",

  props: {
    acaoForm: {
      default: true,
      type: Boolean,
    },
    campoObrigatorioTitle: {
      default: true,
      type: Boolean,
    },
    cancelarTitle: {
      default: "Cancelar",
      type: String,
    },
    cancelar: {
      default: true,
      type: Boolean,
    },
    colorToolbar: {
      default: "",
      type: String,
    },
    cols: {
      default: 12,
      type: Number,
    },
    editar: {
      default: true,
      type: Boolean,
    },
    fechar: {
      default: false,
      type: Boolean,
    },
    formulario: {
      required: true,
      type: Boolean,
    },
    loading: {
      default: false,
      type: Boolean,
    },
    maisOpcoes: {
      default: false,
      type: Boolean,
    },
    salvar: {
      default: true,
      type: Boolean,
    },
    salvarText: {
      default: "Salvar",
      type: String,
    },
    subtitulo: {
      default: "",
      type: String,
    },
    titulo: {
      default: "",
      type: String,
    },
    tituloToolbar: {
      default: "",
      type: String,
    },
  },
};
</script>
