import axios from "@/plugins/axios";

export const propriedadeDropdownListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/propriedade/dropdown", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("propriedadeDropdown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("/confinamento/confinamento/listar", {
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
export const exibir = async ({ commit }, confinamentoId) => {
  try {
    const res = await axios.get(
      "/confinamento/confinamento/exibir/" + confinamentoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const relacionamentoListar = async ({ commit }, alimentoId) => {
  try {
    const res = await axios.get(
      "/confinamento/agenda-trato/listar/" + alimentoId
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
      "/confinamento/agenda-trato/exibir/" + dietaAlimentoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoSalvar = async ({ commit }, payload) => {
  try {
    const res = await axios.post("/confinamento/agenda-trato/salvar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoEditar = async ({ commit }, payload) => {
  try {
    const res = await axios.put("/confinamento/agenda-trato/editar", payload);

    return res.data;
  } catch (error) {
    return null;
  }
};
export const relacionamentoExcluir = async ({ commit }, dietaAlimentoId) => {
  try {
    const res = await axios.delete(
      "/confinamento/agenda-trato/excluir/" + dietaAlimentoId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const sequenciaEditar = async ({ commit }, dados) => {
  try {
    const res = await axios.put(
      "/confinamento/agenda-trato/editar-sequencia",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
