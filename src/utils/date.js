const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
});

const d = new Date();
export const today = formatter.format(d);