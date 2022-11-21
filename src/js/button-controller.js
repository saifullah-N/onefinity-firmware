"use strict";

const api = require("./api");
const utils = require("./utils");
const merge = require("lodash.merge");

module.exports = {
  template: "#button-controller-view",
  props: ["config", "state"],

  data: function () {
    return {
      confirmReset: false,
      autoCheckUpgrade: true,
      button_type: "",
    };
  },

  methods: {

    set_btn_type: async function () {
      // const config = {
      //   button: this.button_type,
      // };
       const data = { button:this.button_type}
       
         console.log(this.button_type)
      try {
        await api.put("set-button-type",data); //JSON.stringify(data)
        this.confirmReset = false;
        this.$dispatch("update");
        SvelteComponents.showDialog("Message", {
          title: "Success",
          message: "button type set",
        });
        location.replace('/done/')
      } catch (error) {
        console.error("button settings failed:", error);
        alert("OOPS! an error has occured");
      }
    },
  },
};
