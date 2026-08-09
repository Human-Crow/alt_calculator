// cd alt_calculator; if ($?) { npx tsc --watch }
// git rm -r --cached .
import { init_inputs } from './ui/input_btns.js';
import { init_bulk } from './ui/bulk.js';
import { init_fake_select } from './ui/fake_select.js';
import { init_field_btns } from './ui/field_buttons.js';
import { init_view_btns } from './ui/view_buttons.js';
import { init_mode } from './ui/solver_mode.js';
import { init_drag } from './ui/click_drag.js';
import { init_number } from './ui/numbers.js';
import { init_url } from './ui/url.js';
import { init_defaults } from './ui/defaults.js';
import { init_hide } from './ui/hide.js';
init_inputs();
init_defaults();
init_mode();
init_bulk();
init_fake_select();
init_field_btns();
init_view_btns();
init_drag();
init_number();
init_hide();
init_url(); // needs to be last
//# sourceMappingURL=main.js.map