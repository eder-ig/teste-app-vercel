import axios from "@/plugins/axios";

export const agendaTratoListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/agenda-trato/listar/1", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("agendaTratos", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const agendaTratoGeradaListar = async ({ commit }, receitaId) => {
  try {
    const res = await axios.get(
      "/confinamento/agenda-trato/listar-agenda-trato-gerado/" + receitaId
    );

    if (!res.data.erro) {
      commit("registrosAgendaTratoGerada", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const diferencaTratoListar = async ({ commit }, receitaId) => {
  try {
    const res = await axios.get(
      "/confinamento/receita/listar-diferenca-reprocessamento/" + receitaId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const tratoAgendaGerar = async ({ commit }, dados) => {
  try {
    const res = await axios.post("/confinamento/receita/gerar-trato/", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const agendaTratoFinalizar = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/receita/finalizar-trato",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const agendaTratoReabrir = async ({ commit }, dados) => {
  try {
    const res = await axios.post("/confinamento/receita/reabrir-trato", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/receita/listar", {
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

export const exibir = async ({ commit }, receitaId) => {
  try {
    const res = await axios.get("/confinamento/receita/exibir/" + receitaId);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const receitaGerar = async ({ commit }, dados) => {
  try {
    const res = await axios.post("/confinamento/receita/gerar-receita", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const ingredientesListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/receita-ingrediente/listar", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("registrosReceitaIngrediente", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const tatosAgrupadosListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "/confinamento/trato-movimento/listar-agrupado",
      {
        params: filtros,
      }
    );

    if (!res.data.erro) {
      commit("registrosTratosAgrupados", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const tratosGeradosListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/trato-movimento/listar", {
      params: filtros,
    });

    // if (!res.data.erro) {
    //   commit("registrosTratosGerados", res.data);
    // }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const loteMovimentoListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/lote-movimento/listar", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("registrosLoteMovimento", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const preparoAgrupadoListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/preparo/listar-agrupado", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("registrosPreparoAgrupado", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const movimentoTratoExibir = async ({ commit }, movimentoTratoId) => {
  try {
    const res = await axios.get(
      "/confinamento/trato-movimento/exibir/" + movimentoTratoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const tratoManualRealizar = async ({ commit }, dados) => {
  try {
    const res = await axios.put(
      "/confinamento/trato-movimento/realizar-trato-manual",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const tratoExcluir = async ({ commit }, dados) => {
  try {
    const res = await axios.delete("/confinamento/receita/excluir-trato", {
      data: dados,
    });

    return res.data;
  } catch (error) {
    return null;
  }
};

export const preparoComplementarGerar = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/preparo/gerar-complementar",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const moCorrigidoTratoAlterar = async ({ commit }, dados) => {
  try {
    const res = await axios.put(
      "/confinamento/trato-movimento/alterar-mo-trato-corrigido",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const atendimentoPreparoGerar = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/preparo/gerar-atendimento-preparo",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const ingredientesAtendimentoPreparoListar = async (
  { commit },
  preparoAtendimentoId
) => {
  try {
    const res = await axios.get(
      "/confinamento/preparo/listar-ingrediantes-atendimento/" +
        preparoAtendimentoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const ingredientesAtendimentoPreparoAtender = async (
  { commit },
  dados
) => {
  try {
    const res = await axios.post(
      "/confinamento/preparo/realizar-atendimento-ingrediente-preparo",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
