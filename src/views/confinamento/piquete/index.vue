<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    :mais-opcoes="!controle.inserir"
    subtitulo="Listagem dos piquetes"
    titulo-toolbar="Informações do Piquete"
    titulo="Piquetes"
    fechar
    @cancelar="resetFormulario()"
    @editar="(controle.exibir = false), (controle.editar = true)"
    @fechar="resetFormulario()"
    @salvar="salvarRegistro()"
  >
    <aviso
      v-model="aviso.modal"
      :options="aviso"
      @sim="aviso = { modal: false, key: null, text: '' }"
      @excluir="
        (aviso = { modal: false, key: null, text: '' }), excluirRegistro()
      "
    />

    <template slot="formulario">
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observer">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.id"
                  disabled
                  hide-details
                  dense
                  label="Piquete"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.codigo"
                  v-mask="mascara('T', 250)"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Código"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Linha"
                  rules="required"
                  vid="linha"
                >
                  <v-autocomplete
                    v-model="formulario.linhaId"
                    :items="linhas"
                    :error-messages="errors"
                    :disabled="controle.exibir"
                    item-text="descricao"
                    item-value="id"
                    class="required"
                    dense
                    hide-details
                    label="Linha"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.areaTotal"
                  v-mask="'########'"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Area m2"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.capacidadeMaxima"
                  v-mask="'########'"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Capacidade Máxima"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.capacidadeIdeal"
                  v-mask="'########'"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Capacidade Ideal"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.tamanhoCocho"
                  v-mask="'########'"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Tamanho Cocho (m)"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Tag Inicio"
                  rules="required"
                  vid="tagInicio"
                >
                  <v-text-field
                    v-model="formulario.tagInicio"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Tag Inicio"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Tag Fim"
                  rules="required"
                  vid="tagFinal"
                >
                  <v-text-field
                    v-model="formulario.tagFinal"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Tag Fim"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </template>

    <template slot="maisOpcoes">
      <v-list class="pa-0" dense>
        <v-list-item
          @click="
            aviso = {
              modal: true,
              key: 'excluir',
              text: 'Deseja realmente excluir esse registro?',
            }
          "
        >
          <v-list-item-icon class="mr-3">
            <v-icon color="primary"> mdi-delete </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Excluir registro </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <template slot="listagem">
      <filtro
        v-if="!$vuetify.breakpoint.mobile"
        :options="optionsFilter"
        @adicionar="(modal = true), (controle.inserir = true)"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row class="pa-0" dense>
              <v-col cols="12" xl="6" lg="6" md="6" xs="12">
                <v-text-field
                  v-model="filtro.codigo"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Código"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
              <v-col cols="12" xl="6" lg="6" md="6" xs="12">
                <v-autocomplete
                  v-model="filtro.linhaId"
                  :items="linhas"
                  :disabled="controle.exibir"
                  item-text="descricao"
                  item-value="id"
                  dense
                  hide-details
                  label="Linha"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="filtro.tagInicio"
                  hide-details
                  dense
                  label="Tag Inicio"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="filtro.tagFim"
                  hide-details
                  dense
                  label="Tag Fim"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro>

      <filtro-mobile
        v-if="$vuetify.breakpoint.mobile"
        :options="optionsFilter"
        @adicionar="(modal = true), (controle.inserir = true)"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <v-text-field
                  v-model="filtro.codigo"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Código"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
            </v-row>
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="filtro.linhaId"
                  :items="linhas"
                  :disabled="controle.exibir"
                  item-text="descricao"
                  item-value="id"
                  dense
                  hide-details
                  label="Linha"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row class="pa-0" dense>
              <v-col cols="6">
                <v-text-field
                  v-model="filtro.tagInicio"
                  hide-details
                  dense
                  label="Tag Inicio"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="filtro.tagFim"
                  hide-details
                  dense
                  label="Tag Fim"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro-mobile>

      <v-card v-if="$vuetify.breakpoint.mobile" dense>
        <v-card-text class="overflow-auto px-2" style="height: 70vh">
          <v-card
            v-for="item in registros"
            :key="item.id"
            dense
            outlined
            class="font-weight-bold justify-space-between black--text my-1"
            style="border: 2px solid #ddd; border-radius: 5px"
            @click="exibirRegistro(item.id)"
          >
            <!-- @click="exibirRegistro(item.id)" -->
            <v-card-title
              class="justify-space-between py-2 subtitle-1 font-weight-bold px-2"
            >
              <span>Piquete: {{ item.id }}</span>
              <span>
                <v-chip small dark color="green">
                  Código: {{ item.codigo }}
                </v-chip>
              </span>
            </v-card-title>
            <v-card-text
              class="font-weight-bold black--text justify-space-between px-0"
            >
              <div
                class="mx-2 d-flex justify-space-between"
                style="border-bottom: 0.5px dashed #ddd"
              >
                Linha
                <div class="balanca_primary--text font-weight-medium text-end">
                  {{ item.linha.descricao }}
                </div>
              </div>
              <div
                class="mx-2 d-flex justify-space-between"
                style="border-bottom: 0.5px dashed #ddd"
              >
                Tag Inicio
                <div class="balanca_primary--text font-weight-medium text-end">
                  {{ item.tagInicio }}
                </div>
              </div>
              <div
                class="mx-2 d-flex justify-space-between"
                style="border-bottom: 0.5px dashed #ddd"
              >
                Tag Fim
                <div class="balanca_primary--text font-weight-medium text-end">
                  {{ item.tagFinal }}
                </div>
              </div>
              <div
                class="mx-2 d-flex justify-space-between"
                style="border-bottom: 0.5px dashed #ddd"
              >
                Area Total
                <div class="balanca_primary--text font-weight-medium text-end">
                  {{ item.areaTotal }} m²
                </div>
              </div>
              <div
                class="mx-2 d-flex justify-space-between"
                style="border-bottom: 0.5px dashed #ddd"
              >
                Capacidade Máxima
                <div class="balanca_primary--text font-weight-medium text-end">
                  {{ item.capacidadeMaxima }}
                </div>
              </div>
              <div
                class="mx-2 d-flex justify-space-between"
                style="border-bottom: 0.5px dashed #ddd"
              >
                Capacidade Ideal
                <div class="balanca_primary--text font-weight-medium text-end">
                  {{ item.capacidadeIdeal }}
                </div>
              </div>
              <div
                class="mx-2 d-flex justify-space-between"
                style="border-bottom: 0.5px dashed #ddd"
              >
                Tamanho Cocho
                <div class="balanca_primary--text font-weight-medium text-end">
                  {{ item.tamanhoCocho }} m
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-alert
            v-if="!registros.length"
            class="mt-4"
            outlined
            text
            type="info"
            prominent
            border="left"
          >
            Nenhum registro!
          </v-alert>
        </v-card-text>

        <v-divider />
        <v-card-actions class="py-1 px-4 body-2 font-weight-bold">
          Registros: {{ registros.length }}
        </v-card-actions>
      </v-card>

      <tabela
        v-if="!$vuetify.breakpoint.mobile"
        :colunas="colunas"
        :loading="loading"
        :paginacao="paginacaoFake"
        :registros="registros"
        :registros-por-pagina="100"
        class="mt-4"
        height-auto
        exibir
        toolbar-grid
        titulo="Receitas"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
        @select="$vuetify.breakpoint.mobile ? exibirRegistro($event.id) : ''"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "PaginaConfinamentoPiquete",

  data: () => ({
    aviso: {
      modal: false,
      key: null,
      text: "",
    },
    colunas: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Código",
        align: "center",
        sortable: true,
        value: "codigo",
        width: 50,
      },
      {
        text: "Linha",
        align: "start",
        sortable: true,
        value: "linha.descricao",
        width: 50,
      },
      {
        text: "Área m²",
        align: "start",
        sortable: true,
        value: "areaTotal",
        width: 50,
      },
      {
        text: "Cap. Máxima",
        align: "start",
        sortable: true,
        value: "capacidadeMaxima",
        width: 50,
      },
      {
        text: "Cap. Ideal",
        align: "start",
        sortable: true,
        value: "capacidadeIdeal",
        width: 50,
      },
      {
        text: "Tamanho Cocho",
        align: "start",
        sortable: true,
        value: "tamanhoCocho",
        width: 50,
      },
      {
        text: "Tag Inicio",
        align: "start",
        sortable: true,
        value: "tagInicio",
        width: 50,
      },
      {
        text: "Tag Fim",
        align: "start",
        sortable: true,
        value: "tagFinal",
        width: 50,
      },
      {},
    ],
    modal: false,
    controle: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    filtro: {
      codigo: null,
      linhaId: null,
      tagFim: null,
      tagInicio: null,
    },
    formulario: {
      id: null,
      linhaId: null,
      areaTotal: null,
      capacidadeMaxima: null,
      capacidadeIdeal: null,
      tagInicio: null,
      tagFinal: null,
      codigo: null,
      tamanhoCocho: null,
      piqueteIgfazId: null,
    },
    loading: false,
    paginacaoFake: {
      pagina: 1,
      registros: 20,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("paginaConfinamentoPiquete", ["registros", "linhas"]),
    optionsFilter() {
      return {
        adicionar: true,
        valueInMore: true,
        values:
          !!this.filtro.codigo ||
          !!this.filtro.tagInicio ||
          !!this.filtro.linhaId ||
          !!this.filtro.tagFim,
      };
    },
  },

  async created() {
    this.dropdownLinhas();
    this.listarRegistros();

    this.$nextTick(() => {
      if (this.$route.query.id && this.$route.query.exibir) {
        this.exibirRegistro(this.$route.query.id);
      } else {
        setTimeout(() => {
          this.listarRegistros();
        }, 200);
      }
    });
  },

  methods: {
    ...mapActions("paginaConfinamentoPiquete", [
      "listar",
      "editar",
      "salvar",
      "exibir",
      "excluir",
      "dropdownLinhas",
    ]),
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        codigo: this.filtro.codigo || undefined,
        linhaId: this.filtro.linhaId || undefined,
        tagInicio: this.filtro.tagInicio || undefined,
        tagFim: this.filtro.tagFim || undefined,
      });

      this.loading = false;
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          linhaId: this.formulario.linhaId || undefined,
          areaTotal: this.formulario.areaTotal || undefined,
          capacidadeMaxima: this.formulario.capacidadeMaxima || undefined,
          capacidadeIdeal: this.formulario.capacidadeIdeal || undefined,
          tagInicio: this.formulario.tagInicio || undefined,
          tagFinal: this.formulario.tagFinal || undefined,
          codigo: this.formulario.codigo || undefined,
          tamanhoCocho: this.formulario.tamanhoCocho || undefined,
          piqueteIgfazId: this.formulario.piqueteIgfazId || undefined,
        };
        let res;

        if (form.id) res = await this.editar(form);
        else if (!form.id) res = await this.salvar(form);

        if (res) {
          if (!res.erro) {
            if (res.id) this.exibirRegistro(res.id);
            else this.resetFormulario();
          } else if (typeof res.erro === "object") {
            this.$refs.observer.setErrors(res.erro);
            this.$setError({}, res.erro);
          }
        }

        this.loading = false;
      }
    },
    async excluirRegistro() {
      this.loading = true;

      const res = await this.excluir(this.formulario.id);

      if (res && !res.erro) this.resetFormulario();

      this.loading = false;
    },
    async exibirRegistro(id) {
      this.loading = true;

      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          linhaId: res.linhaId || null,
          areaTotal: res.areaTotal || null,
          capacidadeMaxima: res.capacidadeMaxima || null,
          capacidadeIdeal: res.capacidadeIdeal || null,
          tagInicio: res.tagInicio || null,
          tagFinal: res.tagFinal || null,
          codigo: res.codigo || null,
          tamanhoCocho: res.tamanhoCocho || null,
          piqueteIgfazId: res.piqueteIgfazId || null,
        };
      }

      this.modal = true;
      this.controle.exibir = true;
      this.loading = false;
    },
    resetFormulario() {
      this.controle = {
        inserir: false,
        exibir: false,
        editar: false,
      };
      this.formulario = {
        id: null,
        linhaId: null,
        areaTotal: null,
        capacidadeMaxima: null,
        capacidadeIdeal: null,
        tagInicio: null,
        tagFinal: null,
        codigo: null,
        tamanhoCocho: null,
        piqueteIgfazId: null,
      };

      this.modal = false;
      this.listarRegistros();
    },
    limparFiltros() {
      this.filtro = {
        codigo: null,
        tagFim: null,
        linhaId: null,
        tagInicio: null,
      };
    },
  },
};
</script>
