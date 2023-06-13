<template>
  <pagina
    :editar="!!(controle.exibir && !controle.inserir)"
    :formulario.sync="modal"
    :loading="loading"
    :mais-opcoes="!controle.inserir || controle.editar"
    :salvar="!!(!controle.exibir && (controle.inserir || controle.editar))"
    fechar
    subtitulo="Listagem e manutenção de grupos de páginas"
    titulo-toolbar="Detalhes do Grupo de página"
    titulo="Grupos de páginas"
    @cancelar="resetFormulario()"
    @editar="(controle.exibir = false), (controle.editar = true)"
    @fechar="resetFormulario()"
    @salvar="salvarRegistro()"
  >
    <aviso
      v-model="aviso.modal"
      :options="aviso"
      @sim="aviso = { modal: false, key: '', text: '' }"
      @excluirRelacionamento="paginaExcluir()"
      @excluirRegistro="excluirRegistro()"
      @excluirRelacionamentoUsuario="usuarioExcluir()"
      @excluirRequisicaoPagina="requisicaoExcluir()"
      @excluirAcessoPagina="acessoExcluir()"
      @excluirPaginasdoUsuario="paginaUsuarioExcluir()"
      @excluirUsuarioPaginaEmMassa="usuarioExcluirEmMassa()"
    />

    <pesquisa-usuario
      ref="pesquisarUsuario"
      :exibir-campos="false"
      :selecionar="true"
      exibir-perfil
      @salvar="usuarioInserirEmMassa($event)"
    />

    <!-- Modal relacionamento de páginas com o grupo -->
    <modal
      v-model="modalRelacionamento"
      :options="optionsModalRelacionamento"
      acao-form
      @cancelar="paginaResetFormulario()"
      @editar="
        (controleRelacionamento.exibir = false),
          (controleRelacionamento.editar = true)
      "
      @input="paginaResetFormulario()"
      @salvar="paginaSalvar()"
    >
      <template v-slot:maisOpcoes>
        <v-list class="pa-0" dense>
          <v-list-item
            @click="
              aviso = {
                modal: true,
                key: 'excluirRelacionamento',
                text: 'Deseja realmente excluir esse <b>Cadastro de página</b>?',
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

      <validation-observer ref="formularioRelacionamento">
        <v-container fluid>
          <v-row dense>
            <v-col cols="12" xl="2" lg="2" md="2" sm="12">
              <v-text-field
                v-model="formularioRelacionamento.id"
                disabled
                hide-details
                dense
                label="Código"
                outlined
              />
            </v-col>
            <v-col cols="12" xl="7" lg="7" md="7" sm="12">
              <validation-provider
                v-slot="{ errors }"
                name="Descrição"
                rules="required"
                vid="descricao"
              >
                <v-text-field
                  v-model="formularioRelacionamento.descricao"
                  :disabled="controleRelacionamento.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="Descrição"
                  outlined
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" xl="3" lg="3" md="3" sm="12">
              <validation-provider
                v-slot="{ errors }"
                name="Ordem"
                rules="required"
                vid="ordem"
              >
                <v-text-field
                  v-model="formularioRelacionamento.ordem"
                  v-mask="'###########'"
                  :disabled="controleRelacionamento.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="Ordem"
                  outlined
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" xl="4" lg="4" md="4" sm="12">
              <validation-provider
                v-slot="{ errors }"
                name="Icone"
                rules="required"
                vid="icone"
              >
                <v-text-field
                  v-model="formularioRelacionamento.icone"
                  :disabled="controleRelacionamento.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="Icone"
                  outlined
                >
                  <template v-slot:append>
                    <v-icon :color="formularioRelacionamento.corIcone">
                      {{ formularioRelacionamento.icone }}
                    </v-icon>
                  </template>
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" xl="3" lg="3" md="3" sm="12">
              <validation-provider
                v-slot="{ errors }"
                name="Cor Icone"
                rules="required"
                vid="corIcone"
              >
                <v-text-field
                  v-model="formularioRelacionamento.corIcone"
                  :disabled="controleRelacionamento.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="Cor Icone"
                  outlined
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" xl="5" lg="5" md="5" sm="12">
              <validation-provider
                v-slot="{ errors }"
                name="URL"
                rules="required"
                vid="url"
              >
                <v-text-field
                  v-model="formularioRelacionamento.url"
                  :disabled="controleRelacionamento.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="URL"
                  outlined
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" xl="12" lg="12" md="12" sm="12">
              <validation-provider
                v-slot="{ errors }"
                name="Observação"
                rules="required"
                vid="observacao"
              >
                <v-text-field
                  v-model="formularioRelacionamento.observacao"
                  :disabled="controleRelacionamento.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="Observação"
                  outlined
                />
              </validation-provider>
            </v-col>
          </v-row>
        </v-container>
      </validation-observer>
    </modal>

    <!-- Modal relacionamento requisições -->
    <modal
      v-model="modalRelacionamentoRequisicoes"
      :options="optionsModalRelacionamentoRequisicoes"
      @cancelar="requisicaoResetFormulario()"
      @editar="
        (controleRelacionamentoRequisicoes.exibir = false),
          (controleRelacionamentoRequisicoes.editar = true)
      "
      @input="requisicaoResetFormulario()"
      @salvar="requisicaoSalvar()"
    >
      <template v-slot:maisOpcoes>
        <v-list class="pa-0" dense>
          <v-list-item
            @click="
              aviso = {
                modal: true,
                key: 'excluirRequisicaoPagina',
                text: 'Deseja realmente excluir esse <b>Cadastro de requisição</b>?',
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

      <validation-observer ref="formularioRelacionamentoRequisicoes">
        <v-container fluid>
          <v-row dense>
            <v-col cols="12" xl="12" lg="12" md="12" xs="12">
              <validation-provider
                v-slot="{ errors }"
                name="Descrição"
                rules="required"
                vid="descricao"
              >
                <v-text-field
                  v-model="formularioRelacionamentoRequisicoes.descricao"
                  v-mask="mascara('T', 255)"
                  :disabled="controleRelacionamentoRequisicoes.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="Descrição"
                  outlined
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" xl="12" lg="12" md="12" xs="12">
              <validation-provider
                v-slot="{ errors }"
                name="URL"
                rules="required"
                vid="url"
              >
                <v-text-field
                  v-model="formularioRelacionamentoRequisicoes.url"
                  :disabled="controleRelacionamentoRequisicoes.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="URL"
                  outlined
                />
              </validation-provider>
            </v-col>
          </v-row>
        </v-container>
      </validation-observer>
    </modal>

    <!-- Modal relacionamento acessos -->
    <modal
      v-model="modalRelacionamentoAcesso"
      :options="optionsModalRelacionamentoAcesso"
      @cancelar="acessoResetFormulario()"
      @editar="
        (controleRelacionamentoAcesso.exibir = false),
          (controleRelacionamentoAcesso.editar = true)
      "
      @input="acessoResetFormulario"
      @salvar="acessoSalvar()"
    >
      <template v-slot:maisOpcoes>
        <v-list class="pa-0" dense>
          <v-list-item
            @click="
              aviso = {
                modal: true,
                key: 'excluirAcessoPagina',
                text: 'Deseja realmente excluir esse <b>Cadastro de acesso</b>?',
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

      <validation-observer ref="formularioRelacionamentoAcesso">
        <v-container fluid>
          <v-row dense>
            <v-col cols="12" xl="12" lg="12" md="12" xs="12">
              <validation-provider
                v-slot="{ errors }"
                name="Descrição"
                rules="required"
                vid="descricao"
              >
                <v-text-field
                  v-model="formularioRelacionamentoAcesso.descricao"
                  v-mask="mascara('T', 250)"
                  :disabled="controleRelacionamentoAcesso.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="Descrição"
                  outlined
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" xl="12" lg="12" md="12" xs="12">
              <validation-provider
                v-slot="{ errors }"
                name="Observação"
                rules="required"
                vid="observacao"
              >
                <v-textarea
                  v-model="formularioRelacionamentoAcesso.observacao"
                  :disabled="controleRelacionamentoAcesso.exibir"
                  :error-messages="errors"
                  class="required"
                  dense
                  hide-details
                  label="Observação"
                  outlined
                />
              </validation-provider>
            </v-col>
          </v-row>
        </v-container>
      </validation-observer>
    </modal>

    <!-- Mais opções com botao excluir para grupo de páginas -->
    <template v-slot:maisOpcoes>
      <v-list class="pa-0" dense>
        <v-list-item
          @click="
            aviso = {
              modal: true,
              key: 'excluirRegistro',
              text: 'Deseja realmente excluir esse <b>Registro</b>?',
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

    <!-- Formulario de cadastro para grupo de páginas -->
    <template v-slot:formulario>
      <v-form @submit.prevent="&quot;&quot;;">
        <validation-observer ref="observer">
          <v-container fluid grid-list-xs>
            <v-row dense>
              <v-col cols="12" xl="1" lg="1" md="3" sm="4">
                <v-text-field
                  v-model="formulario.id"
                  disabled
                  hide-details
                  dense
                  label="Código"
                  outlined
                />
              </v-col>
              <v-col cols="12" xl="5" lg="5" md="9" sm="8">
                <validation-provider
                  v-slot="{ errors }"
                  name="Descrição"
                  rules="required"
                  vid="descricao"
                >
                  <v-text-field
                    v-model="formulario.descricao"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    class="required"
                    dense
                    hide-details
                    label="Descrição"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="4" sm="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Icone"
                  rules="required"
                  vid="icone"
                >
                  <v-text-field
                    v-model="formulario.icone"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    class="required"
                    dense
                    hide-details
                    label="Icone"
                    outlined
                  >
                    <template v-slot:append>
                      <v-icon :color="formulario.corIcone">
                        {{ formulario.icone }}
                      </v-icon>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="4" sm="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="Cor Icone"
                  rules="required"
                  vid="id"
                >
                  <v-text-field
                    v-model="formulario.corIcone"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    class="required"
                    dense
                    hide-details
                    label="Cor Icone"
                    outlined
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xl="1" lg="1" md="4" sm="2">
                <validation-provider
                  v-slot="{ errors }"
                  name="Ordem"
                  rules="required"
                  vid="ordem"
                >
                  <v-text-field
                    v-model="formulario.ordem"
                    v-mask="'########'"
                    :disabled="controle.exibir"
                    :error-messages="errors"
                    class="required"
                    dense
                    hide-details
                    label="Ordem"
                    outlined
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-form>
    </template>

    <!-- Contem tabelas de relacionamento paginas, usuarios e requisicoes -->
    <template v-if="formulario.id" v-slot:relacionamento>
      <tabela
        ref="tabelaPaginas"
        :colunas="colunasRelacionamento"
        :exibir="!expandido"
        :height-auto="!itemExpand"
        :loading="loading"
        :registros="registrosRelacionamento"
        :registros-por-pagina="100"
        :selecionados.sync="paginaSelecionadas"
        :sortable="!itemExpand"
        btn-expand-table
        selecionar
        sem-paginacao
        titulo="Listagem das paginas deste grupo"
        toolbar-grid
        @exibir="paginaExibir($event)"
        @expand="
          (itemExpand = $event),
            usuarioPaginaListar(),
            acessoPaginaListar(),
            (expandido = true)
        "
        @expandUndo="paginaResetExpand()"
        @sorted="paginaAlterarSequencia($event)"
      >
        <template v-slot:botoes>
          <v-btn
            :disabled="expandido"
            class="mr-2"
            small
            color="secundary"
            outlined
            @click="
              (modalRelacionamento = true),
                (controleRelacionamento.inserir = true)
            "
          >
            <v-icon left> mdi-plus </v-icon>
            Adicionar Página
          </v-btn>
          <v-btn
            :disabled="!paginaSelecionadas.length"
            outlined
            small
            @click="$refs.pesquisarUsuario.modalFiltro = true"
          >
            <v-icon>mdi-account-plus-outline</v-icon>
            Adicionar Usuários em MASSA
          </v-btn>
        </template>
      </tabela>
      <v-row dense class="mt-1">
        <v-col cols="12" md="6">
          <tabela
            v-if="expandido"
            :colunas="colunasRelacionamentoUsuario"
            :loading="loading"
            :registros="usuarioPagina"
            :registros-por-pagina="100"
            :search.sync="search"
            :selecionados.sync="usuariosPaginaSelecionados"
            :click-row="true"
            toolbar-grid
            selecionar
            item-key="usuarioId"
            excluir
            height-auto
            titulo="Listagem de usuários relacionados com a página"
            sem-paginacao
            @excluir="
              (usuarioId = $event),
                (aviso = {
                  modal: true,
                  key: 'excluirRelacionamentoUsuario',
                  text: 'Deseja realmente excluir esse registro?',
                })
            "
            @click="
              !$event.isSelected
                ? ((usuariosPaginaSelecionados = [$event]),
                  acessoBuscar($event))
                : (acessosSelecionados = [])
            "
          >
            <template v-slot:cabecalho>
              <v-form @submit.prevent="&quot;&quot;;">
                <v-row class="px-2 py-1" dense>
                  <v-col cols="12" xl="6" lg="6" md="6" xs="12">
                    <v-text-field
                      v-model="search"
                      v-mask="mascara('T', 20)"
                      hide-details
                      dense
                      label="Pesquise pelo nome"
                      outlined
                      append-icon="mdi-magnify"
                    />
                  </v-col>
                  <v-col cols="12" xl="6" lg="6" md="6" xs="12">
                    <v-autocomplete
                      v-model="usuarioInsercaoId"
                      v-mask="mascara('T', 20)"
                      :items="usuarioDropDown"
                      hide-details
                      clearable
                      class="required"
                      dense
                      item-text="login"
                      item-value="id"
                      outlined
                      label="Usuário"
                      @input="usuarioInserir($event)"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </template>
            <template v-slot:botoes>
              <v-btn
                :disabled="usuariosPaginaSelecionados.length < 2"
                class="mb-1"
                small
                outlined
                @click="
                  aviso = {
                    modal: true,
                    key: 'excluirUsuarioPaginaEmMassa',
                    text: 'Deseja realmente excluir esse registro?',
                  }
                "
              >
                <v-icon left color="error"> mdi-delete </v-icon>
                Excluir usuários selecionados
              </v-btn>
            </template>
          </tabela>
        </v-col>
        <v-col cols="12" md="6">
          <tabela
            v-if="expandido"
            ref="tabelaAcessos"
            :colunas="colunasAcessos"
            :height-auto="!acessoId"
            :loading="loading"
            :registros="acessos"
            :registros-por-pagina="100"
            :search.sync="searchAcesso"
            :selecionados.sync="acessosSelecionados"
            :selecionar="selecionarAcesso"
            :simple-checkbox-header="false"
            btn-expand-table
            toolbar-grid
            exibir
            titulo="Listagem dos acessos da página"
            sem-paginacao
            :multiple="
              !(
                usuariosPaginaSelecionados.length <= 1 ||
                (usuariosPaginaSelecionados.length === 1 &&
                  !acessosSelecionados.length)
              )
            "
            :item-selected="usuariosPaginaSelecionados.length === 1"
            @expand="
              (acessoId = $event.id),
                requisicaoPaginaListar(),
                (expandAcesso = true)
            "
            @expandUndo="acessoResetListagem()"
            @exibir="acessoExibir($event)"
            @item-selected="inserirOuRemoverAcesso($event)"
          >
            <template v-slot:cabecalho>
              <v-row class="px-2 py-1" dense>
                <v-col cols="12" xl="12" lg="12" md="12" xs="12">
                  <v-text-field
                    v-model="searchAcesso"
                    hide-details
                    dense
                    label="Pesquise pela descrição"
                    outlined
                    append-icon="mdi-magnify"
                  />
                </v-col>
              </v-row>
            </template>
            <template v-slot:botoes>
              <v-btn
                class="mb-1"
                small
                outlined
                @click="
                  (modalRelacionamentoAcesso = true),
                    (controleRelacionamentoAcesso.inserir = true)
                "
              >
                <v-icon>mdi-plus</v-icon>
                Adicionar Acesso
              </v-btn>
            </template>
          </tabela>
          <tabela
            v-if="expandAcesso"
            ref="tabelaRequisicoes"
            :colunas="colunasRequisicoes"
            :loading="loading"
            :registros="requisicoesPagina"
            :registros-por-pagina="100"
            :search.sync="searchRequisicao"
            class="mt-2"
            exibir
            height-auto
            sem-paginacao
            titulo="Listagem das requisições do acesso"
            toolbar-grid
            @exibir="requisicaoExibir($event)"
          >
            <template v-slot:cabecalho>
              <v-row class="px-2 py-1" dense>
                <v-col cols="12" xl="12" lg="12" md="6" xs="12">
                  <v-text-field
                    v-model="searchRequisicao"
                    hide-details
                    dense
                    label="Pesquise pela descrição"
                    outlined
                    append-icon="mdi-magnify"
                  />
                </v-col>
              </v-row>
            </template>
            <template v-slot:botoes>
              <v-btn
                class="mb-1"
                small
                outlined
                @click="
                  (modalRelacionamentoRequisicoes = true),
                    (controleRelacionamentoRequisicoes.inserir = true)
                "
              >
                <v-icon>mdi-plus</v-icon>
                Adicionar URL
              </v-btn>
            </template>
          </tabela>
        </v-col>
      </v-row>
    </template>

    <!-- Contem a tab com tabela de listagem e filtro de pesquisa e tab usuário manutenção -->
    <template v-slot:listagem>
      <v-tabs v-model="tabs">
        <v-tab> Grupos de páginas </v-tab>
        <v-tab> Usuários </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <filtro
            dense
            :options="optionsFilter"
            @adicionar="(controle.inserir = true), (modal = true)"
            @clearFilters="limparFiltros"
            @search="listarRegistros()"
          >
            <template v-slot:filtros>
              <v-container class="my-0 py-0" fluid>
                <v-row class="pa-0" dense>
                  <v-col cols="12" xl="12" lg="12" md="6" xs="12">
                    <v-text-field
                      v-model="filtro.descricao"
                      hide-details
                      dense
                      label="Descrição"
                      outlined
                      append-icon="mdi-magnify"
                      @keydown.enter="listarRegistros()"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </filtro>
          <tabela
            v-if="!modal"
            :colunas="colunas"
            :loading="loading"
            :registros="registros"
            :registros-por-pagina="100"
            height-auto
            class="mt-2"
            exibir
            toolbar-grid
            titulo="Listagem de grupos de páginas"
            sem-paginacao
            @exibir="exibirRegistro($event)"
          />
        </v-tab-item>
        <v-tab-item>
          <tabela
            ref="tabelaUsuarios"
            :colunas="colunasUsuarioManutencao"
            :height-auto="!usuarioExpand"
            :loading="loading"
            :registros="usuarioManutencao"
            :registros-por-pagina="100"
            :search.sync="searchListagemDeUsuario"
            :fn-search="pesquisarUsuario"
            btn-expand-table
            toolbar-grid
            class="mt-2"
            titulo="Usuários"
            @expand="
              (usuarioExpand = $event),
                paginaUsuarioListar(),
                acessoUsuarioListar()
            "
            @expandUndo="
              (usuarioExpand = null),
                (paginasDoUsuarioSelecionadas = []),
                (acessosDoUsuarioSelecionado = [])
            "
          >
            <template v-slot:botoes>
              <v-btn
                color="primary"
                outlined
                small
                title="Atualizar"
                @click="usuarioListar()"
              >
                <v-icon left> mdi-refresh </v-icon>
                Atualizar
              </v-btn>
            </template>
            <template v-slot:cabecalho>
              <v-text-field
                v-model="searchListagemDeUsuario"
                v-mask="mascara('T', 250)"
                :disabled="!!usuarioExpand"
                class="my-2 mx-3"
                hide-details
                dense
                label="Pesquisar"
                outlined
                append-icon="mdi-magnify"
              />
            </template>
          </tabela>
          <v-row v-if="!!usuarioExpand" class="pa-0" dense>
            <v-col cols="6">
              <tabela
                :colunas="colunasPaginasUsuario"
                :loading="loading"
                :registros="paginasDoUsuario"
                :registros-por-pagina="100"
                :search.sync="searchPaginasDoUsuario"
                :selecionados.sync="paginasDoUsuarioSelecionadas"
                class="mt-2"
                height-auto
                selecionar
                sem-paginacao
                toolbar-grid
                titulo="Páginas"
              >
                <template v-slot:cabecalho>
                  <v-text-field
                    v-model="searchPaginasDoUsuario"
                    class="my-2 mx-4"
                    hide-details
                    dense
                    label="Pesquisar Página"
                    outlined
                    append-icon="mdi-magnify"
                  />
                </template>
                <template v-slot:botoes>
                  <v-btn
                    :disabled="!paginasDoUsuarioSelecionadas.length"
                    small
                    outlined
                    @click="
                      aviso = {
                        modal: true,
                        key: 'excluirPaginasdoUsuario',
                        text: 'As páginas selecionadas serão <b>excluídas</b>, deseja continuar?',
                      }
                    "
                  >
                    <v-icon color="error" left> mdi-delete </v-icon>
                    Excluir
                  </v-btn>
                </template>
              </tabela>
            </v-col>
            <v-col cols="6">
              <tabela
                ref="tabelaAcessosUsuario"
                :colunas="colunasAcessosUsuario"
                :loading="loading"
                :registros="acessos"
                :registros-por-pagina="100"
                :search.sync="searchAcessosDoUsuario"
                :selecionados.sync="acessosDoUsuarioSelecionado"
                :simple-checkbox-header="false"
                :height-auto="!expandAcesso"
                btn-expand-table
                class="mt-2"
                item-selected
                selecionar
                sem-paginacao
                titulo="Acessos"
                toolbar-grid
                @expand="
                  (acessoId = $event.id),
                    requisicaoPaginaListar(),
                    (expandAcesso = true)
                "
                @expandUndo="acessoResetExpand()"
                @item-selected="inserirOuRemoverAcesso($event)"
              >
                <template v-slot:cabecalho>
                  <v-text-field
                    v-model="searchAcessosDoUsuario"
                    class="my-2 mx-4"
                    hide-details
                    dense
                    label="Pesquisar Acesso"
                    outlined
                    append-icon="mdi-magnify"
                  />
                </template>
              </tabela>
              <tabela
                v-if="expandAcesso"
                :colunas="colunasRequisicoesUsuario"
                :registros="requisicoesPagina"
                :registros-por-pagina="100"
                class="mt-1"
                height-auto
                toolbar-grid
                titulo="Requisições"
              />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </pagina>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "Paginas",

  data: () => ({
    acessoId: null,
    acessoRequisicao: false,
    acessosSelecionados: [],
    selecionarAcesso: true,
    colunas: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Ordem",
        align: "center",
        sortable: false,
        value: "ordem",
        width: 61,
      },
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 200,
      },
      {
        text: "Icone",
        align: "start",
        sortable: false,
        value: "icone",
        width: 100,
      },
      {
        text: "Cor Icone",
        align: "start",
        sortable: false,
        value: "corIcone",
      },
    ],
    colunasRelacionamento: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Ordem",
        align: "center",
        sortable: false,
        value: "ordem",
        width: 60,
      },
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 200,
      },
      {
        text: "Observação",
        align: "start",
        sortable: false,
        value: "observacao",
        width: 200,
      },
      {
        text: "Icone",
        align: "center",
        sortable: false,
        value: "icone",
        width: 70,
      },
      {
        text: "Cor do Icone",
        align: "center",
        sortable: false,
        value: "corIcone",
        width: 100,
      },
      {
        text: "URL",
        align: "start",
        sortable: false,
        value: "url",
      },
    ],
    colunasRelacionamentoUsuario: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Login",
        align: "start",
        sortable: true,
        value: "login",
        width: 200,
      },
      {
        text: "Nome",
        align: "start",
        sortable: true,
        value: "nome",
        width: 200,
      },
      {
        text: "Ativo",
        align: "center",
        sortable: true,
        value: "ativo",
      },
    ],
    colunasRequisicoes: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 200,
      },
      {
        text: "URL",
        align: "start",
        sortable: false,
        value: "url",
      },
    ],
    colunasRequisicoesUsuario: [
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 200,
      },
      {
        text: "URL",
        align: "start",
        sortable: false,
        value: "url",
      },
    ],
    colunasAcessos: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 200,
      },
      {
        text: "Observação",
        align: "start",
        sortable: false,
        value: "observacao",
      },
    ],
    colunasAcessosUsuario: [
      {
        text: "Ação",
        align: "center",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 100,
      },
      {
        text: "Pagina",
        align: "start",
        sortable: false,
        value: "paginaDescricao",
        width: 50,
      },
      {
        text: "Observação",
        align: "start",
        sortable: false,
        value: "observacao",
        width: 50,
      },
      {},
    ],
    colunasUsuarioManutencao: [
      {
        text: "Ação",
        align: "centrer",
        sortable: false,
        value: "acao",
        width: 61,
      },
      {
        text: "Login",
        align: "start",
        sortable: true,
        value: "login",
        width: 200,
      },
      {
        text: "Nome",
        align: "start",
        sortable: true,
        value: "nome",
        width: 200,
      },
      {
        text: "Ativo",
        align: "start",
        sortable: true,
        value: "ativo",
      },
    ],
    colunasPaginasUsuario: [
      {
        text: "Descrição",
        align: "start",
        sortable: true,
        value: "descricao",
        width: 200,
      },
      {
        text: "Observação",
        align: "start",
        sortable: false,
        value: "observacao",
        width: 200,
      },
      {
        text: "Icone",
        align: "center",
        sortable: false,
        value: "icone",
        width: 61,
      },
      {
        text: "Cor do Icone",
        align: "center",
        sortable: false,
        value: "corIcone",
        width: 61,
      },
      {
        text: "URL",
        align: "start",
        sortable: false,
        value: "url",
      },
    ],
    pagi: null,
    load: null,
    itemExpand: null,
    expandAcesso: false,
    expandRequisicao: false,
    usuarioExpand: null,
    requisicaoId: null,
    usuarioId: null,
    usuarioInsercaoId: null,
    requisicaoUsuarioId: null,
    expandido: false,
    search: null,
    searchAcesso: null,
    searchRequisicao: null,
    searchListagemDeUsuario: null,
    searchAcessosDoUsuario: null,
    searchPaginasDoUsuario: null,
    modal: false,
    modalRelacionamento: false,
    modalRelacionamentoAcesso: false,
    modalRelacionamentoRequisicoes: false,
    modalDropDownUsuario: false,
    loading: false,
    paginaSelecionadas: [],
    paginasDoUsuarioSelecionadas: [],
    acessosDoUsuarioSelecionado: [],
    requisicoesSelecionadas: [],
    usuariosPaginaSelecionados: [],
    usuariosRequisicaoSelecionados: [],
    tabs: null,
    aviso: {
      key: "",
      text: "",
      modal: false,
    },
    controle: {
      exibir: false,
      inserir: false,
      editar: false,
    },
    controleRelacionamento: {
      exibir: false,
      inserir: false,
      editar: false,
    },
    controleRelacionamentoAcesso: {
      exibir: false,
      editar: false,
      inserir: false,
    },
    controleRelacionamentoRequisicoes: {
      exibir: false,
      editar: false,
      inserir: false,
    },
    filtro: {
      descricao: null,
    },
    arrUsuarios: [],
    formulario: {
      id: null,
      descricao: null,
      icone: null,
      corIcone: null,
      ordem: null,
    },
    formularioRelacionamento: {
      id: null,
      descricao: null,
      observacao: null,
      icone: null,
      corIcone: null,
      url: null,
      ordem: null,
      grupoPaginaId: null,
    },
    formularioRelacionamentoAcesso: {
      id: null,
      descricao: null,
      observacao: null,
    },
    formularioRelacionamentoRequisicoes: {
      id: null,
      descricao: null,
      url: null,
    },
  }),

  computed: {
    ...mapState("paginaCadastroDePaginas", [
      "usuarioDropDown",
      "registros",
      "registrosRelacionamento",
      "usuarioPagina",
      "requisicoesPagina",
      "usuarioManutencao",
      "paginasDoUsuario",
      "acessos",
    ]),
    optionsModalRelacionamento() {
      return {
        title: "Cadastro de página",
        width: 1000,
        maisOpcoes: !this.controleRelacionamento.inserir,
        actions: [
          {
            title:
              this.controleRelacionamento.exibir &&
              !this.controleRelacionamento.inserir
                ? "Editar"
                : "Salvar",
            color: this.$vuetify.theme.dark ? "accent" : "primary",
            icon:
              this.controleRelacionamento.exibir &&
              !this.controleRelacionamento.inserir
                ? "mdi-pencil"
                : "mdi-content-save",
            emit:
              this.controleRelacionamento.exibir &&
              !this.controleRelacionamento.inserir
                ? "editar"
                : "salvar",
            outlined: false,
          },
          {
            title: "Cancelar",
            color: "error",
            icon: "mdi-cancel",
            emit: "cancelar",
            outlined: false,
          },
        ],
      };
    },
    optionsModalRelacionamentoRequisicoes() {
      return {
        title: "Cadastro de requisição da página",
        width: 1000,
        maisOpcoes: !this.controleRelacionamentoRequisicoes.inserir,
        actions: [
          {
            title:
              this.controleRelacionamentoRequisicoes.exibir &&
              !this.controleRelacionamentoRequisicoes.inserir
                ? "Editar"
                : "Salvar",
            color: this.$vuetify.theme.dark ? "accent" : "primary",
            icon:
              this.controleRelacionamentoRequisicoes.exibir &&
              !this.controleRelacionamentoRequisicoes.inserir
                ? "mdi-pencil"
                : "mdi-content-save",
            emit:
              this.controleRelacionamentoRequisicoes.exibir &&
              !this.controleRelacionamentoRequisicoes.inserir
                ? "editar"
                : "salvar",
            outlined: false,
          },
          {
            title: "Cancelar",
            color: "error",
            icon: "mdi-cancel",
            emit: "cancelar",
            outlined: false,
          },
        ],
      };
    },
    optionsModalModalDropDownUsuario() {
      return {
        title: "Cadastro de Usuários em massa",
        width: 1000,
      };
    },
    optionsFilter() {
      return {
        adicionar: true,
        values: !!this.filtro.descricao,
      };
    },
    optionsModalRelacionamentoAcesso() {
      return {
        title: this.controleRelacionamentoAcesso.exibir
          ? "Cadastro de acesso da página"
          : this.controleRelacionamentoAcesso.inserir
          ? "Cadastrar acesso da página"
          : "Editar Cadastro de acesso da página",
        width: 600,
        maisOpcoes: !this.controleRelacionamentoAcesso.inserir,
        actions: [
          {
            title:
              this.controleRelacionamentoAcesso.exibir &&
              !this.controleRelacionamentoAcesso.inserir
                ? "Editar"
                : "Salvar",
            color: this.$vuetify.theme.dark ? "accent" : "primary",
            icon:
              this.controleRelacionamentoAcesso.exibir &&
              !this.controleRelacionamentoAcesso.inserir
                ? "mdi-pencil"
                : "mdi-content-save",
            emit:
              this.controleRelacionamentoAcesso.exibir &&
              !this.controleRelacionamentoAcesso.inserir
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
  },

  watch: {
    usuariosPaginaSelecionados(payload, antes) {
      this.selecionarAcesso = true;

      const { length: values } = payload;
      const { length: acessosSelecionados } = this.acessosSelecionados;

      if (values === 1) this.acessoBuscar(payload[0]);
      if ((antes.length > 0 && values === 0) || values === 0) {
        this.selecionarAcesso = false;
      } else if (antes.length > 0 && values === 0) {
        this.selecionarAcesso = true;
        this.acessosSelecionados = [];
      } else if ((values > 2 || values === 0) && acessosSelecionados > 0) {
        this.selecionarAcesso = false;
        this.acessosSelecionados = [];
      } else if (values > 1) this.selecionarAcesso = false;
    },
    tabs(value) {
      if (value !== 1 && this.$refs.tabelaUsuarios) {
        this.paginaResetExpand();
        this.$refs.tabelaUsuarios.expandUndoTable();
      }
    },
  },

  async created() {
    await this.listarRegistros();
    await this.usuarioManutencaoListar();
  },

  methods: {
    ...mapActions("paginaCadastroDePaginas", [
      "usuarioDropDownListar",

      "listar",
      "exibir",
      "salvar",
      "editar",
      "excluir",

      "listarPaginas",
      "exibirPagina",
      "salvarPagina",
      "editarPagina",
      "excluirPagina",
      "alterarSequenciaPagina",

      "listarUsuario",
      "excluirUsuario",
      "salvarUsuario",
      "inserirUsuarioMassa",

      "salvarAcesso",
      "editarAcesso",
      "exibirAcesso",
      "excluirAcesso",

      "listarRequisicao",
      "exibirRequisicao",
      "salvarRequisicao",
      "excluirRequisicao",
      "editarRequisicao",

      "excluirPaginasUsuario",

      "usuarioManutencaoListar",
      "listarPaginasUsuario",
      "excluirUsuarioPaginaMassa",

      "listarAcessos",
      "buscarAcessoUsuario",
      "inserirAcessoUsuario",
      "excluirAcessoUsuario",

      "listarAcessosUsuario",
    ]),
    ...mapMutations("paginaCadastroDePaginas", [
      "alterarSequencia",
      "resetAcessosPagina",
      "resetPaginas",
      "resetRequisicoesPagina",
    ]),
    // Grupos Páginas
    async listarRegistros() {
      this.loading = true;
      await this.listar({
        descricao: this.filtro.descricao || undefined,
      });
      this.loading = false;
    },
    async exibirRegistro(id) {
      this.loading = true;
      const res = await this.exibir(id);
      if (res && !res.erro) {
        this.formulario = {
          id: res.id || null,
          descricao: res.descricao || null,
          icone: res.icone || null,
          corIcone: res.corIcone || null,
          ordem: res.ordem || null,
        };
      }
      this.modal = true;
      this.controle.exibir = true;
      this.paginaListar();
      this.loading = false;
    },
    async salvarRegistro() {
      if (await this.$refs.observer.validate()) {
        this.loading = true;

        const form = {
          id: this.formulario.id || undefined,
          descricao: this.formulario.descricao || undefined,
          icone: this.formulario.icone || undefined,
          corIcone: this.formulario.corIcone || undefined,
          ordem: this.formulario.ordem
            ? Number(this.formulario.ordem)
            : undefined,
        };
        let res;
        if (form.id) res = await this.editar(form);
        else if (!form.id) res = await this.salvar(form);
        if (res) {
          if (!res.erro) {
            if (res.id) {
              this.resetFormulario();
              this.exibirRegistro(res.id);
            } else this.resetFormulario();
          } else if (typeof res.erro === "object") {
            this.$refs.observer.setErrors(res.erro);
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
    resetFormulario() {
      this.controle = {
        exibir: false,
        inserir: false,
        editar: false,
      };
      this.formulario = {
        id: null,
        descricao: null,
        icone: null,
        corIcone: null,
        ordem: null,
      };
      this.modal = false;
      this.expandido = false;
      this.listarRegistros();
      this.usuarioResetListagem();
      if (this.expandido) this.paginaResetExpand();
    },

    // Página
    async paginaUsuarioListar() {
      this.loading = true;
      await this.listarPaginasUsuario(this.usuarioExpand.id);
      this.loading = false;
    },
    async paginaUsuarioExcluir() {
      this.loading = true;
      const res = await this.excluirPaginasUsuario({
        id: this.usuarioExpand.id,
        paginaIds: this.paginasDoUsuarioSelecionadas.map((el) => el.id),
      });

      this.paginaUsuarioListar();
      this.acessoUsuarioListar();
      if (res && !res.erro) this.paginasDoUsuarioSelecionadas = [];
      this.loading = false;
    },
    async paginaListar() {
      this.loading = true;
      await this.listarPaginas(this.formulario.id);
      this.loading = false;
    },
    async paginaExibir(id) {
      this.loading = true;
      const res = await this.exibirPagina(id);
      if (res && !res.erro) {
        this.formularioRelacionamento = {
          id: res.id,
          descricao: res.descricao,
          observacao: res.observacao,
          icone: res.icone,
          corIcone: res.corIcone,
          url: res.url,
          ordem: String(res.ordem),
          grupoPaginaId: res.grupoPaginaId,
        };
      }
      this.modalRelacionamento = true;
      this.controleRelacionamento.exibir = true;
      this.loading = false;
    },
    async paginaSalvar() {
      if (await this.$refs.formularioRelacionamento.validate()) {
        this.loading = true;
        const form = {
          id: this.formularioRelacionamento.id || undefined,
          descricao: this.formularioRelacionamento.descricao || undefined,
          observacao: this.formularioRelacionamento.observacao || undefined,
          icone: this.formularioRelacionamento.icone || undefined,
          corIcone: this.formularioRelacionamento.corIcone || undefined,
          url: this.formularioRelacionamento.url || undefined,
          ordem: this.formularioRelacionamento.ordem
            ? Number(this.formularioRelacionamento.ordem)
            : undefined,
          grupoPaginaId: this.formulario.id || undefined,
        };
        let res;
        if (form.id) res = await this.editarPagina(form);
        else if (!form.id) res = await this.salvarPagina(form);
        if (res) {
          if (!res.erro) {
            if (res.id) {
              this.paginaResetFormulario();
              this.paginaListar();
            } else this.paginaResetFormulario();
          } else if (typeof res.erro === "object") {
            this.$refs.formularioRelacionamento.setErrors(res.erro);
          }
        }
      }
      this.loading = false;
    },
    async paginaExcluir() {
      this.loading = true;
      const res = await this.excluirPagina(this.formularioRelacionamento.id);
      if (res && !res.erro) this.paginaResetFormulario();
      this.loading = false;
    },
    async paginaAlterarSequencia(item) {
      const res = await this.alterarSequenciaPagina({
        ordem: this.registrosRelacionamento[item.oldIndex].ordem,
        ordemAtual: this.registrosRelacionamento[item.newIndex].ordem,
      });
      if (res && !res.erro) {
        this.alterarSequencia({
          oldIndex: item.oldIndex,
          newIndex: item.newIndex,
        });
        await this.listarPaginas(this.formulario.id);
      }
    },
    paginaResetFormulario() {
      this.controleRelacionamento = {
        exibir: false,
        inserir: false,
        editar: false,
      };
      this.formularioRelacionamento = {
        id: null,
        descricao: null,
        observacao: null,
        icone: null,
        corIcone: null,
        url: null,
        ordem: null,
        grupoPaginaId: null,
      };
      this.modalRelacionamento = false;
      if (this.$refs.tabelaPaginas) this.$refs.tabelaPaginas.expandUndoTable();
      this.paginaListar();
      this.expandido = false;
    },
    paginaResetExpand() {
      this.usuarioResetListagem();
      this.acessoResetExpand();
      this.resetAcessosPagina();
      this.expandido = false;
      this.itemExpand = null;
    },

    // Usuário
    async usuarioPaginaListar() {
      this.loading = true;

      this.usuariosPaginaSelecionados = [];
      await this.listarUsuario(this.itemExpand.id);
      await this.usuarioDropDownListar(this.itemExpand.id);

      this.loading = false;
    },
    async usuarioListar() {
      this.loading = true;
      await this.usuarioManutencaoListar();
      this.loading = false;
    },
    async usuarioInserir(usuarioId) {
      this.loading = true;
      const res = await this.salvarUsuario({
        usuarioId: usuarioId || undefined,
        paginaId: this.itemExpand.id || undefined,
      });
      if (res && !res.erro) {
        this.usuarioPaginaListar();
        this.usuarioInsercaoId = null;
      }
      this.loading = false;
    },
    async usuarioExcluir() {
      this.loading = true;
      const res = await this.excluirUsuario({
        id: this.itemExpand.id,
        usuarioRelacionamentoId: this.usuarioId,
      });
      if (res && !res.erro) {
        this.usuarioPaginaListar();
      }
      this.loading = false;
    },
    async usuarioExcluirEmMassa() {
      this.loading = true;
      const res = await this.excluirUsuarioPaginaMassa({
        id: this.itemExpand.id,
        usuarioRelacionamentoIds: this.usuariosPaginaSelecionados.map(
          (el) => el.usuarioId
        ),
      });
      if (res && !res.erro) {
        this.usuarioPaginaListar();
        this.usuariosPaginaSelecionados = [];
      }
      this.loading = false;
    },
    async usuarioInserirEmMassa(usuarios) {
      this.loading = true;

      const res = await this.inserirUsuarioMassa({
        paginaIds: this.paginaSelecionadas.map((el) => el.id),
        usuarioIds: usuarios.map((el) => el.id),
      });

      if (res && !res.erro) {
        this.paginaSelecionadas = [];
        this.$refs.pesquisarUsuario.modalFiltro = false;
        this.usuarioPaginaListar();
      }

      this.loading = false;
    },
    usuarioResetListagem() {
      this.$store.commit("paginaCadastroDePaginas/usuarioDropDown", []);
      this.$store.commit("paginaCadastroDePaginas/usuarioPagina", []);
    },

    // Acesso
    async acessoPaginaListar() {
      this.loading = true;
      this.acessosSelecionados = [];
      this.listarAcessos(this.itemExpand.id);
      this.loading = false;
    },
    async acessoUsuarioListar() {
      this.loading = true;

      await this.listarAcessosUsuario(this.usuarioExpand.id);
      this.acessosDoUsuarioSelecionado = this.acessos.filter((el) => !!el.id);

      this.loading = false;
    },
    async acessoSalvar() {
      if (await this.$refs.formularioRelacionamentoAcesso.validate()) {
        this.loading = true;
        const form = {
          id: this.formularioRelacionamentoAcesso.id || undefined,
          paginaId: this.itemExpand.id || undefined,
          descricao: this.formularioRelacionamentoAcesso.descricao || undefined,
          observacao:
            this.formularioRelacionamentoAcesso.observacao || undefined,
        };
        let res;
        if (form.id) res = await this.editarAcesso(form);
        else if (!form.id) res = await this.salvarAcesso(form);
        if (res && res.erro && typeof res.erro === "object") {
          this.$refs.formularioRelacionamentoAcesso.setErrors(res.erro);
        }
        this.acessoResetFormulario();
        this.loading = false;
      }
    },
    async acessoExibir(id) {
      this.loading = true;
      const res = await this.exibirAcesso(id);
      if (res && !res.erro) {
        this.formularioRelacionamentoAcesso = {
          id: res.id || null,
          descricao: res.descricao || null,
          observacao: res.observacao || null,
        };
      }
      this.modalRelacionamentoAcesso = true;
      this.controleRelacionamentoAcesso.exibir = true;
      this.loading = false;
    },
    async acessoExcluir() {
      this.loading = true;
      const { id } = this.formularioRelacionamentoAcesso;
      const res = await this.excluirAcesso(id);
      if (res && !res.erro) {
        this.acessoResetFormulario();
        this.acessoResetListagem();
        this.$refs.tabelaAcessos.expandUndoTable();
      }
      this.loading = false;
    },
    async acessoBuscar({ usuarioId: id }) {
      this.acessosSelecionados = [];
      const acessoDoUsuario = await this.buscarAcessoUsuario(id);
      this.acessosSelecionados = this.acessos.filter(({ id }) =>
        acessoDoUsuario.includes(id)
      );
    },
    async inserirOuRemoverAcesso({ item, value: isSelected }) {
      this.loading = true;
      const { id: acessoId } = item;
      const usuarioId =
        this.tabs === 0
          ? this.usuariosPaginaSelecionados[0].usuarioId
          : this.usuarioExpand.id;
      const form = { acessoId, usuarioId };
      if (isSelected) await this.inserirAcessoUsuario(form);
      else await this.excluirAcessoUsuario(form);

      if (this.itemExpand) await this.acessoBuscar(form);
      else if (this.usuarioExpand) await this.acessoUsuarioListar();
      this.loading = false;
    },
    acessoResetFormulario() {
      this.controleRelacionamentoAcesso = {
        exibir: false,
        editar: false,
        inserir: false,
      };
      this.formularioRelacionamentoAcesso = {
        id: null,
        descricao: null,
        observacao: null,
      };
      this.modalRelacionamentoAcesso = false;
      this.listarAcessos(this.itemExpand.id);
      if (this.$refs.tabelaAcesso) this.$refs.tabelaAcesso.expandUndoTable();
    },
    acessoResetExpand() {
      this.acessoId = null;
      this.expandAcesso = false;
      this.resetRequisicoesPagina();
    },
    acessoResetListagem() {
      this.acessoResetExpand();
      this.resetAcessosPagina();
      this.acessoPaginaListar();
    },

    // Requisição
    async requisicaoPaginaListar() {
      this.loading = true;
      await this.listarRequisicao(this.acessoId);
      this.loading = false;
    },
    async requisicaoSalvar() {
      if (await this.$refs.formularioRelacionamentoRequisicoes.validate()) {
        this.loading = true;
        const { id, descricao, url } = this.formularioRelacionamentoRequisicoes;
        const acessoId = this.acessoId;
        const form = {
          id: id || undefined,
          acessoId: acessoId || undefined,
          descricao: descricao || undefined,
          url: url || undefined,
        };
        let res;
        if (form.id) res = await this.editarRequisicao(form);
        else if (!form.id) res = await this.salvarRequisicao(form);
        if (res) {
          if (res && !res.erro) {
            if (res.id) {
              this.requisicaoResetFormulario();
            }
          } else if (typeof res.erro === "object") {
            this.$refs.formularioRelacionamentoRequisicoes.setErrors(res.erro);
          }
        }
        this.requisicaoResetFormulario();
        this.loading = false;
      }
    },
    async requisicaoExibir(id) {
      this.loading = true;
      const res = await this.exibirRequisicao(id);
      if (res && !res.erro) {
        this.formularioRelacionamentoRequisicoes = {
          id: res.id || null,
          descricao: res.descricao || null,
          url: res.url || null,
        };
      }
      this.modalRelacionamentoRequisicoes = true;
      this.controleRelacionamentoRequisicoes.exibir = true;
      this.loading = false;
    },
    async requisicaoExcluir() {
      this.loading = true;
      const res = await this.excluirRequisicao(
        this.formularioRelacionamentoRequisicoes.id
      );
      if (res && !res.erro) this.requisicaoResetFormulario();
      this.loading = false;
    },
    requisicaoResetFormulario() {
      this.controleRelacionamentoRequisicoes = {
        exibir: false,
        editar: false,
        inserir: false,
      };
      this.formularioRelacionamentoRequisicoes = {
        descricao: null,
        url: null,
      };
      this.modalRelacionamentoRequisicoes = false;
      this.requisicaoPaginaListar();
      if (this.$refs.tabelaRequisicoes)
        this.$refs.tabelaRequisicoes.expandUndoTable();
    },

    limparFiltros() {
      this.filtro = {
        descricao: null,
        ordem: null,
      };
      this.listarRegistros();
    },

    // Função de pesquis da tabela da aba usuários
    pesquisarUsuario(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
  },
};
</script>
