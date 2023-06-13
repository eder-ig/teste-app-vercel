<template>
  <div v-resize="newCalculaTableHeigth">
    <v-data-table
      id="10"
      ref="tabela"
      v-model="selected"
      v-sortable-table="sortable"
      :class="
        flat ? 'elevation-0 componente-tabela' : 'elevation-1 componente-tabela'
      "
      :custom-filter="fnSearch"
      :custom-sort="customSort"
      :disable-pagination="semRodape || semRodapeExpand || !!search"
      :expanded.sync="expanded"
      :headers="colunas"
      :height="
        heightAuto ? (registros.length >= 20 ? tableHeight : '') : height || ''
      "
      :hide-default-header="hideDefaultHeader"
      :item-key="itemKey"
      :item-class="itemClass"
      :items="
        selectedExpand.length
          ? selectedExpand
          : registros.length
          ? registros
          : []
      "
      :items-per-page="rowsPerPage || 100"
      :loading="loading"
      :mobile-breakpoint="mobileBreackpoint ? 700 : 0"
      :page="page"
      :server-items-length="itensServidor"
      :show-select="selecionar"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :single-expand="expand"
      :show-expand="expand"
      :search="search"
      calculate-widths
      dense
      fixed-header
      hide-default-footer
      style="border-radius: 0px !important"
      @sorted="$emit('sorted', $event)"
      @click:row="noClickRow ? '' : $emit('select', $event)"
      @dblclick:row="acaoDbClick"
    >
      <template
        v-for="(coluna, index) in colunasCustomizadas"
        v-slot:[`item.${coluna}`]="{ value }"
      >
        <span
          v-if="
            [0, '0', '0,000'].includes(value) ||
            (value && value.indexOf('<span') === -1)
          "
          :key="index"
          :style="
            [0, '0', '0,000'].includes(value)
              ? 'font-weight: bold; color: #4CAF50'
              : value < 0
              ? 'font-weight: bold; color: #eb2f06'
              : 'font-weight: bold; color: #0277BD'
          "
        >
          {{ value }}
        </span>
        <span v-else :key="index" class="font-weight-mediun" v-html="value" />
      </template>
      <template v-slot:top="{ items }">
        <v-toolbar
          v-if="toolbarGrid"
          :height="toolbarHight"
          :style="corToolbar ? `background: ${corToolbar}` : ''"
          dense
          flat
        >
          <v-btn
            v-if="voltarListagem"
            :title="tituloVoltar"
            icon
            width="30"
            small
            @click="$emit('voltar')"
          >
            <v-icon pl-3 dark> mdi-chevron-left </v-icon>
          </v-btn>
          <v-toolbar-title class="pa-0 ma-0 subtitle-2 font-weight-bold">
            {{ titulo }}
          </v-toolbar-title>
          <span v-if="subtitulo" class="body-2 font-weight-light mt-1">
            {{ subtitulo }}
          </span>
          <v-divider
            v-if="titulo || subtitulo"
            vertical
            inset
            style="border-width: 1px; border-color: #fff5; border-radius: 25%"
            size="30"
            class="mx-2"
          />
          <slot :items="items" name="titulo" />
          <v-spacer />
          <slot name="botoes" />

          <v-menu v-if="$slots.maisOpcoes" offset-y>
            <template v-slot:activator="{ on }">
              <v-tooltip activator=".btn_mais_opcoes" bottom>
                <span>Mais Opções</span>
              </v-tooltip>
              <v-btn
                :color="$vuetify.theme.dark ? '' : 'primary darken-1'"
                :loading="loading"
                class="btn_mais_opcoes mx-0 ml-2"
                dark
                small
                icon
                v-on="on"
              >
                <v-icon> mdi-dots-vertical </v-icon>
              </v-btn>
            </template>
            <slot name="maisOpcoes" />
          </v-menu>
        </v-toolbar>
        <v-card v-if="items" flat>
          <slot name="cabecalho" />
        </v-card>
        <v-divider v-if="toolbarGrid" />
      </template>
      <template v-if="hideDefaultHeader" v-slot:[`header`]="{ props, on }">
        <thead class="v-data-table-header mb-3">
          <tr class="table-filters">
            <th
              v-for="(header, idx) in props.headers"
              :key="idx"
              :style="{
                width: `${header.width}px !important`,
                minWidth: `${header.width}px !important`,
              }"
            >
              <template
                v-if="header.value === 'data-table-select' && selecionar"
              >
                <v-simple-checkbox
                  v-model="allSelected"
                  :ripple="false"
                  @click="on[`toggle-select-all`](allSelected)"
                />
              </template>
              <slot
                v-if="header.value !== 'acao'"
                :header="header"
                :on="on"
                :name="header.value"
              />
            </th>
          </tr>
        </thead>
      </template>

      <template v-slot:[`item.ocorrencia`]="{ value }">
        <v-btn
          v-if="value && value.chip"
          :color="value.color ? value.color : 'primary'"
          class="font-weight-bold"
          depressed
          small
          text
        >
          {{ value.text }}
        </v-btn>
        <div
          v-if="value && !value.chip"
          v-html="value.text ? value.text : value"
        />
      </template>
      <template v-slot:[`item.solucao`]="{ value }">
        <v-btn
          v-if="value && value.chip"
          :color="value.color ? value.color : 'primary'"
          class="font-weight-bold"
          depressed
          small
          text
        >
          {{ value.text }}
        </v-btn>
        <div
          v-if="value && !value.chip"
          v-html="value.text ? value.text : value"
        />
      </template>
      <template v-slot:[`item.id`]="{ item }">
        <span
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          style="cursor: pointer"
          @click="$emit('exibir', item[itemKey])"
        >
          {{ item.id }}
        </span>
      </template>
      <template v-slot:[`item.personalizado`]="{ item }">
        <slot :registro="item" :fabs="fabs" name="personalizado" />
      </template>
      <template v-slot:[`item.personalizado2`]="{ item }">
        <slot :registro="item" :fabs="fabs" name="personalizado2" />
      </template>
      <template v-slot:[`item.depositoAjusteDebito`]="{ item }">
        <slot :registro="item" :fabs="fabs" name="depositoAjusteDebito" />
      </template>
      <template v-slot:[`item.depositoAjusteCredito`]="{ item }">
        <slot :registro="item" :fabs="fabs" name="depositoAjusteCredito" />
      </template>

      <template v-slot:[`item.acao`]="{ item }">
        <slot
          :registro="item"
          :expand="expandTable"
          :expandUndo="expandUndoTable"
          :fabs="fabs"
          name="acao"
        />
        <v-btn
          v-if="acessar"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado"
          :loading="loading"
          class="botao-acao-tabela"
          data-cy="btnTableAcessar"
          icon
          title="Acessar Registro"
          @click="$emit('acessar', item[itemKey])"
        >
          <v-icon size="20"> mdi-open-in-app </v-icon>
        </v-btn>
        <v-btn
          v-if="btnExpandTable"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado"
          :loading="loading"
          :title="
            !selectedExpand.length ? 'Expandir registro' : 'Recolher registro'
          "
          class="botao-acao-tabela"
          data-cy="btnTableExpandTable"
          icon
          @click="
            !selectedExpand.length ? expandTable(item) : expandUndoTable()
          "
        >
          <v-icon size="20">
            {{ !selectedExpand.length ? "mdi-chevron-down" : "mdi-chevron-up" }}
          </v-icon>
        </v-btn>
        <v-btn
          v-if="btnExpand"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado"
          :loading="loading"
          class="botao-acao-tabela"
          data-cy="btnTableExpand"
          icon
          title="Expandir registro"
          @click="$emit('btnExpand', item)"
        >
          <v-icon size="20"> mdi-chevron-down </v-icon>
        </v-btn>
        <v-btn
          v-if="btnExpandUndo"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado"
          :loading="loading"
          class="botao-acao-tabela"
          data-cy="btnTableExpandUndo"
          icon
          title="Encolher registro"
          @click="$emit('btnExpandUndo', item)"
        >
          <v-icon size="20"> mdi-chevron-up </v-icon>
        </v-btn>
        <v-btn
          v-if="exibir"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado"
          :loading="loading"
          :icon="!$vuetify.breakpoint.mobile"
          :outlined="$vuetify.breakpoint.mobile"
          :class="$vuetify.breakpoint.mobile ? 'my-1' : ''"
          class="botao-acao-tabela"
          data-cy="btnTableExibir"
          x-small
          title="Exibir registro"
          @click="$emit('exibir', item[itemKey])"
        >
          <v-icon size="20"> mdi-eye </v-icon>
        </v-btn>
        <v-btn
          v-if="exibirLinha"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado"
          :loading="loading"
          class="botao-acao-tabela"
          data-cy="btnTableExibirLinha"
          icon
          title="Exibir registro"
          @click="$emit('exibirLinha', item)"
        >
          <v-icon size="20"> mdi-eye </v-icon>
        </v-btn>
        <v-btn
          v-if="escolher"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado"
          :loading="loading"
          class="botao-acao-tabela"
          data-cy="btnTableEscolher"
          icon
          title="Escolher registro"
          @click="$emit('escolher', item[itemKey])"
        >
          <v-icon size="20"> mdi-check-bold </v-icon>
        </v-btn>
        <v-btn
          v-if="selecionarLinha"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado"
          :loading="loading"
          class="botao-acao-tabela"
          data-cy="btnTableEscolher"
          icon
          title="Escolher registro"
          @click="$emit('selecionarLinha', item)"
        >
          <v-icon size="20"> mdi-check-bold </v-icon>
        </v-btn>
        <v-btn
          v-if="editar"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado"
          :loading="loading"
          class="botao-acao-tabela"
          data-cy="btnTableEditar"
          icon
          title="Editar Registro"
          @click="$emit('editar', item[itemKey])"
        >
          <v-icon size="20"> mdi-lead-pencil </v-icon>
        </v-btn>
        <v-btn
          v-if="excluir"
          :loading="loading"
          :disabled="desabilitado"
          data-cy="btnTableExcluir"
          class="botao-acao-tabela"
          color="error"
          icon
          title="Excluir Registro"
          @click="$emit('excluir', item[itemKey])"
        >
          <v-icon size="20"> mdi-delete </v-icon>
        </v-btn>
        <v-btn
          v-if="moveUp"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado || desabilitadoMover"
          :loading="loading"
          class="botao-acao-tabela ml-1"
          data-cy="btnTableMoveUp"
          icon
          title="Mover Para Cima"
          @click="$emit('moveUp', item[itemKey])"
        >
          <v-icon size="20"> mdi-arrow-up-bold-box-outline </v-icon>
        </v-btn>
        <v-btn
          v-if="moveDown"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :disabled="desabilitado || desabilitadoMover"
          :loading="loading"
          class="botao-acao-tabela"
          data-cy="btnTableMoveDown"
          icon
          title="Mover Para Baixo"
          @click="$emit('moveDown', item[itemKey])"
        >
          <v-icon size="20"> mdi-arrow-down-bold-box-outline </v-icon>
        </v-btn>
        <v-btn
          v-if="resetSenhaUsuario"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :loading="loading"
          :icon="!$vuetify.breakpoint.mobile"
          :outlined="$vuetify.breakpoint.mobile"
          :class="$vuetify.breakpoint.mobile ? 'my-1' : ''"
          class="botao-acao-tabela mx-1"
          data-cy="btnTableResetSenhaUsuario"
          x-small
          title="Redefinir senha"
          @click="$emit('resetSenhaUsuario', item[itemKey])"
        >
          <v-icon size="20"> mdi-lock-reset </v-icon>
        </v-btn>
        <v-btn
          v-if="configuracao"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :loading="loading"
          class="botao-acao-tabela ml-2"
          data-cy="btnTableConfiguracao"
          icon
          title="Configuração"
          @click="$emit('configuracao', item[itemKey])"
        >
          <v-icon size="20"> mdi-cogs </v-icon>
        </v-btn>
        <v-btn
          v-if="auditoria"
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :loading="loading"
          class="botao-acao-tabela ml-2"
          data-cy="btnTableAuditoria"
          icon
          title="Auditoria"
          @click="$emit('auditoria', item)"
        >
          <v-icon size="20"> mdi-history </v-icon>
        </v-btn>
        <v-btn
          v-if="sortable"
          :loading="loading"
          :disabled="desabilitado"
          class="sortHandle botao-acao-tabela ml-1 mr-2"
          color="secondary"
          icon
          style="cursor: move"
          title="Mover"
        >
          <v-icon size="20"> mdi-drag-variant </v-icon>
        </v-btn>
        <slot
          :registro="item"
          :fabs="fabs"
          :expand="expandTable"
          :expandUndo="expandUndoTable"
          name="acao2"
        />
      </template>
      <template v-slot:[`item.icone`]="{ value }">
        <v-icon
          v-if="value && value.icone && String(value.icone).includes('mdi')"
          :color="value && value.color ? value.color : ''"
          :title="value && value.title ? value.title : ''"
          size="25"
        >
          {{ value && value.icone ? value.icone : value }}
        </v-icon>
        <v-img
          v-else
          :src="require(`@/assets/icones/${value.icone}.png`)"
          class="my-1"
          contain
          width="100%"
          height="100%"
          max-height="30"
          max-width="35"
          min-height="30"
          min-width="35"
        />
      </template>
      <template v-slot:[`item.imagem`]="{ item }">
        <v-img v-if="item.imagem" :src="item.imagem" height="30" width="30" />
      </template>
      <template v-slot:[`item.ativo`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.imagemBanco`]="{ item }">
        <!-- TODO: Requer um objeto -->
        <!-- imagemBanco: {
          imagem: '',
          descricao: ''
        } -->
        <div class="d-flex align-center justify-start">
          <v-img
            :src="item.imagemBanco.imagem"
            class="my-1"
            contain
            width="100%"
            height="100%"
            max-height="30"
            max-width="35"
            min-height="30"
            min-width="35"
          />
          <div class="py-2 ml-3">
            {{ item.imagemBanco.descricao }}
          </div>
        </div>
      </template>
      <template v-slot:expanded-item="{ item }">
        <td colspan="12" class="pa-0">
          <slot :registros="item" name="expandir" />
        </td>
      </template>
      <template v-slot:[`item.observacao`]="{ value }">
        {{
          value && value.length >= observacaoSliceSize
            ? `${value.substring(0, observacaoSliceSize)} [...]`
            : value
        }}
      </template>
      <template v-slot:[`item.${htmlColumn}`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.descricao`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.quantidade`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.gerado`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.${statusTag}`]="{ item, value }">
        <v-chip
          v-if="value && value.chip"
          :color="value.color ? value.color : 'primary'"
          :text-color="value.color === '#FFEB3B' ? '#263238' : 'white'"
          class="font-weight-bold v-chip-status"
          small
        >
          {{ value.text }}
        </v-chip>

        <v-progress-circular
          v-else
          :color="$vuetify.theme.dark ? 'white' : 'primary'"
          :size="20"
          :width="2"
          indeterminate
        />

        <v-tooltip
          v-if="value && value.tooltip"
          bottom
          :activator="`#${item.empresa}`"
        >
          {{ value.tooltip }}
        </v-tooltip>
      </template>
      <template v-slot:[`item.curralCodigo`]="{ value }">
        <v-btn
          v-if="value && value.chip"
          :color="value.color ? value.color : 'primary'"
          class="font-weight-bold"
          depressed
          small
          text
        >
          {{ value.text }}
        </v-btn>
      </template>
      <template v-slot:[`item.saidaValor`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.saidaConciliar`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.entradaValor`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.entradaConciliar`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.valor`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.conferido`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.valorConciliado`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.valorConciliar`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.saldo`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.valorCredito`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.valorDebito`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.valorLancado`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.valorExtrato`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.diferenca`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.link`]="{ value }">
        <v-tooltip v-if="value" bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              :color="$vuetify.theme.dark ? 'white' : 'primary'"
              :to="{ name: value.to }"
              icon
              small
              v-on="on"
            >
              <v-icon> mdi-link </v-icon>
            </v-btn>
          </template>
          <span>Ir para o depósito código: {{ value.depositoId }}</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.tipo`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.resultado`]="{ value }">
        <div v-html="value" />
      </template>
      <template v-slot:[`item.progresso`]="{ item }">
        <v-progress-linear
          v-if="item.progresso"
          :color="
            item.progressoNumero < 30
              ? '#B0BEC5'
              : item.progressoNumero > 30 && item.progressoNumero < 90
              ? '#FFC107'
              : '#29B6F6'
          "
          :value="item.progressoNumero"
          height="20"
          reactive
        >
          <div v-html="item.progresso" />
        </v-progress-linear>
      </template>
      <template v-slot:[`item.campoEdit`]="{ item }">
        <v-row class="pa-0 mx-1" dense>
          <v-col cols="12" class="py-0 px-0 my-0">
            <v-text-field
              :id="`${item.id}`"
              :ref="`${item.id}`"
              v-model="item.campoEdit"
              v-moeda="{ negativo: false, decimal: 3 }"
              :name="`${item.id}`"
              :disabled="item.disabled"
              dense
              hide-details
              reverse
              text
              @change="$emit('campoEdit', item)"
            />
          </v-col>
        </v-row>
      </template>
      <template
        v-if="
          colunas.length &&
          !selectedExpand.length &&
          colunas.find((el) => el.total)
        "
        v-slot:[`body.append`]
      >
        <tr
          v-if="
            colunas.length &&
            !selectedExpand.length &&
            colunas.find((el) => el.total)
          "
          class="body_append_line"
        >
          <td
            v-for="(col, index) in colunas"
            :key="index"
            :class="
              ($vuetify.theme.dark ? 'white--text' : 'grey--text',
              `text-${col.align ? col.align : 'start'} py-1`)
            "
            :style="
              $vuetify.theme.dark
                ? 'pointer-events: none; background-color: #000 !important;'
                : 'pointer-events: none; border: solid 1px #E0E0E0; background-color: #fafafa !important;'
            "
            class="font-weight-bold py-0 ma-0 text--darken-2"
          >
            <span v-html="getValorTotal(col.total)" />
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        <div class="d-flex justify-center align-center align-self-center pt-4">
          <v-alert
            :color="$vuetify.theme.dark ? 'white' : 'primary'"
            text
            type="info"
            width="210"
          >
            Nenhum Registro!
          </v-alert>
        </div>
      </template>
      <template
        v-if="!semRodape && !semRodapeExpand"
        v-slot:footer="{ headers, widths }"
      >
        <slot
          name="append"
          v-bind="{
            headers: headers.map((header, idx) => ({
              ...header,
              width: widths[idx],
            })),
            widths,
          }"
        />
        <v-divider />
        <v-toolbar class="body-2" dense flat height="30">
          Registros:
          <b class="ml-1">{{
            !!search
              ? $refs.tabela.internalCurrentItems
                ? $refs.tabela.internalCurrentItems.length
                : 0
              : totalRegistrosRodape
          }}</b>
          <span v-if="selecionadosMostrar" class="ml-1">
            &nbsp;| &nbsp; Selecionados: &nbsp;
            <b class="font-weight-bold">
              {{ selecionados.length }}
            </b>
          </span>
          <v-spacer />
          <span v-if="!semPaginacaoRaw && !$vuetify.breakpoint.mobile">
            Por página
          </span>
          <v-select
            v-if="!$vuetify.breakpoint.xs && !semPaginacaoRaw"
            v-model="rowsPerPage"
            :items="[20, 50, 100, 200, 400, 600, 1000]"
            class="registros-pagina ml-3"
            hide-details
            style="
              .v-menu__content {
                width: 100px !important;
              }
            "
            @change="(page = 1), requisicao({ registros: true })"
          />
          <div
            v-if="!$vuetify.breakpoint.xs && !semPaginacaoRaw"
            class="pa-3"
          />
          <v-btn
            v-if="!semPaginacaoRaw"
            :color="$vuetify.theme.dark ? '' : 'primary darken-1'"
            :disabled="loading || desabilitarPaginaAnterior || !!search"
            icon
            small
            @click="requisicao({ page: 1 })"
          >
            <v-icon> mdi-chevron-double-left </v-icon>
          </v-btn>
          <v-btn
            v-if="!semPaginacaoRaw"
            :color="$vuetify.theme.dark ? '' : 'primary darken-1'"
            :disabled="loading || desabilitarPaginaAnterior || !!search"
            class="mr-3"
            icon
            small
            @click="requisicao({ page: --page })"
          >
            <v-icon> mdi-chevron-left </v-icon>
          </v-btn>
          <span v-if="!semPaginacaoRaw">
            {{ !!search ? 1 : paginaAtual }} &nbsp;-&nbsp;
            {{ !!search ? 1 : totalPaginas || 1 }}
          </span>
          <v-btn
            v-if="!semPaginacaoRaw"
            :color="$vuetify.theme.dark ? '' : 'primary darken-1'"
            :disabled="loading || desabilitarPaginaPosterior || !!search"
            class="ml-3"
            icon
            small
            @click="requisicao({ page: ++page })"
          >
            <v-icon> mdi-chevron-right </v-icon>
          </v-btn>
          <v-btn
            v-if="!semPaginacaoRaw"
            :color="$vuetify.theme.dark ? '' : 'primary darken-1'"
            :disabled="loading || desabilitarPaginaPosterior || !!search"
            class="mr-1"
            icon
            small
            @click="requisicao({ page: totalPaginas })"
          >
            <v-icon> mdi-chevron-double-right </v-icon>
          </v-btn>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-divider
      v-if="semRodape && contarRegistros"
      style="border: solid 1px #ddd"
    />

    <v-toolbar
      v-if="semRodape && contarRegistros"
      class="body-2 elevation-0"
      dense
      flat
      height="35"
    >
      Registros: <b class="ml-1">{{ totalRegistrosRodape }}</b>
    </v-toolbar>

    <slot name="totais" />

    <v-style>
      <template v-if="minHeight">
        .componente-tabela > .v-data-table__wrapper { min-height: 100px
        !important; }
      </template>
    </v-style>
    <v-style>
      <template v-if="lineHover">
        tbody > tr:hover { background-color: rgba(200, 230, 201, 0.5)
        !important; }
      </template>
    </v-style>

    <v-style v-if="!$vuetify.theme.dark">
      th { padding-left: 8px !important; padding-right: 8px !important;
      border-left: 1px solid #EEEEEE; } td { padding-left: 8px !important;
      padding-right: 8px !important; border: 1px solid #EEEEEE; } tbody
      tr:nth-child(even) { background-color: #f5f5f5; } tbody
      tr:not(:last-child) td:not(.v-data-table__mobile-row) { border-bottom:
      none !important } thead th { background-color: #f2f1f1 !important; }
    </v-style>

    <v-style v-if="!iconSortHeader">
      .v-data-table-header th.desc .v-data-table-header__icon { display: none
      !important; } .v-data-table-header th.sortable .v-data-table-header__icon
      { display: none !important; } .v-data-table-header th.active
      .v-data-table-header__icon, .v-data-table-header
      .v-data-table-header__icon { display: none !important; }
    </v-style>
  </div>
</template>

<script>
import moeda from "@tiig/moeda";
import _ from "lodash";

export default {
  name: "ComponenteTabela",

  props: {
    auditoria: {
      default: false,
      type: Boolean,
    },
    acessar: {
      default: false,
      type: Boolean,
    },
    configuracao: {
      default: false,
      type: Boolean,
    },
    contarRegistros: {
      default: false,
      type: Boolean,
    },
    noClickRow: {
      default: false,
      type: Boolean,
    },
    btnExpandTable: {
      default: false,
      type: Boolean,
    },
    btnExpand: {
      default: false,
      type: Boolean,
    },
    btnExpandUndo: {
      default: false,
      type: Boolean,
    },
    colunasCustomizadas: {
      required: false,
      default: () => {
        return [];
      },
      type: Array,
    },
    corToolbar: {
      type: String,
      default: null,
    },
    colunas: {
      required: true,
      type: Array,
    },
    desabilitado: {
      default: false,
      type: Boolean,
    },
    desabilitadoMover: {
      default: false,
      type: Boolean,
    },
    disabledSortDefault: {
      default: false,
      type: Boolean,
    },
    expand: {
      default: false,
      type: Boolean,
    },
    exibir: {
      default: false,
      type: Boolean,
    },
    exibirLinha: {
      default: false,
      type: Boolean,
    },
    selecionarLinha: {
      default: false,
      type: Boolean,
    },
    excluir: {
      default: false,
      type: Boolean,
    },
    editar: {
      default: false,
      type: Boolean,
    },
    escolher: {
      default: false,
      type: Boolean,
    },
    flat: {
      default: false,
      type: Boolean,
    },
    fnSearch: {
      type: Function,
      default: () => true,
    },
    footer: {
      default: () => {
        return [];
      },
      type: Array,
    },
    minHeight: {
      type: Boolean,
      default: true,
    },
    statusTag: {
      type: String,
      default: "status",
    },
    selecionadosMostrar: {
      default: false,
      type: Boolean,
    },
    sortable: {
      default: false,
      type: Boolean,
    },
    height: {
      default: "",
      type: String,
    },
    hideDefaultHeader: {
      default: false,
      type: Boolean,
    },
    child: {
      type: [Number, Boolean],
      default: false,
    },
    heightAuto: {
      default: false,
      type: Boolean,
    },
    htmlColumn: {
      type: String,
      default: "html",
    },
    iconSortHeader: {
      default: false,
      type: Boolean,
    },
    maxHeight: {
      default: false,
      type: Boolean,
    },
    itemKey: {
      default: "id",
      type: String,
    },
    itemClass: {
      default: "",
      type: [String, Function],
    },
    lineHover: {
      default: true,
      type: Boolean,
    },
    registrosPorPagina: {
      default: 15,
      type: Number,
    },
    registros: {
      required: true,
      type: Array,
    },
    loading: {
      default: false,
      type: Boolean,
    },
    moveDown: {
      default: false,
      type: Boolean,
    },
    moveUp: {
      default: false,
      type: Boolean,
    },
    mobileBreackpoint: {
      type: Boolean,
      default: false,
    },
    observacaoSliceSize: {
      default: 60,
      type: [Number, String],
    },
    paginacao: {
      default: () => {},
      type: Object,
    },
    paginacaoServidor: {
      default: false,
      type: Boolean,
    },
    problemas: {
      default: false,
      type: Boolean,
    },
    resetSenhaUsuario: {
      default: false,
      type: Boolean,
    },
    search: {
      validator: function (value) {
        return (
          typeof value === "undefined" ||
          typeof value === "string" ||
          typeof value === "boolean" ||
          value === null
        );
      },
      default: "",
    },
    selecionar: {
      default: false,
      type: Boolean,
    },
    semRodape: {
      default: false,
      type: Boolean,
    },
    semPaginacaoRaw: {
      default: false,
      type: Boolean,
    },
    subtitulo: {
      default: "",
      type: String,
    },
    sortByCli: {
      default: "",
      type: String,
    },
    sortDescCli: {
      default: false,
      type: Boolean,
    },
    toolbarGrid: {
      default: false,
      type: Boolean,
    },
    titulo: {
      default: "",
      type: String,
    },
    selecionados: {
      type: Array,
      default: () => [],
    },
    toolbarHight: {
      type: [Number, String],
      default: 35,
    },
    voltarListagem: {
      default: false,
      type: Boolean,
    },
    tituloVoltar: {
      default: "Voltar Listagem",
      type: String,
    },
  },

  data: () => ({
    allSelected: false,
    expanded: [],
    rowsPerPage: 15,
    page: 1,
    sortBy: [],
    sortDesc: [],
    fabs: {},
    selectedExpand: [],
    semRodapeExpand: false,
    tableHeight: 0,
  }),

  computed: {
    desabilitarPaginaAnterior() {
      return this.paginacaoServidor
        ? this.paginacao.pagina === 1 || this.paginacao.pagina === undefined
        : this.page === 1;
    },
    desabilitarPaginaPosterior() {
      return this.paginacaoServidor
        ? this.paginacao.pagina === this.paginacao.totalPaginas ||
            this.paginacao.totalPaginas === 0
        : this.page === Math.ceil(this.registros.length / this.rowsPerPage) ||
            Math.ceil(this.registros.length / this.rowsPerPage) === 0;
    },
    itensServidor() {
      return this.paginacaoServidor ? this.paginacao.totalRegistros : -1;
    },
    paginaAtual() {
      return this.paginacaoServidor ? this.paginacao.pagina : this.page;
    },
    totalPaginas() {
      return this.paginacaoServidor
        ? this.paginacao.totalPaginas
        : Math.ceil(this.registros.length / this.rowsPerPage);
    },
    totalRegistros() {
      return this.paginacaoServidor
        ? this.paginacao.totalRegistros
        : this.registros.length;
    },
    totalRegistrosRodape() {
      return this.paginacaoServidor
        ? moeda.format(this.paginacao.totalRegistros, 0)
        : moeda.format(this.registros.length, 0);
    },
    selected: {
      get() {
        return this.selecionados;
      },
      set(val) {
        this.$emit("update:selecionados", val);
        this.$emit("selecionar", val);
      },
    },
  },

  watch: {
    expanded(valor) {
      if (valor.length) {
        this.$emit("expandir", this.expanded);
      }
    },
    selected(valor) {
      if (valor) {
        if (this.selected.length) {
          this.$emit("selecionar", valor);
        } else {
          this.$emit("selecionar", []);
        }
      }
    },
    sortDesc(valor) {
      if (this.paginacaoServidor) this.requisicao({});
    },
    paginacao: {
      handler(val) {
        if (val) {
          this.rowsPerPage = val.registros;
          this.page = val.pagina;
        }
      },
    },
    registros: {
      handler(value) {
        const [selectedExpand] = this.selectedExpand;
        if (selectedExpand) {
          const atualizado = value.find((el) => el.id === selectedExpand.id);
          if (atualizado) {
            this.selectedExpand = [atualizado];
            this.expandTable(atualizado);
          }
        }

        setTimeout(() => {
          this.newCalculaTableHeigth();
        }, 500);
      },
      deep: true,
    },
  },

  created() {
    this.rowsPerPage = this.registrosPorPagina;
    this.sortBy = [this.sortByCli];
    this.sortDesc = [this.sortDescCli];

    if (this.paginacaoServidor) {
      this.page = this.paginacao.pagina;
      this.rowsPerPage = this.paginacao.registros;
    }
  },

  mounted() {
    this.newCalculaTableHeigth();
  },

  methods: {
    customSort(items, index, isDesc) {
      const coluna = this.colunas.find((el) => el.value === index[0]);
      let sort = "";
      if (coluna) {
        sort = coluna.sort || "";
      }

      items.sort((a, b) => {
        if (sort) {
          if (sort === "money") {
            if (!isDesc[0]) {
              if (isNaN(a[index[0]]) || isNaN(b[index[0]])) {
                const va = String(a[index[0]])
                  .match(/-*[?^0-9,]/gm)
                  .join("");
                const vb = String(b[index[0]])
                  .match(/-*[?^0-9,]/gm)
                  .join("");

                return moeda.strip(va) - moeda.strip(vb);
              } else {
                return moeda.strip(a[index[0]]) - moeda.strip(b[index[0]]);
              }
            } else {
              if (isNaN(a[index[0]]) || isNaN(b[index[0]])) {
                const va = String(a[index[0]])
                  .match(/-*[?^0-9,]/gm)
                  .join("");
                const vb = String(b[index[0]])
                  .match(/-*[?^0-9,]/gm)
                  .join("");

                return moeda.strip(vb) - moeda.strip(va);
              } else {
                return moeda.strip(b[index[0]]) - moeda.strip(a[index[0]]);
              }
            }
          } else if (sort === "date") {
            const dataA = this.$day(a[index[0]], "DD/MM/YYYY");
            const dataB = this.$day(b[index[0]], "DD/MM/YYYY");
            if (dataA.isValid() && dataB.isValid()) {
              if (!isDesc[0]) {
                return dataB && dataA && dataA.isSameOrBefore(dataB) ? -1 : 1;
              } else {
                return dataB && dataA && dataB.isSameOrBefore(dataA) ? -1 : 1;
              }
            }
          }
        } else if (!this.disabledSortDefault) {
          if (!isDesc[0]) {
            return a[index[0]] < b[index[0]] ? -1 : 1;
          } else {
            return b[index[0]] < a[index[0]] ? -1 : 1;
          }
        }
      });

      if (this.problemas) {
        for (let y = 0; y < items.length; y++) {
          if (items[y].problemas === 1) {
            this.changePosition(items, y, 0);
          }
        }
        return items;
      }
      return items;
    },
    changePosition(arr, from, to) {
      arr.splice(to, 0, arr.splice(from, 1)[0]);
      return arr;
    },

    getValorTotal(valor) {
      if (valor && typeof valor === "number")
        return `<span class="${valor < 0 ? "red--text" : ""}">${moeda.format(
          valor || 0,
          2
        )}</span>`;
      else if (valor && typeof valor === "object") {
        return `<span class="${
          valor.valor < 0 ? "red--text" : ""
        }">${moeda.format(
          valor.valor || 0,
          Number(valor.casasDecimais) || 0
        )}</span>`;
      } else return moeda.format(valor, 2);
    },
    newCalculaTableHeigth() {
      const table = this.$refs.tabela?.$el;

      if (!table) return;

      let tableHeaderFooterHeight = 0;

      // Pega o tamanho do header e do footer do componente tabela
      [...table.children].forEach((node) => {
        const nodeRect = node.getBoundingClientRect();

        if (!node.classList.contains("v-data-table__wrapper")) {
          tableHeaderFooterHeight += nodeRect.height;
        }
      });

      const tableRect = table.getBoundingClientRect();
      const windowHeigh = window.innerHeight;

      if (this.$slots.totais) {
        this.tableHeight =
          windowHeigh - tableRect.top - 75 - tableHeaderFooterHeight;
      } else {
        this.tableHeight =
          windowHeigh - tableRect.top - 35 - tableHeaderFooterHeight;
      }
    },
    expandTable(item) {
      const cloneItem = _.cloneDeep(item);
      this.selectedExpand = [cloneItem];
      this.semRodapeExpand = true;
      this.$emit("expand", cloneItem);
    },
    expandUndoTable(emit = true) {
      this.selectedExpand = [];
      this.semRodapeExpand = false;
      emit && this.$emit("expandUndo");
    },
    requisicao({ page, registros }) {
      let pagina;

      if (registros) {
        pagina = this.page;
      }

      if (page) {
        pagina =
          page > this.paginacao.totalPaginas
            ? this.paginacao.totalPaginas
            : page;
      }

      this.$emit("paginacao", {
        ordenacao: this.sortBy[0],
        ordenacao_tipo:
          this.sortDesc[0] === true
            ? "desc"
            : this.sortDesc[0] === false
            ? "asc"
            : undefined,
        pagina: pagina,
        registros: this.rowsPerPage,
      });
    },
    hasSlot(name = "default") {
      return !!this.$slots[name] || !!this.$scopedSlots[name];
    },
    acaoDbClick(event, item) {
      this.$emit("dblclick", item.item);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table__selected {
  background: #bbdefb !important;
}
::v-deep .body_append_line {
  td {
    position: sticky;
    bottom: 0;
    z-index: 1;
  }
}
::v-deep .theme--light.v-data-table thead tr th {
  color: rgba(0, 0, 0, 1) !important;
}
::v-deep .v-input--selection-controls__ripple {
  padding: 0px !important;
  margin: 0px !important;
  visibility: hidden !important;
}
::v-deep .botao-acao-tabela {
  height: 31px !important;
  width: 29px !important;
}

::v-deep .v-chip-status {
  width: 100%;
  display: flex !important;
  // justify-content: flex-start !important;
  justify-content: center !important;
}

::v-deep .componente-tabela {
  border-collapse: collapse;
  white-space: nowrap;

  ::-webkit-scrollbar {
    width: 12px !important;
    height: 12px !important;
  }
}
::v-deep .registros-pagina {
  .v-menu__content .menuable__content__active {
    min-width: 80px !important;
  }
  .theme--light.v-list-item:not(.v-list-item--active):not(
      .v-list-item--disabled
    ) {
    padding-left: 8px !important;
    padding-right: 0px !important;
  }
  font-size: 12px !important;
  margin-bottom: 10px !important;
  max-width: 80px !important;
  .v-input__control
    .v-input__slot
    .v-select__slot
    .v-select__selections
    .v-select__selection {
    margin-bottom: 0px !important;
    min-width: 1;
  }
}
</style>
