import Vue from "vue";
function validar(obj, error) {
  if (typeof error !== "object") {
    return "";
  } else {
    let erroMsg = "";

    for (const key of Object.keys(error)) {
      // !obj.hasOwnProperty(key)
      if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        for (const msg of error[key]) {
          erroMsg += `${msg} <br/>`;
        }
      }
    }
    if (erroMsg) {
      this.$notificacao(erroMsg, "erro");
    }
  }
}

Vue.prototype.$setError = validar;
export default validar;
