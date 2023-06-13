import day from "@/plugins/dayjs";
// import opcao from "@/plugins/opcoes";
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
  ultimasLeituras(state, param) {
    param.forEach((element) => {
      element.dataLeitura = day(element.dataLeitura).format("DD/MM/YYYY");
    });
    state.ultimasLeituras = param;
  },
  historicoOcorrencias(state, param) {
    param.forEach((element) => {
      element.data = day(element.data).format("DD/MM/YYYY");
    });
    state.historicoOcorrencias = param;
  },
  historicoConsumo(state, param) {
    param.forEach((element) => {
      element.movimento = day(element.movimento).format("DD/MM/YYYY");
      element.qtdAnimais = moeda.format(element.qtdAnimais || 0, 0);
      element.ganhoMedioDia = moeda.format(
        Number(element.ganhoMedioDia) || 0,
        3
      );
      element.ingestaoMassaSeca = moeda.format(
        Number(element.ingestaoMassaSeca) || 0,
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
      element.qtdMsAnimalRealizada = moeda.format(
        Number(element.qtdMsAnimalRealizada) || 0,
        3
      );
      element.qtdMsLote = moeda.format(Number(element.qtdMsLote) || 0, 3);
      element.qtdMsAumentoLote = moeda.format(
        Number(element.qtdMsAumentoLote) || 0,
        3
      );
      element.qtdMoAnimal = moeda.format(Number(element.qtdMoAnimal) || 0, 3);
      element.qtdMoLote = moeda.format(Number(element.qtdMoLote) || 0, 3);
      element.ganhoMedioDia = moeda.format(
        Number(element.ganhoMedioDia) || 0,
        3
      );
      element.ganhoMedioDia = moeda.format(
        Number(element.ganhoMedioDia) || 0,
        3
      );
      element.ganhoMedioDia = moeda.format(
        Number(element.ganhoMedioDia) || 0,
        3
      );
      element.percentualMs = moeda.format(Number(element.percentualMs) || 0, 2);
    });

    state.historicoConsumo = param;
  },
  coletaCocho(state, param) {
    param.forEach((element) => {
      element.data = day(element.data).format("DD/MM/YYYY");
    });
    state.coletaCocho = param;
  },
  registros(state, param) {
    param.forEach((element) => {
      element.tipoLeituraDescricao = element.tipoLeituraCocho.descricao;
      element.piqueteDescricao = element.piquete.codigo;

      element.dataLeitura = element.dataLeitura
        ? day(element.dataLeitura, "YYYY-MM-DD HH:mm:ss").format(
            "DD/MM/YYYY HH:mm:ss"
          )
        : null;
    });

    state.registros = param;
  },
  reset: () => {},
};
