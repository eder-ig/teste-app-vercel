import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/layout/"),
    children: [
      {
        path: "",
        redirect: "/inicio",
      },
      {
        path: "/inicio",
        name: "Início",
        component: () => import("@/views/inicio/"),
      },
      {
        path: "/manutencao/usuario",
        name: "Cadastro Usuário",
        component: () => import("@/views/manutencao/usuario/"),
        props: {
          storeName: "paginaCadastroUsuario",
          storePath: "/manutencao/usuario/store",
        },
      },
      {
        path: "/manutencao/paginas",
        name: "Cadastro de Páginas",
        component: () => import("@/views/manutencao/paginas/"),
        props: {
          storeName: "paginaCadastroDePaginas",
          storePath: "/manutencao/paginas/store",
        },
      },
      {
        path: "/manutencao/opcao",
        name: "Cadastro Opção",
        component: () => import("@/views/manutencao/opcao/"),
        props: {
          storeName: "paginaCadastroOpcao",
          storePath: "/manutencao/opcao/store",
        },
      },
      {
        path: "/confinamento/alimento",
        name: "Alimento",
        component: () => import("@/views/confinamento/alimento/"),
        props: {
          storeName: "paginaConfinamentoAlimento",
          storePath: "/confinamento/alimento/store",
        },
      },
      {
        path: "/confinamento/dieta",
        name: "Dieta",
        component: () => import("@/views/confinamento/dieta/"),
        props: {
          storeName: "paginaConfinamentoDieta",
          storePath: "/confinamento/dieta/store",
        },
      },
      {
        path: "/confinamento/propriedade",
        name: "Propriedade",
        component: () => import("@/views/confinamento/propriedade/"),
        props: {
          storeName: "paginaConfinamentoPropriedade",
          storePath: "/confinamento/propriedade/store",
        },
      },
      {
        path: "/confinamento/confinamento",
        name: "Confinamento",
        component: () => import("@/views/confinamento/confinamento/"),
        props: {
          storeName: "paginaConfinamentoConfinamento",
          storePath: "/confinamento/confinamento/store",
        },
      },
      {
        path: "/confinamento/agenda-trato",
        name: "Agendamento de Trato",
        component: () => import("@/views/confinamento/agenda_trato/"),
        props: {
          storeName: "paginaConfinamentoAgendamentoTrato",
          storePath: "/confinamento/agenda_trato/store",
        },
      },
      {
        path: "/confinamento/receita",
        name: "Receita",
        component: () => import("@/views/confinamento/receita/"),
        props: {
          storeName: "paginaConfinamentoReceita",
          storePath: "/confinamento/receita/store",
        },
      },
      {
        path: "/confinamento/piquete",
        name: "Piquete",
        component: () => import("@/views/confinamento/piquete/"),
        props: {
          storeName: "paginaConfinamentoPiquete",
          storePath: "/confinamento/piquete/store",
        },
      },
      {
        path: "/confinamento/rua",
        name: "Rua",
        component: () => import("@/views/confinamento/rua/"),
        props: {
          storeName: "paginaConfinamentoRua",
          storePath: "/confinamento/rua/store",
        },
      },
      {
        path: "/confinamento/raca",
        name: "Raca",
        component: () => import("@/views/confinamento/raca/"),
        props: {
          storeName: "paginaConfinamentoRaca",
          storePath: "/confinamento/raca/store",
        },
      },
      {
        path: "/confinamento/categoria",
        name: "Categoria",
        component: () => import("@/views/confinamento/categoria/"),
        props: {
          storeName: "paginaConfinamentoCategoria",
          storePath: "/confinamento/categoria/store",
        },
      },
      {
        path: "/confinamento/linha",
        name: "Linha",
        component: () => import("@/views/confinamento/linha/"),
        props: {
          storeName: "paginaConfinamentoLinha",
          storePath: "/confinamento/linha/store",
        },
      },
      {
        path: "/confinamento/leitura-cocho",
        name: "Leitura Cocho",
        component: () => import("@/views/confinamento/leitura_cocho/"),
        props: {
          storeName: "paginaConfinamentoLeituraCocho",
          storePath: "/confinamento/leitura_cocho/store",
        },
      },
      {
        path: "/confinamento/equipamento",
        name: "Equipamento",
        component: () => import("@/views/confinamento/equipamento/"),
        props: {
          storeName: "paginaConfinamentoEquipamento",
          storePath: "/confinamento/equipamento/store",
        },
      },
      {
        path: "/confinamento/lote",
        name: "Lotes",
        component: () => import("@/views/confinamento/lote/"),
        props: {
          storeName: "paginaConfinamentoLote",
          storePath: "/confinamento/lote/store",
        },
      },
      {
        path: "/confinamento/tipo-leitura-cocho",
        name: "Tipo de Leitura de Cocho",
        component: () => import("@/views/confinamento/tipo_leitura_cocho/"),
        props: {
          storeName: "paginaConfinamentoTipoLeituraCocho",
          storePath: "/confinamento/tipo_leitura_cocho/store",
        },
      },
      {
        path: "/confinamento/analise-alimento",
        name: "Análise Alimento",
        component: () => import("@/views/confinamento/analise_alimento/"),
        props: {
          storeName: "paginaConfinamentoAnaliseAlimento",
          storePath: "/confinamento/analise_alimento/store",
        },
      },
      {
        path: "/confinamento/plano-transicao",
        name: "Plano Transicao Dieta",
        component: () => import("@/views/confinamento/plano_transicao/"),
        props: {
          storeName: "paginaPlanoTransicaoDieta",
          storePath: "/confinamento/plano_transicao/store",
        },
      },
      {
        path: "/confinamento/coleta-leitura-cocho",
        name: "Coleta Litura de Cocho",
        component: () => import("@/views/confinamento/coleta_leitura_cocho/"),
        props: {
          storeName: "paginaColetaLeituraCocho",
          storePath: "/confinamento/coleta_leitura_cocho/store",
        },
      },
      {
        path: "/confinamento/tipo-ocorrencia",
        name: "Tipo de Ocorrências",
        component: () => import("@/views/confinamento/tipo_ocorrencia/"),
        props: {
          storeName: "paginaTipoOcorrencia",
          storePath: "/confinamento/tipo_ocorrencia/store",
        },
      },
      {
        path: "/confinamento/ocorrencia",
        name: "Cadastro de Ocorrências",
        component: () => import("@/views/confinamento/ocorrencia/"),
        props: {
          storeName: "paginaCadastroOcorrencia",
          storePath: "/confinamento/ocorrencia/store",
        },
      },
      {
        path: "/relatorio/eficiencia-trato",
        name: "Relatório Eficiência de Trato",
        component: () => import("@/views/relatorio/eficiencia_trato/"),
        props: {
          storeName: "relatorioEficienciaTrato",
          storePath: "/relatorio/eficiencia_trato/store",
        },
      },
      {
        path: "/relatorio/movimento-lotes",
        name: "Relatório Movimento Lotes",
        component: () => import("@/views/relatorio/movimento_lotes/"),
        props: {
          storeName: "relatorioMovimentoLotes",
          storePath: "/relatorio/movimento_lotes/store",
        },
      },
      {
        path: "/relatorio/lotes-ativos",
        name: "Relatório Lotes Ativos",
        component: () => import("@/views/relatorio/lotes_ativos/"),
        props: {
          storeName: "relatorioLotesAtivos",
          storePath: "/relatorio/lotes_ativos/store",
        },
      },
      {
        path: "/relatorio/calculadora-lotes",
        name: "Calculadora Lotes",
        component: () => import("@/views/relatorio/calculadora_lote/"),
        props: {
          storeName: "paginaCalculadoraLote",
          storePath: "/relatorio/calculadora_lote/store",
        },
      },
      {
        path: "/relatorio/resumo-dia",
        name: "Relatório Resumo do Dia",
        component: () => import("@/views/relatorio/resumo_dia/"),
        props: {
          storeName: "relatorioResumoDia",
          storePath: "/relatorio/resumo_dia/store",
        },
      },
      {
        path: "/relatorio/distribuicao-trato-piquete",
        name: "Relatório Distribuição Trato Piquete",
        component: () =>
          import("@/views/relatorio/distribuicao_trato_piquete/"),
        props: {
          storeName: "relatorioDistribuicaoTratoPiquete",
          storePath: "/relatorio/distribuicao_trato_piquete/store",
        },
      },
      {
        path: "/relatorio/mapa-piquete",
        name: "Mapa dos Piquetes",
        component: () => import("@/views/relatorio/mapa_piquete/"),
        props: {
          storeName: "relatorioMapaPiquete",
          storePath: "/relatorio/mapa_piquete/store",
        },
      },
    ],
    beforeEnter: (to, from, next) =>
      localStorage.getItem("igtrato:token") ? next() : next("/login"),
  },
  {
    path: "/login",
    component: () => import("@/views/auth/"),
    children: [
      {
        path: "",
        name: "Login",
        component: () => import("@/views/auth/"),
      },
    ],
    beforeEnter: (to, from, next) =>
      localStorage.getItem("igtrato:token") ? next("/") : next(),
  },
  {
    path: "*",
    component: () => import("@/views/error/404"),
  },
  {
    path: "/proibido",
    name: "Proibido",
    component: () => import("@/views/error/403"),
  },
];

const router = new VueRouter({
  mode: "history",
  // mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, _from, next) => {
  store.commit("app/titulo", to.name);

  const path = to.matched.length > 1 ? to.matched[1].path : to.path;

  if (
    to.matched[0].path !== "*" &&
    to.path !== "/inicio" &&
    to.path !== "/login" &&
    to.path !== "/" &&
    to.path !== "/proibido"
  ) {
    if (localStorage.getItem("igtrato:token")) {
      let rotas;
      try {
        rotas = localStorage.getItem("igtrato:paginas-usuario")
          ? JSON.parse(
              window.atob(localStorage.getItem("igtrato:paginas-usuario"))
            )
          : [];
      } catch (e) {
        rotas = [];
      }

      if (rotas.find((rota) => rota.url === path)) next();
      else next("/proibido");
    } else next("/login");
  } else {
    next();
  }

  next();
});

export default router;
