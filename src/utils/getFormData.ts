export function getFormData(event: Event) {
  const formData = new FormData(event.target as HTMLFormElement);
  return formData;
}
