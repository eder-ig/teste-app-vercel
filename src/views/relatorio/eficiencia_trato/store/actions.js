import axios from "@/plugins/axios";

export const agendaTratoDropdownListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("confinamento/agenda-trato/listar/1", {
      params: filtros,
    });

    if (!res.data.erro) {
      commit("agendaTratoDropdown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const dropdownLotesAtivosListar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "relatorio/eficiencia-trato/dropdown-lotes-ativos",
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

export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get("relatorio/eficiencia-trato/listar", {
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
