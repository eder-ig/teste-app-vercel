import day from "@/plugins/dayjs";
import moeda from "@tiig/moeda";

export default {
  registros(state, param) {
    param.forEach((element) => {
      element.ladoEsquerdo.forEach((el) => {
        el.loteDataEntrada = el.loteDataEntrada
          ? day(el.loteDataEntrada, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY")
          : null;
        el.tratos.forEach((tra) => {
          tra.percentualAumento = moeda.format(
            Number(tra.percentualAumento || 0),
            3
          );
          tra.quantidadeMsAumento = moeda.format(
            Number(tra.quantidadeMsAumento || 0),
            3
          );
          tra.quantidadeMassaSeca = moeda.format(
            Number(tra.quantidadeMassaSeca || 0),
            3
          );
          tra.quantidadeMassaOriginal = moeda.format(
            Number(tra.quantidadeMassaOriginal || 0),
            3
          );
          tra.quantidadeMassaOriginalCorrigida = moeda.format(
            Number(tra.quantidadeMassaOriginalCorrigida || 0),
            3
          );
          tra.quantidadeRealMassaSecaTrato = moeda.format(
            Number(tra.quantidadeRealMassaSecaTrato || 0),
            3
          );
          tra.quantidadeRealMassaOriginalTrato = moeda.format(
            Number(tra.quantidadeRealMassaOriginalTrato || 0),
            3
          );
        });
      });
      element.ladoDireito.forEach((el) => {
        el.loteDataEntrada = el.loteDataEntrada
          ? day(el.loteDataEntrada, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY")
          : null;
        el.tratos.forEach((tra) => {
          tra.percentualAumento = moeda.format(
            Number(tra.percentualAumento || 0),
            3
          );
          tra.quantidadeMsAumento = moeda.format(
            Number(tra.quantidadeMsAumento || 0),
            3
          );
          tra.quantidadeMassaSeca = moeda.format(
            Number(tra.quantidadeMassaSeca || 0),
            3
          );
          tra.quantidadeMassaOriginal = moeda.format(
            Number(tra.quantidadeMassaOriginal || 0),
            3
          );
          tra.quantidadeMassaOriginalCorrigida = moeda.format(
            Number(tra.quantidadeMassaOriginalCorrigida || 0),
            3
          );
          tra.quantidadeRealMassaSecaTrato = moeda.format(
            Number(tra.quantidadeRealMassaSecaTrato || 0),
            3
          );
          tra.quantidadeRealMassaOriginalTrato = moeda.format(
            Number(tra.quantidadeRealMassaOriginalTrato || 0),
            3
          );
        });
      });
    });
    state.registros = param;
  },
  dietas(state, param) {
    state.dietas = param;
  },
  agendasTrato(state, param) {
    state.agendasTrato = param;
  },
  totais(state, param) {
    state.totais = {
      capacidadeMaxima: moeda.format(param.capacidadeMaxima || 0, 0),
      totalAnimais: moeda.format(param.totalAnimais || 0, 0),
    };
  },
  reset: () => {},
};
