import moeda from "@tiig/moeda";
import opcao from "@/plugins/opcoes";

export default {
  registros(state, param) {
    param.forEach((element) => {
      element.qtdAnimais = moeda.format(Number(element.qtdAnimais) || 0, 0);
      element.pesoMedioEntrada = moeda.format(
        Number(element.pesoMedioEntrada) || 0,
        3
      );
      element.mediaArrobaEntrada = moeda.format(
        Number(element.mediaArrobaEntrada) || 0,
        2
      );
      element.valorArrobaCompra = moeda.format(
        Number(element.valorArrobaCompra) || 0,
        2
      );
      element.pesoTotalEntrada = moeda.format(
        Number(element.pesoTotalEntrada) || 0,
        3
      );
      element.custoEstimadoArrobaCompra = moeda.format(
        Number(element.custoEstimadoArrobaCompra) || 0,
        2
      );
      element.pesoMedioAtual = moeda.format(
        Number(element.pesoMedioAtual) || 0,
        3
      );
      element.mediaArrobaAtual = moeda.format(
        Number(element.mediaArrobaAtual) || 0,
        2
      );
      element.valorArrobaVenda = moeda.format(
        Number(element.valorArrobaVenda) || 0,
        2
      );
      element.valorEstimadoVenda = moeda.format(
        Number(element.valorEstimadoVenda) || 0,
        2
      );
      element.saldoEstimadoAposAVenda = moeda.format(
        Number(element.saldoEstimadoAposAVenda) || 0,
        2
      );
      element.qtdMsPrevisto = moeda.format(
        Number(element.qtdMsPrevisto) || 0,
        3
      );
      element.qtdMoPrevisto = moeda.format(
        Number(element.qtdMoPrevisto) || 0,
        3
      );
      element.qtdMoPrevistoAjustado = moeda.format(
        Number(element.qtdMoPrevistoAjustado) || 0,
        3
      );
      element.qtdrealMs = moeda.format(Number(element.qtdrealMs) || 0, 3);
      element.qtdRealMo = moeda.format(Number(element.qtdRealMo) || 0, 3);
      element.custoEstimadoAquiloReceita = moeda.format(
        Number(element.custoEstimadoAquiloReceita) || 0,
        2
      );
      element.custoTotalTratoMo = moeda.format(
        Number(element.custoTotalTratoMo) || 0,
        2
      );
      element.saldoDescontadoTrato = moeda.format(
        Number(element.saldoDescontadoTrato) || 0,
        2
      );
      element.saldoEstimadoPorAnimal = moeda.format(
        Number(element.saldoEstimadoPorAnimal) || 0,
        2
      );

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
