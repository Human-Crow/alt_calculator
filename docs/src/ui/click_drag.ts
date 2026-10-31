import { click_number } from "./numbers.js";

let isDragging = false;
let startX = 0;
let startY = 0;



export function init_drag() {
    document.addEventListener("pointerdown", (event) => {
        startX = event.clientX;
        startY = event.clientY;
        isDragging = false;
    });

    document.addEventListener("pointermove", (event) => {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        // 5 pixels of movement counts as a drag
        if (Math.hypot(dx, dy) > 5) {
            isDragging = true;
        }
    });

    document.addEventListener("click", (event) => {
        if (isDragging) {
            // A drag (scrolling, selecting text to copy): not a click on anything
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        // Double / triple click on a number: selecting it to copy it.
        // The first click already switched it, so switch it back to what
        // was shown, then select it (the browser's own selection may have
        // missed it when the number got shorter). The click never opens /
        // closes the item around it
        const target = event.target as Element | null;
        const num = target?.closest<HTMLElement>(".number");
        if (num && event.detail > 1) {
            if (event.detail === 2) {
                click_number(event);
            } else {
                event.preventDefault();
                event.stopPropagation();
            }
            select_text(num);
            return;
        }
        click_number(event);
    });
}


/** Select all text of `el` (as if dragged over), ready to copy. */
function select_text(el: HTMLElement) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
}



/** True when the current click ended a drag (5px+ of movement). */
export function was_drag(): boolean {
    return isDragging;
}