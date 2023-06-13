import moeda from "@tiig/moeda";

export default {
  propriedadeDropdown(state, param) {
    param.forEach((element) => {
      element.descricao = `${element.id} | ${element.nomeFazenda} | ${element.marca}`;
    });
    state.propriedadeDropdown = param;
  },

  updateRegistros(state, { oldIndex, newIndex }) {
    const movedItem = state.registrosRelacionamento.splice(oldIndex, 1)[0];

    state.registrosRelacionamento.splice(newIndex, 0, movedItem);
  },
  registrosRelacionamento(state, param) {
    param.forEach((element) => {
      element.percentualDistribuicao = `${moeda.format(
        Number(element.percentualDistribuicao),
        2
      )}%`;
      element.correcao =
        element.correcao === 1 ? "SIM" : element.correcao === 0 ? "NÃO" : " - ";
    });
    state.registrosRelacionamento = param;
  },

  registros(state, param) {
    param.forEach((element) => {
      element.propriedadeDescricao = `${element.propriedade.id} | ${element.propriedade.nomeFazenda} | ${element.propriedade.marca}`;
    });
    state.registros = param;
  },

  reset: () => {},
};
