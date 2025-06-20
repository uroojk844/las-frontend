export function getFormData(event) {
    const formData = new FormData(event.target);
    return formData;
}