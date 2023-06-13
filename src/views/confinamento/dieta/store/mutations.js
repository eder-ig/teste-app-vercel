import moeda from "@tiig/moeda";

export default {
  tipoDietaDropdown(state, param) {
    state.tipoDietaDropdown = param;
  },
  alimentoDropdown(state, param) {
    param.forEach((element) => {
      element.descricao = `${element.descricao} | ${element.descricaoSubgrupoIgfaz} | ${element.unidade}`;
    });
    state.alimentoDropdown = param;
  },
  registrosRelacionamento(state, param) {
    param.forEach((element) => {
      element.alimentoDescricao = element.alimento.descricao;
      element.quantidade = moeda.format(Number(element.quantidade) || 0, 2);
    });
    state.registrosRelacionamento = param;
  },
  registros(state, param) {
    param.forEach((element) => {
      element.tipoDietaDescricao =
        element.tipoDieta && element.tipoDieta.descricao;
      element.ganhoMedioDia = moeda.format(Number(element.ganhoMedioDia), 2);
      element.ingestaoMassaSeca = moeda.format(
        Number(element.ingestaoMassaSeca),
        2
      );
    });
    state.registros = param;
  },
  reset: () => {},
};
