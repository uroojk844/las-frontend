import { defineStore } from "pinia";

type TAlert = "success" | "error";

interface IAlert {
  message: string;
  type: TAlert;
}

interface IAlertStore {
  currentAlert: IAlert | undefined;
  alerts: IAlert[];
}

let c: NodeJS.Timeout;
export const useAlertStore = defineStore("alertStore", {
  state: (): IAlertStore => ({
    currentAlert: undefined,
    alerts: [],
  }),
  getters: {
    getAlert: (state) => {
      return state.currentAlert;
    },
  },
  actions: {
    showAppAlert(message: string, type: TAlert = "success") {
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
