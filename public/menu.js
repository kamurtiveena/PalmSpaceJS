
function newMenuState() {
    return {
        showMenu: true,
        technique: null,
        technique: null,
        userID: null,
        practice: false,
        debug: false,
        cellscnt: null,
        targetscnt: 3
    }
}

function checkRadio(tag) {
    const radios = document.getElementsByName(tag);
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) return radios[i].value;
    }

    return "N/A";
}

function checkSelectList(tag) {
    var e = document.getElementById(tag);
    return e.options[e.selectedIndex].text;
}


export { newMenuState, checkRadio, checkSelectList };