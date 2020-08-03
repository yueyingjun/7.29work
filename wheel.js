/*
    无缝轮播图
    wins  要放入轮播图的窗口     //选择器
    opts   json    实现轮播图的各个属性
        img   数组   要包含的轮播图的图片的地址
        links 数组  图片的链接地址
        imgColor  数组   图片的颜色，用于实现全屏的颜色拼接
        imgSize   数组   第一个参数代表的宽，第二个参数代表高
        btnColor  String 按钮的颜色
        btnActive  String   获得焦点的按钮的颜色
        btnPos    数组     第一个参数代表X位置     y位置

*/

function wheel(wins,opts,Run){


    //初始化
    var wins = document.querySelector(wins);
    if(!(wins&&wins.nodeType==1)){
        console.error("窗口元素 not find")
        return ; 
    }
    var btnColor = opts.btnColor||"green";
    var btnActive = opts.btnActive||"red";
    var btnPos = opts.btnPos||["center","20"] ;

    


    //图片的地址添加一个
    opts.imgs.push(opts.imgs[0])
    opts.links.push(opts.links[0])
    opts.imgColor.push(opts.imgColor[0])
    var imgLength = opts.imgs.length;
    console.log(opts.imgs);
    console.log(imgLength);
    if(imgLength==0){
        console.error("没有传入相应的轮播图");
    }

    var imgSize = opts.imgSize;
    if (!(imgSize instanceof Array)) {
        console.log("请输入合法的尺寸类型");
    }
    if(imgSize.length==0){
        imgSize[0] = document,documentElement.clienWidth;
        imgSize[1] = 400;
    }
    if(imgSize.some(function(val){
        return val==0
    })){
        for(var i=0;i<2;i++){
            if(imgSize[i]==0){
                imgSize[i] = 500;
            }
        }
    }
    var Run = Run||{};
    var time = 0;
    if (Run.time) {
        time = Run.time * 100;
    }
    else {
        time = 5000;
    }
    var eachTime = 0;
    if (Run.eachTime) {
        eachTime = Run.eachTime * 1000;
    }
    else {
        eachTime = 500;
    }
    var runStyle = null;
    if (Run.runStyle == "inner" || !(Run.runStyle)) {
        runStyle = Tween.Linear;

    }
    else if (Run.runStyle == "in") {
        runStyle = Tween.Quad.easeIn;
    }
    else if (Run.runStyle == "out") {
        runStyle = Tween.Quad.easeOut;
    }


    

    //1.win样式
    wins.style.cssText = "width:100%;height:"+imgSize[1]+"px;overflow:hidden;position: relative";
    
    //2.添加容器
    var box = document.createElement("div");
    box.style.cssText = "width:"+(imgLength*100)+"%;height:100%;border:1px solid red;overflow:hidden"
    wins.appendChild(box);

    //创建每一个轮播图
    for(var i=0;i<imgLength;i++){
        

       var divList = document.createElement("div");
        divList.style.cssText = `float:left;width:${100/imgLength}%;height: 100%;background:${opts.imgColor[i]}`;

        var link = document.createElement("a");
        link.href = opts.links[i];
        link.style.cssText = "background:url("+opts.imgs[i]+") no-repeat 0 0;width:"+imgSize[0]+"px;height:"+imgSize[1]+"px;display:block;margin:auto"

        divList.appendChild(link);
        box.appendChild(divList); 
        console.log(opts);
    }

    
    
    
    //创建按钮
    var btnBox = document.createElement("div");
    btnBox.style.cssText = "width:300px;height:20px;position:absolute;left:0;right:0;margin:auto;bottom:"+btnPos[1]+"px;";

    var btns=[];
    for(var i=0;i<imgLength-1;i++){
        if(i==0){
            var bgcolor = btnActive;
        }else{
            var bgcolor = btnColor;
        }
        var btn = document.createElement("div");
        btn.style.cssText = "width:5px;height:5px;background:"+bgcolor+";border-radius:50%;margin:0 10px;cursor:pointer;float:left";
        btnBox.appendChild(btn);
        btns.push(btn);
    }

    wins.appendChild(btnBox);
    
    //无缝轮播
    var win = wins;
    console.log(btns);
    //如何获得窗口的大小
        // console.log(window.innerWidth)
        // console.log(document.documentElement.clientWidth)
    var winW = parseInt(getComputedStyle(win,null).width);
    var num = 0;
    
    function move(){    
        num++;
        if(num >btns.length-1){
            animate(box,{
                "margin-left": -(num * winW)
            },eachTime,runStyle,function(){
                
                box.style.marginLeft = 0;
            })
            num=0;    
        }else{
            animate(box,{
                "margin-left": -(num * winW)
            },eachTime)
        }
        
        
        for(var i=0;i<btns.length;i++){
            btns[i].style.background= btnColor;
        }
        btns[num].style.background = btnActive;
        
    }

    //自动轮播
    
    var t = setInterval(move,time)

    //按钮轮播
    for(let i=0;i<btns.length;i++){
        btns[i].onclick = function(){
            num=i;
            animate(box,{
                "margin-left": -(num*winW)
            },eachTime,runStyle)                
            for(var j=0;j<btns.length;j++){
                btns[j].style.background = btnColor;
            }
            btns[num].style.background = btnActive;
        
        
        }
    }
    //鼠标移入，移出
    win.onmouseover = function(){
        clearInterval(t)
    }
    win.onmouseout = function(){
        t = setInterval(move,time)
    }




}