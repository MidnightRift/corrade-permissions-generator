let permissions = [
    {
        name: 'copy',
        shortCode: 'C'
    },
    {
        name: 'damage',
        shortCode: 'D'
    },
    {
        name: '_export',
        shortCode: 'E'
    },
    {
        name: 'modify',
        shortCode: 'M'
    },
    {
        name: 'move',
        shortCode: 'V'
    },
    {
        name: 'transfer',
        shortCode: 'T'
    }
];

let groups = [
    {
        name: 'base',
        color: '#d50000'
    },
    {
        name: 'everyone',
        color: '#8e24aa'
    },
    {
        name: 'group',
        color: '#1565C0'
    },
    {
        name: 'next_owner',
        color: '#2E7D32'
    },
    {
        name: 'owner',
        color: '#ff6d00'
    }
];


function updatePermissionString(ctx) {
    let _group = ctx.getAttribute('data-group');
    let _perm = ctx.getAttribute('data-permission');
    builtGroupAndPerms[_group][_perm].checked = ctx.checked;
    let outputHtmlArray = [];
    for (let key in builtGroupAndPerms) {
        let outputstring = '';

        for (let _key in builtGroupAndPerms[key]) {
            if (builtGroupAndPerms[key][_key].checked) {
                outputstring += builtGroupAndPerms[key][_key].shortCode
            } else {
                outputstring += '-'
            }
        }
        let _span = document.createElement('span');
        let groupObj = groups.find(obj => {
            return obj.name === key
        });
        _span.style.color = groupObj.color;
        _span.innerText = outputstring;
        outputHtmlArray.push(_span)
    }

    permString.innerHTML = '';
    outputHtmlArray.forEach(function (item) {
        permString.appendChild(item)
    })
}

function updatePermissionFieldSets(ctx) {
    let simpleTest = (groups.length * permissions.length === ctx.innerText.length); // quick and dirty, better ways to do this.

    let letterCount = 0;

    let outputHtmlArray = [];
    if (simpleTest) {
        for (let key in builtGroupAndPerms) {
            let outputstring = ctx.innerText.substr(letterCount, permissions.length);

            for (let _key in builtGroupAndPerms[key]) {
                if (ctx.innerText.charAt(letterCount) !== '-') {

                    if (builtGroupAndPerms[key][_key].shortCode === ctx.innerText.charAt(letterCount).toUpperCase()) {
                        builtGroupAndPerms[key][_key].checked = true;
                        let updateThisNode = document.getElementById(key + _key + '_input')
                        updateThisNode.checked = true;
                    }
                }
                ++letterCount;

            }
            let _span = document.createElement('span');
            let groupObj = groups.find(obj => {
                return obj.name === key
            });
            _span.style.color = groupObj.color;
            _span.innerText = outputstring;
            outputHtmlArray.push(_span)
        }

        permString.innerHTML = '';
        outputHtmlArray.forEach(function (item) {
            permString.appendChild(item)
        })
    } else {
        alert('Please enter a valid Corrade Permission String')
    }


}

let permString = document.getElementById('permTextString');
permString.addEventListener('input', function () {

    updatePermissionFieldSets(this)
});


let builtGroupAndPerms;

function _pageSetup() {
    let objects = [];
    let outputHtmlArray = [];

    let textGen = function () {
        let length = permissions.length;
        let out = '';

        while (length--) {
            out += '-'
        }
        return out;
    };


    groups.forEach(function (item, index, arr) {
        objects[item.name] = {};

        let _fieldset = document.createElement("div"); // no longer a actual fieldset element because of a bug in chrome with it being flex.
        _fieldset.classList.add("fieldsetGroup");
        _fieldset.style.borderColor = item.color;

        let _legend = document.createElement('div');
        _legend.classList.add('fieldsetLegend');

        _legend.innerText = item.name.replace(/_/g, ' ');

        _fieldset.appendChild(_legend);

        let _span = document.createElement('span');
        _span.style.color = item.color;
        _span.innerText = textGen();
        outputHtmlArray.push(_span);


        permissions.forEach(function (_item, _index, _arr) {
            objects[item.name][_item.name] = {};
            objects[item.name][_item.name].checked = false;
            objects[item.name][_item.name].shortCode = _item.shortCode;

            let _input = document.createElement('input');
            _input.type = 'checkbox';
            _input.setAttribute('data-group', item.name);
            _input.setAttribute('data-permission', _item.name);

            _input.id = item.name + _item.name + '_input';

            _input.addEventListener('change', function () {
                updatePermissionString(this)
            });

            _fieldset.appendChild(_input);
            let _label = document.createElement('label');
            _label.id = item.name + _item.name + '_label';
            _label.innerText = _item.name.replace(/_/g, '');
            _fieldset.appendChild(_label);

        });

        document.body.appendChild(_fieldset);


    });


    permString.innerHTML = '';
    outputHtmlArray.forEach(function (item) {
        permString.appendChild(item)
    });

    builtGroupAndPerms = objects;
}

_pageSetup();
