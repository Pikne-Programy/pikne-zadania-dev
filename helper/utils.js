/**
 * Returns current screen size breakpoint:
 * @returns
 * 'mobile': 768px and less
 * 
 * 'tablet': 769px - 1023px
 * 
 * 'desktop': 1024px - 1215px
 * 
 * 'widescreen': 1216px - 1407px
 * 
 * 'fullhd': 1408px and more
 */
export function getScreenSize() {
    const width = window.innerWidth
    if (width <= 768)
        return 'mobile'
    else if (width <= 1023)
        return 'tablet'
    else if (width <= 1215)
        return 'desktop'
    else if (width <= 1407)
        return 'widescreen'
    else
        return 'fullhd'
}

/**
 * Creates HTMLElement with provided classes, innerHTML & appends children
 * @param {string} type
 * @param {string[]} classes
 * @param {HTMLElement[]} children
 * @param {string} innerHTML
 */
export function createElement(type, classes = [], children = [], innerHTML = '') {
    var element = document.createElement(type)
    for (var i = 0; i < classes.length; i++)
        element.classList.add(classes[i])
    element.innerHTML = innerHTML
    for (var i = 0; i < children.length; i++)
        element.appendChild(children[i])
    return element;
}

/**
 * Sets visibility of a HTMLElement.
 * @param {HTMLElement} element
 * @param {('visible' | 'hidden' | 'collapse')} state 
 */
export function setVisibility(element, state) {
    element.style.visibility = state
}

/**
 * Support class used in toggleClasses function
 * @see toggleClasses
 */
export class ToggleClasses {
    /**
     * @param {string} parent
     * @param {string} toToggle
     */
    constructor(parent, toToggle) {
        this.parent = parent;
        this.toToggle = toToggle;
    }
}

/**
 * Adds or removes each of toToggle class if provided element's class list contains parent class
 * @param {HTMLElement} element  
 * @param {ToggleClasses[]} toggleClassesList 
 * @param {boolean} add True - adds classes; False - removes classes
 */
export function toggleClasses(element, toggleClassesList, add) {
    toggleClassesList.forEach(toggleClass => {
        if (add) {
            if ($(element).hasClass(toggleClass.parent) && !$(element).hasClass(toggleClass.toToggle))
                $(element).addClass(toggleClass.toToggle);
        } else {
            if ($(element).hasClass(toggleClass.parent))
                $(element).removeClass(toggleClass.toToggle);
        }
    });
}

export class Observable {
    /**
     * Object with custom callback on value change
     * @param {any} initialValue Initially set value
     * @param {function} callback Function executed on value change
     * @class
     */
    constructor(initialValue = null, callback = null) {
        this.target = initialValue;
        this.callback = callback;
    }

    get() {
        return this.target;
    }
    set(val) {
        this.target = val;
        if (this.callback != null)
            this.callback();
    };
}