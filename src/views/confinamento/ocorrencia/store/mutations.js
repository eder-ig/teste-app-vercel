import day from "@/plugins/dayjs";

export default {
  dropdownLotesAtivos(state, param) {
    param.forEach((element) => {
      element.descricao = `${element.codigo} - ${element.loteDescricao} -- Qtd. Anim.: ${element.loteQuantidadeAnimais}`;
    });

    state.dropdownLotesAtivos = param;
  },
  dropdownLotes(state, param) {
    state.dropdownLotes = param;
  },
  dropdownPiquetes(state, param) {
    state.dropdownPiquetes = param;
  },
  dropdownTipoOcorrencia(state, param) {
    state.dropdownTipoOcorrencia = param;
  },
  registros(state, param) {
    param.forEach((element) => {
      element.data = element.data
        ? day(element.data, "YYYY-MM-DD").format("DD/MM/YYYY")
        : "";
      const dataEntradaLote = day(element.loteDataEntrada, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );
      element.loteDescricao = `${element.loteDescricao} -- Entrada: ${dataEntradaLote} -- Qtd. Ani.: ${element.loteQuantidadeAnimais}`;
    });
    state.registros = param;
  },
  reset: () => {},
};
