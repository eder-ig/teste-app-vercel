import day from "@/plugins/dayjs";
import opcao from "@/plugins/opcoes";
import moeda from "@tiig/moeda";

export default {
  dropdownLotesAtivos(state, param) {
    param.forEach((element) => {
      element.loteDataEntrada = day(element.loteDataEntrada).format(
        "DD/MM/YYYY"
      );
      element.loteQuantidadeAnimais = moeda.format(
        element.loteQuantidadeAnimais || 0,
        0
      );
      element.lotePesoMedioEntrada = moeda.format(
        element.lotePesoMedioEntrada || 0,
        3
      );
    });
    state.dropdownLotesAtivos = param;
  },
  dropdownTipoLeituraCocho(state, param) {
    state.dropdownTipoLeituraCocho = param;
  },
  registros(state, param) {
    param.forEach((element) => {
      element.data = day(element.data).format("DD/MM/YYYY");
    });
    state.registros = param;
  },
  reset: () => {},
};
