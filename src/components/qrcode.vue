<template>
  <v-dialog :value="ligada" fullscreen persistent style="margin: 0">
    <v-container fluid grid-list-xs class="fill-height grey">
      <v-row dense class="justify-center aling-center d-flex align-self-center">
        <v-col cols="12" class="d-flex text-center justify-center align-center">
          <div v-if="ligada" id="reader" style="width: 500px"></div>
        </v-col>
        <v-col class="d-flex text-center justify-center align-center">
          <v-btn class="mt-2" color="primary" outlined @click="resetDecode">
            <v-icon left color="primary"> mdi-camera-off-outline </v-icon>
            Desligar Câmera
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>
<script>
// To use Html5QrcodeScanner (more info below)
// import { Html5QrcodeScanner } from "html5-qrcode";

// To use Html5Qrcode (more info below)
import { Html5Qrcode } from "html5-qrcode";
export default {
  name: "ComponenteQrcode",

  data: () => ({
    ligada: false,
    html5QrCode: null,
  }),

  methods: {
    startScam() {
      this.ligada = true;
      setTimeout(() => {
        const tml5QrCode = new Html5Qrcode(/* element id */ "reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        this.html5QrCode = tml5QrCode;
        tml5QrCode
          .start({ facingMode: "environment" }, config, this.onScanSuccess)
          .catch((err) => {
            // Start failed, handle it.
            this.ligada = false;
          });
      }, 500);
    },
    onScanSuccess(decodedText, decodedResult) {
      // handle the scanned code as you like, for example:
      this.$emit("qrdecode", decodedText);
      if (decodedText && Number(decodedText)) {
        this.resetDecode();
      }
    },
    onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
      // for example:
      console.warn(`Code scan error = ${error}`);
    },
    resetDecode() {
      this.ligada = false;
      this.html5QrCode
        .stop()
        .then((ignore) => {
          // QR Code scanning is stopped.
        })
        .catch((err) => {
          // Stop failed, handle it.
        });
      this.html5QrCode = null;
    },
  },
};
</script>
