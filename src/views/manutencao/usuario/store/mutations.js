export default {
  reset: () => {},
  empresas(state, data) {
    state.empresas = data;
  },
  empresasUsuario(state, data) {
    state.empresasUsuario = data;
  },
  perfis(state, data) {
    let aux = [];

    data.forEach((element) => {
      let registro = state.perfisUsuario.find(
        (el) => el.descricao === element.descricao
      );
      if (!registro) {
        aux.push(element);
      }
    });

    state.perfis = aux;
  },
  perfisUsuario(state, data) {
    state.perfisUsuario = data;
  },
  usuarios(state, data) {
    state.usuarios = data.map((usuario) => {
      usuario.ativo = usuario.ativo === 1 ? "Sim" : "Nao";
      return usuario;
    });
  },
};
