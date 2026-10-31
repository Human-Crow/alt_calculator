import { mode_btn } from './dom.js?v=1.0.19';
import { toggle_hide_mode } from './hide.js?v=1.0.19';
let goal_bool = false;
function toggle_mode() {
    goal_bool = !goal_bool;
    mode_btn.textContent = `${goal_bool ? "Goal" : "Resource"} Limited`;
}
export function is_mode_goal() {
    return goal_bool;
}
export function init_mode() {
    mode_btn.addEventListener("click", () => {
        toggle_mode();
        toggle_hide_mode(goal_bool);
    });
}
//# sourceMappingURL=solver_mode.js.map