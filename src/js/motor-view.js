"use strict";

module.exports = {
    template: "#motor-view-template",
    props: [ "index", "config", "template", "state" ],

    computed: {
        metric: function() {
            return this.$root.display_units === "METRIC";
        },

        is_slave: function() {
            for (let i = 0; i < this.index; i++) {
                if (this.motor.axis == this.config.motors[i].axis) {
                    return true;
                }
            }

            return false;
        },

        motor: function() {
            return this.config.motors[this.index];
        },

        invalidMaxVelocity: function() {
            return this.maxMaxVelocity < this.motor["max-velocity"];
        },

        maxMaxVelocity: function() {
            return 1 * (15 * this.umPerStep / this.motor["microsteps"]).toFixed(3);
        },

        ustepPerSec: function() {
            return this.rpm * this.stepsPerRev * this.motor["microsteps"] / 60;
        },

        rpm: function() {
            return 1000 * this.motor["max-velocity"] / this.motor["travel-per-rev"];
        },

        gForce: function() {
            return this.motor["max-accel"] * 0.0283254504;
        },

        gForcePerMin: function() {
            return this.motor["max-jerk"] * 0.0283254504;
        },

        stepsPerRev: function() {
            return 360 / this.motor["step-angle"];
        },

        umPerStep: function() {
            return this.motor["travel-per-rev"] * this.motor["step-angle"] / 0.36;
        },

        milPerStep: function() {
            return this.umPerStep / 25.4;
        },

        invalidStallVelocity: function() {
            if (!this.motor["homing-mode"].startsWith("stall-")) {
                return false;
            }

            return this.maxStallVelocity < this.motor["search-velocity"];
        },

        stallRPM: function() {
            const v = this.motor["search-velocity"];
            return 1000 * v / this.motor["travel-per-rev"];
        },

        maxStallVelocity: function() {
            const maxRate = 900000 / this.motor["stall-sample-time"];
            const ustep = this.motor["stall-microstep"];
            const angle = this.motor["step-angle"];
            const travel = this.motor["travel-per-rev"];
            const maxStall = maxRate * 60 / 360 / 1000 * angle / ustep * travel;

            return 1 * maxStall.toFixed(3);
        },

        stallUStepPerSec: function() {
            const ustep = this.motor["stall-microstep"];
            return this.stallRPM * this.stepsPerRev * ustep / 60;
        }
    },

    events: {
        "input-changed": function() {
            Vue.nextTick(function() {
                // Limit max-velocity
                if (this.invalidMaxVelocity) {
                    this.$set('motor["max-velocity"]', this.maxMaxVelocity);
                }

                //Limit stall-velocity
                if (this.invalidStallVelocity) {
                    this.$set('motor["search-velocity"]', this.maxStallVelocity);
                }

                this.$dispatch("config-changed");
            }.bind(this));

            return false;
        }
    },

    methods: {
        show: function(name, templ) {
            if (templ.hmodes == undefined) {
                return true;
            }

            return templ.hmodes.indexOf(this.motor["homing-mode"]) != -1;
        }
    }
};
