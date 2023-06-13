import moeda from "@tiig/moeda";
import day from "@/plugins/dayjs";

export default {
  dropdownLotesAtivos(state, param) {
    param.forEach((element) => {
      element.loteDataEntrada = day(element.loteDataEntrada).format(
        "DD/MM/YYYY"
      );
    });
    state.dropdownLotesAtivos = param;
  },
  agendaTratoDropdown(state, param) {
    state.agendaTratoDropdown = param;
  },
  dropdownDietas(state, param) {
    state.dropdownDietas = param;
  },
  registros(state, param) {
    param.forEach((element) => {
      element.data = day(element.data, "YYYY-MM-DD HH:mm:ss").format(
        "DD/MM/YYYY HH:mm:ss"
      );

      element.quantidadeMassaSeca = moeda.format(
        Number(element.quantidadeMassaSeca) || 0,
        3
      );
      element.quantidadeMassaOriginal = moeda.format(
        Number(element.quantidadeMassaOriginal) || 0,
        3
      );
      element.quantidadeMassaOriginalCorrigida = moeda.format(
        Number(element.quantidadeMassaOriginalCorrigida) || 0,
        3
      );
      element.quantidadeRealMassaSecaTrato = moeda.format(
        Number(element.quantidadeRealMassaSecaTrato) || 0,
        3
      );
      element.quantidadeRealMassaOriginalTrato = moeda.format(
        Number(element.quantidadeRealMassaOriginalTrato) || 0,
        3
      );
      element.pesoBalanca = moeda.format(Number(element.pesoBalanca) || 0, 3);
      element.pesoDescarregado = moeda.format(
        Number(element.pesoDescarregado) || 0,
        3
      );
      element.variacao = moeda.format(Number(element.variacao) || 0, 3);
    });
    state.registros = param;
  },
  reset: () => {},
};
