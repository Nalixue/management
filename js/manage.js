function Manage() {
    this.data = this.data || {};
    this.complete = {};
    this.notCom = {};
    this.childLen = 0; //二级分类长度
    this.taskLen = 0; //二级分类任务长度
    this.init();

}

Manage.prototype = {

    init: function() {
        this.readStorage();
        this.showHeight();
        this.delegate();
    },

    //设置页面高度
    showHeight: function() {
        var that = this;
        that._getHeight();
        global.event.on(window, 'resize', function() {
            that._getHeight();
        });
    },

    delegate: function() {
        var that = this;

        //绑定所有click事件
        global.event.on(document, 'click', function() {
            var target = global.event.getTarget(event);

            if (global.hasClassName(target, 'lt-title')) {
                that._show(target.parentNode
                    .getElementsByTagName('ul')[0], true);
            }

            if (target.id === 'add-task' 
                || target.id === 'back-task') {
                that._show(global.$('mask-task'));
                that._showOptions();
            }

            if (target.id === 'add-class' ||
                target.id === 'back-class') {
                that._show(global.$('mask-class'));
            }

            if (target.id === 'icon-check' ||
                target.id === 'back-edit') {
                that._show(global.$('com-task'));
            }

            if (global.hasClassName(target, 'icon-cross')) {

                //点击二级分类删除
                if (global.hasClassName(target.parentNode.children[0], 'icon-file-empty')) {
                    var inner = target.parentNode.children[0].innerHTML;
                    var text = inner.substring(0, inner.indexOf('('));
                    for (var i in that.data) {

                        for (var j in that.data[i]) {

                            if (that.data[i][j].cVal === text) {
                                delete that.data[i][j];
                                that.data[i].cLen--;
                                alert('删除成功');
                                localStorage.setItem('storage', JSON.stringify(that.data));
                                that.readStorage();
                            }
                        }
                    }
                }

                //点击一级分类删除
                if (global.hasClassName(target.parentNode, 'icon-folder-open')) {
                    var inner = target.parentNode.firstChild.nodeValue;
                    var text = inner.substring(0, inner.indexOf('('));

                    for (var i in that.data) {

                        if (that.data[i].val === text) {
                            delete that.data[i];
                            that.data.len--;
                            alert('删除成功');
                            localStorage.setItem('storage', JSON.stringify(that.data));
                            that.readStorage();
                        }
                    }
                }
            }

            //点击二级分类显示所有任务
            if (global.hasClassName(target, 'icon-file-empty')) {
                var inner = target.innerHTML
                var text = inner.substring(0, inner.indexOf('('));
                var no = 0;
                var yes = 0;
                var flag = 0;
                var timeSortArr = [];

                for (var i in that.data) {

                    for (var j in that.data[i]) {
                        var comConAll = global.$('com-con-all');
                        var comConNo = global.$('com-con-no');
                        var comConYes = global.$('com-con-yes');

                        if (that.data[i][j].cVal == text && that.data[i][j].tLen !== 0) {

                            comConAll.innerHTML = "";
                            comConNo.innerHTML = "";
                            comConYes.innerHTML = "";
                            for (var k in that.data[i][j]) {

                                if (that.data[i][j][k].tVal) {
                                    var d = that.data[i][j][k].time.split('-');
                                    timeSortArr.push(new Date(d[0], d[1] - 1, d[2]));
                                    timeSortArr[flag].t = that.data[i][j][k].time
                                    timeSortArr[flag].v = that.data[i][j][k].tVal;
                                    timeSortArr[flag].w = that.data[i][j][k].whe;
                                    flag++;
                                }
                            }
                        }

                        if (that.data[i][j].cVal == text && that.data[i][j].tLen == 0) {
                            comConAll.innerHTML = "";
                            comConNo.innerHTML = "";
                            comConYes.innerHTML = "";
                            break;
                        }
                    }
                }
                timeSortArr.sort();

                //将任务完成情况显示出来
                for (var z = 0, len = timeSortArr.length; z < len; z++) {
                    var t = timeSortArr[z].t;
                    var v = timeSortArr[z].v;
                    comConAll.innerHTML += '<li><p class="lt-title">' + t 
                        + '</p><ul class="list-child com-list hidden"></ul></li>'
                    var allChild = comConAll.getElementsByClassName('list-child')[z];

                    if (timeSortArr[z].w) {
                        //所有任务颜色分配
                        allChild.innerHTML += '<li class="h-color task-detail">'
                                              + v + '</li>';

                        //完成的为绿色
                        comConYes.innerHTML += '<li><p class="lt-title">' 
                            + t + '</p><ul class="list-child com-list hidden"></ul></li>'
                        var yesChild = comConYes.getElementsByClassName('list-child')[yes];
                        yesChild.innerHTML += '<li class="h-color task-detail">' 
                                              + v + '</li>';
                        yes++;
                    } else {
                        allChild.innerHTML += '<li class="task-detail">' + v + '</li>';

                        //未完成的没有颜色
                        comConNo.innerHTML += '<li><p class="lt-title">' + t 
                             + '</p><ul class="list-child com-list hidden"></ul></li>'
                        var noChild = comConNo.getElementsByClassName('list-child')[no];
                        noChild.innerHTML += '<li class="task-detail">' + v + '</li>';
                        no++;
                    }
                }
            }

            //显示编辑框的详细内容
            if (global.hasClassName(target, 'task-detail')) {
                for (var i in that.data) {

                    if (that.data[i]['val']) {

                        for (var j in that.data[i]) {

                            if (that.data[i][j].cVal) {

                                for (var k in that.data[i][j]) {

                                    if (that.data[i][j][k].tVal == target.innerHTML) {
                                        var whether = that.data[i][j][k].whe;
                                        var hHeader = document.getElementsByClassName('dt-header')[0];

                                        if (whether) {
                                            hHeader.innerHTML = '<span id="dt-header"></span>';
                                        } else {
                                            hHeader.innerHTML = '<span id="dt-header"></span><a href="#"'
                                                +' class="icon icon-write" id="icon-write"></a><a href="#" '
                                                +'class="icon icon-check-alt" id="icon-check"></a>'

                                        }
                                        global.$('dt-header').innerHTML = that.data[i][j][k].tVal;
                                        global.$('dt-time').innerHTML = that.data[i][j][k].time;
                                        global.$('dt-content').innerHTML = that.data[i][j][k].con;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (target.id === 'com-sub') {

                for (var i in that.data) {

                    if (that.data[i]['val']) {

                        for (var j in that.data[i]) {

                            if (that.data[i][j].cVal) {

                                for (var k in that.data[i][j]) {

                                    if (that.data[i][j][k].tVal == global.$('dt-header').innerHTML) {
                                        that.data[i][j][k].whe = true;
                                        if (global.$('dt-content').getElementsByTagName('textarea')[0]) {
                                            that.data[i][j][k].con = global.$('dt-content')
                                                 .getElementsByTagName('textarea')[0].value;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                that._show(global.$('com-task'));
                localStorage.setItem('storage', JSON.stringify(that.data));
                that.readStorage();
            }

            if (target.id === 'all-com') {
                that._showBackground();
            }

            if (target.id === 'no-com') {
                that._showBackground();
            }

            if (target.id === 'yes-com') {
                that._showBackground();
            }

            //添加分类如果没有绿色字体则默认添加一级分类，否则添加二级分类
            if (target.id === 'class-sub') {

                if (global.$('mask-class').getElementsByTagName('span').length !== 0) {
                    event = global.event.getEvent(event);
                    global.event.preventDefault(event);
                } else {

                    //如果字体颜色为绿色的，添加二级分类
                    var classTit = global.$('class-tit').value;
                    var k = 0;
                    for (var i in that.data) {

                        if (that.data[i].val) {

                            if (k !== that.data.len) {
                                var list = global.$('list').getElementsByTagName('ul');
                                var childNode = list[k].parentNode.children[0];
                            }

                            if (global.hasClassName(childNode, 'h-color')) {

                                var d = 0;
                                that.data[i][classTit] = that.data[i][classTit] || {};
                                var child = that.data[i][classTit];
                                child.cVal = classTit;
                                child.tLen = 0;
                                that.data[i].cLen++;
                                localStorage.setItem('storage', JSON.stringify(that.data));
                                that.readStorage();
                            }
                            k++;
                        }
                    }
                    //添加一级分类
                    if (d !== 0) {
                        that.data.len++;
                        that.data[classTit] = {};
                        that.data[classTit].val = classTit;
                        that.data[classTit].cLen = 0;
                        localStorage.setItem('storage', JSON.stringify(that.data));
                        that.readStorage();
                    }
                    that._show(global.$('mask-class'));
                }
            }

            //当点击确认添加任务后，将信息保存在data对象里
            if (target.id === 'task-sub') {
                var flag = 0;
                var registerdata = {
                    date: global.$('date').value,
                    content: global.$('content').value
                };
                validator.validate(registerdata);

                for (var k = 0; k < validator.message.length; k++) {
                    if (!validator.message[k]) {
                        flag++;
                    }
                }

                //验证通过
                if (flag === validator.message.length) {
                    var dtHeader = global.$('dt-header');
                    var dtTime = global.$('dt-time');
                    var dtContent = global.$('dt-content');
                    dtHeader.innerHTML = "";
                    dtTime.innerHTML = "";
                    dtContent.innerHTML = "";

                    for (var i in that.data) {

                        for (var j in that.data[i]) {
                            var task = that.data[i][j],
                                opVal = global.$('class-option').value,
                                titVal = global.$('title').value,
                                dateVal = global.$('date').value,
                                conVal = global.$('content').value;

                            if (task.cVal === opVal) {
                                task.tLen++;
                                task[titVal] = {};
                                task[titVal].tVal = titVal;
                                dtHeader.innerHTML = titVal;
                                task[titVal].time = dateVal;
                                dtTime.innerHTML = dateVal;
                                task[titVal].con = conVal;
                                dtContent.innerHTML = conVal;
                                task[titVal].whe = false;
                            }
                        }
                    }
                    localStorage.setItem('storage', JSON.stringify(that.data));
                    that.readStorage();
                    that._show(global.$('mask-task'));
                } else {
                    var len = global.$('mask-task').getElementsByClassName('wrong').length;

                    for (var i = 0; i < len; i++) {
                        global.$('mask-task').getElementsByClassName('wrong')[i].innerHTML 
                             = validator.message[i];
                    }
                    event = global.event.getEvent(event);
                    global.event.preventDefault(event);
                }
            }

            //显示编辑框
            if (target.id === 'icon-write') {
                var dtContent = global.$('dt-content');
                var text = dtContent.innerHTML;
                var height = dtContent.offsetHeight;

                if (dtContent.innerHTML.indexOf('<') == -1 && dtContent.innerHTML != '') {
                    dtContent.innerHTML = '';
                    dtContent.innerHTML = '<textarea>' + text + '</textarea>';
                    global.$('dt-content').getElementsByTagName('textarea')[0].style.height = height + 'px';
                }
            }
        });

    },

    //读取本地存储的内容
    readStorage: function() {
        var data = JSON.parse(localStorage.getItem('storage'));
        var ltParent = global.$('list');
        var allNum = global.$('all-num');
        var k = 0;
        ltParent.innerHTML = "";

        if (data) {
            this.data = data;
            this.childLen = 0;
            this.taskLen = 0;
            for (var i in this.data) {

                if (this.data[i]['val']) {
                    ltParent.innerHTML += '<li><p class="icon icon-folder-open lt-title">' 
                        + this.data[i]['val'] + '(<strong>' + this.data[i].cLen 
                        + '</strong>)<span class="icon icon-cross"></span>' 
                        + '</p><ul class="list-child hidden"></li>';

                    for (var j in this.data[i]) {

                        if (this.data[i][j].cVal) {
                            var list = global.$('list').getElementsByTagName('ul');
                            list[k].innerHTML += '<li><span class="icon icon-file-empty">' 
                                + this.data[i][j].cVal + '(<strong>' + this.data[i][j].tLen 
                                + '</strong>)</span><span class="icon icon-cross"></span>'
                                + '</li>';
                            this.taskLen += this.data[i][j].tLen;
                        }
                    }
                    k++;
                    this.childLen += this.data[i].cLen;
                }
            }
        } else {
            this.data.默认分类 = {};
            this.data.默认分类.val = '默认分类';
            this.data.默认分类.cLen = 0;
            ltParent.innerHTML += '<li class="defalut-class"><p class="icon icon-folder-open lt-title">' 
                + this.data.默认分类.val + '(<strong>0</strong>)<span class="icon icon-cross"></span>' 
                + '</p><ul class="list-child hidden"></li>';
            this.data.len = 1;
        }

        allNum.innerHTML = "";
        allNum.innerHTML = this.childLen;
    },

    _show: function(element, color) {
        var target = global.event.getTarget(event);
        if (global.hasClassName(element, 'hidden')) {
            global.removeClassName(element, 'hidden');
            if (color) {
                for (var i = 0; i < this.data.len; i++) {
                    var list = global.$('list').getElementsByTagName('ul');
                    var listbro = list[i].parentNode.children[0];
                    if (global.hasClassName(listbro, 'h-color')) {
                        global.removeClassName(listbro, 'h-color');
                    }
                }
                global.addClassName(target, 'h-color');
            }
        } else {
            global.addClassName(element, 'hidden');
            if (color) {
                global.removeClassName(target, 'h-color');
            }
        }
    },

    _showOptions: function() {
        var select = global.$('class-option');
        select.innerHTML = "";
        for (var i in this.data) {

            if (this.data[i]['val']) {
                var k = 0;

                for (var j in this.data[i]) {

                    if (this.data[i][j].cVal) {
                        select.innerHTML += '<option id="o' + k + '" value="' 
                            + this.data[i][j].cVal + '">' + this.data[i][j].cVal 
                            + '</option>';
                        k++;
                    }
                }
            }
        }
    },

    _showBackground: function() {
        var target = global.event.getTarget(event);
        var targetId = target.id;
        var targetLi = target.parentNode.getElementsByTagName('li');
        var element;
        switch (targetId) {
            case 'all-com':
                element = global.$("com-con-all");
                global.addClassName(global.$("com-con-yes"), 'hidden');
                global.addClassName(global.$("com-con-no"), 'hidden');
                break;
            case 'no-com':
                element = global.$("com-con-no");
                global.addClassName(global.$("com-con-yes"), 'hidden');
                global.addClassName(global.$("com-con-all"), 'hidden');
                break;
            case 'yes-com':
                element = global.$("com-con-yes");
                global.addClassName(global.$("com-con-all"), 'hidden');
                global.addClassName(global.$("com-con-no"), 'hidden');
                break;
            default:
                //no one
        }
        for (var i = 0; i < targetLi.length; i++) {

            if (global.hasClassName(targetLi[i], 'tit-back')) {
                global.removeClassName(targetLi[i], 'tit-back');
            }
        }
        global.addClassName(target, 'tit-back');
        global.removeClassName(element, 'hidden');
    },

    _getHeight: function() {
        var height = Math.max(370, document.documentElement.clientHeight) - 70 + 'px';
        global.$('main').style.height = height;
        global.$('sd-complete').style.height = height;
        global.$('sd-task').style.height = height;
        global.$('mask-task').style.height = height;
    }
};