import moeda from "@tiig/moeda";
import day from "@/plugins/dayjs";
import opcao from "@/plugins/opcoes";

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
  registros(state, param) {
    param.forEach((element) => {
      element.data = day(element.data, "YYYY-MM-DD").format("DD/MM/YYYY");

      element.quantidadeAnimais = moeda.format(
        Number(element.quantidadeAnimais) || 0,
        0
      );

      element.qtdMsBase = moeda.format(Number(element.qtdMsBase) || 0, 3);
      element.qtdMs = moeda.format(Number(element.qtdMs) || 0, 3);
      element.qtdMo = moeda.format(Number(element.qtdMo) || 0, 3);
      element.qtdMoAjustado = moeda.format(
        Number(element.qtdMoAjustado) || 0,
        3
      );
      element.qtdMoRealizado = moeda.format(
        Number(element.qtdMoRealizado) || 0,
        3
      );
      element.qtdMsAumento = moeda.format(Number(element.qtdMsAumento) || 0, 3);
      element.qtdMsRealizado = moeda.format(
        Number(element.qtdMsRealizado) || 0,
        3
      );
      element.percentualAtendimento = moeda.format(
        Number(element.percentualAtendimento) || 0,
        2
      );
      element.percentualAumento = moeda.format(
        Number(element.percentualAumento) || 0,
        2
      );
      element.diferenca = moeda.format(Number(element.diferenca) || 0, 3);

      element.status = {
        chip: true,
        color: opcao.statusCor(9, element.status),
        text: element.statusDescricao,
      };
    });

    state.registros = param;
  },
  reset: () => {},
};
