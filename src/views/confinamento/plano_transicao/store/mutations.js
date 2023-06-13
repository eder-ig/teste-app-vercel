import moeda from "@tiig/moeda";

export default {
  dietaDropdown(state, param) {
    state.dietaDropdown = param;
  },
  agendaTratoDropdown(state, param) {
    state.agendaTratoDropdown = param;
  },
  registros(state, param) {
    state.registros = param;
  },
  registrosRelacionamento(state, param) {
    param.forEach((element) => {
      element.dietaGanhoMedioDia = moeda.format(
        Number(element.dietaGanhoMedioDia) || 0,
        3
      );
    });
    state.registrosRelacionamento = param;
  },
  reset: () => {},
};
