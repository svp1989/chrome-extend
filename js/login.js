$(function () {
    //авторизация на сервере и получение вакансий из базы
    $('#popup_login_form').on('submit', function (e) {
        e.preventDefault();
        var form = $(this).serialize();

        $('#loader').css('display', 'block');
        $('#error_message').html('');

        //выполняем запрос
        var bg_wnd = chrome.extension.getBackgroundPage();
        bg_wnd.bg.loginUser(form);

        //получаем результат, если ok то заменяем popup на новый
        setTimeout(function () {
            var result = bg_wnd.bg.data;
            if (result && result.status && result.status == 'error') {
                $('#error_message').text('Не правильный логин или пароль');
            } else {
                bg_wnd.bg.setPopup('find.html');
                window.close();
            }
            $('#loader').css('display', 'none');
        }, 500);

    });
});