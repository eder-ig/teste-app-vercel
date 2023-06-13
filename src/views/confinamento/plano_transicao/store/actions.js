import axios from "@/plugins/axios";

export const dietaDropdownListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/dieta/dropdown", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("dietaDropdown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const agendaTratoDropdownListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/agenda-trato/listar/1");

    if (!res.data.erro) {
      commit("agendaTratoDropdown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/plano-transicao/listar", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("registros", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const exibir = async ({ commit }, planoTransicaoId) => {
  try {
    const res = await axios.get(
      "confinamento/plano-transicao/exibir/" + planoTransicaoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, dados) => {
  try {
    const res = await axios.post("confinamento/plano-transicao/salvar", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, dados) => {
  try {
    const res = await axios.put("confinamento/plano-transicao/editar", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, planoTransicaoId) => {
  try {
    const res = await axios.delete(
      "confinamento/plano-transicao/excluir/" + planoTransicaoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const relacionamentoListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "confinamento/plano-transicao-configuracao/listar",
      {
        params: filtros,
      }
    );

    if (!res.data.erro) {
      commit("registrosRelacionamento", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoExibir = async (
  { commit },
  planoTransicaoConfiguracaoId
) => {
  try {
    const res = await axios.get(
      "confinamento/plano-transicao-configuracao/exibir/" +
        planoTransicaoConfiguracaoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoExcluir = async (
  { commit },
  planoTransicaoConfiguracaoId
) => {
  try {
    const res = await axios.delete(
      "confinamento/plano-transicao-configuracao/excluir/" +
        planoTransicaoConfiguracaoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoEditar = async ({ commit }, dados) => {
  try {
    const res = await axios.put(
      "confinamento/plano-transicao-configuracao/editar",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoSalvar = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "confinamento/plano-transicao-configuracao/salvar",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
