import day from "@/plugins/dayjs";
import moeda from "@tiig/moeda";

export default {
  setNotificacao(state, { ativo, cor, icone, mensagem, tempo }) {
    state.notificacao = {
      ativo,
      cor,
      icone,
      mensagem,
      tempo,
    };
  },
  opcoes(state, { grupo, opcoes }) {
    state.opcoes[grupo] = opcoes;
  },
  titulo(state, titulo) {
    state.titulo = titulo || "IG - CONFINAMENTO";
  },
  parametros(state, { chave, valor }) {
    state.parametros[chave] = valor;
  },
  reset: () => {},

  paginasUsuario(state, param) {
    state.paginasUsuario = param;
  },
  paginasUsuarioGroup(state, param) {
    state.paginasUsuarioGroup = param;
  },

  // Mapa Curral
  curralQuantidade(state, param) {
    state.curralQuantidade = param;
  },
  registros(state, param) {
    state.registros = param;
  },
  totais(state, param) {
    state.totais = {
      capacidadeTotalCurral: moeda.format(param.capacidadeTotalCurral || 0, 0),
      totalCurral: moeda.format(param.totalCurral || 0, 0),
    };
  },

  // Componente Usuario
  registrosUsuarios(state, param) {
    state.registrosUsuarios = param;
  },
};
