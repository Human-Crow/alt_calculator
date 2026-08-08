import { create_num_el } from './numbers.js';
import { VariantId, ItemId } from '../data/types.js';
import { V } from '../data/enums.js';
import { round_sig, formatNumber, formatCeil, roundN } from '../utils/math.js'
import { is_alt_item } from '../utils/validation.js'



export function populate_amount_cell(
    is_rounded: boolean, 
    root: ParentNode, 
    amount: number,
    id: string = "",
    strong: boolean = true
) {
    const cell = root.querySelector(`.number-cell${id}`)!;
    cell.appendChild(
        create_num_el(
            is_rounded, amount, 
            formatNumber, x => round_sig(x, 6), 
            strong? "strong":""
        )
    );
}


export function populate_build_cell(
    is_rounded: boolean,
    root: ParentNode, 
    amounts: number[],
    id: string = ""
) {
    const cell = root.querySelector(`.build-cell${id}`)!;
    let total_len = amounts.length;
    const colors = total_len < 3 ? 
        ["color-white", "color-purple"] : 
        ["color-white","color-yellow","color-green"];

    let has_previous = false;
    for (const [i, amount] of amounts.entries()) {
        if (roundN(amount) <= 0) continue;

        if (has_previous) {
            cell.appendChild(document.createTextNode("-"));
        }

        cell.appendChild(
            create_num_el(
                is_rounded, amount, 
                formatNumber, formatCeil,
                "", colors[i]
            )
        );
        has_previous = true;
    }
}


export function populate_belt_cell(
    is_rounded: boolean,
    root: ParentNode, 
    amount: number,
    id: string = ""
) {
    const cell = root.querySelector(`.belt-cell${id}`)!;
    cell.appendChild(
        create_num_el(is_rounded, amount, formatNumber, formatCeil)
    );
}


export function populate_frac_cell(
    is_rounded: boolean,
    root: ParentNode, 
    fraction: number,
    id: string = ""
) {
    const cell = root.querySelector(`.frac-cell${id}`) as Element;
    cell.appendChild(
        create_num_el(is_rounded, fraction, 
            formatNumber, (x) => round_sig(x * 100, 5) + " %"
        )
    );
}


export function get_item_display(
    item_name: ItemId, 
    variant: VariantId
): {name: string, is_split: boolean} {
    const is_split = variant === V.SPLIT;
    const name = item_name.replaceAll("_", " ") 
               + ((!is_split && is_alt_item(item_name))? ` ${variant}` : "");
    return {name, is_split};
}