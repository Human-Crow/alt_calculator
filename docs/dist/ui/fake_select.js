import { get_asset } from '../utils/asset_path.js';
import { item_sel, fake_sel, } from './dom.js';
import { update_page } from './update_page.js';
function make_fake_select(realSelect, fakeSelect, withImages = false) {
    const selectedBtn = fakeSelect.querySelector(".selected");
    const optionsDiv = fakeSelect.querySelector(".options");
    function renderSelected(option) {
        if (!(selectedBtn)) {
            return;
        }
        if (withImages) {
            selectedBtn.innerHTML = `
                <img src="${get_asset(option.value)}" alt="">
                <span>${option.textContent}</span>
            `;
        }
        else {
            selectedBtn.textContent = option.textContent;
        }
    }
    if (!(selectedBtn) || !(optionsDiv)) {
        return;
    }
    fakeSelect.tabIndex = 0;
    optionsDiv.replaceChildren();
    for (const option of realSelect.options) {
        const div = document.createElement("div");
        div.className = "option";
        if (withImages) {
            div.innerHTML = `
                <img src="${get_asset(option.value)}" alt="">
                <span>${option.textContent}</span>
            `;
        }
        else {
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
    // Track keyboard search state
    let lastKey = "";
    let lastMatchIndex = -1;
    fakeSelect.addEventListener("keydown", (e) => {
        if (e.key.length !== 1)
            return;
        const key = e.key.toLowerCase();
        // Only handle letters
        if (!/^[a-z]$/.test(key))
            return;
        const options = Array.from(realSelect.options);
        const matches = options
            .map((option, index) => ({ option, index }))
            .filter(({ option }) => option.textContent?.trim().toLowerCase().startsWith(key));
        if (matches.length === 0)
            return;
        let matchIndex = 0;
        if (key === lastKey) {
            // Same key again → move to the next match
            const currentMatch = matches.findIndex(({ index }) => index === lastMatchIndex);
            matchIndex = currentMatch === -1
                ? 0
                : (currentMatch + 1) % matches.length;
        }
        else {
            // New key → start from the first match
            matchIndex = 0;
        }
        const match = matches[matchIndex];
        if (!match)
            return;
        realSelect.value = match.option.value;
        renderSelected(match.option);
        update_page(realSelect);
        const optionDiv = optionsDiv.children[match.index];
        if (optionDiv instanceof HTMLElement) {
            optionsDiv.scrollTop = optionDiv.offsetTop;
        }
        lastKey = key;
        lastMatchIndex = match.index;
        e.preventDefault();
    });
    // toggle dropdown
    selectedBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        fakeSelect.classList.toggle("open");
    });
    // close when clicking outside
    document.addEventListener("click", e => {
        if (!(e.target instanceof Node))
            return;
        if (!fakeSelect.contains(e.target)) {
            fakeSelect.classList.remove("open");
        }
    });
    realSelect.addEventListener("change", () => {
        const option = realSelect.selectedOptions[0];
        if (!option)
            return;
        renderSelected(option);
    });
}
export function init_fake_select() {
    make_fake_select(item_sel, fake_sel, true);
}
//# sourceMappingURL=fake_select.js.map