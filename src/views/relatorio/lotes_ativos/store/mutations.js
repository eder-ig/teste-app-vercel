import moeda from "@tiig/moeda";
import day from "@/plugins/dayjs";
// import opcao from "@/plugins/opcoes";

export default {
  registros(state, param) {
    param.forEach((element) => {
      element.dataEntrada = day(element.dataEntrada, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );
      element.dataEsperadaAbate =
        (element.dataEsperadaAbate &&
          day(element.dataEsperadaAbate, "YYYY-MM-DD").format("DD/MM/YYYY")) ||
        "";

      element.gmd = moeda.format(Number(element.gmd) || 0, 3);
      element.pesoEntrada = moeda.format(Number(element.pesoEntrada) || 0, 3);
      element.pesoEsperadoAbate = moeda.format(
        Number(element.pesoEsperadoAbate) || 0,
        3
      );
      element.pesoMedioAtual = moeda.format(
        Number(element.pesoMedioAtual) || 0,
        3
      );
      element.qtdAnimais = moeda.format(Number(element.qtdAnimais) || 0, 0);
      element.qtdDiasConf = moeda.format(Number(element.qtdDiasConf) || 0, 0);
      element.qtdDiasEstimadoConfinamento = moeda.format(
        Number(element.qtdDiasEstimadoConfinamento) || 0,
        0
      );
      element.qtdMedioMo = moeda.format(Number(element.qtdMedioMo) || 0, 3);
      element.qtdMedioMs = moeda.format(Number(element.qtdMedioMs) || 0, 3);
      element.qtdMedioUltimoDiaMo = moeda.format(
        Number(element.qtdMedioUltimoDiaMo) || 0,
        3
      );
      element.qtdMedioUltimoDiaMs = moeda.format(
        Number(element.qtdMedioUltimoDiaMs) || 0,
        3
      );
      element.qtdMedioUltimos3DiasMo = moeda.format(
        Number(element.qtdMedioUltimos3DiasMo) || 0,
        3
      );
      element.qtdMedioUltimos3DiasMs = moeda.format(
        Number(element.qtdMedioUltimos3DiasMs) || 0,
        3
      );
    });

    state.registros = param;
  },
  reset: () => {},
};
