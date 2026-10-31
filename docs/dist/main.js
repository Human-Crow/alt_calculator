// cd alt_calculator; if ($?) { npm run watch }   (tsc --watch + versions, see watch.mjs)
// git rm -r --cached .
import { init_inputs } from './ui/input_btns.js?v=1.0.19';
import { init_bulk } from './ui/bulk.js?v=1.0.19';
import { init_fake_select } from './ui/fake_select.js?v=1.0.19';
import { init_field_btns } from './ui/field_buttons.js?v=1.0.19';
import { init_view_btns } from './ui/view_buttons.js?v=1.0.19';
import { init_collapse_all } from './ui/collapse_all.js?v=1.0.19';
import { init_mode } from './ui/solver_mode.js?v=1.0.19';
import { init_drag } from './ui/click_drag.js?v=1.0.19';
import { init_number } from './ui/numbers.js?v=1.0.19';
import { init_url } from './ui/url.js?v=1.0.19';
import { init_defaults } from './ui/defaults.js?v=1.0.19';
import { init_hide } from './ui/hide.js?v=1.0.19';
import { init_update_page } from './ui/update_page.js?v=1.0.19';
import { init_keep_scroll } from './ui/keep_scroll.js?v=1.0.19';
init_update_page();
init_inputs();
init_defaults();
init_mode();
init_bulk();
init_fake_select();
init_field_btns();
init_view_btns();
init_collapse_all();
init_keep_scroll();
init_drag();
init_number();
init_hide();
init_url(); // needs to be last
//# sourceMappingURL=main.js.map