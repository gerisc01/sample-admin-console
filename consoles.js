var savedRow = "";

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
            row.replaceWith(generateRowFromJson(json));
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
    values = [];
    row.find('td').each(function() {
        values.push($(this).text());
    });

        return '<tr>' +
    '  <td><input name="username" value="'+values[0]+'"/></td>' +
    '  <td><input name="name" value="'+values[1]+'"/></td>' +
    '  <td><input name="email" value="'+values[2]+'"/></td>' +
    '  <td><input name="age" value="'+values[3]+'"/></td>' +
    '  <td>' +
    '    <input style="display:none;" name="new_user" value="false"/>' +
    '    <button type="button" class="btn btn-default reject" aria-label="Left Align">' +
    '      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
    '    </button>' +
    '    <button type="button" class="btn btn-default accept" aria-label="Left Align">' +
    '      <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>' +
    '    </button>' +
    '  </td>' +
    '</tr>';
}

function generateRowFromJson(json) {
    // Assumes the rows are username,name,email,age
    return '<tr>' +
    '  <td>'+json["username"]+'</td>' +
    '  <td>'+json["name"]+'</td>' +
    '  <td>'+json["email"]+'</td>' +
    '  <td>'+json["age"]+'</td>' +
    '  <td>' +
    '    <button type="button" class="btn btn-default edit" aria-label="Left Align">' +
    '      <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
    '    </button>' +
    '  </td>' +
    '</tr>';
}

function populateUserTable() {
    $.getJSON("users.json", function(json) {
        var users = json["users"];
        var table = $('table#users').children("tbody");
        var i, len;

        for (i = 0, len = json["users"].length; i < len; ++i) {
            console.log(generateRowFromJson(users[i]));
            table.append(generateRowFromJson(users[i]));
        }
    });
}
