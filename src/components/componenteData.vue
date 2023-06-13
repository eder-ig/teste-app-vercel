<template>
  <div>
    <validation-observer ref="datePicker">
      <validation-provider v-slot="{ errors }" name="Data" rules="" vid="date">
        <v-menu
          v-model="picker"
          :close-on-content-click="false"
          :nudge-bottom="errors && errors.length ? '52' : '40'"
          min-width="0"
          bottom
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <validation-observer ref="datePicker">
              <validation-provider
                v-slot="{ errors }"
                name="Data"
                rules=""
                vid="date"
              >
                <v-text-field
                  ref="data"
                  v-model="valor"
                  v-mask="mascaraData"
                  :maxlength="mascaraData.length"
                  :autofocus="autofocus"
                  :append-icon="!valor ? 'mdi-calendar-month-outline' : ''"
                  :clearable="clearable"
                  :data-cy="dataCy"
                  :disabled="disabled"
                  :error-messages="[...errors, ...parentErrors]"
                  :filled="filled"
                  :label="label"
                  :outlined="outlined"
                  :placeholder="placeholder"
                  :readonly="readonly"
                  :rounded="rounded"
                  :solo="solo"
                  :single-line="singleLine"
                  :hide-details="hideDetails"
                  autocomplete="off"
                  dense
                  @change="picker = false"
                  @click:append="picker = true"
                  @click:clear="resetData()"
                  @keydown.enter="autocomplete()"
                  @keydown.tab="autocomplete(), (picker = false)"
                  @dblclick="autocomplete()"
                  @keydown="navegarDentroDoInput"
                  @click="(picker = true), navegarDentroDoInput"
                >
                  <template v-slot:append>
                    <slot name="append" />
                    <div v-if="controlarDia && type !== 'month'" class="d-flex">
                      <tt-btn
                        v-if="valor"
                        icone="mdi-chevron-left"
                        icon
                        small
                        tooltip-label="Dia Anterior"
                        @click="diminuirDia()"
                      />
                      <tt-btn
                        v-if="valor"
                        icone="mdi-chevron-right"
                        icon
                        small
                        tooltip-label="Próximo Dia"
                        @click="aumentarDia()"
                      />
                      <v-icon v-if="!valor" v-on="on">
                        mdi-calendar-month-outline
                      </v-icon>
                    </div>
                  </template>
                </v-text-field>
              </validation-provider>
            </validation-observer>
          </template>
          <v-dialog
            v-if="picker && $vuetify.breakpoint.mobile"
            v-model="picker"
            :fullscreen="!notFullScreen"
          >
            <v-card>
              <v-card-title>
                <v-icon left>mdi-calendar</v-icon>
                Calendário
                <v-spacer> </v-spacer>
                <v-icon @click="picker = false">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-date-picker
                  v-model="data"
                  :disabled="disabled"
                  :max="max ? parseMinMax(max) : max"
                  :min="min ? parseMinMax(min) : min"
                  :class="type === 'datetime' ? 'pb-6' : ''"
                  :type="type === 'month' ? 'month' : 'date'"
                  :color="$vuetify.theme.dark ? 'appbar' : 'primary'"
                  full-width
                  locale="pt-br"
                  no-title
                  @input="
                    type === 'datetime'
                      ? handleInput($event)
                      : inputDataPicker($event)
                  "
                >
                  <v-btn
                    v-if="btnNow"
                    :class="type === 'datetime' ? 'mt-6' : ''"
                    :disabled="opcoesBotaoAgora.disabled"
                    block
                    color="primary"
                    outlined
                    @click="$emit('input', parseMinMax($day()))"
                  >
                    {{ opcoesBotaoAgora.text }}
                  </v-btn>
                </v-date-picker>
                <v-time-picker
                  v-if="type === 'datetime'"
                  v-model="horario"
                  :color="$vuetify.theme.dark ? 'appbar' : 'primary'"
                  :disabled="!data"
                  :min="horarioMinMax.min"
                  :max="horarioMinMax.max"
                  format="24hr"
                  @click:minute="inputDataPicker(auxHora)"
                />
              </v-card-text>
            </v-card>
          </v-dialog>

          <div
            v-if="picker && !$vuetify.breakpoint.mobile"
            :class="$vuetify.theme.dark ? 'appbar' : 'white'"
          >
            <v-date-picker
              v-model="data"
              :disabled="disabled"
              :max="max ? parseMinMax(max) : max"
              :min="min ? parseMinMax(min) : min"
              :class="type === 'datetime' ? 'pb-6' : ''"
              :type="type === 'month' ? 'month' : 'date'"
              :color="$vuetify.theme.dark ? 'appbar' : 'primary'"
              locale="pt-br"
              no-title
              @input="
                type === 'datetime'
                  ? handleInput($event)
                  : inputDataPicker($event)
              "
            >
              <v-btn
                v-if="btnNow"
                :class="type === 'datetime' ? 'mt-6' : ''"
                :disabled="opcoesBotaoAgora.disabled"
                block
                color="primary"
                outlined
                @click="$emit('input', parseMinMax($day()))"
              >
                {{ opcoesBotaoAgora.text }}
              </v-btn>
            </v-date-picker>
            <v-time-picker
              v-if="type === 'datetime'"
              v-model="horario"
              :color="$vuetify.theme.dark ? 'appbar' : 'primary'"
              :disabled="!data"
              :min="horarioMinMax.min"
              :max="horarioMinMax.max"
              format="24hr"
              @click:minute="inputDataPicker(auxHora)"
            />
          </div>
        </v-menu>
      </validation-provider>
    </validation-observer>
  </div>
</template>

<script>
import customParseFormat from "dayjs/plugin/customParseFormat";

export default {
  name: "DataPicker",

  props: {
    autofocus: {
      default: false,
      type: Boolean,
    },
    btnNow: {
      default: true,
      type: Boolean,
    },
    dataCy: {
      default: "dia",
      type: String,
    },
    clearable: {
      default: true,
      type: Boolean,
    },
    controlarDia: {
      default: false,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    filled: {
      default: false,
      type: Boolean,
    },
    hideDetails: {
      default: false,
      type: Boolean,
    },
    label: {
      type: String,
      default: "",
    },
    max: {
      default: "",
      type: String,
    },
    min: {
      default: "",
      type: String,
    },
    notFullScreen: {
      default: false,
      type: Boolean,
    },
    outlined: {
      default: false,
      type: Boolean,
    },
    placeholder: {
      default: "-/-/-",
      type: String,
    },
    readonly: {
      default: false,
      type: Boolean,
    },
    rounded: {
      default: false,
      type: Boolean,
    },
    solo: {
      default: false,
      type: Boolean,
    },
    singleLine: {
      default: false,
      type: Boolean,
    },
    type: {
      default: "date",
      type: String,
    },
    value: {
      required: true,
      validator: function (value) {
        return (
          typeof value === "undefined" ||
          typeof value === "string" ||
          typeof value === "object" ||
          value === null
        );
      },
    },
  },

  data() {
    return {
      auxHora: null,
      data: null,
      horario: null,
      picker: false,
      valor: null,
    };
  },

  computed: {
    horarioMinMax() {
      if (!this.data) return "";

      const data = this.$day(this.data, "YYYY-MM-DD");
      const max =
        this.max && data.isSame(this.$day(this.parseMinMax(this.max)), "day")
          ? this.$day(this.parseMinMax(this.max)).format("HH:mm")
          : "";
      const min =
        this.min && data.isSame(this.$day(this.parseMinMax(this.min)), "day")
          ? this.$day(this.parseMinMax(this.min)).format("HH:mm")
          : "";

      return { min, max };
    },
    mascaraData() {
      let formato;
      switch (this.type) {
        case "date":
          formato = "##/##/####";
          break;
        case "datetime":
          formato = "##/##/#### ##:##";
          break;
        case "month":
          formato = "##/####";
          break;
        case "dayOfMonth":
          formato = "##/##";
          break;
      }

      return formato;
    },
    parentErrors() {
      if (this.$attrs["error-messages"]) {
        return this.$attrs["error-messages"];
      } else return [];
    },
    opcoesBotaoAgora() {
      let [precisao, text] = ["", ""];

      if (this.type === "datetime") {
        text = `Agora ${this.$day().format("DD/MM/YYYY HH:mm")}`;
        precisao = "minute";
      } else if (this.type === "month") {
        text = `Este mês ${this.$day().format("MM/YYYY")}`;
        precisao = "month";
      } else {
        text = `Hoje ${this.$day().format("DD/MM/YYYY")}`;
        precisao = "day";
      }

      const disabled =
        (!!this.min &&
          this.$day().isBefore(
            this.$day(this.parseMinMax(this.min)),
            precisao
          )) ||
        (!!this.max &&
          this.$day().isAfter(this.$day(this.parseMinMax(this.max)), precisao));

      return { text, disabled };
    },
  },

  watch: {
    valor(v) {
      if (v && this.type === "date" && v.length >= 10) {
        this.validarTextField();
      }
      if (v && this.type === "dayOfMonth" && v.length >= 5) {
        this.validarTextField();
      }
      if (v && this.type === "datetime" && v.length >= 16) {
        this.validarTextField();
      }
      if (v && this.type === "month" && v.length >= 7) {
        this.validarTextField();
      }
    },
    value(val) {
      if (val && this.type === "date") {
        this.valor = this.$day(val, "YYYY-MM-DD").format("DD/MM/YYYY");
      }
      if (val && this.type === "dayOfMonth") {
        this.valor = this.$day(val, "MM-DD").format("DD/MM");
      }
      if (val && this.type === "datetime") {
        this.valor = this.$day(val, "YYYY-MM-DD HH:mm").format(
          "DD/MM/YYYY HH:mm"
        );
      }
      if (val && this.type === "month") {
        this.valor = this.$day(val, "YYYY-MM").format("MM/YYYY");
      }
      if (!val) this.valor = null;
    },
  },

  created() {
    if (this.value && this.type === "date") {
      this.valor = this.$day(this.value, "YYYY-MM-DD").format("DD/MM/YYYY");
    }
    if (this.value && this.type === "datetime") {
      this.valor = this.$day(this.value, "YYYY-MM-DD HH:mm").format(
        "DD/MM/YYYY HH:mm"
      );
    }
    if (this.value && this.type === "dayOfMonth") {
      this.valor = this.$day(this.value, "DD-MM").format("DD/MM");
    }
    if (this.value && this.type === "month") {
      this.valor = this.$day(this.value, "YYYY-MM").format("MM/YYYY");
    }
  },

  methods: {
    // TODO: Aumenta 1 dia
    aumentarDia() {
      this.$day.extend(customParseFormat);
      if (this.type === "date") {
        let data = this.$day(this.valor, "DD/MM/YYYY").add(1, "day");
        this.$emit("input", data.format("YYYY-MM-DD"));
        this.$emit("listar");
        const max = this.$day(this.max, "DD/MM/YYYY");
        if (this.max && data.isAfter(max)) {
          this.emitirErro("A data inserida vai além da data máxima");
          data = null;
          this.$emit("input", "");
          this.$emit("listar");
          this.resetData();
          return;
        }
      }
      if (this.type === "datetime") {
        let data = this.$day(this.valor, "DD/MM/YYYY HH:mm").add(1, "day");
        this.valor = this.$day(data).format("DD/MM/YYYY HH:mm");
        this.$emit("input", data.format("YYYY-MM-DD HH:mm"));
        this.$emit("listar");
        const max = this.$day(this.max, "DD/MM/YYYY HH:mm");
        if (this.max && data.isAfter(max)) {
          this.emitirErro("A data inserida vai além da data máxima");
          data = null;
          this.$emit("input", "");
          this.$emit("listar");
          this.resetData();
          return;
        }
      }
      if (this.type === "dayOfMonth") {
        let data = this.$day(this.valor, "DD/MM").add(1, "day");
        this.valor = this.$day(data).format("DD/MM");
        this.$emit("input", data.format("MM-DD"));
        this.$emit("listar");
        const max = this.$day(this.max, "DD/MM");
        if (this.max && data.isAfter(max)) {
          this.emitirErro("A data inserida vai além da data máxima");
          data = null;
          this.$emit("input", "");
          this.$emit("listar");
          this.resetData();
          return;
        }
      }
    },
    // TODO: Autocompleta com o dia de hoje
    // A função é chamada pelo tab, pelo double click ou pelo enter quando o text-field está vazio.
    autocomplete() {
      const dataDigitada = String(this.valor).split("/");
      const dia = dataDigitada[0]
        ? String(dataDigitada[0]).padStart(2, 0)
        : null;
      const mes = dataDigitada[1]
        ? String(dataDigitada[1]).padStart(2, 0)
        : null;
      const ano = dataDigitada[2] ? String(dataDigitada[2]).padEnd(4, 0) : null;

      if (this.type === "date") {
        if (!this.valor || !this.valor.length)
          this.valor = this.$day().format("DD/MM/YYYY");
        else if (dia && mes && ano)
          this.valor = this.$day(`${dia}-${mes}-${ano}`, "DD-MM-YYYY").format(
            "DD/MM/YYYY"
          );
        else if (dia && mes)
          this.valor = this.$day(`${dia}-${mes}`, "DD-MM").format("DD/MM/YYYY");
        else if (dia) this.valor = this.$day(dia, "DD").format("DD/MM/YYYY");
      }
      if (this.type === "month") {
        if (!this.valor || !this.valor.length)
          this.valor = this.$day().format("MM/YYYY");
        else if (dia && mes && ano)
          this.valor = this.$day(`${dia}-${mes}-${ano}`, "DD-MM-YYYY").format(
            "MM/YYYY"
          );
        else if (dia && mes)
          this.valor = this.$day(`${dia}-${mes}`, "DD-MM").format("MM/YYYY");
        else if (dia) this.valor = this.$day(dia, "DD").format("MM/YYYY");
      }
      if (this.type === "datetime") {
        if (!this.valor || !this.valor.length)
          this.valor = this.$day().format("DD/MM/YYYY HH:mm");
        else if (dia && mes && ano)
          this.valor = this.$day(`${dia}-${mes}-${ano}`, "DD-MM-YYYY").format(
            "DD/MM/YYYY HH:mm"
          );
        else if (dia && mes)
          this.valor = this.$day(`${dia}-${mes}`, "DD-MM").format(
            "DD/MM/YYYY HH:mm"
          );
        else if (dia)
          this.valor = this.$day(dia, "DD").format("DD/MM/YYYY HH:mm");
      }
      if (this.type === "dayOfMonth") {
        if (!this.valor || !this.valor.length)
          this.valor = this.$day().format("DD/MM");
        if (dia && mes && ano)
          this.valor = this.$day(`${dia}-${mes}-${ano}`, "DD-MM-YYYY").format(
            "DD/MM"
          );
        if (dia && mes)
          this.valor = this.$day(`${dia}-${mes}`, "DD-MM").format("DD/MM");
        if (dia) this.valor = this.$day(dia, "DD").format("DD/MM");
      }
    },
    // TODO: Diminui 1 dia
    diminuirDia() {
      this.$day.extend(customParseFormat);
      if (this.type === "date") {
        let data = this.$day(this.valor, "DD/MM/YYYY").subtract(1, "day");
        this.valor = this.$day(data).format("DD/MM/YYYY");
        this.$emit("input", data.format("YYYY-MM-DD"));
        this.$emit("listar");
        const min = this.$day(this.min, "DD/MM/YYYY");
        if (this.min && data.isBefore(min)) {
          this.emitirErro("A data inserida é mais antiga que a data mínima");
          data = null;
          this.$emit("input", "");
          this.$emit("listar");
          this.resetData();
          return;
        }
      }
      if (this.type === "datetime") {
        let data = this.$day(this.valor, "DD/MM/YYYY HH:mm").subtract(1, "day");
        this.valor = this.$day(data).format("DD/MM/YYYY HH:mm");
        this.$emit("input", data.format("YYYY-MM-DD HH:mm"));
        this.$emit("listar");
        const min = this.$day(this.min, "DD/MM/YYYY HH:mm");
        if (this.min && data.isBefore(min)) {
          this.emitirErro("A data inserida é mais antiga que a data mínima");
          data = null;
          this.$emit("input", "");
          this.$emit("listar");
          this.resetData();
          return;
        }
      }
      if (this.type === "dayOfMonth") {
        let data = this.$day(this.valor, "DD/MM").subtract(1, "day");
        this.valor = this.$day(data).format("DD/MM");
        this.$emit("input", data.format("MM-DD"));
        this.$emit("listar");
        const min = this.$day(this.min, "DD/MM");
        if (this.min && data.isBefore(min)) {
          this.emitirErro("A data inserida é mais antiga que a data mínima");
          data = null;
          this.$emit("input", "");
          this.$emit("listar");
          this.resetData();
          return;
        }
      }
    },
    emitirErro(erro) {
      this.$notificacao(erro, "erro");
      this.$refs.datePicker.setErrors({ date: [erro] });
    },
    handleInput(data) {
      this.auxHora = data;
      this.horario = null;
    },
    // TODO: Transmite o valor inserido através do datepicker
    inputDataPicker(date) {
      const data = this.$day(date, "YYYY-MM-DD");
      switch (this.type) {
        case "date":
          this.valor = data.format("DD/MM/YYYY");
          this.$emit("input", this.$day(data).format("YYYY-MM-DD"));
          this.$emit("listar");
          this.picker = false;
          break;
        case "datetime":
          /* eslint-disable */
          let d = this.$day(`${date} ${this.horario}`);
          this.valor = null;
          /* eslint-enable */
          this.valor = d.format("DD/MM/YYYY HH:mm");
          this.$emit("input", this.$day(d).format("YYYY-MM-DD HH:mm"));
          this.$emit("listar");
          this.picker = false;
          break;
        case "month":
          this.valor = this.$day(date).format("MM/YYYY");
          this.$emit("input", this.$day(date).format("YYYY-MM"));
          this.$emit("listar");
          this.picker = false;
          break;
        case "dayOfMonth":
          this.valor = this.$day(date, "YYYY-MM-DD").format("DD/MM");
          this.$emit("input", this.$day(date, "YYYY-MM-DD").format("MM-DD"));
          this.$emit("listar");
          this.picker = false;
          break;
      }
    },
    navegarDentroDoInput($event) {
      const keyCode = $event.keyCode;
      // if ([33, 34].indexOf($event.keyCode) > -1) return
      const elementor = this.$refs.data.$el.querySelector("input");
      let valor = elementor.value;
      const len = valor.length;
      let pos = elementor.selectionStart;

      let charAt = valor.charAt(pos);
      if ($event.type === "click") {
        while (!/\d/.test(charAt) && pos < len) {
          pos++;
          charAt = valor.charAt(pos);
        }
        this.$refs.data.$el.querySelector("input").setSelectionRange(pos, pos);
      }

      if ($event.type === "click" && $event.pointerType === "mouse") return;

      if ([35, 36].indexOf(keyCode) > -1) {
        // 36 - HOME, 25 - END
        pos = keyCode === 36 ? 0 : len;
        this.$refs.data.$el.querySelector("input").setSelectionRange(pos, pos);
      } else if ([37, 39].indexOf(keyCode) > -1) {
        if (keyCode === 37) {
          // Direção esquerda
          pos--;
          pos = pos === -1 ? 0 : pos;
        } else if (keyCode === 39) {
          // Direção direira
          pos = pos === len ? len : pos++;
        }
        this.$refs.data.$el.querySelector("input").setSelectionRange(pos, pos);
      } else {
        // if (len < this.mask.length) return
        if (keyCode < 48 || keyCode > 57 || len < this.mask.length) return;
        if (isNaN($event.key)) return;
        const self = this;
        const a =
          (pos > 0 ? valor.substring(0, pos) : "") +
          $event.key +
          valor.substring(pos + 1, len);
        pos++;
        this.valor = a;
        setTimeout(() => {
          if (pos < len) {
            valor = self.$refs.data.$el.querySelector("input").value;
            charAt = valor.charAt(pos);
            if (!/\d/.test(charAt)) {
              while (!/\d/.test(charAt) && pos < len) {
                pos++;
                charAt = valor.charAt(pos);
              }
              self.$refs.data.$el
                .querySelector("input")
                .setSelectionRange(pos, pos);
            } else {
              self.$refs.data.$el
                .querySelector("input")
                .setSelectionRange(pos, pos);
            }
          }
        }, 5);
      }
    },
    parseMinMax(value) {
      let formato;
      switch (this.type) {
        case "date":
          if (this.$day(value, "DD/MM/YYYY").isValid())
            formato = this.$day(value, "DD/MM/YYYY").format("YYYY-MM-DD");
          else if (this.$day(value, "YYYY-MM-DD").isValid())
            formato = this.$day(value).format("YYYY-MM-DD");
          break;
        case "datetime":
          if (this.$day(value, "DD/MM/YYYY HH:mm").isValid())
            formato = this.$day(value, "DD/MM/YYYY HH:mm").format(
              "YYYY-MM-DD HH:mm"
            );
          else if (this.$day(value, "YYYY-MM-DD HH:mm").isValid())
            formato = this.$day(value).format("YYYY-MM-DD HH:mm");
          break;
        case "month":
          if (this.$day(value, "MM/YYYY").isValid())
            formato = this.$day(value, "MM/YYYY").format("YYYY-MM");
          else if (this.$day(value, "YYYY-MM").isValid())
            formato = this.$day(value).format("YYYY-MM");
          break;
        case "dayOfMonth":
          if (this.$day(value, "DD/MM").isValid())
            formato = this.$day(value, "DD/MM").format("MM-DD");
          else if (this.$day(value, "MM-DD").isValid())
            formato = this.$day(value, "MM-DD").format("MM-DD");
          break;
      }
      return formato;
    },
    // TODO: Reseta datas e mensagems de erro
    resetData() {
      this.$emit("input", null);
      this.$emit("listar");
      this.valor = null;
      this.data = null;
      setTimeout(() => {
        this.$refs.datePicker.reset();
      }, 3000);
      this.inputInválido = null;
      this.horario = null;
    },
    // TODO: Valida a entrada direta do usário evitando possíveis erros
    validarTextField() {
      this.$day.extend(customParseFormat);
      const regexValidarData =
        /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
      if (!this.valor || this.valor.length === 0) {
        this.emitirErro("Insira uma data");
        this.resetData();
        return;
      }
      if (this.type === "date") {
        if (!this.valor.match(regexValidarData) || !this.valor) {
          this.emitirErro("Data inválida");
          this.resetData();
          return;
        }
        const dataInput = this.$day(this.valor, "DD/MM/YYYY");
        if (this.min) {
          const min = this.$day(this.parseMinMax(this.min));
          if (dataInput.isBefore(min)) {
            this.emitirErro("A data inserida é mais antiga que a data mínima");
            this.resetData();
            return;
          }
        }
        if (this.max) {
          const max = this.$day(this.parseMinMax(this.max));
          if (dataInput.isAfter(max)) {
            this.emitirErro("A data inserida vai além da data máxima");
            this.resetData();
            return;
          }
        }
        this.$emit(
          "input",
          this.$day(this.valor, "DD/MM/YYYY").format("YYYY-MM-DD")
        );
        this.$emit("listar");
        this.picker = false;
      }
      if (this.type === "dayOfMonth") {
        const dia = parseInt(this.valor.slice(0, 2));
        const mes = parseInt(this.valor.slice(3, 5));
        if (dia > 31) {
          this.emitirErro("Data inválida");
          this.resetData();
          return;
        }
        if (mes > 12) {
          this.emitirErro("Data inválida");
          this.resetData();
          return;
        }
        if (dia > 29 && mes === 2) {
          this.emitirErro("Data inválida");
          this.resetData();
          return;
        }
        if (dia > 30 && (mes === 4 || mes === 6 || mes === 7 || mes === 11)) {
          this.emitirErro("Data inválida");
          this.resetData();
          return;
        }

        const dataInput = this.$day(this.valor, "DD/MM");
        if (this.max) {
          const dataMax = this.$day(this.parseMinMax(this.max));
          if (dataInput.isAfter(dataMax)) {
            this.emitirErro("A data inserida vai além da data máxima");
            this.resetData();
            return;
          }
        }
        if (this.min) {
          const dataMin = this.$day(this.parseMinMax(this.min));
          if (dataInput.isBefore(dataMin)) {
            this.emitirErro("A data inserida é mais antiga que a data mínima");
            this.resetData();
            return;
          }
        }
        this.$emit("input", this.$day(this.valor, "DD/MM").format("MM-DD"));
        this.$emit("listar");
        this.picker = false;
      }
      if (this.type === "datetime") {
        const dataInput = this.$day(this.valor, "DD/MM/YYYY HH:mm");
        const regexValidarHoras = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const data = this.valor.slice(0, 10);
        const hora = this.valor.slice(11, 16);
        if (!data.match(regexValidarData)) {
          this.emitirErro("Data inválida");
          this.resetData();
          return;
        }
        if (!hora.match(regexValidarHoras)) {
          this.emitirErro("Hora inválida");
          this.resetData();
          return;
        }
        if (this.min) {
          const min = this.$day(this.parseMinMax(this.min));
          if (dataInput.isBefore(min)) {
            this.emitirErro("A data inserida é mais antiga que a data mínima");
            this.resetData();
            return;
          }
        }
        if (this.max) {
          const max = this.$day(this.parseMinMax(this.max));
          if (dataInput.isAfter(max)) {
            this.emitirErro("A data inserida vai além da data máxima");
            this.resetData();
            return;
          }
        }
        this.$emit(
          "input",
          this.$day(this.valor, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm")
        );
        this.$emit("listar");
        this.picker = false;
      }
      if (this.type === "month") {
        const dataInput = this.$day(this.valor, "MM/YYYY");
        const mes = parseInt(this.valor.slice(0, 2));
        const ano = this.valor.slice(3, 8);
        if (mes > 12 || mes < 1) {
          this.emitirErro("Data inválida");
          this.resetData();
          return;
        }
        // para caso a máscara falhe
        if (ano.length > 4 || ano.length < 4) {
          this.emitirErro("Data inválida");
          this.resetData();
          return;
        }
        if (this.min) {
          const min = this.$day(this.parseMinMax(this.min));
          if (dataInput.isBefore(min)) {
            this.emitirErro("A data inserida é mais antiga que a data mínima");
            this.resetData();
            return;
          }
        }
        if (this.max) {
          const max = this.$day(this.parseMinMax(this.max));
          if (dataInput.isAfter(max)) {
            this.emitirErro("A data inserida vai além da data máxima");
            this.resetData();
            return;
          }
        }
        this.$emit("input", this.$day(this.valor, "MM/YYYY").format("YYYY-MM"));
        this.$emit("listar");
        this.picker = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .v-date-picker-table td {
  padding-left: 1px !important;
  padding-right: 1px !important;
  border: 0px !important;
}
</style>
