var global = global || {};

global.$ = function(id) {
    return document.getElementById(id);
};

global.hasClassName = function(element, cName) {

    if (element.className) {
        return !!element.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
    }
    return false;
};

global.addClassName = function(element, cName) {

    if (!global.hasClassName(element, cName)) {
        element.className += ' ' + cName;
    }
};

global.removeClassName = function(element, cName) {

    if (global.hasClassName(element, cName)) {
        element.className = element.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), "");
    }
};
global.event = {

    on: function(element, type, listener) {
        if (element.addEventListener) {
            element.addEventListener(type, listener, false);
        } else if (element.attachElement) {
            element.attachElement(type, listener);
        } else {
            element['on' + type] = listener;
        }
    },

    getTarget: function(event) {
        return event.target || event.srcElement;
    },

    getEvent: function(event) {
        return event ? event : window.event;
    },

    preventDefault: function() {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
};

var validator = {
    types: {},
    message: [],
    config: {},
    validate: function(data) {
        // debugger
        var i, msg, type, checker, result_ok;
        this.message = [];
        for (i in data) {

            if (data.hasOwnProperty(i)) {
                type = this.config[i];
                checker = this.types[type];

                if (!type) {
                    continue;
                }

                if (!checker) {
                    throw {
                        name: 'Validation Error',
                        message: 'No handler to Validate type' + type
                    };
                }
                result_ok = checker.validate(data[i]);
                
                if (!result_ok) {
                    msg = checker.instructions;
                    this.message.push(msg);
                }else {
                    this.message.push("");
                }
            }
        }
        return this.hasErrors();
    },

    hasErrors: function() {
        console.log(this.message);
        console.log(this.message.length);
        return this.message.length !== 0;
    }
};

validator.config = {
    title: 'hasFontTitNumber',
    date: 'isDate',
    content: 'hasFontConNumber'
};

validator.types.hasFontTitNumber = {
    validate: function(value) {
        var len = value.length;
        return !(len > 6 || len <= 0);
    },

    instructions: '字数大于0小于6'
};

validator.types.hasFontConNumber = {
    validate: function(value) {
        var len = value.length;
        return !(len > 100 || len <= 0);
    },

    instructions: '字数大于0小于100'
};

validator.types.isDate = {
    validate: function(value) {
        return /^\d{4}-\d{1,2}-\d{1,2}$/.test(value);
    },

    instructions: '请输入正确的日期格式'
};