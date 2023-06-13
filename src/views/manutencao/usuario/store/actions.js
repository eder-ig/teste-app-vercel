import axios from "@/plugins/axios";

const baseUrl = "/sistema/controle-acesso/usuario/";

export const editarUsuario = async ({ commit }, usuario) => {
  try {
    const res = await axios.put(baseUrl + "editar", usuario);

    return res.data;
  } catch (error) {
    return error;
  }
};

export const exibirUsuario = async ({ commit }, id) => {
  try {
    const res = await axios.get(baseUrl + `exibir/${id}`);

    return res.data;
  } catch (error) {
    return error;
  }
};

export const listarUsuarios = async ({ commit }, params) => {
  try {
    const res = await axios.get(baseUrl + "listar", { params });
    if (!res.data.erro) commit("usuarios", res.data);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const senhaReset = async ({ commit }, id) => {
  try {
    const res = await axios.post(baseUrl + `redefinir-senha/${id}`);

    return res.data;
  } catch (error) {
    return error;
  }
};

export const removerUsuario = async ({ commit }, id) => {
  try {
    const res = await axios.delete(baseUrl + `apagar/${id}`);

    return res.data;
  } catch (error) {
    return error;
  }
};

export const salvarUsuario = async ({ commit }, usuario) => {
  try {
    const res = await axios.post(baseUrl + "salvar", usuario);

    return res.data;
  } catch (error) {
    return error;
  }
};
