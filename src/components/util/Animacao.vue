<template>
  <v-fade-transition mode="out-in">
    <div v-show="show" :key="1" class="dialogo">
      <v-container
        v-show="sucesso"
        class="fill-height justify-center"
        style="background-color: #fff9"
        fluid
      >
        <div ref="sucessPainel" style="height: 500px; width: 500px" />
      </v-container>
      <v-container
        v-show="!sucesso"
        class="fill-height justify-center"
        style="background-color: #fff9"
        fluid
      >
        <div ref="failPainel" style="height: 60%; width: 60%" />
      </v-container>
    </div>
  </v-fade-transition>
</template>

<script>
import lottie from "lottie-web";

export default {
  name: "ComponenteAnimacao",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    sucesso: {
      type: Boolean,
      required: true,
    },
    velocidade: {
      default: 800,
      type: Number,
    },
    timeout: {
      type: Number,
      default: 1000,
    },
  },

  data: () => ({
    show: false,
  }),
  watch: {
    dialog(val) {
      if (val) {
        this.show = true;
        this.sucesso ? this.sucess.play() : this.fail.play();

        setTimeout(() => {
          this.sucesso ? this.sucess.stop() : this.fail.stop();
          this.$emit("update:dialog", false);
          this.show = false;
        }, this.timeout);
      }
    },
  },
  mounted() {
    this.sucess = lottie.loadAnimation({
      container: this.$refs.sucessPainel,
      autoplay: false,
      loop: false,
      animationData: require("./check.json"),
    });
    this.fail = lottie.loadAnimation({
      container: this.$refs.failPainel,
      autoplay: false,
      loop: false,
      animationData: require("./failed.json"),
    });
    this.$emit("onCreate", this.anim);
  },
};
</script>

<style lang="scss">
.dialogo {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
