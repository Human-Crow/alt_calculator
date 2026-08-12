import { get_asset } from '../utils/asset_path.js'

import { 
    item_sel,
    fake_sel,
} from './dom.js'

import { update_page } from './update_page.js';


function make_fake_select(
    realSelect: HTMLSelectElement,
    fakeSelect: HTMLDivElement, 
    withImages: boolean = false
) {
    const selectedBtn = fakeSelect.querySelector(".selected");
    const optionsDiv = fakeSelect.querySelector(".options");

    function renderSelected(option: HTMLOptionElement) {
        if (!(selectedBtn)) {return;}
        if (withImages) {
            selectedBtn.innerHTML = `
                <img src="${get_asset(option.value)}" alt="">
                <span>${option.textContent}</span>
            `;
        } else {
            selectedBtn.textContent = option.textContent;
        }
    }

    if (!(selectedBtn) || !(optionsDiv)) {return;}
    optionsDiv.replaceChildren();

    for (const option of realSelect.options) {
        const div = document.createElement("div");
        div.className = "option";

        if (withImages) {
            div.innerHTML = `
                <img src="${get_asset(option.value)}" alt="">
                <span>${option.textContent}</span>
            `;
        } else {
            div.textContent = option.textContent;
        }

        div.addEventListener("click", () => {
            realSelect.value = option.value;
            renderSelected(option);
            fakeSelect.classList.remove("open");

            // forward native change event
            update_page(realSelect);
        });

        optionsDiv.appendChild(div);

        if (option.selected) {
            renderSelected(option);
        }
    }

    // toggle dropdown
    selectedBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        fakeSelect.classList.toggle("open");
    });

    // close when clicking outside
    document.addEventListener("click", e => {
        if (!(e.target instanceof Node)) return;
        if (!fakeSelect.contains(e.target)) {
            fakeSelect.classList.remove("open");
        }
    });

    realSelect.addEventListener("change", () => {
        const option = realSelect.selectedOptions[0];
        if (!option) return;

        renderSelected(option);
    });
}


export function init_fake_select() {
    make_fake_select(item_sel, fake_sel, true);
}