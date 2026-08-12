import { update_page } from "./update_page.js";
const belt_speeds = [
    150, 165, 180, 195, 210, 240,
    270, 300, 330, 375, 420, 450, 480
];
export function init_inputs() {
    document.querySelectorAll(".min-plus-input").forEach((wrapper) => {
        const input = wrapper.querySelector(".mp-input-field");
        const decrease = wrapper.querySelector('[data-action="decrease"]');
        const increase = wrapper.querySelector('[data-action="increase"]');
        if (!input || !decrease || !increase)
            return;
        decrease.addEventListener("click", () => {
            if (input.id === "Belt_BD") {
                if (input.value === "")
                    return;
                const current = Number(input.value);
                const previous = [...belt_speeds].reverse().find(v => v < current);
                if (previous !== undefined) {
                    input.value = String(previous);
                }
                else {
                    input.value = "";
                }
            }
            else {
                if (input.value === "")
                    return;
                if (Number(input.value) <= Number(input.min)) {
                    input.value = "";
                }
                else {
                    input.stepDown();
                }
            }
            update_page(input, { bubbles: true });
        });
        increase.addEventListener("click", () => {
            if (input.id === "Belt_BD") {
                const current = Number(input.value);
                const next = belt_speeds.find(v => v > current);
                if (next !== undefined) {
                    input.value = String(next);
                }
            }
            else {
                input.stepUp();
            }
            update_page(input, { bubbles: true });
        });
    });
}
//# sourceMappingURL=input_btns.js.map