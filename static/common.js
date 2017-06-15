(function(name) {
    var $ = function() {
        if (arguments.length > 0) {
            if ( typeof arguments[0] === 'function') {
                document.addEventListener('DOMContentLoaded', arguments[0]);
            } else if ( typeof arguments[0] == 'string') {
                var selectors = arguments[0].trim().split(/\s+/);
                var children = [],
                    selector,
                    res,
                    isId = false;

                var parents = arguments.length > 1 ? arguments[1] : document;
                if (!Array.isArray(parents)) {
                    parents = [parents];
                    isId = true;
                }
                for (var i = 0; i < selectors.length; ++i) {
                    selector = selectors[i];
                    for (var j = 0; j < parents.length; ++j) {
                        switch(selector.charAt(0)) {
                        case '#':
                            res = $.byId.call(this, selector.substr(1), parents[j]);
                            isId = true;
                            break;
                        case '.':
                            res = $.byClass.call(this, selector.substr(1), parents[j]);
                            isId = false;
                            break;
                        default:
                            res = $.byTag.call(this, selector, parents[j]);
                            isId = false;
                        }
                        if ( res instanceof HTMLCollection || res instanceof NodeList) {
                            for (var k = 0; k < res.length; ++k) {
                                children.push(res[k]);
                            }
                        } else {
                            children = children.concat(res);
                        }
                    }
                    console.log(children);
                    parents = children;
                    children = [];
                }
                return isId ? parents[0] : parents;
            }
        }
    };

    $.byId = function(id, target) {
        if ( typeof target === 'undefined') {
            target = document;
        }
        return target.getElementById(id);
    };

    $.byClass = function(className, target) {
        if ( typeof target === 'undefined') {
            target = document;
        }
        return target.getElementsByClassName(className);
    };

    $.byTag = function(tag, target) {
        if ( typeof target === 'undefined') {
            target = document;
        }
        return target.getElementsByTagName(tag);
    };

    $.bind = function(target, event, fn) {
        if (Array.isArray(target)) {
            for (var i = 0; i < target.length; ++i) {
                target[i].addEventListener(event, fn);
            }
        } else {
            console.log(target);
            target.addEventListener(event, fn);
        }
    }

    $.hide = function(target) {
        target.style.display = 'none';
    }

    $.show = function(target) {
        target.style.display = '';
    }

    if (window.EMULATION) {
        $.platform = window.EMULATION;
    } else {
        $.platform = /android/i.test(navigator.userAgent) ? 'android' : (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ? 'ios' : '');
    }

    $.invoke = function(method, params) {
        switch ($.platform) {
        case 'ios':
            //调用方法实现JS与原生IOS ObjectC交互数据
            window[method](JSON.stringify(params));//6.0
            break;
        case 'android':
            //调用方法实现JS与原生Android ObjectC交互数据
            var PROXY_OBJECT = 'android';
            window[PROXY_OBJECT][method](JSON.stringify(params));//6.0
            break;
        default:
            switch (method) {
            case 'alert':
                alert(params.message);
                break;
            default:
                console.log({
                    action : 'call',
                    method : method,
                    params : params,
                });
            }
        }
    }
    var globalName;
    $.setName = function(name) {
        if (globalName) {
            delete window[globalName];
        }
        window[name] = $;
        globalName = name;
    };
    //当另一个域进行AJAX请求；操作状况不同时作不同的响应
    $.jsonp = function(url, callback, error) {
        var callbackName;
        do {
            callbackName = 'jsonpCallback' + Math.floor(Math.random() * 0xffffff);
        } while(typeof window[callbackName] != 'undefined');
        window[callbackName] = callback;
        var script = document.createElement('script');
        script.onerror = error;
        script.src = url + "&callback=" + callbackName;
        document.head.appendChild(script);
    }

    $.setName('$');
    $.stationArr = [];
    $.roleArr = [];
    $.flag = false;
})();



var touchRefresh = function (body, options) {
    if (!body) {
        // throw 'you should provide body'
        return
    }

    if (!options) {
        throw 'options is missing.';
    }

    var header = options.header
    var footer = options.footer
    if (!header && !footer) {
        throw 'you should provide header or footer'
    }

    var scroller = options.scroller || document.body

    var overflowed = false;

    body.addEventListener('touchstart', function (e) {
        if (triggerEvent) {
            return;
        }
        if (initial === null) {
            var touch = e.changedTouches[0];
            initial = {identifier: touch.identifier, startY: touch.clientY, startScrollTop: scroller.scrollTop, height: -1};
            var diff = initial.startScrollTop + initial.startY - touch.clientY;
            var height = (diff + scroller.offsetHeight - scroller.scrollHeight)
            console.log([initial.startScrollTop, initial.startY - touch.clientY, scroller.parentNode.offsetHeight, scroller.scrollHeight])
        }
    });

    var initial = null;

    var triggerEvent = null;

    body.addEventListener('touchmove', function (e) {
        if (triggerEvent || !initial) {
            return;
        }
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; ++i) {
            var touch = touches[i];
            if (touch.identifier === initial.identifier) {
                var diff = initial.startScrollTop + initial.startY - touch.clientY
                var height = -diff
                if (height > 0) {
                    var height = -diff;
                    header.style.height = height + 'px';
                    if (header.offsetHeight < height - 1) {
                        triggerEvent = new CustomEvent("refresh");
                    }
                    e.preventDefault();
                } else {
                    height = (diff + scroller.parentNode.offsetHeight - (initial.height >= 0 ? initial.height : scroller.scrollHeight))
                    console.log([initial.startScrollTop, initial.startY - touch.clientY, scroller.parentNode.offsetHeight, scroller.scrollHeight])
                    if (height > 0) {
                        if (initial.height < 0) {
                            initial.height = scroller.scrollHeight
                        }
                        footer.style.height = height + 'px'
                        scroller.scrollTop += height
                        if (footer.offsetHeight < height - 1) {
                            triggerEvent = new CustomEvent("append");
                        }
                        e.preventDefault()
                    }
                }
            }
        }
    });

    body.addEventListener('touchend', function (e) {
        if (!initial) {
            return;
        }
        if (e.touches.length === 0) {
            initial = null;
            if (triggerEvent) {
                body.dispatchEvent(triggerEvent);
            } else {
                recover();
            }
        }
    });

    var timer = null;
    const timerInterval = 10;
    const recoverDuration = 200;

    var recover = function () {
         if (!header) {
            return;
        }
        var layer = header.offsetHeight > 0 ? header : (footer.offsetHeight > 0 ? footer : null);
        if (!layer) {
            return;
        }
        var total = layer.offsetHeight;
        if (total == 0) {
            return;
        }
        var i = 0;
        timer = setInterval(function () {
            ++i;
            var height = total - total / recoverDuration * timerInterval * i;
            if (height < 0) {
                height = 0;
            }
            layer.style.height = height + 'px';
            if (height === 0) {
                clearInterval(timer);
                triggerEvent = null;
            }
        }, timerInterval);
    };

    return {recover: recover};
};


