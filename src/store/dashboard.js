import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { axiosInstance } from "../utils/api";

export const useDashboardStore = defineStore("dashboard", () => {
    const initialized = ref(false);

    async function initialize() {
        if (initialized.value) return;

        try {
            await Promise.all([
                fetchStudentsData(),
                fetchDashboardData(),
            ]);
            initialized.value = true;
        } catch (error) {
            console.log(error);
            initialized.value = false;
        }
    }

    const loadingStudentsData = ref(false);
    const getLoadingStudentsData = computed(() => loadingStudentsData.value);

    const studentsData = ref([]);

    const getStudentsChartData = computed(() => {
        return {
            labels: studentsData.value.map(d => 'Class '+d.joiningClass),
            datasets: [
                {
                    barThickness: 48,
                    label: 'Total student',
                    data: studentsData.value.map(d => d.students),
                    borderWidth: 0.5,
                }
            ],
        }
    });

    async function fetchStudentsData() {
        if (studentsData.value.length) return;

        try {
            loadingStudentsData.value = true;
            let response = await axiosInstance.get("/dashboard/studentsData/");
            studentsData.value = response.data.success;
        } catch (error) {
            studentsData.value = [];
        } finally {
            loadingStudentsData.value = true;
        }
    }

    const dashboardData = ref({});
    const getDashboartData = computed(() => dashboardData.value);

    async function fetchDashboardData() {
        try {
            const response = await axiosInstance.get("dashboard/data/");
            dashboardData.value = response.data.success;
        } catch (error) {
            dashboardData.value = {};
        }
    }

    return {
        getLoadingStudentsData,
        getStudentsChartData,
        getDashboartData,
        initialize,
    }
});