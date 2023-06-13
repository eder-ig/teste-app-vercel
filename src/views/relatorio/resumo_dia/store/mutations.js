import moeda from "@tiig/moeda";
import day from "@/plugins/dayjs";
// import opcao from "@/plugins/opcoes";

export default {
  registros(state, param) {
    param.forEach((element) => {
      element.data = day(element.data).format("DD/MM/YYYY");
      element.qtdPrevistaCorrigida = moeda.format(
        Number(element.qtdPrevistaCorrigida) || 0,
        3
      );
      element.qtdPrevista = moeda.format(Number(element.qtdPrevista) || 0, 3);
      element.qtdRealizada = moeda.format(Number(element.qtdRealizada) || 0, 3);
      element.diferenca = moeda.format(Number(element.diferenca) || 0, 3);
    });

    state.registros = param;
  },
  reset: () => {},
};
