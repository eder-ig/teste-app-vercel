import Vue from "vue";
function salvarFiltros(nomePagina, filtros) {
  const filtroStringfy = filtros ? JSON.stringify(filtros) : {};

  if (nomePagina) {
    localStorage.setItem(`${nomePagina}`, window.btoa(filtroStringfy));
  }
}

const obterFiltros = (nomePagina) => {
  try {
    return localStorage.getItem(`${nomePagina}`)
      ? JSON.parse(window.atob(localStorage.getItem(`${nomePagina}`)))
      : false;
  } catch (error) {
    localStorage.removeItem(`${nomePagina}`);
    return false;
  }
};

Vue.prototype.$salvarFiltros = salvarFiltros;
Vue.prototype.$obterFiltros = obterFiltros;

export default { salvarFiltros, obterFiltros };
