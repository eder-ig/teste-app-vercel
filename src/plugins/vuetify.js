import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import pt from "vuetify/es5/locale/pt";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    dark: false,
    themes: {
      light: {
        primary: "#263238",
        secondary: "#37474F",
        accent: "#A1AA8C",
        error: "#eb2f06",
        info: "#2979FF",
        success: "#009C4D",
        warning: "#F2C037",
        balanca_primary: "#358283",
        balanca_secondary: "#fafafa",
      },
      dark: {
        primary: "#ffffff",
        appbar: "#212121",
        secondary: "#424242",
        accent: "#424242",
        error: "#eb2f06",
        info: "#2979FF",
        success: "#009C4D",
        warning: "#F2C037",
        balanca_primary: "#358283",
        balanca_secondary: "#fafafa",
      },
    },
  },
  lang: {
    locales: { pt },
    current: "pt",
  },
});
