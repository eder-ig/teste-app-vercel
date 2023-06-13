<template>
  <pagina
    :formulario.sync="modal"
    :loading="loading"
    :acao-form="true"
    subtitulo="Listagem e Geração das Receitas"
    titulo-toolbar="Informações da Receita"
    titulo="Receita"
    fechar
    @cancelar="resetFormulario()"
    @fechar="resetFormulario()"
  >
    <aviso
      v-model="aviso.modal"
      :options="aviso"
      @sim="aviso = { modal: false, key: null, text: '' }"
      @excluirTrato="
        (aviso = { modal: false, key: null, text: '' }), excluirTrato()
      "
      @finalizarAgendaTrato="
        (aviso = { modal: false, key: null, text: '' }), finalizarAgendaTrato()
      "
      @reabrirAgendaTrato="
        (aviso = { modal: false, key: null, text: '' }), reabrirAgendaTrato()
      "
    />

    <!-- TODO: Modal Gerar Receita -->
    <modal
      v-model="modalGerarReceita"
      :options="optionsModalGearReceita"
      @input="(modalGerarReceita = false), resetModalGerarReceita()"
      @salvar="gerarReceita()"
    >
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observerModalGerarReceita">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Gerar Receita do Dia"
                  rules="required"
                  vid="dataMovimentoReceira"
                >
                  <date-picker
                    v-model="dataMovimentoReceira"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    controlar-dia
                    dense
                    label="Gerar Receita do Dia"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
            <v-row
              class="my-2 py-2 mx-1 orange lighten-4"
              style="border: 1px solid grey; border-radius: 10px"
            >
              <v-col class="py-0 mx-2">
                <p>
                  <strong> Atenção!</strong> <br />Se falhar a geração de um
                  dia, gere do dia anterior primeiro depois do dia atual.
                  <br /><b
                    >Gerar RECEITA pulando um dia não permitirá gerar
                    retroativo.</b
                  >
                </p>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </modal>

    <!-- TODO: Gerar Preparo Complementar -->
    <modal
      v-model="modalGerarPreparoComplementar"
      :options="optionsModalGerarPreparoComplementar"
      @input="
        (modalGerarPreparoComplementar = false),
          resetModalGerarPreparoComplementar()
      "
      @salvar="gerarPreparoComplementar()"
    >
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observerModalGerarPreparoComplementar">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantidade Massa Original Preparo"
                  rules="maskedNumber"
                  vid="quantidadeMassaOriginalPreparo"
                >
                  <v-text-field
                    v-model="quantidadeMassaOriginalPreparo"
                    v-moeda="{ negativo: false, decimal: 3 }"
                    :disabled="controleModalGerarPreparoComplementar.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Quantidade Massa Original Preparo"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </modal>

    <!-- TODO: Gerar Atendimento do Preparo -->
    <modal
      v-model="modalGearAtendimentoPreparo"
      :options="optionsModalGerarAtendimentoPreparo"
      @input="resetModalAtendimentoPreparo()"
      @salvar="gerarAtendimentoDoPreparo()"
    >
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observerModalGerarAtendimentoPreparo">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantidade Massa Original para o Atendimento"
                  rules="maskedNumber"
                  vid="quantidadeMassaOriginalAtendimentoPreparo"
                >
                  <v-text-field
                    v-model="quantidadeMassaOriginalAtendimentoPreparo"
                    v-moeda="{ negativo: false, decimal: 3 }"
                    :disabled="controleModalGerarPreparoComplementar.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Quantidade Massa Original para o Atendimento"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </modal>

    <!-- TODO: Modal Gerar Trato -->
    <modal
      v-model="modalGerarTrato"
      :options="optionsModal"
      @input="(modalGerarTrato = false), (agendaSelecionadaGerarTrato = null)"
      @salvar="gerarTrato()"
    >
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observerGerarTrato">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Agenda de Trato"
                  rules="required"
                  vid="agendaSelecionadaGerarTrato"
                >
                  <v-select
                    v-model="agendaSelecionadaGerarTrato"
                    :items="agendaTratos"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    dense
                    class="required"
                    item-value="id"
                    item-text="descricao"
                    label="Agenda de Trato"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <!-- <v-col cols="12">
                <v-text-field
                  v-model="diferencaTratoAnterior"
                  v-moeda="{ negativo: true, decimal: 3 }"
                  hide-details
                  class="required"
                  dense
                  label="Diferença do Trato Anterior Para Correção"
                  outlined
                />
              </v-col> -->
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </modal>

    <!-- TODO: Realizar Trato Manual -->
    <modal
      v-model="modalRealizarTratoManual"
      :options="optionsModalRealizarTratoManual"
      @input="(modalRealizarTratoManual = false), resetModalTratoMovimento()"
      @salvar="realizarTratoManual()"
      @editar="
        (controleModalRealizarTratoManual.exibir = false),
          (controleModalRealizarTratoManual.editar = true)
      "
    >
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observerModalMovimentoTrato">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="2">
                <v-text-field
                  v-model="formularioTratoMovimento.id"
                  hide-details
                  disabled
                  dense
                  label="Movimento"
                  outlined
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formularioTratoMovimento.piqueteDescricao"
                  hide-details
                  disabled
                  dense
                  label="Piquete"
                  outlined
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formularioTratoMovimento.statusDescricao"
                  hide-details
                  disabled
                  dense
                  label="Status"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="formularioTratoMovimento.loteDescricao"
                  hide-details
                  disabled
                  dense
                  label="Lote"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formularioTratoMovimento.percentualAumento"
                  hide-details
                  disabled
                  dense
                  label="Aumento (%)"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formularioTratoMovimento.quantidadeMsAumento"
                  hide-details
                  disabled
                  dense
                  label="Quantidade Aumento MS (Kg)"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formularioTratoMovimento.quantidadeMassaSeca"
                  hide-details
                  disabled
                  dense
                  label="Quantidade MS (Kg)"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formularioTratoMovimento.quantidadeMassaOriginal"
                  hide-details
                  disabled
                  dense
                  label="Quantidade MO (Kg)"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="
                    formularioTratoMovimento.quantidadeRealMassaSecaTrato
                  "
                  hide-details
                  disabled
                  dense
                  label="Quantidade MS Atendida (Kg)"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantidade MO Atendido (Kg)"
                  rules="required"
                  vid="quantidadeRealMassaOriginalTrato"
                >
                  <v-text-field
                    v-model="
                      formularioTratoMovimento.quantidadeRealMassaOriginalTrato
                    "
                    v-moeda="{ negativo: false, decimal: 3 }"
                    :disabled="controleModalRealizarTratoManual.exibir"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Quantidade MO Atendido (Kg)"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </modal>

    <!-- TODO: Modal Alterar MO Corrigido -->
    <modal
      v-model="modalAlterarMoTratoCorrigido"
      :options="optionsModalAlterarMoTrato"
      @input="
        (modalAlterarMoTratoCorrigido = false), resetModalTratoMovimento()
      "
      @salvar="alterarQtdMOTrato()"
    >
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observerAlterarTratoNO">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  v-model="formularioMoTratoCorrigido.piqueteCodigo"
                  hide-details
                  disabled
                  dense
                  label="Piquete"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formularioMoTratoCorrigido.loteDescricao"
                  hide-details
                  disabled
                  dense
                  label="Lote"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formularioMoTratoCorrigido.percentualAumento"
                  hide-details
                  disabled
                  dense
                  label="Aumento (%)"
                  outlined
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formularioMoTratoCorrigido.quantidadeMassaOriginal"
                  hide-details
                  disabled
                  dense
                  label="Quantidade MO Prevista (Kg)"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantidade MO Atendido (Kg)"
                  rules="required"
                  vid="quantidadeMassaOriginalCorrigida"
                >
                  <v-text-field
                    v-model="
                      formularioMoTratoCorrigido.quantidadeMassaOriginalCorrigida
                    "
                    v-moeda="{ negativo: false, decimal: 3 }"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    class="required"
                    dense
                    label="Quantidade MO Atendido (Kg)"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
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
                  label="Código"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <v-text-field
                  v-model="formulario.status.text"
                  disabled
                  hide-details
                  dense
                  label="Status"
                  outlined
                  :color="formulario.status.color"
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <v-text-field
                  v-model="formulario.data"
                  disabled
                  hide-details
                  dense
                  label="Receita do Dia"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="6" xs="12">
                <v-text-field
                  v-model="formulario.descricao"
                  disabled
                  hide-details
                  dense
                  label="Descrição"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <v-text-field
                  v-model="formulario.quantidadeMassaSeca"
                  disabled
                  hide-details
                  dense
                  label="Total Massa Seca Prevista (Kg)"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="6" xs="12">
                <v-text-field
                  v-model="formulario.quantidadeMassaOriginal"
                  disabled
                  hide-details
                  dense
                  label="Total Massa Original Prevista (Kg)"
                  outlined
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="formulario.percentualMs"
                  disabled
                  hide-details
                  dense
                  label="Percentual Massa Seca (%)"
                  outlined
                />
              </v-col>
              <v-col cols="9">
                <v-text-field
                  v-model="formulario.dietaDescricao"
                  disabled
                  hide-details
                  dense
                  label="Dieta"
                  outlined
                />
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
      <!-- <v-card
        dense
        flat
        class="font-weight-bold justify-space-between black--text my-1"
        style="border-radius: 5px"
      >
        <v-card-title
          class="justify-space-between py-2 subtitle-1 font-weight-bold px-2"
        >
          <span>Receita do Dia: {{ formulario.data }}</span>
          <span>
            <v-chip small label outlined dark :color="formulario.status.color">
              {{ formulario.status.text }}
            </v-chip>
          </span>
        </v-card-title>
        <v-card-text class="justify-space-between px-0">
          <div
            class="mx-2 d-flex justify-space-between"
            style="border-bottom: 0.5px dashed #ddd"
          >
            Descrição
            <div class="grey--text font-weight-bold text-end">
              {{ formulario.descricao }}
            </div>
          </div>
          <div
            class="mx-2 d-flex justify-space-between"
            style="border-bottom: 0.5px dashed #ddd"
          >
            Total Massa Seca
            <div class="grey--text font-weight-bold text-end">
              {{ formulario.quantidadeMassaSeca }} (Kg)
            </div>
          </div>
          <div
            class="mx-2 d-flex justify-space-between"
            style="border-bottom: 0.5px dashed #ddd"
          >
            Total Massa Original
            <div class="grey--text font-weight-bold text-end">
              {{ formulario.quantidadeMassaOriginal }} (Kg)
            </div>
          </div>
          <div
            class="mx-2 d-flex justify-space-between"
            style="border-bottom: 0.5px dashed #ddd"
          >
            Dieta
            <div class="grey--text font-weight-bold text-end">
              {{ formulario.dietaDescricao }}
            </div>
          </div>
        </v-card-text>
      </v-card> -->
    </template>

    <template slot="acao">
      <v-btn
        color="primary"
        class="mx-2"
        title="Gerar Trato"
        @click="abrirModalGerarTrato()"
      >
        <v-icon left> mdi-plus-thick </v-icon>
        Gerar Trato
      </v-btn>
    </template>

    <template slot="relacionamento">
      <v-tabs v-model="tabsAgendaGerada">
        <v-tab value="agendasGeradas">Agendas de Tratos Gerados</v-tab>
        <v-tab value="tratosDoDiaGerado">Tratos do Dia</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabsAgendaGerada">
        <v-tab-item>
          <tabela
            ref="tabelaAgendasTrato"
            :colunas="colunasAgendasTratoGerada"
            :loading="loading"
            :paginacao="paginacaoFake"
            :registros="registrosAgendaTratoGerada"
            :registros-por-pagina="100"
            class="mt-4 mb-2"
            btn-expand-table
            height-auto
            toolbar-grid
            titulo="Agendas de Tratos Geradas"
            @paginacao="paginacaoFake = $event"
            @expand="
              (agendaTratoSelecionadaId = $event.id),
                listarRelacionamentoAgendaTrtao()
            "
            @expandUndo="resetExpandAgendaTrato()"
          >
            <template slot="botoes">
              <v-btn
                color="primary"
                title="Atualizar"
                outlined
                small
                @click="listarAgendaTratoGerada()"
              >
                <v-icon left> mdi-reload </v-icon>
                Atualizar
              </v-btn>
              <v-btn
                v-if="agendaTratoSelecionadaId"
                color="error"
                class="ml-2"
                title="Excluir Trato"
                outlined
                small
                @click="
                  aviso = {
                    modal: true,
                    key: 'excluirTrato',
                    text: 'Tem certeza que deseja <b>EXCLUIR</b> a geração desse <b>TRATO</b>?',
                  }
                "
              >
                <v-icon left> mdi-delete </v-icon>
                Excluir Trato
              </v-btn>
              <v-btn
                v-if="agendaTratoSelecionadaId"
                color="primary"
                class="ml-2"
                title="Finalizar Agenda de Trato"
                outlined
                small
                @click="
                  aviso = {
                    modal: true,
                    key: 'finalizarAgendaTrato',
                    text: 'Tem certeza que deseja <b>FINALIZAR</b> essa agenda de <b>TRATO</b>?',
                  }
                "
              >
                <v-icon left> mdi-check-all </v-icon>
                Finalizar Agenda de Trato
              </v-btn>
              <v-btn
                v-if="agendaTratoSelecionadaId"
                color="primary"
                class="ml-2"
                title="Reabrir Agenda de Trato"
                outlined
                small
                @click="
                  aviso = {
                    modal: true,
                    key: 'reabrirAgendaTrato',
                    text: 'Tem certeza que deseja <b>REABRIR</b> essa agenda de <b>TRATO</b>?',
                  }
                "
              >
                <v-icon left> mdi-check-all </v-icon>
                Reabrir Agenda de Trato
              </v-btn>
            </template>
          </tabela>

          <v-tabs
            v-if="agendaTratoSelecionadaId"
            v-model="tabs"
            bg-color="primary"
          >
            <v-tab value="ingredientes">Ingredientes</v-tab>
            <v-tab value="tratos">Tratos</v-tab>
            <v-tab value="movimentoLote">Movimento Lotes</v-tab>
            <v-tab value="leituraCocho">Preparos</v-tab>
          </v-tabs>

          <v-tabs-items v-if="agendaTratoSelecionadaId" v-model="tabs">
            <!-- Ingredientes -->
            <v-tab-item>
              <tabela
                :colunas="colunasIngredientes"
                :loading="loading"
                :paginacao="paginacaoFake"
                :registros="registrosReceitaIngrediente"
                :registros-por-pagina="100"
                class="mt-4 mb-2"
                height-auto
                exibir
                toolbar-grid
                titulo="Ingredientes da Receita"
                @paginacao="paginacaoFake = $event"
                @exibir="exibirRegistro($event)"
                @select="
                  $vuetify.breakpoint.mobile ? exibirRegistro($event.id) : ''
                "
              >
                <template slot="botoes">
                  <v-btn
                    color="primary"
                    title="Atualizar"
                    outlined
                    small
                    @click="listarIngredientes()"
                  >
                    <v-icon left> mdi-reload </v-icon>
                    Atualizar
                  </v-btn>
                </template>
              </tabela>
            </v-tab-item>

            <!-- Tratos -->
            <v-tab-item style="border: 1px solid #ccc" class="mb-4">
              <div class="font-weight-bold grey--text ma-2">
                Listagem dos Tratos da Agenda
              </div>
              <v-simple-table
                v-for="(item, idx) in registrosTratosAgrupados"
                :key="idx"
                dense
                class="mt-2"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th style="width: 50px !important" class="text-center">
                        Trato
                      </th>
                      <th style="width: 150px !important" class="text-left">
                        Status
                      </th>
                      <th style="width: 150px !important" class="text-right">
                        Total Massa Seca (Kg)
                      </th>
                      <th style="width: 150px !important" class="text-right">
                        Total Massa Original (Kg)
                      </th>
                      <th style="width: 150px !important" class="text-right">
                        Total Massa Seca Atendida (Kg)
                      </th>
                      <th style="width: 150px !important" class="text-right">
                        Total Massa Original Atendida (Kg)
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="width: 50px !important" class="text-center">
                        {{ item.id }}
                      </td>
                      <td style="width: 150px !important">
                        <v-chip
                          :color="item.status.color"
                          small
                          label
                          outlined
                          dark
                        >
                          {{ item.status.text }}
                        </v-chip>
                      </td>
                      <td style="width: 150px !important" class="text-right">
                        {{ item.quantidadeMassaSeca }}
                      </td>
                      <td style="width: 150px !important" class="text-right">
                        {{ item.quantidadeMassaOriginal }}
                      </td>
                      <td style="width: 150px !important" class="text-right">
                        {{ item.quantidadeMassaSecaAtendido }}
                      </td>
                      <td style="width: 150px !important" class="text-right">
                        {{ item.quantidadeMassaOriginalAtendido }}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colspan="1"></td>
                      <td colspan="12" class="pa-0 ma-0">
                        <tabela
                          :colunas="colunasMovimentosTratos"
                          :loading="loading"
                          :paginacao="paginacaoFake"
                          :registros="item.tratoMovimentos"
                          :registros-por-pagina="100"
                          sem-rodape
                          height-auto
                          exibir
                          toolbar-grid
                          titulo="Movimentos Tratos"
                          @paginacao="paginacaoFake = $event"
                          @exibir="exibirMovimentoTrato($event)"
                        />
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>

            <!-- Movimentos Lote -->
            <v-tab-item>
              <tabela
                :colunas="colunasMovimentosLote"
                :loading="loading"
                :paginacao="paginacaoFake"
                :registros="registrosLoteMovimento"
                :registros-por-pagina="100"
                class="mt-4 mb-2"
                height-auto
                exibir
                toolbar-grid
                titulo="Movimento do Lote"
                @paginacao="paginacaoFake = $event"
                @exibir="exibirRegistro($event)"
                @select="
                  $vuetify.breakpoint.mobile ? exibirRegistro($event.id) : ''
                "
              >
                <template slot="botoes">
                  <v-btn
                    color="primary"
                    title="Atualizar"
                    outlined
                    small
                    @click="listarLoteMovimento()"
                  >
                    <v-icon left> mdi-reload </v-icon>
                    Atualizar
                  </v-btn>
                </template>
              </tabela>
            </v-tab-item>

            <!-- Preparos -->
            <v-tab-item>
              <div
                class="font-weight-bold grey--text ma-2 d-flex justify-space-between"
              >
                Listagem dos Preparos da Receita
                <v-btn
                  color="primary"
                  class="mx-2"
                  title="Gerar Preparo Complementar"
                  @click="
                    (modalGerarPreparoComplementar = true),
                      (controleModalGerarPreparoComplementar.inserir = true)
                  "
                >
                  <v-icon left> mdi-plus-thick </v-icon>
                  Gerar Preparo Complementar
                </v-btn>
              </div>
              <v-simple-table
                v-for="(item, idx) in registrosPreparoAgrupado"
                :key="idx"
                dense
                class="mt-2"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th style="width: 100px !important" class="text-center">
                        Preparo
                      </th>
                      <th style="width: 150px !important" class="text-left">
                        Status
                      </th>
                      <th style="width: 150px !important" class="text-right">
                        Total Massa Seca (Kg)
                      </th>
                      <th style="width: 150px !important" class="text-right">
                        Total Massa Original (Kg)
                      </th>
                      <th style="width: 150px !important" class="text-right">
                        Total Massa Original Corrigida (Kg)
                      </th>
                      <th style="width: 150px !important" class="text-right">
                        Total Massa Seca Preparada (Kg)
                      </th>
                      <th style="width: 150px !important" class="text-right">
                        Total Massa Original Preparada (Kg)
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="widht: 400px !important">
                      <td class="text-center">
                        {{ item.id }}
                      </td>
                      <td>
                        <v-chip
                          :color="item.status.color"
                          small
                          label
                          outlined
                          dark
                        >
                          {{ item.status.text }}
                        </v-chip>
                      </td>
                      <td class="text-right">
                        {{ item.quantidadeMassaSeca }}
                      </td>
                      <td class="text-right">
                        {{ item.quantidadeMassaOriginal }}
                      </td>
                      <td class="text-right">
                        {{ item.quantidadeMassaOriginalCorrigida }}
                      </td>
                      <td class="text-right">
                        {{ item.quantidadeMassaSecaAtendido }}
                      </td>
                      <td class="text-right">
                        {{ item.quantidadeMassaOriginalAtendido }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1"></td>
                      <td colspan="6" class="pa-0 ma-0">
                        <tabela
                          :colunas="colunasPreparos"
                          :loading="loading"
                          :paginacao="paginacaoFake"
                          :registros="item.preparoAtendimento"
                          :registros-por-pagina="100"
                          btn-expand-table
                          sem-rodape
                          height-auto
                          toolbar-grid
                          toolbar-hight="50"
                          titulo="Preparo Atendimento"
                          @paginacao="paginacaoFake = $event"
                          @expand="
                            (atendimentoPreparoSelecionadoId = $event.id),
                              listarIngredientesAtendimentoPreparo()
                          "
                          @expandUndo="
                            resetExpandIngredientesAtendimentoPreparo()
                          "
                        >
                          <template slot="botoes">
                            <v-btn
                              color="primary"
                              title="Atualizar"
                              @click="
                                (preparoSelecionadoId = item.id),
                                  (modalGearAtendimentoPreparo = true)
                              "
                            >
                              <v-icon left> mdi-plus-thick </v-icon>
                              Gerar Atendimento do Preparo
                            </v-btn>
                          </template>
                        </tabela>

                        <tabela
                          v-if="atendimentoPreparoSelecionadoId"
                          :colunas="colunasPreparoAtendimentoIngrediente"
                          :loading="loading"
                          :paginacao="paginacaoFake"
                          :registros="preparoAtendimentoIngredientes"
                          :registros-por-pagina="100"
                          sem-rodape
                          height-auto
                          toolbar-grid
                          toolbar-hight="50"
                          titulo="Ingredientes do Atendimento do Preparo"
                          @paginacao="paginacaoFake = $event"
                          @campoEdit="
                            realizarAtendimentoManualIngrediente($event)
                          "
                        />
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
          </v-tabs-items>
        </v-tab-item>
        <v-tab-item class="mb-10">
          <tabela
            :colunas="colunasTratosGerados"
            :loading="loading"
            :paginacao="paginacaoFake"
            :registros="registrosTratosGerados"
            :registros-por-pagina="100"
            :search.sync="search"
            :fn-search="filterHistory"
            sem-rodape
            toolbar-grid
            titulo="Tratos Gerados"
            @paginacao="paginacaoFake = $event"
            @campoEdit="realizarTratoManualEmMassaGrid($event)"
          >
            <template v-slot:acao="{ registro }">
              <v-menu bottom offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :color="$vuetify.theme.dark ? 'primary' : 'secondary'"
                    :disabled="registro.disabled"
                    class="ma-1"
                    fab
                    height="25"
                    outlined
                    size="17"
                    small
                    title="Ações"
                    width="25"
                    v-on="on"
                  >
                    <v-icon class="pa-0" dark size="17"> mdi-menu </v-icon>
                  </v-btn>
                </template>

                <v-list class="pa-0 ma-0" dense>
                  <v-list-item
                    @click="
                      (formularioMoTratoCorrigido = registro),
                        (modalAlterarMoTratoCorrigido = true)
                    "
                  >
                    <v-list-item-icon class="mr-2">
                      <v-icon color="primary" size="20"> mdi-pencil</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        Alterar Qtd. MO Corrigida
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template slot="cabecalho">
              <v-row class="ma-2" dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="search"
                    v-mask="mascara('T', 250)"
                    append-icon="mdi-magnify"
                    clearable
                    dense
                    hide-details
                    label="Filtro de Registros da Tabela"
                    outlined
                    placeholder="Pesquise aqui qualquer valor na tabela."
                  />
                </v-col>
              </v-row>
            </template>
            <template slot="botoes">
              <v-btn
                color="primary"
                title="Atualizar"
                outlined
                small
                @click="listarAgendaTratoGerada()"
              >
                <v-icon left> mdi-reload </v-icon>
                Atualizar
              </v-btn>
            </template>
          </tabela>
        </v-tab-item>
      </v-tabs-items>
    </template>

    <template slot="listagem">
      <filtro
        v-if="!$vuetify.breakpoint.mobile"
        :options="optionsFilter"
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row class="pa-0" dense>
              <v-col cols="12" xl="4" lg="4" md="4" xs="12">
                <dateRange
                  v-model="filtro.periodo"
                  :error-messages="[]"
                  @listar="filtro.periodo.dataInicio ? listarRegistros() : ''"
                />
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4" xs="12">
                <select-all
                  v-model="filtro.status"
                  :items="[]"
                  clearable
                  dense
                  hide-details
                  item-value="id"
                  item-text="descricao"
                  label="Status"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4" xs="12">
                <v-text-field
                  v-model="filtro.descricao"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Descricao"
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
        @clearFilters="limparFiltros(), listarRegistros()"
        @search="listarRegistros()"
      >
        <template slot="filtros">
          <v-container class="my-0 py-0" fluid>
            <v-row class="pa-0" dense>
              <v-col cols="12">
                <dateRange
                  v-model="filtro.periodo"
                  :error-messages="[]"
                  @listar="filtro.periodo.dataInicio ? listarRegistros() : ''"
                />
              </v-col>
              <v-col cols="12">
                <select-all
                  v-model="filtro.status"
                  :items="[]"
                  clearable
                  dense
                  hide-details
                  item-value="id"
                  item-text="descricao"
                  label="Status"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="filtro.descricao"
                  v-mask="mascara('T', 250)"
                  hide-details
                  dense
                  label="Descricao"
                  outlined
                  @keypress.enter="listarRegistros()"
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
        titulo="Receitas"
        @paginacao="paginacaoFake = $event"
        @exibir="exibirRegistro($event)"
        @select="$vuetify.breakpoint.mobile ? exibirRegistro($event.id) : ''"
      >
        <template slot="botoes">
          <v-btn
            color="primary"
            title="Adicionar"
            @click="
              (dataMovimentoReceira = $day().format('YYYY-MM-DD')),
                (modalGerarReceita = true)
            "
          >
            <v-icon left> mdi-plus-thick </v-icon>
            Nova Receita
          </v-btn>
        </template>
      </tabela>
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moeda from "@tiig/moeda";
import opcao from "@/plugins/opcoes";

export default {
  name: "PaginaConfinamentoReceita",

  data: () => ({
    search: "",
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
        width: 50,
      },
      {
        text: "Receita",
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
        width: 100,
      },
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 50,
      },
      {
        text: "Quantidade Massa Seca Prevista (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaSeca",
        width: 50,
      },
      {
        text: "Quantidade Massa Original Prevista (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginal",
        width: 50,
      },
      {
        text: "Massa Seca (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "percentualMs",
        width: 50,
      },
      {},
    ],
    colunasAgendasTratoGerada: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
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
        text: "Data",
        align: "start",
        sortable: true,
        sort: "date",
        value: "data",
        width: 50,
      },
      {
        text: "Hora",
        align: "start",
        sortable: true,
        value: "hora",
        width: 50,
      },
      {
        text: "Percentual Distribuição (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "percentualDistribuicao",
        width: 50,
      },
      {
        text: "Qtd. MS Prevista (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaSeca",
        width: 50,
      },
      {
        text: "Qtd. MS Realizada (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaSecaAtendido",
        width: 50,
      },
      {
        text: "Qtd. MO Prevista (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginal",
        width: 50,
      },
      {
        text: "Qtd. MO Corrigida (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginalCorrigida",
        width: 50,
      },
      {
        text: "Qtd. MO Realizada (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginalAtendido",
        width: 50,
      },
      {
        text: "Diferença (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "diferenca",
        width: 50,
      },
      {},
    ],
    colunasIngredientes: [
      {
        text: "Ingrediente",
        align: "start",
        sortable: true,
        value: "alimentoDescricao",
        width: 150,
      },
      {
        text: "Análise Massa Seca (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "percentualMassaSeca",
        width: 50,
      },
      {
        text: "Composição Massa Seca (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "inclusaoMassaSeca",
        width: 50,
      },
      {
        text: "Composição Massa Original (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "inclusaoMassaOriginal",
        width: 50,
      },
      {
        text: "Quantidade Massa Seca (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaSeca",
        width: 50,
      },
      {
        text: "Quantidade Massa Original (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginal",
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
        sort: "date",
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
        text: "MS (%)",
        align: "end",
        sortable: true,
        value: "percentualMsTRATO",
        width: 50,
      },
      {
        text: "Qtd. Animais",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdAnimais",
        width: 50,
      },
      {
        text: "CMS/ PV (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "ingestaoMassaSeca",
        width: 50,
      },
      {
        text: "Peso Médio Entrada (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoMedioEntrada",
        width: 50,
      },
      {
        text: "Peso Médio Anterior (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoMedioAnterior",
        width: 50,
      },
      {
        text: "Peso Médio Atual (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "pesoMedioAtual",
        width: 50,
      },
      // {
      //   text: "MS/Animal/Base/Dia (Kg)",
      //   align: "end",
      //   sortable: true,
      //   sort: "money",
      //   value: "qtdMsAnimalBase",
      //   width: 50,
      // },
      {
        text: "Aumento/Dia (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "percentualAumento",
        width: 50,
      },
      {
        text: "MS/Animal/Previsto/Dia (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMsAnimalRealizada",
        width: 50,
      },
      // {
      //   text: "MS/Lote/Base/Dia (Kg)",
      //   align: "end",
      //   sortable: true,
      //   sort: "money",
      //   value: "qtdMsLote",
      //   width: 50,
      // },
      // {
      //   text: "MS/Aumento/Dia (Kg)",
      //   align: "end",
      //   sortable: true,
      //   sort: "money",
      //   value: "qtdMsAumentoLote",
      //   width: 50,
      // },
      // {
      //   text: "MO/Animal/Trato (Kg)",
      //   align: "end",
      //   sortable: true,
      //   sort: "money",
      //   value: "qtdMoAnimalTRATO",
      //   width: 50,
      // },
      {
        text: "MO/Animal/Dia (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMoAnimal",
        width: 50,
      },
      {
        text: "MO/Lote/Dia (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "qtdMoLote",
        width: 50,
      },
      {},
    ],
    colunasMovimentosTratos: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 50,
      },
      {
        text: "Piquete",
        align: "center",
        sortable: true,
        value: "piqueteDescricao",
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
        text: "Lote",
        align: "start",
        sortable: true,
        value: "loteDescricao",
        width: 50,
      },
      {
        text: "Qtd. Animais",
        align: "center",
        sortable: true,
        value: "quantidadeAnimais",
        width: 50,
      },
      {
        text: "Aumento (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "percentualAumento",
        width: 50,
      },
      {
        text: "Qtd. MO Previsto (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginal",
        width: 50,
      },
      {
        text: "Qtd. MO Corrigida (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginalCorrigida",
        width: 50,
      },
      {
        text: "Qtd. MO Realizada (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeRealMassaOriginalTrato",
        width: 50,
      },
      {
        text: "Diferença (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "diferenca",
        width: 50,
      },
      {},
    ],
    colunasTratosGerados: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 50,
      },
      {
        text: "Piquete",
        align: "center",
        sortable: true,
        value: "piqueteCodigo",
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
        text: "Lote",
        align: "start",
        sortable: true,
        value: "loteDescricao",
        width: 50,
      },
      {
        text: "Agenda Hora",
        align: "start",
        sortable: true,
        value: "agendaTratoHora",
        width: 50,
      },
      {
        text: "Qtd. Animais",
        align: "center",
        sortable: true,
        value: "quantidadeAnimais",
        width: 50,
      },
      {
        text: "Aumento (%)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "percentualAumento",
        width: 50,
      },
      {
        text: "Qtd. MO Previsto (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginal",
        width: 50,
      },
      {
        text: "Qtd. MO Corrigida (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginalCorrigida",
        width: 50,
      },
      {
        text: "Qtd. MO Realizada (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        // value: "quantidadeRealMassaOriginalTrato",
        value: "campoEdit",
        width: 50,
      },
      {
        text: "Diferença (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "diferenca",
        width: 50,
      },
      // {
      //   text: "Criado Por",
      //   align: "start",
      //   sortable: true,
      //   value: "createdBy",
      //   width: 50,
      // },
      // {
      //   text: "Criado Em",
      //   align: "start",
      //   sortable: true,
      //   sort: "date",
      //   value: "createdAt",
      //   width: 50,
      // },
      // {
      //   text: "Alterado Por",
      //   align: "start",
      //   sortable: true,
      //   value: "updatedBy",
      //   width: 50,
      // },
      // {
      //   text: "Alterado Em",
      //   align: "start",
      //   sortable: true,
      //   sort: "date",
      //   value: "updatedAt",
      //   width: 50,
      // },
      {},
    ],
    colunasPreparos: [
      {
        text: "Ação",
        align: "center",
        sortable: true,
        value: "acao",
        width: 50,
      },
      {
        text: "Preparo Atendimento",
        align: "center",
        sortable: true,
        value: "id",
        width: 50,
      },
      {
        text: "Equipamento",
        align: "start",
        sortable: true,
        value: "equipamento",
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
        text: "Quantidade Massa Seca (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaSeca",
        width: 50,
      },
      {
        text: "Quantidade Massa Original (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginal",
        width: 50,
      },
      {
        text: "Quantidade Massa Seca Atendida(Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaSecaAtendido",
        width: 50,
      },
      {
        text: "Quantidade Massa Original Atendida (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginalAtendido",
        width: 50,
      },
      {},
    ],
    colunasPreparoAtendimentoIngrediente: [
      {
        text: "Receita Ingrediente Atendimento",
        align: "center",
        sortable: true,
        value: "id",
        width: 50,
      },
      {
        text: "Alimento",
        align: "start",
        sortable: true,
        value: "alimentoDescricao",
        width: 50,
      },
      {
        text: "MS Alimento (%)",
        align: "end",
        sortable: true,
        value: "percentualMassaSecaIngrediente",
        width: 50,
      },
      {
        text: "Qtd. Massa Seca (Kg)",
        align: "end",
        sortable: true,
        value: "quantidadeMassaSeca",
        width: 50,
      },
      {
        text: "Quantidade Massa Original (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaOriginal",
        width: 50,
      },
      {
        text: "Quantidade Massa Seca Atendida(Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        value: "quantidadeMassaSecaAtendido",
        width: 50,
      },
      {
        text: "Quantidade Massa Original Atendida (Kg)",
        align: "end",
        sortable: true,
        sort: "money",
        // value: "quantidadeMassaOriginalAtendido",
        value: "campoEdit",
        width: 50,
      },
      {},
    ],
    filtro: {
      periodo: {
        dataInicio: null,
        dataFim: null,
      },
      status: [],
      descricao: null,
    },
    formulario: {
      id: null,
      status: {
        chip: false,
        color: null,
        text: null,
      },
      dietaId: null,
      data: null,
      descricao: null,
      percentualMs: null,
      quantidadeMassaSeca: null,
      quantidadeMassaOriginal: null,
      dietaDescricao: null,
    },
    modal: false,
    tabs: null,
    tabsAgendaGerada: null,
    loading: false,
    paginacaoFake: {
      pagina: 1,
      registros: 20,
      totalRegistros: 0,
    },

    agendaTratoSelecionadaId: null,

    modalGerarTrato: false,
    diferencaTratoAnterior: null,
    agendaSelecionadaGerarTrato: null,

    modalRealizarTratoManual: false,
    controleModalRealizarTratoManual: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    formularioTratoMovimento: {
      id: null,
      tratoId: null,
      receitaId: null,
      loteId: null,
      loteDescricao: null,
      piqueteId: null,
      piqueteDescricao: null,
      status: null,
      statusDescricao: null,
      percentualAumento: null,
      quantidadeMsAumento: null,
      quantidadeMassaSeca: null,
      quantidadeMassaOriginal: null,
      quantidadeMassaOriginalCorrigida: null,
      quantidadeRealMassaSecaTrato: null,
      quantidadeRealMassaOriginalTrato: null,
    },

    controleModalGerarPreparoComplementar: {
      inserir: false,
      exibir: false,
      editar: false,
    },
    modalGerarPreparoComplementar: false,
    quantidadeMassaOriginalPreparo: null,

    modalGerarReceita: false,
    dataMovimentoReceira: null,

    registrosTratosGerados: [],

    formularioMoTratoCorrigido: {},
    modalAlterarMoTratoCorrigido: false,

    modalGearAtendimentoPreparo: false,
    quantidadeMassaOriginalAtendimentoPreparo: null,
    preparoSelecionadoId: null,

    atendimentoPreparoSelecionadoId: null,
    preparoAtendimentoIngredientes: [],
  }),

  computed: {
    ...mapState("paginaConfinamentoReceita", [
      "agendaTratos",
      "registros",
      "registrosAgendaTratoGerada",
      "registrosReceitaIngrediente",
      "registrosTratosAgrupados",
      "registrosLoteMovimento",
      "registrosPreparoAgrupado",
    ]),
    optionsFilter() {
      return {
        values: !!(
          this.filtro.descricao ||
          this.filtro.periodo.dataInicio ||
          this.filtro.periodo.dataFim ||
          this.filtro.status.length
        ),
      };
    },
    optionsModal() {
      return {
        title: "Escolha a Agenda para Gerar o Trato!",
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
    optionsModalRealizarTratoManual() {
      return {
        title: "Realizar Trato Manual",
        width: 700,
        actions: [
          {
            title:
              this.controleModalRealizarTratoManual.exibir &&
              !this.controleModalRealizarTratoManual.inserir
                ? "Editar"
                : "Salvar",
            color: this.$vuetify.theme.dark ? "accent" : "primary",
            icon:
              this.controleModalRealizarTratoManual.exibir &&
              !this.controleModalRealizarTratoManual.inserir
                ? "mdi-pencil"
                : "mdi-content-save",
            emit:
              this.controleModalRealizarTratoManual.exibir &&
              !this.controleModalRealizarTratoManual.inserir
                ? "editar"
                : "salvar",
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
    optionsModalGerarPreparoComplementar() {
      return {
        title: this.controleModalGerarPreparoComplementar.inserir
          ? "Gerar Preparo Complementar"
          : "Preparo complementar",
        width: 700,
        maisOpcoes: this.controleModalGerarPreparoComplementar.editar,
        actions: [
          {
            title:
              this.controleModalGerarPreparoComplementar.exibir &&
              !this.controleModalGerarPreparoComplementar.inserir
                ? "Editar"
                : "Salvar",
            color: this.$vuetify.theme.dark ? "accent" : "primary",
            icon:
              this.controleModalGerarPreparoComplementar.exibir &&
              !this.controleModalGerarPreparoComplementar.inserir
                ? "mdi-pencil"
                : "mdi-content-save",
            emit:
              this.controleModalGerarPreparoComplementar.exibir &&
              !this.controleModalGerarPreparoComplementar.inserir
                ? "editar"
                : "salvar",
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
    optionsModalGearReceita() {
      return {
        title: "Gerar Trato",
        width: 400,
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
    optionsModalAlterarMoTrato() {
      return {
        title: "Alterar MO Trato",
        width: 400,
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
    optionsModalGerarAtendimentoPreparo() {
      return {
        title: "Gerar Atendimento Preparo",
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

  async created() {
    this.listarRegistros();
    await this.agendaTratoListar();
  },
  methods: {
    ...mapActions("paginaConfinamentoReceita", [
      "listar",
      "exibir",
      "receitaGerar",

      "agendaTratoGeradaListar",

      "agendaTratoListar",
      "tratoAgendaGerar",

      "diferencaTratoListar",

      "ingredientesListar",
      "tatosAgrupadosListar",
      "loteMovimentoListar",
      "preparoAgrupadoListar",

      "movimentoTratoExibir",
      "tratoManualRealizar",

      "tratoExcluir",

      "preparoComplementarGerar",

      "tratosGeradosListar",
      "agendaTratoFinalizar",
      "agendaTratoReabrir",

      "moCorrigidoTratoAlterar",

      "atendimentoPreparoGerar",
      "ingredientesAtendimentoPreparoListar",
      "ingredientesAtendimentoPreparoAtender",
    ]),
    async listarRegistros() {
      this.loading = true;

      await this.listar({
        descricao: this.filtro.descricao || undefined,
        dataInicio: this.filtro.periodo.dataInicio || undefined,
        dataFim: this.filtro.periodo.dataFim || undefined,
        status: this.filtro.status.length ? this.filtro.status : undefined,
      });

      this.loading = false;
    },
    limparFiltros() {
      this.filtro = {
        descricao: null,
        periodo: {
          dataInicio: null,
          dataFim: null,
        },
        status: [],
      };
    },
    async exibirRegistro(id) {
      this.loading = true;

      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          dietaId: res.dietaId || null,
          data: this.$day(res.data).format("DD/MM/YYYY") || null,
          descricao: res.descricao || null,
          percentualMs: res.quantidadeMassaSeca
            ? moeda.format(
                (Number(res.quantidadeMassaSeca) /
                  Number(res.quantidadeMassaOriginal)) *
                  100 || 0,
                2
              )
            : 0,
          quantidadeMassaSeca: moeda.format(
            Number(res.quantidadeMassaSeca) || 0,
            2
          ),
          quantidadeMassaOriginal: moeda.format(
            Number(res.quantidadeMassaOriginal) || 0,
            2
          ),
          dietaDescricao: `${res.dieta.descricao} | GPD: ${moeda.format(
            Number(res.dieta.ganhoMedioDia) || 0,
            2
          )} (Kg) | DURAÇÂO: ${res.dieta.quantidadeDiasUso} dias`,
          status: {
            chip: true,
            color: opcao.statusCor(3, res.statusReceita.item),
            text: res.statusReceita.descricao || " - ",
          },
        };
        this.modal = true;

        this.listarAgendaTratoGerada();
      }

      this.loading = false;
    },

    async gerarReceita() {
      if (await this.$refs.observerModalGerarReceita.validate()) {
        this.loading = true;

        const res = await this.receitaGerar({
          dataMovimento: this.dataMovimentoReceira || undefined,
        });

        if (res && !res.erro) {
          await this.listarRegistros();
          this.resetModalGerarReceita();
        }

        this.loading = false;
      }
    },
    resetModalGerarReceita() {
      if (this.$refs.observerModalGerarReceita)
        this.$refs.observerModalGerarReceita.reset();
      this.modalGerarReceita = false;
      this.dataMovimentoReceira = null;
    },

    resetFormulario() {
      this.modal = false;
      this.formulario = {
        id: null,
        status: {
          chip: false,
          color: null,
          text: null,
        },
        dietaId: null,
        data: null,
        descricao: null,
        percentualMs: null,
        quantidadeMassaSeca: null,
        quantidadeMassaOriginal: null,
        dietaDescricao: null,
      };

      this.resetExpandAgendaTrato();
      this.listarRegistros();
    },

    async listarAgendaTratoGerada() {
      await this.agendaTratoGeradaListar(this.formulario.id);
      const res = await this.tratosGeradosListar({
        receitaId: this.formulario.id,
      });
      if (res && !res.erro) {
        res.forEach((element) => {
          element.diferenca =
            moeda.format(
              Number(element.quantidadeMassaOriginalCorrigida) -
                Number(element.quantidadeRealMassaOriginalTrato) || 0,
              3
            ) || "";

          element.campoEdit = moeda.format(Number(element.campoEdit) || 0, 3);

          element.percentualAumento = moeda.format(
            Number(element.percentualAumento) || 0,
            2
          );
          element.quantidadeMsAumento = moeda.format(
            Number(element.quantidadeMsAumento) || 0,
            3
          );
          element.quantidadeAnimais = moeda.format(
            Number(element.loteQuantidadeAnimais) || 0,
            0
          );
          element.quantidadeMassaSeca = moeda.format(
            Number(element.quantidadeMassaSeca) || 0,
            3
          );
          element.quantidadeMassaOriginal = moeda.format(
            Number(element.quantidadeMassaOriginal) || 0,
            3
          );
          element.quantidadeMassaOriginalCorrigida = moeda.format(
            Number(element.quantidadeMassaOriginalCorrigida) || 0,
            3
          );

          element.quantidadeRealMassaOriginalTrato = moeda.format(
            Number(element.quantidadeRealMassaOriginalTrato) || 0,
            3
          );
          element.quantidadeRealMassaSecaTrato = moeda.format(
            Number(element.quantidadeRealMassaSecaTrato) || 0,
            3
          );

          element.status = {
            chip: true,
            color: opcao.statusCor(5, element.status),
            text: element.statusDescricao || " - ",
          };
        });

        this.registrosTratosGerados = res;
      }
    },
    resetExpandAgendaTrato() {
      this.agendaTratoSelecionadaId = null;
      // this.$store.commit(
      //   "paginaConfinamentoReceita/registrosAgendaTratoGerada",
      //   []
      // );
      this.$store.commit(
        "paginaConfinamentoReceita/registrosReceitaIngrediente",
        []
      );
      this.$store.commit(
        "paginaConfinamentoReceita/registrosTratosAgrupados",
        []
      );
      this.$store.commit(
        "paginaConfinamentoReceita/registrosLoteMovimento",
        []
      );
      this.$store.commit(
        "paginaConfinamentoReceita/registrosPreparoAgrupado",
        []
      );
    },

    async listarRelacionamentoAgendaTrtao() {
      this.listarIngredientes();
      this.listarTratosAgrupados();
      this.listarLoteMovimento();
      this.listarPreparoAgrupado();
    },

    async listarIngredientes() {
      await this.ingredientesListar({
        receitaId: this.formulario.id,
        agendaTratoId: this.agendaTratoSelecionadaId,
      });
    },
    async listarTratosAgrupados() {
      await this.tatosAgrupadosListar({
        receitaId: this.formulario.id,
        agendaTratoId: this.agendaTratoSelecionadaId,
        diaMovimento: this.formulario.data
          ? this.$day(this.formulario.data, "DD/MM/YYYY").format("YYYY-MM-DD")
          : undefined,
      });
    },
    async listarLoteMovimento() {
      await this.loteMovimentoListar({
        receitaId: this.formulario.id,
        agendaTratoId: this.agendaTratoSelecionadaId,
      });
    },
    async listarPreparoAgrupado() {
      await this.preparoAgrupadoListar({
        receitaId: this.formulario.id,
        agendaTratoId: this.agendaTratoSelecionadaId,
      });
    },

    async abrirModalGerarTrato() {
      this.loading = true;
      const res = await this.diferencaTratoListar(this.formulario.id);
      if (res && !res.erro) {
        this.diferencaTratoAnterior = moeda.format(
          Number(res.diferenca) || 0,
          3
        );
        this.modalGerarTrato = true;
      }
      this.loading = false;
    },
    async gerarTrato() {
      if (await this.$refs.observerGerarTrato.validate()) {
        this.loading = true;
        const res = await this.tratoAgendaGerar({
          receitaId: this.formulario.id || undefined,
          agendaTratoId: this.agendaSelecionadaGerarTrato || undefined,
          diferencaTratoAnterior:
            moeda.strip(this.diferencaTratoAnterior) || undefined,
        });

        if (res && !res.erro) {
          this.modalGerarTrato = false;
          this.agendaSelecionadaGerarTrato = null;
          this.exibirRegistro(this.formulario.id);
        }

        this.loading = false;
      }
    },

    async exibirMovimentoTrato(id) {
      this.loading = true;
      const res = await this.movimentoTratoExibir(id);
      if (res && !res.erro) {
        this.formularioTratoMovimento = {
          id: res.id || null,
          tratoId: res.tratoId || null,
          receitaId: res.receitaId || null,
          loteId: res.loteId || null,
          loteDescricao: res.loteDescricao || null,
          piqueteId: res.piqueteId || null,
          piqueteDescricao: res.piqueteDescricao || null,
          status: res.status || null,
          statusDescricao: res.statusDescricao || null,
          percentualAumento: moeda.format(res.percentualAumento || 0, 3),
          quantidadeMsAumento: moeda.format(res.quantidadeMsAumento || 0, 3),
          quantidadeMassaSeca: moeda.format(res.quantidadeMassaSeca || 0, 3),
          quantidadeMassaOriginal: moeda.format(
            Number(res.quantidadeMassaOriginal) || 0,
            3
          ),
          quantidadeMassaOriginalCorrigida: moeda.format(
            Number(res.quantidadeMassaOriginalCorrigida) || 0,
            3
          ),
          quantidadeRealMassaSecaTrato: moeda.format(
            Number(res.quantidadeRealMassaSecaTrato) || 0,
            3
          ),
          quantidadeRealMassaOriginalTrato: moeda.format(
            Number(res.quantidadeRealMassaOriginalTrato) || 0,
            3
          ),
        };

        this.modalRealizarTratoManual = true;
        this.controleModalRealizarTratoManual.exibir = true;
      }
      this.loading = false;
    },
    async realizarTratoManual() {
      this.loading = true;
      const res = await this.tratoManualRealizar({
        id: this.formularioTratoMovimento.id || undefined,
        quantidadeRealMassaOriginalTrato:
          moeda.strip(
            this.formularioTratoMovimento.quantidadeRealMassaOriginalTrato
          ) || 0,
      });
      if (res && !res.erro) {
        this.resetModalTratoMovimento();
        this.listarAgendaTratoGerada();
      }
      this.loading = false;
    },
    resetModalTratoMovimento() {
      this.modalRealizarTratoManual = false;
      this.controleModalRealizarTratoManual = {
        inserir: false,
        exibir: false,
        editar: false,
      };
      this.formularioTratoMovimento = {
        id: null,
        tratoId: null,
        receitaId: null,
        loteId: null,
        loteDescricao: null,
        piqueteId: null,
        piqueteDescricao: null,
        status: null,
        statusDescricao: null,
        percentualAumento: null,
        quantidadeMsAumento: null,
        quantidadeMassaSeca: null,
        quantidadeMassaOriginal: null,
        quantidadeMassaOriginalCorrigida: null,
        quantidadeRealMassaSecaTrato: null,
        quantidadeRealMassaOriginalTrato: null,
      };
    },
    async realizarTratoManualEmMassaGrid(item) {
      this.loading = true;
      const res = await this.tratoManualRealizar({
        id: item.id || undefined,
        quantidadeRealMassaOriginalTrato: moeda.strip(item.campoEdit) || 0,
      });
      if (res && !res.erro) {
        this.listarAgendaTratoGerada();
      }
      this.loading = false;
    },

    async excluirTrato() {
      this.loading = true;
      const res = await this.tratoExcluir({
        agendaTratoId: this.agendaTratoSelecionadaId || undefined,
        receitaId: this.formulario.id || undefined,
      });
      if (res && !res.erro) {
        this.$refs.tabelaAgendasTrato.expandUndoTable();
        this.resetExpandAgendaTrato();
        this.exibirRegistro(this.formulario.id);
        // this.listarAgendaTratoGerada();
      }
      this.loading = false;
    },

    async gerarPreparoComplementar() {
      if (await this.$refs.observerModalGerarPreparoComplementar.validate()) {
        this.loading = true;

        const res = await this.preparoComplementarGerar({
          receitaId: this.formulario.id || undefined,
          agendaTratoId: this.agendaTratoSelecionadaId || undefined,
          quantidadeMassaOriginalPreparo:
            moeda.strip(this.quantidadeMassaOriginalPreparo) || undefined,
        });

        if (res && !res.erro) {
          this.resetModalGerarPreparoComplementar();
          this.listarAgendaTratoGerada();
        }

        this.loading = false;
      }
    },
    resetModalGerarPreparoComplementar() {
      this.modalGerarPreparoComplementar = false;
      this.quantidadeMassaOriginalPreparo = null;
      this.controleModalGerarPreparoComplementar = {
        inserir: false,
        exibir: false,
        editar: false,
      };
    },

    filterHistory(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },

    async finalizarAgendaTrato() {
      this.loading = true;
      const res = await this.agendaTratoFinalizar({
        receitaId: this.formulario.id || undefined,
        agendaTratoId: this.agendaTratoSelecionadaId || undefined,
      });

      if (res && !res.erro) {
        this.listarAgendaTratoGerada();
      }

      this.loading = false;
    },
    async reabrirAgendaTrato() {
      this.loading = true;
      const res = await this.agendaTratoReabrir({
        receitaId: this.formulario.id || undefined,
        agendaTratoId: this.agendaTratoSelecionadaId || undefined,
      });

      if (res && !res.erro) {
        this.listarAgendaTratoGerada();
      }

      this.loading = false;
    },

    async alterarQtdMOTrato() {
      if (await this.$refs.observerAlterarTratoNO.validate()) {
        this.loading = true;

        const res = await this.moCorrigidoTratoAlterar({
          id: this.formularioMoTratoCorrigido.id || undefined,
          quantidadeMassaOriginalCorrigida:
            moeda.strip(
              this.formularioMoTratoCorrigido.quantidadeMassaOriginalCorrigida
            ) || undefined,
        });
        if (res && !res.erro) {
          this.resetModalAlterarMo();
          this.listarAgendaTratoGerada();
        }

        this.loading = false;
      }
    },
    resetModalAlterarMo() {
      this.modalAlterarMoTratoCorrigido = false;
      this.formularioMoTratoCorrigido = {};
    },

    async gerarAtendimentoDoPreparo() {
      if (await this.$refs.observerModalGerarAtendimentoPreparo.validate()) {
        this.loading = true;

        const res = await this.atendimentoPreparoGerar({
          preparoId: this.preparoSelecionadoId || undefined,
          quantidadeMassaOriginalAtendimentoPreparo:
            moeda.strip(this.quantidadeMassaOriginalAtendimentoPreparo) ||
            undefined,
        });

        if (res && !res.erro) {
          this.resetModalAtendimentoPreparo();
          this.listarRelacionamentoAgendaTrtao();
        }

        this.loading = false;
      }
    },
    resetModalAtendimentoPreparo() {
      this.modalGearAtendimentoPreparo = false;
      this.quantidadeMassaOriginalAtendimentoPreparo = null;
      this.preparoSelecionadoId = null;
    },

    async listarIngredientesAtendimentoPreparo() {
      this.loading = true;
      const res = await this.ingredientesAtendimentoPreparoListar(
        this.atendimentoPreparoSelecionadoId
      );
      res.forEach((element) => {
        element.campoEdit = moeda.format(Number(element.campoEdit) || 0, 3);
        element.percentualMassaSecaIngrediente = moeda.format(
          Number(element.percentualMassaSecaIngrediente) || 0,
          2
        );
        element.quantidadeMassaSeca = moeda.format(
          Number(element.quantidadeMassaSeca) || 0,
          3
        );
        element.quantidadeMassaOriginal = moeda.format(
          Number(element.quantidadeMassaOriginal) || 0,
          3
        );
        element.quantidadeMassaSecaAtendido = moeda.format(
          Number(element.quantidadeMassaSecaAtendido) || 0,
          3
        );
        element.quantidadeMassaOriginalAtendido = moeda.format(
          Number(element.quantidadeMassaOriginalAtendido) || 0,
          3
        );
      });

      if (res && !res.erro) this.preparoAtendimentoIngredientes = res;

      this.loading = false;
    },
    resetExpandIngredientesAtendimentoPreparo() {
      this.atendimentoPreparoSelecionadoId = null;
    },
    async realizarAtendimentoManualIngrediente(item) {
      this.loading = true;
      const res = await this.ingredientesAtendimentoPreparoAtender({
        id: item.id || undefined,
        alimentoId: item.alimentoId || undefined,
        quantidadeRealMassaOriginalIngrediente:
          moeda.strip(item.campoEdit) || 0,
      });
      if (res && !res.erro) {
        this.listarAgendaTratoGerada();
      }
      this.loading = false;
    },
  },
};
</script>
