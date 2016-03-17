//инициальзируем на странице hh.ru
//TODO добавить возможность выбирать из созданных шаблонов, т.е. чекаем страницу отправляем запрос приходят массив классов(id)
//TODO с которыми работаем
function initialization(data) {
    //TODO url для обработки полученных данных данные парсятся пока только с hh.ru переделать html должен быть дефолтный для всех
    var url_create = '';
    var result = JSON.parse(data);
    var positions = result.position;
    var secret = result.key;
    var html = '<div class="topbutton noprint">' +
        '<span class="link-switch-secondary" id="dorp_down_list">Сохранить в базу' +
        '<div id="ul_drop_down" style="' +
        'position: absolute;' +
        'background: #fff;' +
        'z-index: 100;' +
        'min-width: 130px;' +
        'max-width: 800px;' +
        'padding: 12px 14px;' +
        'color: #333;' +
        'background-color: #fff;' +
        '-webkit-box-shadow: 0 0 8px rgba(0,0,0,.2);' +
        'display: none;' +
        'box-shadow: 0 0 8px rgba(0,0,0,.2);' +
        '">' +
        '<ul class="list-params">';


    for (key in positions) {
        html += '<li class="list-params__item">' +
            '<a class="list-params__link" data-key="' + key + '" id="send_on_site">' + positions[key] + '</a>' +
            '</li>';
    }

    html += '</ul>' +
        '</div>' +
        '</span>' +
        '</div>';

    $('.g-paddings .topbuttons.topbuttons_noindent').append(html);

    //собираем данные на странице и отправляем на сайт
    $('li > #send_on_site').on('click', function (e) {
        e.preventDefault();
        var phone = $('.resume__contacts__phone__number').text();
        var email = $('a[itemprop=email]').text();
        var name = $('.resume__personal__name').text();
        var url = document.location.href;
        var position = $(this).attr('data-key');

        var obj = {
            phone: phone,
            email: email,
            name: name,
            url: url,
            position: position,
            secret: secret
        };

        $.post(url_create, obj, function(data){
            if (data == 'ok') {
                $('#dorp_down_list').css('color', 'green');
            }
        });

    });

    //выпадающее меню
    $('span#dorp_down_list').on('click', function () {
        $('#ul_drop_down').toggle();
    });

}