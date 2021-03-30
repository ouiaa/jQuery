$(function () {
    // 存储的数据格式var todolist =[{title:'xxx',done :false}]
    // 1.toDoList按下回车把新数据添加到本地存储里面
    // 1）利用事件对象.keyCode判断用户按下回车键(13)。
    $('.add').on('keyup', function (e) {
        if (e.keyCode == 13) {
            if ($(this).val() == '') {
                alert('请输入内容')
            } else {
                // 2）读取本地存储原来的数据
                // 如果本地存储有数据，得到一个数组，没有数据也要得到一个数组，为空数组
                var local = getData()
                // console.log(local);
                // 由于本地存储没有直接追加内容的方法，通过中介数组实现：（所以就算本地存储没有数据也要返回数组）
                // （1）对local数组进行数据更新，把最新的数据追加给数组,注意数据格式是对象格式
                local.push({ title: $(this).val(), done: false }) //title为用户输入的任务内容,done为是否完成，默认都是未完成
                // （2）将数组存储给本地存储 此处单独封装成函数
                saveData(local)

                // 2.toDoList本地存储数据渲染加载到页面
                load()

                // 清空表单内数据
                $('.add').val('')
            }
        }
    })

    // 读取本地存储的数据 由于需要多次读取，因此单独封装成函数，减少代码量
    function getData() {
        var data = localStorage.getItem('todolist')
        // 判断本次存储下是否有数据，有则返回相应的数组，无则返回空数组
        if (data != null) {
            // 注意本地存储的数据是字符串形式，我们需要的是对象格式，需要进行转换
            return JSON.parse(data)
        } else {
            return []
        }
    }
    // 存储本地存储的数据
    function saveData(data) {
        // 注意：本地存储只能存储字符串类型，因此需要将传入的参数转为字符串类型
        localStorage.setItem('todolist', JSON.stringify(data))
    }
    // 每次打开页面都自动渲染一次数据
    load()
    // 2.数据渲染到页面
    function load() {
        // 5.toDoList统计正在进行个数和已经完成个数
        var todoCount = 0
        var doneCount = 0

        // 1)先要读取本地存储数据
        var data = getData()
        // console.log(data);
        // 4)每次渲染前要将ol内数据清空，即清空每次打开页面渲染出来的数据
        // ul内数据也要清空
        $('ol,ul').empty()
        // 2)遍历这个数据( $.each()) , 有几条数据,就生成几个小li添加到ol里面
        $.each(data, function (i, ele) {
            if (ele.done) {
                // 将最新数据放到最前面
                // 完成放入“已经完成”列表ul里,注意修改里面的checked
                $('ul').prepend('<li><input type="checkbox" name="" id="" checked="checked"><p>' + ele.title + '</p><a href="javascript:;" id=' + i + '>-</a></li>')
                doneCount++
                console.log(doneCount);
            } else {
                // 没完成放入ol里
                $('ol').prepend('<li><input type="checkbox" name="" id=""><p>' + ele.title + '</p><a href="javascript:;" id=' + i + '>-</a></li>')
                todoCount++
            }
        });

        $('.todocount').text(todoCount)
        $('.donecount').text(doneCount)
    }
    // 3.toDoList删除操作
    $('ol,ul').on('click', 'a', function () {
        // 1)先获取本地存储数据
        var data = getData()
        console.log(data);
        // 2)删除数组中对应的数据
        // 获得当前a所在li的索引号
        var index = $(this).attr('id')
        // console.log(index);
        // splice(从哪个位置开始删除-索引号，删除几个元素)
        data.splice(index, 1)
        // 3)存储本地存储的数据
        saveData(data)
        // 4)重新渲染页面
        load()
    })
    // 4.toDoList正在进行和已完成选项操作
    // 使用并集选择器，两个列表里的checkbox属性都要判断
    $('ul,ol').on('click', 'input', function () {
        // 1）获取本地存储数据
        var data = getData()
        // 2)修改数据
        // 需要获得当前checkbox所在li的索引号,通过兄弟a的自定义属性，兄弟的就是我的索引号
        var index = $(this).siblings('a').attr('id')
        // console.log('input' + index);
        // 得到并修改当前checkbox的状态
        data[index].done = $(this).prop('checked');
        // 3)存储本地存储的数据
        saveData(data)
        // 4)重新渲染页面
        load()
    })
})