import { watch } from 'vue';
/**

 * Close an element when clicked outside

 * @param element - element ref you want to close when clicked outside.
 * @param state - variable ref storing toggle state of element.
 * @param callback - Optional: Function to execute on every state changes. 

*/

export function handleClickedOutside(
    element,
    state,
    callback
) {
    function closeElement(event) {
        if (
            !(element.value === event.target || element.value.contains(event.target))
        ) {
            state.value = false;
        }
    }

    watch(state, () => {
        if (state.value) {
            document.addEventListener('click', closeElement);
        } else {
            document.removeEventListener('click', closeElement);
        }
        callback && callback();
    });
}
