import moeda from "@tiig/moeda";

export default {
  registros(state, param) {
    param.forEach((element) => {
      element.rendimentoCarcaca = element.rendimentoCarcaca
        ? moeda.format(Number(element.rendimentoCarcaca), 2)
        : null;
    });
    state.registros = param;
  },
  confinamentos(state, param) {
    state.confinamentos = param;
  },
  reset: () => {},
};
