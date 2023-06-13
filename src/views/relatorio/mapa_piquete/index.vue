<template>
  <pagina
    :formulario="false"
    :loading="loading"
    subtitulo="Lotes ativos no curral"
    titulo="Mapa do Curral"
  >
    <aviso
      v-model="aviso.modal"
      :options="aviso"
      @sim="aviso = { modal: false, key: null, text: '' }"
    />

    <template slot="listagem">
      <v-toolbar class="mt-2 mb-1" dense elevation="3" width="100%">
        <v-toolbar-title class="pa-0"> Mapa do Curral </v-toolbar-title>

        <v-divider class="mx-4" inset vertical />

        <div v-if="!$vuetify.breakpoint.mobile" style="width: 200px">
          <v-text-field
            v-model="searchCurral"
            v-mask="mascara('T', 20)"
            dense
            hide-details
            label="Pesquisar Lote"
            outlined
          />
        </div>

        <div
          v-if="!$vuetify.breakpoint.mobile"
          style="width: 200px"
          class="mx-2"
        >
          <v-select
            v-model="agendaTratoSelecionada"
            :items="agendasTrato"
            clearable
            hide-details
            dense
            item-value="hora"
            item-text="hora"
            label="Agenda"
            outlined
          />
        </div>

        <v-spacer v-if="!$vuetify.breakpoint.mobile" />

        <v-chip-group
          v-if="!$vuetify.breakpoint.mobile"
          v-model="dietaSelecionada"
        >
          <v-chip
            v-for="(item, idx) in dietas"
            :key="idx"
            :color="$vuetify.theme.dark ? '' : item.color || 'primary'"
            :text-color="
              Number(item.id) === dietaSelecionadaId ? 'white' : 'primary'
            "
            :outlined="item.id !== dietaSelecionadaId"
            class="mr-2 mt-1"
          >
            <span>
              Dieta:<b class="pl-1">{{ item.descricao }}</b>
            </span>
          </v-chip>
        </v-chip-group>

        <v-spacer />
        <v-chip
          v-if="!$vuetify.breakpoint.mobile"
          :color="$vuetify.theme.dark ? '' : 'primary'"
          class="mr-2 mt-1"
          text-color="primary"
          outlined
        >
          <span>
            Capacidade:<b class="pl-1">{{ totais.capacidadeMaxima }}</b>
          </span>
        </v-chip>
        <v-chip
          v-if="!$vuetify.breakpoint.mobile"
          :color="$vuetify.theme.dark ? '' : 'primary'"
          class="mr-2 mt-1"
          text-color="primary"
          outlined
        >
          <span>
            Total Animais:<b class="pl-1">{{ totais.totalAnimais }}</b>
          </span>
        </v-chip>

        <v-btn icon title="Mover Para Esquerda" @click="navegarMapa('left')">
          <v-icon> mdi-chevron-double-left </v-icon>
        </v-btn>
        <v-btn icon title="Mover Para Direita" @click="navegarMapa('rigth')">
          <v-icon> mdi-chevron-double-right </v-icon>
        </v-btn>
        <v-btn icon title="Mover Para Baixo" @click="navegarMapa('bottom')">
          <v-icon> mdi-chevron-double-down </v-icon>
        </v-btn>
        <v-btn icon title="Mover Para Cima" @click="navegarMapa('top')">
          <v-icon> mdi-chevron-double-up </v-icon>
        </v-btn>
        <v-btn
          :loading="loadingZoom"
          icon
          title="Aumentar Zoom (ctrl +)"
          @click.stop="zoomMais()"
        >
          <v-icon> mdi-magnify-plus-outline </v-icon>
        </v-btn>
        <span class="pa-2">
          {{ zoom === 0 ? "100%" : (zoom * 100).toFixed(0) + "%" }}
        </span>
        <v-btn
          :loading="loadingZoom"
          icon
          title="Diminuir Zoom (ctrl -)"
          @click.stop="zoomMenos()"
        >
          <v-icon> mdi-magnify-minus-outline </v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          outlined
          title="Atualizar Mapa"
          @click.stop="listar()"
        >
          <v-icon> mdi-restart </v-icon>
          Atualizar
        </v-btn>
      </v-toolbar>

      <!-- TODO: Mapa Do Curral -->
      <v-card
        ref="scroll"
        class="overflow-auto"
        dense
        height="79vh"
        style="position: relative !important"
        width="100%"
      >
        <div :style="`zoom:${zoom} !important;`" class="text-center">
          <v-row
            v-for="(pavilhao, idx) in registros"
            :key="idx"
            :style="`width: 450vw !important`"
            class="pa-10"
          >
            <table>
              <tbody>
                <tr>
                  <td
                    v-for="(lado, i) in pavilhao.ladoEsquerdo"
                    :key="i"
                    :colspan="lado.colspan"
                    :style="
                      $vuetify.theme.dark
                        ? 'border: 1px dashed white; margin: 0px'
                        : 'border: 1px dashed grey; margin: 0px'
                    "
                    class="pa-0"
                  >
                    <v-card
                      :class="searchCurral"
                      :width="350 * lado.colspan"
                      dense
                      flat
                      min-height="150"
                      style="border-radius: 0px"
                    >
                      <v-card-title
                        class="display-1 justify-center font-weight-bold text-center pb-0"
                      >
                        {{ lado.codigo }}
                      </v-card-title>
                      <v-card-text class="caption" style="min-height: 60px">
                        <v-row dense>
                          <v-col cols="12">
                            <v-btn
                              v-if="lado.loteId"
                              :color="
                                (dietas &&
                                  lado.loteId &&
                                  dietas.find(
                                    (el) => el.id === lado.loteDietaId
                                  ).color) ||
                                'green darken-4'
                              "
                              :title="'Abrir lote:' + ' ' + lado.loteDescricao"
                              :text="
                                lado.loteId &&
                                searchCurral !== lado.loteDescricao &&
                                Number(lado.loteDietaId) !==
                                  Number(dietaSelecionadaId)
                              "
                              :class="
                                (lado.loteId &&
                                  searchCurral === lado.loteDescricao) ||
                                Number(lado.loteDietaId) ===
                                  Number(dietaSelecionadaId)
                                  ? 'white--text'
                                  : ''
                              "
                              block
                              class="justify-space-between font-weight-bold my-1 subtitle-1"
                              small
                              @click="abrirLote(lado.loteId)"
                            >
                              {{ lado.loteId && lado.loteDescricao }}
                              <v-chip
                                v-if="
                                  lado.loteId &&
                                  lado.loteQuantidadeAnimais !== 0
                                "
                                :color="
                                  $vuetify.theme.dark ? '' : 'green darken-4'
                                "
                                class="white--text subtitle-1"
                                small
                                text
                              >
                                {{ lado.loteId && lado.loteQuantidadeAnimais }}
                              </v-chip>
                              <span v-else class="ml-2"> 0 </span>
                            </v-btn>
                          </v-col>
                          <v-col v-if="lado.tratos.length" cols="12">
                            <!-- <v-card outlined>
                              <v-card-text class="py-0">
                                <div class="d-flex justify-space-between px-4">
                                  Previsto Dia:
                                  <span>
                                    {{
                                      lado.tratos[0]
                                        .tratoQuantidadeMassaOriginal
                                    }}</span
                                  >
                                </div>
                                <div class="d-flex justify-space-between px-4">
                                  Previsto Corrigido Dia:
                                  <span>
                                    {{
                                      lado.tratos[0]
                                        .tratoQuantidadeMassaOriginalCorrigida
                                    }}</span
                                  >
                                </div>
                                <div class="d-flex justify-space-between px-4">
                                  Realizado Dia:
                                  <span>
                                    {{
                                      lado.tratos[0]
                                        .tratoQuantidadeMassaOriginalAtendido
                                    }}</span
                                  >
                                </div>
                              </v-card-text>
                            </v-card> -->
                            <v-card
                              v-for="(trato, idtr) in agendaTratoSelecionada
                                ? lado.tratos.filter(
                                    (el) =>
                                      el.agendaHora === agendaTratoSelecionada
                                  )
                                : lado.tratos"
                              :key="idtr"
                              outlined
                              class="mt-2"
                            >
                              <v-card-title
                                class="caption justify-center py-0 orange--text text--darken-3 font-weight-bold"
                              >
                                {{ trato.agendaHora }}
                              </v-card-title>
                              <v-divider />
                              <v-simple-table dense>
                                <template v-slot:default>
                                  <thead class="py-0">
                                    <tr>
                                      <th class="text-end caption px-1">
                                        Previsto
                                      </th>
                                      <th class="text-end caption px-1">
                                        Pre. Corrigido
                                      </th>
                                      <th class="text-end caption px-1">
                                        Realizado
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td class="text-end caption px-1">
                                        {{ trato.quantidadeMassaOriginal }}
                                      </td>
                                      <td class="text-end caption px-1">
                                        {{
                                          trato.quantidadeMassaOriginalCorrigida
                                        }}
                                      </td>
                                      <td class="text-end caption px-1">
                                        {{
                                          trato.quantidadeRealMassaOriginalTrato
                                        }}
                                      </td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>

                      <v-card-text class="body-2 py-0">
                        <span class="back--text font-weight-bold">
                          Dieta:
                          {{ lado.loteDietaDescricao }}
                        </span>
                      </v-card-text>

                      <v-card-text class="body-2 py-0">
                        <span class="back--text font-weight-bold">
                          Data Entrada:
                          {{ lado.loteDataEntrada }}
                        </span>
                      </v-card-text>

                      <v-card-text class="body-2 py-0">
                        <span class="back--text font-weight-bold">
                          Animais:
                          {{ lado.loteQuantidadeAnimais }}
                        </span>
                      </v-card-text>

                      <v-card-actions class="py-0 justify-center">
                        <v-btn
                          text
                          title="Abrir Piquete"
                          @click="abrirPiquete(lado.piqueteId)"
                        >
                          <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      border-top: 10px solid grey;
                      border-bottom: 10px solid grey;
                    "
                    colspan="12"
                  >
                    <div class="pa-4 grey lighten-2 title">
                      Rua {{ pavilhao.pavilhao }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    v-for="(lado, i) in pavilhao.ladoDireito"
                    :key="i"
                    :colspan="lado.colspan"
                    :style="
                      $vuetify.theme.dark
                        ? 'border: 1px dashed white; margin: 0px'
                        : 'border: 1px dashed grey; margin: 0px'
                    "
                    class="pa-0"
                  >
                    <v-card
                      :class="searchCurral"
                      :width="350 * lado.colspan"
                      dense
                      flat
                      min-height="150"
                      style="border-radius: 0px"
                    >
                      <v-card-title
                        class="display-1 justify-center font-weight-bold text-center pb-0"
                      >
                        {{ lado.codigo }}
                      </v-card-title>
                      <v-card-text class="caption" style="min-height: 60px">
                        <v-row dense>
                          <v-col cols="12">
                            <v-btn
                              v-if="lado.loteId"
                              :color="
                                (dietas &&
                                  lado.loteId &&
                                  dietas.find(
                                    (el) => el.id === lado.loteDietaId
                                  ).color) ||
                                'green darken-4'
                              "
                              :title="'Abrir lote:' + ' ' + lado.loteDescricao"
                              :text="
                                lado.loteId &&
                                searchCurral !== lado.loteDescricao &&
                                Number(lado.loteDietaId) !==
                                  Number(dietaSelecionadaId)
                              "
                              :class="
                                (lado.loteId &&
                                  searchCurral === lado.loteDescricao) ||
                                Number(lado.loteDietaId) ===
                                  Number(dietaSelecionadaId)
                                  ? 'white--text'
                                  : ''
                              "
                              block
                              class="justify-space-between font-weight-bold my-1 subtitle-1"
                              small
                              @click="abrirLote(lado.loteId)"
                            >
                              {{ lado.loteId && lado.loteDescricao }}
                              <v-chip
                                v-if="
                                  lado.loteId &&
                                  lado.loteQuantidadeAnimais !== 0
                                "
                                :color="
                                  $vuetify.theme.dark ? '' : 'green darken-4'
                                "
                                class="white--text subtitle-1"
                                small
                                text
                              >
                                {{ lado.loteId && lado.loteQuantidadeAnimais }}
                              </v-chip>
                              <span v-else class="ml-2"> 0 </span>
                            </v-btn>
                          </v-col>
                          <v-col v-if="lado.tratos.length" cols="12">
                            <!-- <v-card outlined>
                              <v-card-text class="py-0">
                                <div class="d-flex justify-space-between px-4">
                                  Previsto Dia:
                                  <span>
                                    {{
                                      lado.tratos[0]
                                        .tratoQuantidadeMassaOriginal
                                    }}</span
                                  >
                                </div>
                                <div class="d-flex justify-space-between px-4">
                                  Previsto Corrigido Dia:
                                  <span>
                                    {{
                                      lado.tratos[0]
                                        .tratoQuantidadeMassaOriginalCorrigida
                                    }}</span
                                  >
                                </div>
                                <div class="d-flex justify-space-between px-4">
                                  Realizado Dia:
                                  <span>
                                    {{
                                      lado.tratos[0]
                                        .tratoQuantidadeMassaOriginalAtendido
                                    }}</span
                                  >
                                </div>
                              </v-card-text>
                            </v-card> -->
                            <v-card
                              v-for="(trato, idtr) in agendaTratoSelecionada
                                ? lado.tratos.filter(
                                    (el) =>
                                      el.agendaHora === agendaTratoSelecionada
                                  )
                                : lado.tratos"
                              :key="idtr"
                              outlined
                              class="mt-2"
                            >
                              <v-card-title
                                class="caption justify-center py-0 orange--text text--darken-3 font-weight-bold"
                              >
                                {{ trato.agendaHora }}
                              </v-card-title>
                              <v-divider />
                              <v-simple-table dense>
                                <template v-slot:default>
                                  <thead class="py-0">
                                    <tr>
                                      <th class="text-end caption px-1">
                                        Previsto
                                      </th>
                                      <th class="text-end caption px-1">
                                        Pre. Corrigido
                                      </th>
                                      <th class="text-end caption px-1">
                                        Realizado
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td class="text-end caption px-1">
                                        {{ trato.quantidadeMassaOriginal }}
                                      </td>
                                      <td class="text-end caption px-1">
                                        {{
                                          trato.quantidadeMassaOriginalCorrigida
                                        }}
                                      </td>
                                      <td class="text-end caption px-1">
                                        {{
                                          trato.quantidadeRealMassaOriginalTrato
                                        }}
                                      </td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>

                      <v-card-text class="body-2 py-0">
                        <span class="back--text font-weight-bold">
                          Dieta:
                          {{ lado.loteDietaDescricao }}
                        </span>
                      </v-card-text>

                      <v-card-text class="body-2 py-0">
                        <span class="back--text font-weight-bold">
                          Data Entrada:
                          {{ lado.loteDataEntrada }}
                        </span>
                      </v-card-text>

                      <v-card-text class="body-2 py-0">
                        <span class="back--text font-weight-bold">
                          Animais:
                          {{ lado.loteQuantidadeAnimais }}
                        </span>
                      </v-card-text>

                      <v-card-actions class="py-0 justify-center">
                        <v-btn
                          text
                          title="Abrir Piquete"
                          @click="abrirPiquete(lado.piqueteId)"
                        >
                          <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-row>
        </div>
      </v-card>
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "RelatorioMapaPiquete",

  data: () => ({
    aviso: {
      modal: false,
      key: null,
      text: "",
    },
    searchCurral: null,
    curralSelecionado: null,
    loading: false,
    zoom: 0.8,
    loadingZoom: false,
    dietaSelecionada: null,
    agendaTratoSelecionada: null,
  }),

  computed: {
    ...mapState("relatorioMapaPiquete", [
      "registros",
      "totais",
      "dietas",
      "agendasTrato",
    ]),
    curralDropdownFiltered() {
      return this.searchCurral
        ? this.registros.filter((el) =>
            [this.searchCurral].includes(String(el.loteDescricao))
          )
        : this.registros;
    },
    dietaSelecionadaId() {
      if (![null, undefined].includes(this.dietaSelecionada)) {
        return this.dietas[this.dietaSelecionada].id;
      } else return null;
    },
  },

  async created() {
    await this.listar();
  },

  destroyed() {
    window.removeEventListener("keydown", this.verificarTeclas);
    window.removeEventListener("wheel", this.verificarScroll);
  },

  mounted() {
    window.addEventListener("keydown", this.verificarTeclas);
    window.addEventListener("wheel", this.verificarScroll, { passive: false });
  },

  methods: {
    ...mapActions("relatorioMapaPiquete", ["listar"]),
    navegarMapa(direction) {
      if (direction === "left")
        this.$refs.scroll.$el.scrollLeft =
          this.$refs.scroll.$el.scrollLeft - 60;
      else if (direction === "rigth")
        this.$refs.scroll.$el.scrollLeft =
          this.$refs.scroll.$el.scrollLeft + 60;
      else if (direction === "top")
        this.$refs.scroll.$el.scrollTop = this.$refs.scroll.$el.scrollTop - 60;
      else if (direction === "bottom")
        this.$refs.scroll.$el.scrollTop = this.$refs.scroll.$el.scrollTop + 60;
    },
    verificarScroll(event) {
      if (event.ctrlKey && event.wheelDeltaY > 0) {
        event.preventDefault();
        this.zoomMais();
      } else if (event.ctrlKey && event.wheelDeltaY < 0) {
        event.preventDefault();
        this.zoomMenos();
      }
    },
    verificarTeclas(event) {
      if (event.ctrlKey === true && event.keyCode === 107) {
        event.preventDefault();
        this.zoomMais();
      } else if (event.ctrlKey === true && event.keyCode === 109) {
        event.preventDefault();
        this.zoomMenos();
      }
    },
    zoomMais() {
      this.loadingZoom = true;
      setTimeout(() => {
        this.zoom =
          this.zoom === 0 ? (this.zoom = 1.1) : (this.zoom = this.zoom + 0.1);
        this.loadingZoom = false;
      }, 50);
    },
    zoomMenos() {
      this.loadingZoom = true;
      setTimeout(() => {
        this.zoom =
          this.zoom === 0 ? (this.zoom = 0.9) : (this.zoom = this.zoom - 0.1);
        this.loadingZoom = false;
      }, 50);
    },

    abrirLote(loteId) {
      const route = this.$router.resolve({
        name: "Lotes",
        query: {
          id: loteId || undefined,
          exibir: true,
        },
      });

      window.open(route.href, "_blank");
    },
    abrirPiquete(piqueteId) {
      const route = this.$router.resolve({
        name: "Piquete",
        query: {
          id: piqueteId || undefined,
          exibir: true,
        },
      });

      window.open(route.href, "_blank");
    },
  },
};
</script>
