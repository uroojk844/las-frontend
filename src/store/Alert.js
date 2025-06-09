import { defineStore } from "pinia";

let c;
export const useAlertStore = defineStore('alertStore', {
    state: () => ({
        currentAlert: undefined,
        alerts: [],
    }),
    getters: {
        getAlert: (state) => {
            return state.currentAlert;
        },
    },
    actions: {
        showAppAlert(message, type = 'success') {
            this.alerts.push({
                message,
                type,
            });
            if (this.alerts.length == 1) this.autoDeleteAlert();
        },
        autoDeleteAlert() {
            if (!this.alerts.length) return;

            this.currentAlert = this.alerts[0];

            c = setTimeout(this.deleteAlert, 4000);
        },
        deleteAlert() {
            this.cancelAutoDelete();
            this.alerts.shift();
            this.currentAlert = undefined;
            setTimeout(() => {
                this.autoDeleteAlert();
            }, 250);
        },
        cancelAutoDelete() {
            clearTimeout(c);
        },
    },
});
