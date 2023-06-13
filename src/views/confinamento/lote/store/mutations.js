import day from "@/plugins/dayjs";
import opcao from "@/plugins/opcoes";
import moeda from "@tiig/moeda";

export default {
  registros(state, param) {
    param.forEach((element) => {
      element.dataEntrada = element.dataEntrada
        ? day(element.dataEntrada, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY")
        : null;
      element.dataSaida = element.dataSaida
        ? day(element.dataSaida, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY")
        : null;
      element.pesoMedioEntrada = moeda.format(
        Number(element.pesoMedioEntrada) || 0,
        3
      );
      element.pesoEsperadoAbate = moeda.format(
        Number(element.pesoEsperadoAbate) || 0,
        3
      );
      element.pesoMedioSaida = moeda.format(
        Number(element.pesoMedioSaida) || 0,
        3
      );
      element.status = {
        chip: true,
        color: opcao.statusCor(9, element.status),
        text: element.statusDescricao,
      };
    });

    state.registros = param;
  },

  movimentosLote(state, param) {
    param.forEach((element) => {
      element.movimento = day(element.movimento).format("DD/MM/YYYY");
      // element.dietaDescricao = element.dieta.descricao;
      // element.loteDescricao = element.lote.descricao;

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
      element.percentualMs = moeda.format(Number(element.percentualMs) || 0, 3);
      element.qtdMoAnimal = moeda.format(Number(element.qtdMoAnimal) || 0, 3);
      element.qtdMoLote = moeda.format(Number(element.qtdMoLote) || 0, 3);
      element.lotePesoMedioEntrada = moeda.format(
        Number(element.lotePesoMedioEntrada) || 0,
        3
      );
    });
    state.movimentosLote = param;
  },

  lotePiquete(state, param) {
    param.forEach((element) => {
      element.tamanhoCocho = element.piquete.tamanhoCocho;
      element.areaTotal = moeda.format(element.piquete.areaTotal || 0, 0);
      element.capacidadeMaxima = element.piquete.capacidadeMaxima;
      element.capacidadeIdeal = element.piquete.capacidadeIdeal;
      element.piqueteDescricao = element.piquete.codigo;
    });
    state.lotePiquete = param;
  },

  raca(state, param) {
    state.racas = param;
  },
  piquete(state, param) {
    state.piquetes = param;
  },
  categoria(state, param) {
    state.categorias = param;
  },
  dieta(state, param) {
    param.forEach((element) => {
      element.ingestaoMassaSeca = moeda.format(
        Number(element.ingestaoMassaSeca) || 0,
        2
      );
      element.ganhoMedioDia = moeda.format(
        Number(element.ganhoMedioDia) || 0,
        3
      );
    });
    state.dietas = param;
  },
  loteDieta(state, param) {
    param.forEach((element) => {
      element.diasUsados = element.dataInicio
        ? element.dataFim
          ? day(element.dataFim).diff(day(element.dataInicio), "d")
          : day().diff(day(element.dataInicio), "d")
        : null;
      element.dietaDescicao = element.dieta.descricao;
      element.statusCongelado = element.status;
      element.quantidadeDiasUso = element.dieta.quantidadeDiasUso;
      element.dataInicio = day(element.dataInicio).format("DD/MM/YYYY");
      element.dataFim = element.dataFim
        ? day(element.dataFim).format("DD/MM/YYYY")
        : null;
      element.ingestaoMassaSeca = moeda.format(
        Number(element.dieta.ingestaoMassaSeca) || 0,
        2
      );
      element.dieta.ingestaoMassaSeca = moeda.format(
        Number(element.dieta.ingestaoMassaSeca) || 0,
        2
      );
      element.ganhoMedioDia = moeda.format(
        Number(element.dieta.ganhoMedioDia) || 0,
        3
      );
      element.dieta.ganhoMedioDia = moeda.format(
        Number(element.dieta.ganhoMedioDia) || 0,
        3
      );
      element.status = {
        chip: true,
        color: opcao.statusCor(13, element.status),
        text: element.statusLoteDieta.descricao,
      };
    });
    state.loteDieta = param;
  },

  planoTransicaoLote(state, param) {
    param.forEach((element) => {
      element.dataInicioTransicao = day(element.dataInicioTransicao).format(
        "DD/MM/YYYY"
      );

      element.status = {
        chip: true,
        color: opcao.statusCor(15, element.status),
        text: element.statusDescricao,
      };
    });
    state.planoTransicaoLote = param;
  },
  planoTransicaoDropdown(state, param) {
    param.forEach((element) => {
      element.descricao = `${element.descricao} | Qtd: ${element.quantidadeDias} dias | Inicio: ${element.dietaInicial} | Fim: ${element.dietaFinal}`;
    });
    state.planoTransicaoDropdown = param;
  },
  reset: () => {},
};
