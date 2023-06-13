import axios from "@/plugins/axios";

// Grupo de Páginas
export const listar = async ({ commit }, filtros) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/listar-grupo",
      {
        params: filtros,
      }
    );

    if (res && !res.data.erro) {
      commit("registros", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const exibir = async ({ commit }, id) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/exibir-grupo/" + id
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const salvar = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/controle-acesso/pagina/salvar-grupo",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const editar = async ({ commit }, dados) => {
  try {
    const res = await axios.put(
      `/confinamento/controle-acesso/pagina/editar-grupo/${dados.id}`,
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const excluir = async ({ commit }, id) => {
  try {
    const res = await axios.delete(
      "/confinamento/controle-acesso/pagina/excluir-grupo/" + id
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

// Paginas
export const listarPaginas = async ({ commit }, grupoId) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/listar-pagina/" + grupoId
    );

    if (!res.data.erro) {
      commit("registrosRelacionamento", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const exibirPagina = async ({ commit }, id) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/exibir-pagina/" + id
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const salvarPagina = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/controle-acesso/pagina/salvar-pagina",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const editarPagina = async ({ commit }, dados) => {
  try {
    const res = await axios.put(
      `/confinamento/controle-acesso/pagina/editar-pagina/${dados.id}`,
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const excluirPagina = async ({ commit }, id) => {
  try {
    const res = await axios.delete(
      "/confinamento/controle-acesso/pagina/excluir-pagina/" + id
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const alterarSequenciaPagina = async ({ commit }, params) => {
  try {
    const res = await axios.put(
      "/confinamento/controle-acesso/pagina/editar-sequencia",
      params
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const listarPaginasUsuario = async ({ commit }, usuarioId) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/listar-paginas-usuario/" + usuarioId
    );
    if (res && !res.erro) {
      commit("paginasDoUsuario", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

// Usuario
export const listarUsuario = async ({ commit }, paginaId) => {
  try {
    const res = await axios.get(
      `/confinamento/controle-acesso/pagina/listar-usuario-pagina/` + paginaId
    );

    if (res && !res.erro) {
      commit("usuarioPagina", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const excluirUsuario = async ({ commit }, dados) => {
  try {
    const res = await axios.delete(
      `/confinamento/controle-acesso/pagina/excluir-usuario-pagina/${dados.id}`,
      {
        data: dados,
      }
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const salvarUsuario = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/controle-acesso/pagina/inserir-usuario-pagina",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const usuarioDropDownListar = async ({ commit }, paginaId) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/dropdown-usuario-disponiveis/" +
        paginaId
    );

    if (res && !res.erro) {
      commit("usuarioDropDown", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const usuarioManutencaoListar = async ({ commit }) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/listar-usuarios"
    );

    if (res && !res.erro) {
      commit("usuarioManutencao", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const inserirUsuarioMassa = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/controle-acesso/pagina/inserir-usuarios-pagina-massa",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const excluirUsuarioPaginaMassa = async ({ commit }, dados) => {
  try {
    const res = await axios.delete(
      `/confinamento/controle-acesso/pagina/excluir-usuario-pagina-massa/${dados.id}`,
      {
        data: dados,
      }
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const excluirPaginasUsuario = async ({ commit }, dados) => {
  try {
    const res = await axios.delete(
      `/confinamento/controle-acesso/pagina/excluir-paginas-usuario/${dados.id}`,
      {
        data: dados,
      }
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

// Requsição
export const listarRequisicao = async ({ commit }, paginaId) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/listar-requisicao-pagina/" +
        paginaId
    );

    if (res && !res.erro) {
      commit("requisicoesPagina", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const exibirRequisicao = async ({ commit }, id) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/exibir-requisicao-pagina/" + id
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const excluirRequisicao = async ({ commit }, id) => {
  try {
    const res = await axios.delete(
      "/confinamento/controle-acesso/pagina/excluir-requisicao-pagina/" + id
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const salvarRequisicao = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/controle-acesso/pagina/inserir-requisicao-pagina",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const editarRequisicao = async ({ commit }, dados) => {
  try {
    const res = await axios.put(
      `/confinamento/controle-acesso/pagina/editar-requisicao-pagina/${dados.id}`,
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

// Acesso
export const listarAcessos = async ({ commit }, paginaId) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/listar-acesso-pagina/" + paginaId
    );

    if (res && !res.erro) {
      commit("acessos", res.data);
    }

    return res.data;
  } catch (error) {
    return null;
  }
};

export const exibirAcesso = async ({ commit }, id) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/exibir-acesso-pagina/" + id
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const excluirAcesso = async ({ commit }, id) => {
  try {
    const res = await axios.delete(
      "/confinamento/controle-acesso/pagina/excluir-acesso-pagina/" + id
    );

    return res.data;
  } catch (error) {
    throw new Error(error);
    //, return null
  }
};

export const salvarAcesso = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/controle-acesso/pagina/inserir-acesso-pagina",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const editarAcesso = async ({ commit }, dados) => {
  try {
    const res = await axios.put(
      `/confinamento/controle-acesso/pagina/editar-acesso-pagina/${dados.id}`,
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const buscarAcessoUsuario = async ({ commit }, usuarioId) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/listar-acessos-usuario/" + usuarioId
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const inserirAcessoUsuario = async ({ commit }, dados) => {
  try {
    const res = await axios.post(
      "/confinamento/controle-acesso/pagina/inserir-acesso-usuario/",
      dados
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const excluirAcessoUsuario = async (
  { commit },
  { usuarioId, acessoId }
) => {
  try {
    const res = await axios.delete(
      `/confinamento/controle-acesso/pagina/excluir-acesso-usuario`,
      {
        params: { usuarioId, acessoId },
      }
    );

    return res.data;
  } catch (error) {
    return null;
  }
};

export const listarAcessosUsuario = async ({ commit }, id) => {
  try {
    const res = await axios.get(
      "/confinamento/controle-acesso/pagina/listar-pagina-acessos-usuario/" + id
    );
    if (res.data && !res.data.erro) commit("acessos", res.data);
  } catch (error) {
    return error;
  }
};
