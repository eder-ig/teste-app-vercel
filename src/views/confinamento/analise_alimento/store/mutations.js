import day from "@/plugins/dayjs";
import opcao from "@/plugins/opcoes";
import moeda from "@tiig/moeda";

export default {
  registros(state, param) {
    param.forEach((element) => {
      element.massaSeca = moeda.format(Number(element.massaSeca), 2);
      element.alimentoDescricao = element.alimento.descricao || " - ";
      element.dataAnalise = day(
        element.dataAnalise,
        "YYYY-MM-DD HH:mm:ss"
      ).format("DD/MM/YYYY HH:mm:ss");
      element.status = {
        chip: true,
        color: opcao.statusCor(14, element.status),
        text: element.statusAnaliseMassaSeca.descricao,
      };
    });
    state.registros = param;
  },
  dropdownAlimento(state, param) {
    state.dropdownAlimento = param;
  },
  reset: () => {},
};
