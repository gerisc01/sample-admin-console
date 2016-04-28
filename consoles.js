var savedRow = "";
var userSpec = null;

$(document).on('click','.btn.edit',function(){
    editRow($(this).closest("tr"));
});

$(document).on('click','.btn.reject',function(){
    $(this).closest("tr").replaceWith(getPreEditRow());
});

$(document).on('click','.btn.accept',function(){
    var row = $(this).closest("tr");
    // retrieve all the inputs from the edit row
    values = {};
    row.find('input').each(function() {
        values[this.name] = $(this).val();
    });

    $.ajax({
        type        : 'POST',
        url         : 'user.php',
        data        : values,
        encode      : true
    })
    .done(function(data) {
        try {
            json = JSON.parse(data);
            row.replaceWith(generateRow(json));
        } catch(e) {
            $("div#error").html("<h4>"+data+"</h4>");
        }
    });
});

function submitNewUser(form) {
    var values = {};
    form.find('input').each(function() {
        values[this.name] = $(this).val();
    });

    $.ajax({
        type        : 'POST',
        url         : 'user.php',
        data        : values,
        encode      : true
    })
    .done(function(data) {
        try {
            window.location.replace("/");
        } catch(e) {
            $("div#error").html("<h4>"+data+"</h4>");
        }
    });
}

function validatePasswordsMatch(form) {
    var password = null;
    form.find('input:password').each(function() {
        if (password === null) password = $(this).val();
        if ($(this).val() !== password) {
            password = null;
            return false;
        }
    });
    return password === null ? false : true;
}

function editRow(row) {
    setPreEditRow(row.html());
    row.replaceWith(generateEditRow(row));
}

function getPreEditRow() {
    return savedRow;
}

function setPreEditRow(html) {
    savedRow = "<tr>" +
    "  " + html +
    "</tr>";
}

function generateEditRow(row) {
    var fields = userSpec["fields"];
    var tr = '<tr>';

    // Save the current values from the row
    values = [];
    row.find('td').each(function() {
        values.push($(this).text());
    });

    for (var i = 0, fLen = fields.length; i < fLen; ++i) {
        var type = fields[i]["type"].toLowerCase();
        if (type !== "sensitive") {
            if (type === "string") {
                tr += '  <td><input name="'+fields[i]["name"]+'" value="'+values.shift()+'"/></td>';
            } else if (type.slice(0,3) === "int") {
                tr += '  <td><input type="number" name="'+fields[i]["name"]+'" value="'+values.shift()+'"/></td>';
            }
        }
    }

    // Add buttons and closing td
    tr += '  <td>' +
    '    <input style="display:none;" name="new_user" value="false"/>' +
    '    <button type="button" class="btn btn-default reject" aria-label="Left Align">' +
    '      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
    '    </button>' +
    '    <button type="button" class="btn btn-default accept" aria-label="Left Align">' +
    '      <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>' +
    '    </button>' +
    '  </td>' +
    '</tr>';

    return tr;
}

function generateRow(json) {
    var fields = userSpec["fields"];
    var tr = '<tr>';
    for (var j = 0, fLen = fields.length; j < fLen; ++j) {
        if (fields[j]["type"] !== "sensitive") {
            tr += '  <td>'+json[fields[j].name]+'</td>';
        }
    }
    // Add edit button and closing tr tag
    tr += '  <td>' +
    '    <button type="button" class="btn btn-default edit" aria-label="Left Align">' +
    '      <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
    '    </button>' +
    '  </td>' +
    '</tr>';

    return tr;
}

function loadAdminData() {
    $.getJSON("users.spec",loadAdminHeader)
    .then(function() { 
        $.getJSON("users.json",loadAdminRows);
    });
}

// Load Admin header takes the json for the .spec file
function loadAdminHeader(json) {
    userSpec = json;
    var fields = json["fields"];
    var tr = $('table.admin-data').find('thead tr');

    var i,len;
    for (i = 0, len = fields.length; i < len; ++i) {
        if (fields[i]["type"] !== "sensitive") {
            tr.append('<th>'+capitalizeFirstLetter(fields[i]["name"])+'</th>');
        }
    }
}

// Load Admin header takes the json from the .json data file
function loadAdminRows(json) {
    if (userSpec === null) { console.log("loadAdminHeader() didn't load the .spec file into the userData variable"); return; }
    var rows = json["users"];
    var table = $('table.admin-data').children("tbody");
    
    for (var i = 0, len = rows.length; i < len; ++i) {
        var tr = generateRow(rows[i]);
        table.append(tr);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
