const config = {
    elementsType: ['input', 'select']
}

const getDefaultAlert = (alertText = "") => {
    const el = document.createElement("span");
    el.innerHTML = alertText != '' ? alertText : "This is a mandatory field." + "<br/>";
    el.style.color = "red";
    el.classList.add('v-alert');
    return el;
}

const getDefaultAlertForMatch = (alertText = "") => {
    const el = document.createElement("span");
    el.innerHTML = alertText != '' ? alertText : "Field value does not match with expected value." + "<br/>";
    el.style.color = "red";
    el.classList.add('v-alert');
    return el;
}

function initValidation(triggeredFrom, eventType) {
    if (triggeredFrom && typeof (triggeredFrom) == typeof (document.documentElement)) {
        triggeredFrom.addEventListener(eventType, eventFn)
    }
}

function eventFn() {
    let isFormValid = false;
    try {
        const elements = [];
        config.elementsType.forEach(type => {
            let elsCollection = document.getElementsByTagName(type);
            if (elsCollection) {
                let elsArr = Array.from(elsCollection);
                elements.push(elsArr.filter(el => (el.getAttribute('data-v') || '').toLowerCase() == 'true'))
            }
        });

        if (elements.length > 0) {
            const vElements = elements.flat(1);
            let isDirty = false;
            if (vElements && vElements.length > 0) {
                vElements.map(el => {
                    let alertText = (el.getAttribute("data-v-text") || '').trim();
                    if (el.getAttribute("data-v-matchid")) {
                        let matchText = (el.getAttribute("data-v-mtext") || '').trim();
                        let v = (el.value || '').trim();
                        if (v) {
                            let matchEl = document.getElementById(el.getAttribute("data-v-matchid"));
                            if (matchEl) {
                                let vMatch = (matchEl.value || '');
                                if (v !== vMatch) {
                                    if (matchEl.nextElementSibling == null || !matchEl.nextElementSibling.classList.contains('v-alert')) {
                                        matchEl.parentNode.insertBefore(getDefaultAlertForMatch(matchText), matchEl.nextElementSibling);
                                    }
                                    isDirty = true;
                                } else {
                                    if (matchEl.nextElementSibling != null && matchEl.nextElementSibling.classList.contains('v-alert')) {
                                        matchEl.nextElementSibling.outerHTML = "";
                                    }
                                }
                            }
                        }
                    }

                    if (!el.value) {
                        if (el.nextElementSibling == null || !el.nextElementSibling.classList.contains('v-alert')) {
                            el.parentNode.insertBefore(getDefaultAlert(alertText), el.nextElementSibling);
                        }
                        isDirty = true;
                    } else {
                        if (el.nextElementSibling != null && el.nextElementSibling.classList.contains('v-alert')) {
                            el.nextElementSibling.outerHTML = "";
                        }
                    }
                })

                if (!isDirty) {
                    isFormValid = true;
                }
            }
        }
    } catch (error) {
        console.error(error)
    }

    if (!isFormValid) {
        document.getElementsByTagName("form")[0].addEventListener("submit", preventFormSubmit)
    } else {
        document.getElementsByTagName("form")[0].removeEventListener("submit", preventFormSubmit)
    }
}

function preventFormSubmit(e) {
    e.preventDefault();
}
