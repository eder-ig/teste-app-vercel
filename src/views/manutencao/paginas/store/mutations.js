export default {
  registros(state, param) {
    param.forEach((element) => {
      element.icone = element.icone
        ? { color: element.corIcone, icone: element.icone }
        : "";
    });

    state.registros = param;
  },
  registrosRelacionamento(state, param) {
    param.forEach((element) => {
      element.icone = element.icone
        ? { color: element.corIcone, icone: element.icone }
        : "";
    });

    state.registrosRelacionamento = param;
  },
  usuarioPagina(state, param) {
    param.forEach((element) => {
      element.ativo =
        element.ativo === "SIM"
          ? `<span class="green--text"> ${element.ativo} </span>`
          : `<span class="red--text"> ${element.ativo} </span>`;
    });
    state.usuarioPagina = param;
  },
  usuarioDropDown(state, param) {
    state.usuarioDropDown = param;
  },
  requisicoesPagina(state, param) {
    state.requisicoesPagina = param;
  },
  usuarioManutencao(state, param) {
    param.forEach((element) => {
      element.ativo =
        element.ativo === "SIM"
          ? `<span class="green--text"> ${element.ativo} </span>`
          : `<span class="red--text"> ${element.ativo} </span>`;
    });
    state.usuarioManutencao = param;
  },
  paginasDoUsuario(state, param) {
    param.forEach((element) => {
      element.icone = element.icone
        ? { color: element.corIcone, icone: element.icone }
        : "";
    });
    state.paginasDoUsuario = param;
  },
  acessos(state, param) {
    state.acessos = param;
  },
  alterarSequencia(state, ordem) {
    const movedItem = state.registrosRelacionamento.splice(
      ordem.oldIndex,
      1
    )[0];
    state.registrosRelacionamento.splice(ordem.newIndex, 0, movedItem);
  },
  reset: () => {},
  resetRequisicoesPagina(state) {
    state.requisicoesPagina = [];
  },
  resetAcessosPagina(state) {
    state.acessos = [];
  },
  resetPaginas(state) {
    state.registrosRelacionamento = [];
  },
};
