import axios from "@/plugins/axios";

export const tipoDietaDropdownListar = async ({ commit }) => {
  try {
    const res = await axios.get("/confinamento/tipo-dieta/dropdown");

    if (!res.data.erro) {
      commit("tipoDietaDropdown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const alimentoDropdownListar = async ({ commit }) => {
  try {
    const res = await axios.get("/confinamento/alimento/dropdown");

    if (!res.data.erro) {
      commit("alimentoDropdown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/dieta/listar", {
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
export const exibir = async ({ commit }, dietaId) => {
  try {
    const res = await axios.get("/confinamento/dieta/exibir/" + dietaId);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/dieta/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/dieta/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, dietaId) => {
  try {
    const res = await axios.delete("/confinamento/dieta/excluir/" + dietaId);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const relacionamentoListar = async ({ commit }, alimentoId) => {
  try {
    const res = await axios.get(
      "/confinamento/dieta-alimento/listar/" + alimentoId
    );

    if (!res.data.erro) {
      commit("registrosRelacionamento", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoExibir = async ({ commit }, dietaAlimentoId) => {
  try {
    const res = await axios.get(
      "/confinamento/dieta-alimento/exibir/" + dietaAlimentoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoSalvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post(
      "/confinamento/dieta-alimento/salvar",
      payload
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoEditar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/dieta-alimento/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoExcluir = async ({ commit }, dietaAlimentoId) => {
  try {
    const res = await axios.delete(
      "/confinamento/dieta-alimento/excluir/" + dietaAlimentoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
