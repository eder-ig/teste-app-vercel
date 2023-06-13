import axios from "@/plugins/axios";

export const deletar = async ({ commit }, id) => {
  try {
    const res = await axios.delete("sistema/opcao/apagar/" + id);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const editarRegistro = async ({ commit }, dados) => {
  try {
    const res = await axios.put("sistema/opcao/editar", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const exibir = async ({ commit }, id) => {
  try {
    const res = await axios.get("sistema/opcao/exibir/" + id);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const listarRegistros = async ({ commit }, filtro) => {
  try {
    const res = await axios.get("sistema/opcao/listar", {
      params: filtro,
    });

    if (!res.data.erro) {
      commit("registros", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const proximoItem = async ({ cpmmit }) => {
  try {
    const res = await axios.get("sistema/opcao/proximo-item");

    return res.data;
  } catch (error) {
    return null;
  }
};

export const salvarRegistro = async ({ commit }, dados) => {
  try {
    const res = await axios.post("sistema/opcao/salvar", dados);

    return res.data;
  } catch (error) {
    return null;
  }
};
