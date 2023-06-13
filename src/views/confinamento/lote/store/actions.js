import axios from "@/plugins/axios";

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/lote/listar", {
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

export const exibir = async ({ commit }, loteId) => {
  try {
    const res = await axios.get("confinamento/lote/exibir/" + loteId);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const loteMovimentoListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "confinamento/lote-movimento/listar-resumido-por-dia",
      {
        params: filtros,
      }
    );

    if (!res.data.erro) {
      commit("movimentosLote", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const lotePiqueteListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/lote-piquete/listar", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("lotePiquete", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const dietaLoteListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/lote-dieta/listar", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("loteDieta", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const dropdownCategoria = async ({ commit }) => {
  try {
    const res = await axios.get("confinamento/lote/dropdown-categoria");

    if (!res.data.erro) {
      commit("categoria", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const dropdownRaca = async ({ commit }) => {
  try {
    const res = await axios.get("confinamento/lote/dropdown-raca");

    if (!res.data.erro) {
      commit("raca", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/lote/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/lote/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const dropdownDieta = async ({ commit }) => {
  try {
    const res = await axios.get("confinamento/lote/dropdown-dieta");

    if (!res.data.erro) {
      commit("dieta", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const dropdownPiquete = async ({ commit }) => {
  try {
    const res = await axios.get("confinamento/lote/dropdown-piquete");

    if (!res.data.erro) {
      commit("piquete", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const dietaSalvar = async ({ commit }, dados) => {
  try {
    const res = await axios.post("confinamento/lote-dieta/salvar", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const piqueteSalvar = async ({ commit }, dados) => {
  try {
    const res = await axios.post("confinamento/lote-piquete/salvar", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const planoTransicaoLoteListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/lote-dieta-transicao/listar", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("planoTransicaoLote", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const planoTransicaoDropdownListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/lote-dieta-transicao/dropdown", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("planoTransicaoDropdown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const planoTransicaoDietaLoteInserir = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "confinamento/lote-dieta-transicao/inserir",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
