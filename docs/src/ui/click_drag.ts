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
            event.preventDefault();
            event.stopPropagation();
        }
        click_number(event);
    });
}

