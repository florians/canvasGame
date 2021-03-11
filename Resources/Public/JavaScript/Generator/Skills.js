function getAllSkills(result = "", params = "") {
    if (result) {
        $('select.' + params.type).children().remove();
        $('select.' + params.type).append(fillSelect(result, params.addGroup));
    }
    ajaxHandler(getSkillTypes,
        data = {
            type: 'getSkillTypes'
        });
}

function getSkillTypes(result = "", params = "") {
    if (result) {
        $('select.' + params.type).children().remove();
        $('select.' + params.type).append(fillSelect(result, params.addGroup));
    }
}

function fillSelect(data) {
    var array = [];
    array.push('<option></option>');
    for (i = 0; i < data.length; i++) {
        array.push('<option value="' + data[i].name + '">' + data[i].name + '</option>');
    }
    return array.join('');
}
ajaxHandler(getAllSkills,
    data = {
        type: 'getAllSkills'
    });
