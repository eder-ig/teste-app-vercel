<template>
  <pagina
    :formulario="false"
    :loading="loading"
    subtitulo="Calcular lote com base em valores estimados"
    titulo="Caculadora de Custo Lote"
  >
    <template slot="listagem">
      <filtro
        :options="optionsFilter"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <validation-observer ref="observerFiltro">
              <v-row class="pa-0" dense>
                <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                  <v-select
                    v-model="filtro.status"
                    :items="opcoes[9]"
                    clearable
                    dense
                    hide-details
                    item-value="item"
                    item-text="descricao"
                    label="Status do Lote"
                    outlined
                  />
                </v-col>
                <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Valor Compra/@ (R$)"
                    rules="maskedNumber"
                    vid="valorArrobaCompra"
                  >
                    <v-text-field
                      v-model="filtro.valorArrobaCompra"
                      v-moeda="{ negativo: false, decimal: 2 }"
                      :error-messages="errors"
                      :hide-details="!errors.length"
                      class="required"
                      dense
                      label="Valor Compra/@ (R$)"
                      outlined
                      @keypress.enter="listarRegistros()"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Valor Venda/@ (R$)"
                    rules="maskedNumber"
                    vid="valorArrobaVenda"
                  >
                    <v-text-field
                      v-model="filtro.valorArrobaVenda"
                      v-moeda="{ negativo: false, decimal: 2 }"
                      :error-messages="errors"
                      :hide-details="!errors.length"
                      class="required"
                      dense
                      label="Valor Venda/@ (R$)"
                      outlined
                      @keypress.enter="listarRegistros()"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Custo Estimado/Kg de Trato (R$)"
                    rules="maskedNumber"
                    vid="custoEstimadoQuiloTrato"
                  >
                    <v-text-field
                      v-model="filtro.custoEstimadoQuiloTrato"
                      v-moeda="{ negativo: false, decimal: 2 }"
                      :error-messages="errors"
                      :hide-details="!errors.length"
                      class="required"
                      dense
                      label="Custo Estimado/Kg de Trato (R$)"
                      outlined
                      @keypress.enter="listarRegistros()"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </validation-observer>
          </v-container>
        </template>
      </filtro>

      <tabela
        ref="paginacaoFake"
        :colunas="colunas"
        :registros="registros"
        :paginacao="paginacaoFake"
        :registros-por-pagina="100"
        class="mt-2"
        toolbar-grid
        titulo="Listagem dos Lotes"
        @paginacao="paginacaoFake = $event"
      />
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moeda from "@tiig/moeda";

export default {
  name: "RelatorioCalculadoraCustoLote",

  data: () => ({
    colunas: [
      {
        text: "Lote",
        align: "start",
        sortable: true,
        value: "loteDescricao",
        width: 50,
      },
      {
        text: "Status Lote",
        align: "start",
        sortable: true,
        value: "status",
        width: 50,
      },
      {
        text: "Piquete",
        align: "start",
        sortable: true,
        value: "codigo",
        width: 50,
      },
      {
        text: "Qtd Animais",
        align: "center",
        sortable: true,
        value: "qtdAnimais",
        width: 50,
      },
      {
        text: "Peso Entrada (Kg)",
        align: "end",
        sortable: true,
        value: "pesoMedioEntrada",
        width: 50,
      },
      {
        text: "Peso Entrada (@)",
        align: "end",
        sortable: true,
        value: "mediaArrobaEntrada",
        width: 50,
      },
      // {
      //   text: "Valor Compra (@)",
      //   align: "end",
      //   sortable: true,
      //   value: "valorArrobaCompra",
      //   width: 50,
      // },
      {
        text: "Total Entrada (Kg)",
        align: "end",
        sortable: true,
        value: "pesoTotalEntrada",
        width: 50,
      },
      {
        text: "Custo Estimado Compra. (R$)",
        align: "end",
        sortable: true,
        value: "custoEstimadoArrobaCompra",
        width: 50,
      },
      {
        text: "Peso Estimado Atual (R$)",
        align: "end",
        sortable: true,
        value: "pesoMedioAtual",
        width: 50,
      },
      {
        text: "Peso Estimado Atual (@)",
        align: "end",
        sortable: true,
        value: "mediaArrobaAtual",
        width: 50,
      },
      // {
      //   text: "Valor Venda (@)",
      //   align: "end",
      //   sortable: true,
      //   value: "valorArrobaVenda",
      //   width: 50,
      // },
      {
        text: "Valor Estimado Venda. (R$)",
        align: "end",
        sortable: true,
        value: "valorEstimadoVenda",
        width: 50,
      },
      {
        text: "Saldo Estimado (R$)",
        align: "end",
        sortable: true,
        value: "saldoEstimadoAposAVenda",
        width: 50,
      },
      {
        text: "Qtd MS Previsto (Kg)",
        align: "end",
        sortable: true,
        value: "qtdMsPrevisto",
        width: 50,
      },
      {
        text: "Qtd MO Previsto (Kg)",
        align: "end",
        sortable: true,
        value: "qtdMoPrevisto",
        width: 50,
      },
      {
        text: "Qtd MO Previsto Ajustado (Kg)",
        align: "end",
        sortable: true,
        value: "qtdMoPrevistoAjustado",
        width: 50,
      },
      {
        text: "Qtd MS Realizado (Kg)",
        align: "end",
        sortable: true,
        value: "qtdrealMs",
        width: 50,
      },
      {
        text: "Qtd MO Realizado (Kg)",
        align: "end",
        sortable: true,
        value: "qtdRealMo",
        width: 50,
      },
      // {
      //   text: "Custo Trato MO Kg (R$)",
      //   align: "end",
      //   sortable: true,
      //   value: "custoEstimadoAquiloReceita",
      //   width: 50,
      // },
      {
        text: "Custo Tato Total (R$)",
        align: "end",
        sortable: true,
        value: "custoTotalTratoMo",
        width: 50,
      },
      {
        text: "Saldo Descontado Trato (R$)",
        align: "end",
        sortable: true,
        value: "saldoDescontadoTrato",
        width: 50,
      },
      {
        text: "Saldo Estimado /Animal (R$)",
        align: "end",
        sortable: true,
        value: "saldoEstimadoPorAnimal",
        width: 50,
      },
      {},
    ],
    filtro: {
      status: 1,
      valorArrobaCompra: 200,
      valorArrobaVenda: 210,
      custoEstimadoQuiloTrato: 1,
    },
    loading: false,
    paginacaoFake: {
      pagina: 1,
      registros: 100,
      totalRegistros: 0,
    },
  }),

  computed: {
    ...mapState("app", ["opcoes"]),
    ...mapState("paginaCalculadoraLote", ["registros"]),
    optionsFilter() {
      return {
        values: !!(
          this.filtro.status ||
          this.filtro.valorArrobaCompra ||
          this.filtro.valorArrobaVenda ||
          this.filtro.custoEstimadoQuiloTrato
        ),
      };
    },
  },

  async created() {
    this.obterOpcoes(9); // 9- Status do Lote
  },

  methods: {
    ...mapActions("app", ["obterOpcoes"]),
    ...mapActions("paginaCalculadoraLote", ["listar"]),
    async listarRegistros() {
      if (await this.$refs.observerFiltro.validate()) {
        this.loading = true;

        await this.listar({
          status: this.filtro.status || undefined,
          valorArrobaCompra:
            moeda.strip(this.filtro.valorArrobaCompra) || undefined,
          valorArrobaVenda:
            moeda.strip(this.filtro.valorArrobaVenda) || undefined,
          custoEstimadoQuiloTrato:
            moeda.strip(this.filtro.custoEstimadoQuiloTrato) || undefined,
        });

        this.loading = false;
      }
    },
    limparFiltros() {
      this.filtro = {
        status: null,
        valorArrobaCompra: null,
        valorArrobaVenda: null,
        custoEstimadoQuiloTrato: null,
      };
    },
  },
};
</script>
