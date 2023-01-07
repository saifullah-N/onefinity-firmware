"use strict";

const api = require("./api");
const utils = require("./utils");
const merge = require("lodash.merge");

const z_slider_defaults = {
  "Z-16 Original": {
    "travel-per-rev": 4,
    "max-accel": 3,
    "max-soft-limit": -133,
  },
  "Z-20 Heavy Duty": {
    "travel-per-rev": 10,
    "max-accel": 7,
    "max-soft-limit": -160,
  },
};

module.exports = {
  template: "#z-slider-view-template",
  props: ["config", "state"],

  data: function () {
    return {
      autoCheckUpgrade: true,
      z_slider: "",
      z_slider_variant: " ",
      // config: "",
    };
  },

  ready: function () {
    this.autoCheckUpgrade = this.config.admin["auto-check-upgrade"];
  },

  methods: {
    // next: async function () {
    //   const config = merge(
    //     {},
    //     config_defaults,
    //     variant_defaults[this.reset_variant]
    //   );

    //   try {
    //     await api.put("config/save", config);
    //     this.confirmReset = false;
    //     this.$dispatch("update");
    //     this.config = config;
    //     this.z_slider = true;
    //   } catch (error) {
    //     console.error("Restore failed:", error);
    //     alert("Restore failed");
    //   }
    // },

    set_z_slider: async function () {
      // const z_variant = merge(
      //   {},
      // this.config.motors[3],
      //   z_slider_defaults[this.z_slider_variant]
      // );

      // this.config.motors[3] = z_variant;
      try {
        console.log(this.config);
        //   await api.put("config/save", this.config);
        //   this.$dispatch("update");
        //   SvelteComponents.showDialog("Message", {
        //     title: "Success",
        //     message: "Configuration restored",
        //   });
        //   this.z_slider = false;
      } catch (error) {
        console.error("Z slider failed:", error);
        alert("failed to set Z slider  ");
      }
    },
  },
};
