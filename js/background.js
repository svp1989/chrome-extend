$(function () {
    //создаем новый объект
    window.bg = new bgObj();

    //устанавливаем хост с которым работаем (наш backend с api)
    window.bg.host = ''; //TODO host на котором backend

    //начинаем слушать события интересует таб(для дальнейшей инициальзации скрипта на интересующем нас сайте)
    chrome.tabs.onUpdated.addListener(function (id, info, tab) {
        //если таб загружен делаем проверку
        if (info && info.status && (info.status.toLowerCase() === 'complete')) {
            //проверяем на пустой таб (вкладку) и на протокол запроса можно добавить https:
            if (!id || !tab || !tab.url || (tab.url.indexOf('http:') == -1))
                return 0;

            //сохраняем таб, пока не нужен но может понадобится
            window.bg.push(tab);

            if (window.bg.data && window.bg.data.status == 'ok') {
                chrome.tabs.executeScript(id, {code: "initialization('" + JSON.stringify(window.bg.data) + "')"});
            }
        }
    });

    //подключаем форму логин пароль
    window.bg.onAppReady();
});

window.bgObj = function () {
};

window.bgObj.prototype = {

    /**
     * Параметры для работы
     */
    host: '',
    data: {},
    tabs: {},

    /**
     * устанавливаем первый popup
     */
    onAppReady: function () {
        //устанавливаем форму ввода логина и пароля
        chrome.browserAction.setPopup({popup: "login.html"});
    },

    /**
     * сохраняем таб
     */
    push: function (tab) {
        if (tab.id && (tab.id != 0)) {
            if (!this.tabs[tab.id])
                this.tabs[tab.id] = {tab_obj: tab};
        }
    },

    /**
     * вызывыем login.html
     */
    loginUser: function (user_data) {
        var self = this;
        var json_data = false;
        $.post(self.host, user_data, function (data) {
            self.data = JSON.parse(data);
            return self.data;
        });
    },

    /**
     * устанавливает новый popup, может пригодиться
     */
    setPopup: function (popup_file) {
        chrome.browserAction.setPopup({popup: popup_file});
    },

    /**
     * Empty method
     */
    empty: function () {
    }
};