import day from "@/plugins/dayjs";
import opcao from "@/plugins/opcoes";
import moeda from "@tiig/moeda";

export default {
  agendaTratos(state, param) {
    param.forEach((element) => {
      element.descricao = `Agenda: ${element.hora} -  Distribuição: ${element.percentualDistribuicao} %`;
    });
    state.agendaTratos = param;
  },
  registrosAgendaTratoGerada(state, param) {
    param.forEach((element) => {
      element.data = day(element.data).format("DD/MM/YYYY");
      element.diferenca = moeda.format(
        Number(element.quantidadeMassaOriginal) -
          Number(element.quantidadeMassaOriginalAtendido) || 0,
        3
      );
      element.quantidadeMassaSeca = moeda.format(
        Number(element.quantidadeMassaSeca) || 0,
        3
      );
      element.quantidadeMassaOriginal = moeda.format(
        Number(element.quantidadeMassaOriginal) || 0,
        3
      );
      element.quantidadeMassaSecaAtendido = moeda.format(
        Number(element.quantidadeMassaSecaAtendido) || 0,
        3
      );
      element.quantidadeMassaOriginalCorrigida = moeda.format(
        Number(element.quantidadeMassaOriginalCorrigida) || 0,
        3
      );
      element.quantidadeMassaOriginalAtendido = moeda.format(
        Number(element.quantidadeMassaOriginalAtendido) || 0,
        3
      );
      element.status = {
        chip: true,
        color: opcao.statusCor(4, element.status),
        text: element.statusDescricao || " - ",
      };
    });
    state.registrosAgendaTratoGerada = param;
  },
  registros(state, param) {
    param.forEach((element) => {
      element.data = day(element.data).format("DD/MM/YYYY");
      element.percentualMs = element.quantidadeMassaSeca
        ? moeda.format(
            (Number(element.quantidadeMassaSeca) /
              Number(element.quantidadeMassaOriginal)) *
              100 || 0,
            2
          )
        : 0;

      element.quantidadeMassaOriginal = moeda.format(
        Number(element.quantidadeMassaOriginal) || 0,
        2
      );
      element.quantidadeMassaSeca = moeda.format(
        Number(element.quantidadeMassaSeca) || 0,
        2
      );

      element.status = {
        chip: true,
        color: opcao.statusCor(3, element.statusReceita.item),
        text: element.statusReceita.descricao || " - ",
      };
    });
    state.registros = param;
  },
  registrosReceitaIngrediente(state, param) {
    param.forEach((element) => {
      element.alimentoDescricao = element.dietaAlimento.alimento.descricao;
      element.dietaAlimento.quantidade = moeda.format(
        Number(element.dietaAlimento.quantidade) || 0,
        2
      );

      element.percentualMassaSeca = moeda.format(
        Number(element.percentualMassaSeca) || 0,
        2
      );
      element.inclusaoMassaSeca = moeda.format(
        Number(element.inclusaoMassaSeca) || 0,
        2
      );
      element.inclusaoMassaOriginal = moeda.format(
        Number(element.inclusaoMassaOriginal) || 0,
        2
      );

      element.quantidadeMassaSeca = moeda.format(
        Number(element.quantidadeMassaSeca) || 0,
        3
      );
      element.quantidadeMassaOriginal = moeda.format(
        Number(element.quantidadeMassaOriginal) || 0,
        3
      );
    });
    state.registrosReceitaIngrediente = param;
  },
  registrosTratosAgrupados(state, param) {
    param.forEach((element) => {
      element.data = day(element.data).format("DD/MM/YYYY");

      element.quantidadeMassaSeca = moeda.format(
        Number(element.quantidadeMassaSeca) || 0,
        3
      );
      element.quantidadeMassaSecaAtendido = moeda.format(
        Number(element.quantidadeMassaSecaAtendido) || 0,
        3
      );
      element.quantidadeMassaOriginal = moeda.format(
        Number(element.quantidadeMassaOriginal) || 0,
        3
      );
      element.quantidadeMassaOriginalAtendido = moeda.format(
        Number(element.quantidadeMassaOriginalAtendido) || 0,
        3
      );
      element.quantidadeMassaOriginalCorrigida = moeda.format(
        Number(element.quantidadeMassaOriginalCorrigida) || 0,
        3
      );
      element.status = {
        chip: true,
        color: opcao.statusCor(4, element.statusTrato.item),
        text: element.statusTrato.descricao || " - ",
      };

      element.tratoMovimentos.forEach((mov) => {
        mov.loteDescricao = mov.lote.descricao;
        mov.piqueteDescricao = mov.piquete.codigo;
        mov.diferenca =
          moeda.format(
            Number(mov.quantidadeMassaOriginalCorrigida) -
              Number(mov.quantidadeRealMassaOriginalTrato) || 0,
            3
          ) || "";

        mov.percentualAumento = moeda.format(
          Number(mov.percentualAumento) || 0,
          2
        );
        mov.quantidadeMsAumento = moeda.format(
          Number(mov.quantidadeMsAumento) || 0,
          3
        );
        mov.quantidadeAnimais = moeda.format(
          Number(mov.lote.quantidadeAnimais) || 0,
          0
        );
        mov.lote.quantidadeAnimais = moeda.format(
          Number(mov.lote.quantidadeAnimais) || 0,
          0
        );
        mov.quantidadeMassaSeca = moeda.format(
          Number(mov.quantidadeMassaSeca) || 0,
          3
        );
        mov.quantidadeMassaOriginal = moeda.format(
          Number(mov.quantidadeMassaOriginal) || 0,
          3
        );
        mov.quantidadeMassaOriginalCorrigida = moeda.format(
          Number(mov.quantidadeMassaOriginalCorrigida) || 0,
          3
        );

        mov.quantidadeRealMassaOriginalTrato = moeda.format(
          Number(mov.quantidadeRealMassaOriginalTrato) || 0,
          3
        );
        mov.quantidadeRealMassaSecaTrato = moeda.format(
          Number(mov.quantidadeRealMassaSecaTrato) || 0,
          3
        );

        mov.status = {
          chip: true,
          color: opcao.statusCor(5, mov.statusTratoMovimento.item),
          text: mov.statusTratoMovimento.descricao || " - ",
        };
      });
    });
    state.registrosTratosAgrupados = param;
  },
  registrosLoteMovimento(state, param) {
    param.forEach((element) => {
      element.movimento = day(element.movimento).format("DD/MM/YYYY");
      // element.dietaDescricao = element.dieta.descricao;
      // element.loteDescricao = element.lote.descricao;

      element.qtdMsAnimalBaseTRATO = moeda.format(
        Number(element.qtdMsAnimalBaseTRATO) || 0,
        3
      );
      element.percentualAumentoTRATO = moeda.format(
        Number(element.percentualAumentoTRATO) || 0,
        3
      );
      element.qtdMsAnimalRealizadaTRATO = moeda.format(
        Number(element.qtdMsAnimalRealizadaTRATO) || 0,
        3
      );
      element.qtdMsAumentoAnimalTRATO = moeda.format(
        Number(element.qtdMsAumentoAnimalTRATO) || 0,
        3
      );
      element.qtdMsAumentoLoteTRATO = moeda.format(
        Number(element.qtdMsAumentoLoteTRATO) || 0,
        3
      );
      element.qtdMsLoteRealizadaTRATO = moeda.format(
        Number(element.qtdMsLoteRealizadaTRATO) || 0,
        3
      );
      element.qtdMsLoteBaseTRATO = moeda.format(
        Number(element.qtdMsLoteBaseTRATO) || 0,
        3
      );
      element.percentualMsTRATO = moeda.format(
        Number(element.percentualMsTRATO) || 0,
        3
      );
      element.qtdMoAnimalTRATO = moeda.format(
        Number(element.qtdMoAnimalTRATO) || 0,
        3
      );
      element.qtdMoLoteTRATO = moeda.format(
        Number(element.qtdMoLoteTRATO) || 0,
        3
      );
      element.qtdAnimais = moeda.format(Number(element.qtdAnimais) || 0, 0);
      element.ganhoMedioDia = moeda.format(
        Number(element.ganhoMedioDia) || 0,
        3
      );
      element.ingestaoMassaSeca = moeda.format(
        Number(element.ingestaoMassaSeca) || 0,
        3
      );
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
    });
    state.registrosLoteMovimento = param;
  },
  registrosPreparoAgrupado(state, param) {
    param.forEach((element) => {
      // element.movimento = day(element.movimento).format("DD/MM/YYYY");
      element.quantidadeMassaOriginal = moeda.format(
        Number(element.quantidadeMassaOriginal) || 0,
        3
      );
      element.quantidadeMassaSeca = moeda.format(
        Number(element.quantidadeMassaSeca) || 0,
        3
      );
      element.quantidadeMassaOriginalCorrigida = moeda.format(
        Number(element.quantidadeMassaOriginalCorrigida) || 0,
        3
      );
      element.quantidadeMassaSecaAtendido = moeda.format(
        Number(element.quantidadeMassaSecaAtendido) || 0,
        3
      );
      element.quantidadeMassaOriginalAtendido = moeda.format(
        Number(element.quantidadeMassaOriginalAtendido) || 0,
        3
      );
      element.status = {
        chip: true,
        color: opcao.statusCor(6, element.statusPreparo.item),
        text: element.statusPreparo.descricao || " - ",
      };

      element.preparoAtendimento.forEach((preAt) => {
        preAt.quantidadeMassaOriginal = moeda.format(
          Number(preAt.quantidadeMassaOriginal) || 0,
          3
        );
        preAt.quantidadeMassaOriginalAtendido = moeda.format(
          Number(preAt.quantidadeMassaOriginalAtendido) || 0,
          3
        );
        preAt.quantidadeMassaSeca = moeda.format(
          Number(preAt.quantidadeMassaSeca) || 0,
          3
        );
        preAt.quantidadeMassaSecaAtendido = moeda.format(
          Number(preAt.quantidadeMassaSecaAtendido) || 0,
          3
        );
        preAt.equipamento = preAt.equipamento.descricao;
        preAt.capacidadeMaxima = moeda.format(
          Number(preAt.equipamento.capacidadeMaxima) || 0,
          0
        );
        preAt.status = {
          chip: true,
          color: opcao.statusCor(7, preAt.statusPreparoAtendimento.item),
          text: preAt.statusPreparoAtendimento.descricao || " - ",
        };
      });
    });
    state.registrosPreparoAgrupado = param.sort((a, b) => a.id - b.id);
  },
  reset: () => {},
};
