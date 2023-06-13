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
  registros(state, param) {
    param.forEach((element) => {
      element.movimento = day(element.movimento, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );

      element.qtdAnimais = moeda.format(Number(element.qtdAnimais) || 0, 0);
      element.gmd = moeda.format(Number(element.gmd) || 0, 3);
      element.ims = moeda.format(Number(element.ims) || 0, 2);
      element.pesoMedioEntrada = moeda.format(
        Number(element.pesoMedioEntrada) || 0,
        3
      );
      element.pesoMedioAnterior = moeda.format(
        Number(element.pesoMedioAnterior) || 0,
        3
      );
      element.pesoMedioAtual = moeda.format(
        Number(element.pesoMedioAtual) || 0,
        3
      );
      element.qtdMsAnimalBase = moeda.format(
        Number(element.qtdMsAnimalBase) || 0,
        3
      );
      element.percentualAumento = moeda.format(
        Number(element.percentualAumento) || 0,
        3
      );
      element.qtdMsAnimalRealizado = moeda.format(
        Number(element.qtdMsAnimalRealizado) || 0,
        3
      );
      element.qtdMsAumentoLote = moeda.format(
        Number(element.qtdMsAumentoLote) || 0,
        3
      );
      element.qtdMsLoteAjustado = moeda.format(
        Number(element.qtdMsLoteAjustado) || 0,
        3
      );
      element.qtdMsLote = moeda.format(Number(element.qtdMsLote) || 0, 3);
      element.percentualMs = moeda.format(Number(element.percentualMs) || 0, 3);
      element.qtdMoAnimal = moeda.format(Number(element.qtdMoAnimal) || 0, 3);
      element.qtdMoLote = moeda.format(Number(element.qtdMoLote) || 0, 3);

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
