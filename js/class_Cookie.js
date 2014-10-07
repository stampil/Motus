function Cookie(key, value) {

    this.set = function (key, value) {

        if (typeof key != 'undefined' && typeof value != 'undefined') {

            window.localStorage.setItem(key, value);
        }
    };

    this.get = function (key) {
        return window.localStorage.getItem(key);
    }

    this.remove = function (key) {
        if (typeof key == 'string' && key.length > 0) {
            window.localStorage.removeItem(key);
        }
        else {
            window.localStorage.clear();
        }
    };

    this.list = function () {
        var ret = [];
        for (var i = 0; i < window.localStorage.length; i++) {
            ret[i] = window.localStorage.key(i);
        }
        return ret;
    };

    this.set(key, value);

}
;

var cookie = new Cookie();

