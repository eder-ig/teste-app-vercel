import axios from "@/plugins/axios";

export const dropdownLotesAtivosListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "/confinamento/ocorrencia/dropdown-lotes-ativos",
      {
        params: filtros,
      }
    );

    if (!res.data.erro) {
      commit("dropdownLotesAtivos", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const dropdownLotesListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/ocorrencia/dropdown-lotes", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("dropdownLotes", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const dropdownPiquetesListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/ocorrencia/dropdown-piquetes", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("dropdownPiquetes", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};
export const dropdownTipoOcorrenciaListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "/confinamento/ocorrencia/dropdown-tipo-ocorrencia",
      {
        params: filtros,
      }
    );

    if (!res.data.erro) {
      commit("dropdownTipoOcorrencia", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/ocorrencia/listar", {
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
export const exibir = async ({ commit }, ocorrenciaId) => {
  try {
    const res = await axios.get(
      "/confinamento/ocorrencia/exibir/" + ocorrenciaId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const salvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/ocorrencia/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const editar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/ocorrencia/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const excluir = async ({ commit }, ocorrenciaId) => {
  try {
    const res = await axios.delete(
      "/confinamento/ocorrencia/excluir/" + ocorrenciaId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
