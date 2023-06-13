export default {
  login: localStorage.getItem("igtrato:login")
    ? window.atob(localStorage.getItem("igtrato:login"))
    : null,
  nome: localStorage.getItem("igtrato:nome")
    ? window.atob(localStorage.getItem("igtrato:nome"))
    : null,

  notificacao: {
    ativo: false,
    cor: null,
    icone: null,
    mensagem: null,
    tempo: null,
  },
  opcoes: {},
  titulo: null,
  parametros: {},

  paginasUsuario: [],
  paginasUsuarioGroup: [],

  // Mapa Curral
  registros: [],
  curralQuantidade: [],
  totais: {},

  registrosUsuarios: [],
};
