$(function () {
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chatWindow');
    var $usernameForm = $('#usernameForm');
    var $users = $('#users');
    var $username = $('#username');
    var $error = $('#error');
    $username.on('keyup', function () {
        if ($username.val().trim() != "") {
            $username.removeClass('borderRed');
        } else {
            $username.addClass('borderRed');
        }
    });
    $usernameForm.submit(function (e) {
        e.preventDefault();
        if ($username.val().trim() != "") {
            $username.removeClass('borderRed');
            socket.emit('new user', $username.val(), function (data) {
                if (data) {
                    $('#namesWrapper').hide();
                    $('#mainWrapper').show();
                } else {
                    $error.html('username is already teckan');
                }
            });
        } else {
            $username.addClass('borderRed');
        }
        $username.val('');
    });

    socket.on('usernames', function (data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += "<font color='green'>"+data[i].name + "</font>- Login Since:" + secondsToHms(data[i].time) + "(hh:mm:ss)<br/>";
        }
        $users.html(html);
    });

    $messageForm.submit(function (e) {
        e.preventDefault();
        //$message.val();
        if ($message.val().trim() != "")
            socket.emit('send message', $message.val());
        $message.val('');
        $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 1000);
    });

    socket.on('new message', function (data) {
        $chat.append('<b>' + data.user + ':</b>' + data.msg + "<br/>");
        $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 1000);
    });

    socket.on('userJoin', function (data) {
        $chat.append(data.msg + "<br/>");
        $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 1000);
    });
    socket.on('userLeave', function (data) {
        $chat.append(data.msg + "<br/>");
        $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 1000);
    });
});

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h < 10 ? "0" + h : h;
    var mDisplay = m < 10 ? "0" + m : m;
    var sDisplay = s < 10 ? "0" + s : s;
    return hDisplay +":"+ mDisplay +":"+ sDisplay;
}