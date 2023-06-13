<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :editar="!!(controle.exibir && !controle.inserir)"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    subtitulo="Lotes de Animais"
    titulo-toolbar="Informação do Lote"
    titulo="Lotes"
    fechar
    @editar="editarRegistro()"
    @salvar="salvarRegistro()"
    @cancelar="resetFormulario()"
    @fechar="resetFormulario()"
  >
    <aviso
      v-model="aviso.modal"
      :options="aviso"
      @sim="aviso = { modal: false, key: null, text: '' }"
      @novoPiquete="
        (aviso = { modal: false, key: null, text: '' }), novaPiqueteLote()
      "
      @novaDieta="
        (aviso = { modal: false, key: null, text: '' }), novaDietaLote()
      "
    />
    <!-- TODO: Modal Trocar Dieta do Lote -->
    <modal
      v-model="modalNovaDieta"
      :options="optionsModal"
      @input="modalNovaDieta = false"
    >
      <v-container class="pa-6">
        <v-row v-for="item in dietas" :key="item.id">
          <v-col cols="12">
            <v-card
              :disabled="item.id === dietaAtiva"
              class="white--text mx-1"
              @click="
                (dietaSelecionada = item.id),
                  (aviso = {
                    modal: true,
                    key: 'novaDieta',
                    text: 'Deseja realmente <b>Gerar uma Nova Dieta</b>? </br>A dieta atual será substituída pela selecionada.',
                    footerCheckAccept: true,
                  })
              "
            >
              <v-card-title
                class="justify-space-between py-2 subtitle-1 font-weight-bold px-2"
              >
                <span>
                  <v-chip label> Dieta: {{ item.descricao }} </v-chip>
                </span>
                <span>
                  <v-chip
                    v-if="item.id === dietaAtiva"
                    small
                    label
                    outlined
                    dark
                    color="blue"
                  >
                    EM USO
                  </v-chip>
                </span>
              </v-card-title>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-arrow-right-bold</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="d-flex justify-space-between">
                    GPD
                    <span class="grey--text font-weight-bold"
                      >{{ item.ganhoMedioDia }} (Kg)</span
                    >
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="d-flex justify-space-between">
                    Ingestão Ms %/Peso Vivo
                    <span class="grey--text font-weight-bold"
                      >{{ item.ingestaoMassaSeca }} %</span
                    >
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="d-flex justify-space-between">
                    QTD Dias uso
                    <span class="grey--text font-weight-bold">{{
                      item.quantidadeDiasUso
                    }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </modal>

    <!-- TODO: Modal Dieta Transição -->
    <modal
      v-model="modalPlanoTransicao"
      :options="optionsModalDietaTransicao"
      @input="(modalPlanoTransicao = false), resetModalPlanoTransicao()"
      @salvar="inserirPlanoTransicaoDietaLote()"
    >
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observerPlanoTransicao">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Plano de Transição"
                  rules="required"
                  vid="planoTransicaoSelecionadoId"
                >
                  <v-select
                    v-model="planoTransicaoSelecionadoId"
                    :items="planoTransicaoDropdown"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Plano de Transição"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Data Inicio"
                  rules="required"
                  vid="planoTransicaoDataInicio"
                >
                  <date-picker
                    v-model="planoTransicaoDataInicio"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    label="Data Inicio"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </modal>

    <!-- TODO: Modal Trocar Piquete -->
    <modal
      v-model="modalNovoPiquete"
      :options="optionsModalPiquete"
      @input="modalNovoPiquete = false"
    >
      <v-container class="pa-6">
        <v-row v-for="item in piquetes" :key="item.id">
          <v-col cols="12">
            <v-card
              :disabled="item.id === piqueteAtivo"
              class="white--text mx-1"
              @click="
                (piqueteSelecionado = item.id),
                  (aviso = {
                    modal: true,
                    key: 'novoPiquete',
                    text: 'Deseja realmente <b>Alterar o piquete deste lote</b>? </br>O piquete atual será substituído pelo piquete selecionado.',
                    footerCheckAccept: true,
                  })
              "
            >
              <v-card-title
                class="justify-space-between py-2 subtitle-1 font-weight-bold px-2"
              >
                <span>
                  <v-chip label> Piquete: {{ item.codigo }} </v-chip>
                </span>
                <span>
                  <v-chip
                    v-if="item.id === piqueteAtivo"
                    small
                    label
                    outlined
                    dark
                    color="blue"
                  >
                    EM USO
                  </v-chip>
                </span>
              </v-card-title>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-arrow-right-bold</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="d-flex justify-space-between">
                    Detalhe
                    <span class="grey--text font-weight-bold"
                      >{{ item.opcao }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </modal>

    <template slot="formulario">
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observer">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12" xl="1" lg="1" md="6" xs="12">
                <v-text-field
                  v-model="formulario.id"
                  disabled
                  hide-details
                  dense
                  label="Lote"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="6" xs="12">
                <v-text-field
                  v-model="formulario.descricao"
                  v-mask="mascara('T', 250)"
                  :disabled="controle.exibir"
                  hide-details
                  dense
                  label="Descrição"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Categoria"
                  rules="required"
                  vid="categoria"
                >
                  <v-autocomplete
                    v-model="formulario.categoriaId"
                    :items="categorias"
                    :error-messages="errors"
                    :disabled="controle.exibir"
                    item-text="descricao"
                    item-value="id"
                    class="required"
                    dense
                    hide-details
                    label="Categoria"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Raca"
                  rules="required"
                  vid="raca"
                >
                  <v-autocomplete
                    v-model="formulario.racaId"
                    :items="racas"
                    :error-messages="errors"
                    :disabled="controle.exibir"
                    item-text="descricao"
                    item-value="id"
                    class="required"
                    dense
                    hide-details
                    label="Raça"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantidade Animais"
                  rules="required"
                  vid="quantidadeAnimais"
                >
                  <v-text-field
                    v-model="formulario.quantidadeAnimais"
                    v-mask="'######'"
                    :error-messages="errors"
                    :disabled="controle.exibir"
                    hide-details
                    class="required"
                    dense
                    label="Quantidade Animais"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <date-picker
                  v-model="formulario.dataEntrada"
                  dense
                  :disabled="controle.exibir"
                  not-full-screen
                  :clearable="false"
                  hide-details
                  label="Data Entrada"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <date-picker
                  v-model="formulario.dataSaida"
                  dense
                  disabled
                  not-full-screen
                  :clearable="false"
                  hide-details
                  label="Data Saida"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Peso Medio Entrada"
                  rules="required"
                  vid="pesoMedioEntrada"
                >
                  <v-text-field
                    v-model="formulario.pesoMedioEntrada"
                    v-moeda="{ negativo: false, decimal: 3 }"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    hide-details
                    clearable
                    dense
                    class="required"
                    label="Peso Médio Entrada"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Peso Esperado para Abate"
                  rules="required"
                  vid="pesoEsperadoAbate"
                >
                  <v-text-field
                    v-model="formulario.pesoEsperadoAbate"
                    v-moeda="{ negativo: false, decimal: 3 }"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    hide-details
                    clearable
                    dense
                    class="required"
                    label="Peso Esperado para Abate"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <v-text-field
                  v-model="formulario.pesoMedioSaida"
                  v-moeda="{ negativo: false, decimal: 3 }"
                  disabled
                  hide-details
                  clearable
                  dense
                  label="Peso Médio Saida"
                  outlined
                />
              </v-col>
              <v-col v-if="controle.inserir" cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Piquete"
                  rules="required"
                  vid="piqueteId"
                >
                  <v-autocomplete
                    v-model="formulario.piqueteId"
                    :items="piquetes"
                    :error-messages="errors"
                    :disabled="!controle.inserir"
                    item-text="opcao"
                    item-value="id"
                    class="required"
                    dense
                    hide-details
                    label="Piquete"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col v-if="controle.inserir" cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Dieta"
                  rules="required"
                  vid="dietaId"
                >
                  <v-autocomplete
                    v-model="formulario.dietaId"
                    :items="dietas"
                    :error-messages="errors"
                    :disabled="!controle.inserir"
                    item-text="descricao"
                    item-value="id"
                    class="required"
                    dense
                    hide-details
                    label="Dieta"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </template>

    <template v-if="formulario.id" slot="relacionamento">
      <v-tabs v-model="tabs" bg-color="primary">
        <v-tab value="ingredientes">Movimentos do Lote</v-tab>
        <v-tab value="tratos">Piquetes</v-tab>
        <v-tab value="tratos">Dietas do Lote</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabs">
        <!-- Movimentos Lote -->
        <v-tab-item>
          <tabela
            :colunas="colunasMovimentosLote"
            :loading="loading"
            :paginacao="paginacaoFake"
            :registros="movimentosLote"
            :registros-por-pagina="100"
            class="mt-4 mb-2"
            height-auto
            toolbar-grid
            titulo="Movimentos do Lote"
            @paginacao="paginacaoFake = $event"
          >
            <template slot="botoes">
              <v-btn
                color="primary"
                title="Atualizar"
                outlined
                small
                @click="movimentosLoteListar()"
              >
                <v-icon left> mdi-reload </v-icon>
                Atualizar
              </v-btn>
            </template>
          </tabela>
        </v-tab-item>

        <!-- Piquetes do Lote -->
        <v-tab-item>
          <tabela
            :colunas="colunasPiquetesLote"
            :loading="loading"
            :paginacao="paginacaoFake"
            :registros="lotePiquete"
            :registros-por-pagina="100"
            class="mt-4 mb-2"
            height-auto
            toolbar-grid
            titulo="Piquetes do Lotes"
            @paginacao="paginacaoFake = $event"
          >
            <template slot="botoes">
              <v-btn
                class="mr-2"
                color="orange"
                title="Atualizar"
                @click="modalNovoPiquete = true"
              >
                <v-icon color="white" left> mdi-refresh </v-icon>
                <span style="color: white">Troca de Piquete</span>
              </v-btn>
              <v-btn
                color="primary"
                title="Atualizar"
                outlined
                small
                @click="piquetesLoteListar()"
              >
                <v-icon left> mdi-reload </v-icon>
                Atualizar
              </v-btn>
            </template>
          </tabela>
        </v-tab-item>

        <!-- Dietas do Lote -->
        <v-tab-item>
          <v-row dense>
            <!-- Dietas do Lote -->
            <v-col cols="12" md="6">
              <tabela
                :colunas="colunasDietasLote"
                :loading="loading"
                :paginacao="paginacaoFake"
                :registros="loteDieta"
                :registros-por-pagina="100"
                class="mt-4 mb-2"
                height-auto
                toolbar-grid
                titulo="Dietas do Lote"
                @paginacao="paginacaoFake = $event"
              >
                <template slot="botoes">
                  <v-btn
                    class="mr-2"
                    color="orange"
                    title="Atualizar"
                    @click="modalNovaDieta = true"
                  >
                    <v-icon color="white" left> mdi-plus-box </v-icon>
                    <span style="color: white">Nova Dieta</span>
                  </v-btn>
                  <v-btn
                    color="primary"
                    outlined
                    title="Atualizar"
                    @click="loteDietaListar()"
                  >
                    <v-icon left> mdi-reload </v-icon>
                    Atualizar
                  </v-btn>
                </template>
              </tabela>
            </v-col>

            <!-- Planos de Transição do Lote -->
            <v-col cols="12" md="6">
              <tabela
                :colunas="colunasDietasTransicaoLote"
                :loading="loading"
                :paginacao="paginacaoFake"
                :registros="planoTransicaoLote"
                :registros-por-pagina="100"
                class="mt-4 mb-2"
                height-auto
                toolbar-grid
                titulo="Plano de Transição do Lote"
                @paginacao="paginacaoFake = $event"
              >
                <template slot="botoes">
                  <v-btn
                    class="mr-2"
                    color="orange"
                    title="Atualizar"
                    @click="modalPlanoTransicao = true"
                  >
                    <v-icon color="white" left> mdi-plus-box </v-icon>
                    <span style="color: white"
                      >Adicionar Plano Transição de Dieta</span
                    >
                  </v-btn>
                  <v-btn
                    color="primary"
                    outlined
                    title="Atualizar"
                    @click="listarPlanoTransicaoDietaDoLote()"
                  >
                    <v-icon left> mdi-reload </v-icon>
                    Atualizar
                  </v-btn>
                </template>
              </tabela>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
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
              <v-col cols="4">
                <v-text-field
                  v-model="filtro.descricao"
                  hide-details
                  dense
                  label="Descrição"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="filtro.categoria"
                  :items="categorias"
                  :disabled="controle.exibir"
                  item-text="descricao"
                  item-value="id"
                  dense
                  hide-details
                  label="Categoria"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="filtro.raca"
                  :items="racas"
                  :disabled="controle.exibir"
                  item-text="descricao"
                  item-value="id"
                  dense
                  hide-details
                  label="Raça"
                  outlined
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
                  v-model="filtro.descricao"
                  hide-details
                  dense
                  label="Descrição"
                  outlined
                  @keypress.enter="listarRegistros()"
                />
              </v-col>
            </v-row>
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="filtro.categoria"
                  :items="categorias"
                  :disabled="controle.exibir"
                  item-text="descricao"
                  item-value="id"
                  dense
                  hide-details
                  label="Categoria"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="filtro.raca"
                  :items="racas"
                  :disabled="controle.exibir"
                  item-text="descricao"
                  item-value="id"
                  dense
                  hide-details
                  label="Raça"
                  outlined
                />
              </v-col>
            </v-row>
          </v-container>
        </template>
      </filtro-mobile>

      <tabela
        :colunas="colunas"
        :loading="loading"
        :paginacao="paginacaoFake"
        :registros="registros"
        :registros-por-pagina="100"
        class="mt-4"
        height-auto
        exibir
        toolbar-grid
        titulo="Lotes de Animais"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
        @select="$vuetify.breakpoint.mobile ? exibirRegistro($event.id) : ''"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moeda from "@tiig/moeda";
import opcao from "@/plugins/opcoes";

export default {
  name: "PaginaListagemDeLotes",

  data: () => ({
    dietaSelecionada: null,
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
        text: "Lote",
        align: "center",
        sortable: true,
        value: "id",
        width: 50,
      },
      {
        text: "Status",
        align: "start",
        sortable: true,
        value: "status",
        width: 50,
      },
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 150,
      },
      {
        text: "Piquete",
        align: "start",
        sortable: true,
        value: "piqueteDescricao",
        width: 150,
      },
      {
        text: "Peso Médio Entrada (Kg)",
        align: "end",
        sortable: true,
        value: "pesoMedioEntrada",
        width: 150,
      },
      {
        text: "Peso Esperado para Abate (Kg)",
        align: "end",
        sortable: true,
        value: "pesoEsperadoAbate",
        width: 150,
      },
      {
        text: "Peso Médio Saída (Kg)",
        align: "end",
        sortable: true,
        value: "pesoMedioSaida",
        width: 150,
      },
      {
        text: "Quantidade Animais",
        align: "center",
        sortable: true,
        value: "quantidadeAnimais",
        width: 50,
      },
      {
        text: "Categoria",
        align: "start",
        sortable: true,
        value: "categoriaDescricao",
        width: 50,
      },
      {
        text: "Dieta",
        align: "start",
        sortable: true,
        value: "dietaDescricao",
        width: 50,
      },
      {
        text: "Raça",
        align: "start",
        sortable: true,
        value: "racaDescricao",
        width: 50,
      },
      {
        text: "Data Entrada",
        align: "start",
        sortable: true,
        value: "dataEntrada",
        width: 50,
      },
      {
        text: "Data Saída",
        align: "start",
        sortable: true,
        value: "dataSaida",
        width: 50,
      },
      {},
    ],
    colunasMovimentosLote: [
      {
        text: "Lote",
        align: "start",
        sortable: true,
        value: "loteDescricao",
        width: 50,
      },
      {
        text: "Movimento",
        align: "end",
        sortable: true,
        value: "movimento",
        width: 50,
      },
      {
        text: "Dieta",
        align: "start",
        sortable: true,
        value: "dietaDescricao",
        width: 50,
      },
      {
        text: "Qtd. Animais",
        align: "end",
        sortable: true,
        value: "qtdAnimais",
        width: 50,
      },
      {
        text: "GMD (Kg)",
        align: "end",
        sortable: true,
        value: "ganhoMedioDia",
        width: 50,
      },
      {
        text: "CMS/ PV (%)",
        align: "end",
        sortable: true,
        value: "ingestaoMassaSeca",
        width: 50,
      },
      {
        text: "Peso Médio Anterior (Kg)",
        align: "end",
        sortable: true,
        value: "pesoMedioAnterior",
        width: 50,
      },
      {
        text: "Peso Médio Atual (Kg)",
        align: "end",
        sortable: true,
        value: "pesoMedioAtual",
        width: 50,
      },
      {
        text: "MS/Animal (Kg)",
        align: "end",
        sortable: true,
        value: "qtdMsAnimalBase",
        width: 50,
      },
      {
        text: "Aumento (%)",
        align: "end",
        sortable: true,
        value: "percentualAumento",
        width: 50,
      },
      {
        text: "MS/Animal/Realizado (Kg)",
        align: "end",
        sortable: true,
        value: "qtdMsAnimalRealizada",
        width: 50,
      },
      {
        text: "MS/Lote (Kg)",
        align: "end",
        sortable: true,
        value: "qtdMsLote",
        width: 50,
      },
      {
        text: "MS/Aumento/Lote (Kg)",
        align: "end",
        sortable: true,
        value: "qtdMsAumentoLote",
        width: 50,
      },
      {
        text: "MS (%)",
        align: "end",
        sortable: true,
        value: "percentualMs",
        width: 50,
      },
      {
        text: "MO/Animal (Kg)",
        align: "end",
        sortable: true,
        value: "qtdMoAnimal",
        width: 50,
      },
      {
        text: "MO/Lote (Kg)",
        align: "end",
        sortable: true,
        value: "qtdMoLote",
        width: 50,
      },
      {},
    ],
    colunasPiquetesLote: [
      {
        text: "Piquete",
        align: "start",
        sortable: true,
        value: "piqueteDescricao",
        width: 50,
      },
      {
        text: "Quantidade Animais",
        align: "end",
        sortable: true,
        value: "quantidadeAnimais",
        width: 150,
      },
      {
        text: "Capacidade Ideal",
        align: "end",
        sortable: true,
        value: "capacidadeIdeal",
        width: 50,
      },
      {
        text: "Capacidade Máxima",
        align: "end",
        sortable: true,
        value: "capacidadeMaxima",
        width: 50,
      },
      {
        text: "Área Total do Piquete (m²)",
        align: "end",
        sortable: true,
        value: "areaTotal",
        width: 50,
      },
      {
        text: "Tamanho do Cocho (m)",
        align: "end",
        sortable: true,
        value: "tamanhoCocho",
        width: 50,
      },
      {},
    ],
    colunasDietasLote: [
      {
        text: "Dieta",
        align: "start",
        sortable: true,
        value: "dietaDescicao",
        width: 50,
      },
      {
        text: "Status",
        align: "start",
        sortable: true,
        value: "status",
        width: 150,
      },
      {
        text: "Data Inicio",
        align: "start",
        sortable: true,
        value: "dataInicio",
        width: 150,
      },
      {
        text: "GPD (Kg)",
        align: "end",
        sortable: true,
        value: "ganhoMedioDia",
        width: 50,
      },
      {
        text: "Ingestão Ms %/Peso Vivo",
        align: "end",
        sortable: true,
        value: "ingestaoMassaSeca",
        width: 50,
      },
      {
        text: "Dias para uso da Dieta",
        align: "end",
        sortable: true,
        value: "quantidadeDiasUso",
        width: 50,
      },
      {
        text: "Dias em Uso",
        align: "end",
        sortable: true,
        value: "diasUsados",
        width: 50,
      },
      {},
    ],
    colunasDietasTransicaoLote: [
      {
        text: "Plano Transição",
        align: "center",
        sortable: true,
        value: "planoTransicaoId",
        width: 50,
      },
      {
        text: "Status",
        align: "start",
        sortable: true,
        value: "status",
        width: 100,
      },
      {
        text: "Plano Transição Descrição",
        align: "start",
        sortable: true,
        value: "planoTransicaoDescricao",
        width: 100,
      },
      {
        text: "Data Inicio",
        align: "start",
        sortable: true,
        value: "dataInicioTransicao",
        width: 100,
      },
      {
        text: "Dias Duração",
        align: "center",
        sortable: true,
        value: "planoTransicaoQuantidadeDias",
        width: 100,
      },
      {
        text: "Dieta Inicial",
        align: "start",
        sortable: true,
        value: "planoTransicaoDietaInicial",
        width: 100,
      },
      {
        text: "Dieta Final",
        align: "start",
        sortable: true,
        value: "planoTransicaoDietaFinal",
        width: 100,
      },
      {},
    ],
    tabs: null,
    filtro: {
      id: null,
      categoria: null,
      descricao: null,
      raca: null,
    },
    piqueteSelecionado: null,
    controle: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    modalNovoPiquete: false,
    modalNovaDieta: false,
    formulario: {
      id: null,
      status: null,
      descricao: null,
      dataEntrada: null,
      dataSaida: null,
      categoriaId: null,
      racaId: null,
      quantidadeAnimais: null,
      pesoMedioEntrada: null,
      pesoEsperadoAbate: null,
      pesoMedioSaida: null,
      piqueteId: null,
      dietaId: null,
      dataEntragaCongelada: null,
      raca: {
        id: null,
        descricao: null,
      },
      categoria: {
        id: null,
        descricao: null,
        idade: null,
        rendimentoCarcaca: null,
        sexo: null,
        tipo: null,
      },
      statusLote: {
        chip: false,
        color: null,
        text: null,
      },
    },
    loading: false,
    modal: false,
    paginacaoFake: {
      pagina: 1,
      registros: 100,
      totalRegistros: 0,
    },

    modalPlanoTransicao: false,
    planoTransicaoSelecionadoId: null,
    planoTransicaoDataInicio: null,
  }),

  computed: {
    ...mapState("paginaConfinamentoLote", [
      "registros",
      "racas",
      "piquetes",
      "dietas",
      "categorias",
      "movimentosLote",
      "lotePiquete",
      "loteDieta",

      "planoTransicaoDropdown",
      "planoTransicaoLote",
    ]),
    dietaAtiva() {
      let array = [];
      if (this.loteDieta && this.loteDieta.length > 0) {
        array = this.loteDieta.filter((el) => el.statusCongelado === 1);

        if (array.length > 0) {
          return array[0].dietaId || null;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    piqueteAtivo() {
      if (this.lotePiquete && this.lotePiquete.length > 0) {
        return this.lotePiquete[0].piqueteId || null;
      } else {
        return null;
      }
    },
    optionsModal() {
      return {
        title: "Selecione a Nova Dieta",
        width: 700,
        actions: [
          {
            title: "Cancelar",
            color: "error",
            icon: "mdi-cancel",
            emit: "input",
            outlined: false,
          },
        ],
      };
    },
    optionsModalPiquete() {
      return {
        title: "Selecione o Piquete",
        width: 700,
        actions: [
          {
            title: "Cancelar",
            color: "error",
            icon: "mdi-cancel",
            emit: "input",
            outlined: false,
          },
        ],
      };
    },
    filtroValor() {
      return (
        !!this.filtro.descricao || !!this.filtro.categoria || !!this.filtro.raca
      );
    },
    optionsFilter() {
      return {
        adicionar: true,
        values: this.filtroValor,
      };
    },
    optionsModalDietaTransicao() {
      return {
        title: "Adicionar Plano de Transição",
        width: 700,
        actions: [
          {
            title: "Salvar",
            color: this.$vuetify.theme.dark ? "accent" : "primary",
            icon: "mdi-content-save",
            emit: "salvar",
            outlined: false,
          },
          {
            title: "Cancelar",
            color: "error",
            icon: "mdi-cancel",
            emit: "input",
            outlined: false,
          },
        ],
      };
    },
  },

  watch: {
    modal(value) {
      if (!value) {
        this.resetFormulario();
      }
    },
  },

  async created() {
    await this.planoTransicaoDropdownListar();
    await this.dropdownCategoria();
    await this.dropdownRaca();
    await this.dropdownPiquete();
    await this.dropdownDieta();

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
    ...mapActions("paginaConfinamentoLote", [
      "listar",
      "exibir",
      "salvar",
      "editar",

      "piqueteSalvar",
      "dropdownPiquete",
      "loteMovimentoListar",
      "lotePiqueteListar",
      "dietaLoteListar",
      "dropdownCategoria",
      "dropdownRaca",
      "dropdownDieta",
      "dietaSalvar",

      "planoTransicaoDropdownListar",
      "planoTransicaoLoteListar",
      "planoTransicaoDietaLoteInserir",
    ]),
    async exibirRegistro(id) {
      this.loading = true;

      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          status: res.status || null,
          descricao: res.descricao || null,
          dataEntragaCongelada: res.dataEntrada,
          dataEntrada: res.dataEntrada,
          dataSaida: res.dataSaida,
          categoriaId: res.categoriaId || null,
          racaId: res.racaId || null,
          quantidadeAnimais: res.quantidadeAnimais || null,
          pesoMedioEntrada: moeda.format(Number(res.pesoMedioEntrada) || 0, 3),
          pesoEsperadoAbate: moeda.format(
            Number(res.pesoEsperadoAbate) || 0,
            3
          ),
          pesoMedioSaida: moeda.format(Number(res.pesoMedioSaida) || 0, 3),
          raca: res.raca || null,
          categoria: res.categoria || null,
          statusLote: {
            chip: true,
            color: opcao.statusCor(9, res.statusLote.item),
            text: res.statusLote.descricao || " - ",
          },
        };
        this.controle.exibir = true;
        this.movimentosLoteListar();
        this.piquetesLoteListar();
        this.loteDietaListar();
        this.listarPlanoTransicaoDietaDoLote();
      }

      this.modal = true;
      this.loading = false;
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          categoriaId: this.formulario.categoriaId || undefined,
          racaId: this.formulario.racaId || undefined,
          descricao: this.formulario.descricao || undefined,
          dataEntrada: this.formulario.dataEntrada || undefined,
          pesoMedioEntrada:
            moeda.strip(this.formulario.pesoMedioEntrada) || undefined,
          pesoEsperadoAbate:
            moeda.strip(this.formulario.pesoEsperadoAbate) || undefined,
          quantidadeAnimais: this.formulario.quantidadeAnimais || undefined,
          piqueteId: this.formulario.piqueteId || undefined,
          dietaId: this.formulario.dietaId || undefined,
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
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        id: this.filtro.id || undefined,
        descricao: this.filtro.descricao || undefined,
        categoriaId: this.filtro.categoria || undefined,
        racaId: this.filtro.raca || undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        id: null,
        categoria: null,
        descricao: null,
        raca: null,
      };
    },
    resetFormulario() {
      this.formulario = {
        id: null,
        status: null,
        descricao: null,
        dataEntrada: null,
        dataSaida: null,
        categoriaId: null,
        racaId: null,
        quantidadeAnimais: null,
        pesoMedioEntrada: null,
        pesoEsperadoAbate: null,
        pesoMedioSaida: null,
        raca: {
          id: null,
          descricao: null,
        },
        categoria: {
          id: null,
          descricao: null,
          idade: null,
          rendimentoCarcaca: null,
          sexo: null,
          tipo: null,
        },
        statusLote: {
          chip: false,
          color: null,
          text: null,
        },
      };

      this.controle.exibir = false;
      this.controle.editar = false;
      this.controle.inserir = false;

      this.modal = false;
      this.listarRegistros();
    },
    editarRegistro() {
      this.formulario.pesoMedioEntrada = moeda.strip(
        this.formulario.pesoMedioEntrada
      );
      this.formulario.pesoEsperadoAbate = moeda.strip(
        this.formulario.pesoEsperadoAbate
      );
      this.formulario.dataEntrada = this.formulario.dataEntragaCongelada;
      this.controle.exibir = false;
      this.controle.editar = true;
    },
    async movimentosLoteListar() {
      this.loading = true;
      await this.loteMovimentoListar({
        loteId: this.formulario.id,
      });
      this.loading = false;
    },
    async piquetesLoteListar() {
      this.loading = true;
      await this.lotePiqueteListar({
        loteId: this.formulario.id,
      });
      this.loading = false;
    },
    async novaPiqueteLote() {
      this.loading = true;
      const res = await this.piqueteSalvar({
        loteId: this.formulario.id,
        piqueteId: this.piqueteSelecionado,
      });

      if (!res.erro) {
        this.modalNovoPiquete = false;
        this.exibirRegistro(this.formulario.id);
      }
      this.piqueteSelecionado = null;
      this.loading = false;
    },
    async novaDietaLote() {
      this.loading = true;
      const res = await this.dietaSalvar({
        loteId: this.formulario.id,
        dietaId: this.dietaSelecionada,
      });

      if (!res.erro) {
        this.modalNovaDieta = false;
        this.exibirRegistro(this.formulario.id);
      }
      this.dietaSelecionada = null;
      this.loading = false;
    },
    novoLote() {
      this.controle.inserir = true;
      this.modal = true;
    },
    async loteDietaListar() {
      this.loading = true;
      await this.dietaLoteListar({
        loteId: this.formulario.id,
      });
      this.loading = false;
    },
    async listarPlanoTransicaoDietaDoLote() {
      this.loading = true;
      await this.planoTransicaoLoteListar({
        loteId: this.formulario.id,
      });
      this.loading = false;
    },

    async inserirPlanoTransicaoDietaLote() {
      this.loading = true;

      const res = await this.planoTransicaoDietaLoteInserir({
        loteId: this.formulario.id,
        planoTransicaoId: this.planoTransicaoSelecionadoId || undefined,
        dataInicio: this.planoTransicaoDataInicio || undefined,
      });
      if (res && !res.erro) {
        this.resetModalPlanoTransicao();
        this.listarPlanoTransicaoDietaDoLote();
      }

      this.loading = false;
    },
    async resetModalPlanoTransicao() {
      this.loading = false;
      this.modalPlanoTransicao = false;
      this.planoTransicaoSelecionadoId = null;
      this.planoTransicaoDataInicio = null;
      this.listarPlanoTransicaoDietaDoLote();
    },
  },
};
</script>
