let canvas= document.querySelector("canvas");


canvas.height=window.innerHeight;
canvas.width=window.innerWidth;

// to draw anything on canvas > use this tool
let tool=canvas.getContext("2d");

// default colour > black 
// tool.fillRect(0,0,450,450);

let ismousedown=false;
let undostack=[];
let redostack=[];


canvas.addEventListener("mousedown",function(e){
    tool.beginPath();

    
    
    tool.moveTo(e.clientX,getcoordinates(e.clientY));
    
    let x=e.clientX;
    let y=getcoordinates(e.clientY);
    ismousedown=true;
    let pointsdesc={
        x : x,
        y : y,
        desc: "md"
    }
    undostack.push(pointsdesc);
})

canvas.addEventListener("mousemove",function(e){
    if(ismousedown && !scaleactive)
    {
        let x=e.clientX;
        let y=getcoordinates(e.clientY);
        tool.lineTo(e.clientX,getcoordinates(e.clientY));
       
        tool.stroke();
        let pointsdesc={
            x : x,
            y : y,
            desc:"mm"
        }
        undostack.push(pointsdesc);
    }


    
    
})



canvas.addEventListener("mouseup",function(e){

    if(scaleactive==true)
    {
        let pointsdesc={
            x : e.clientX,
            y : getcoordinates(e.clientY) ,
            desc:"mm"
        }
        tool.lineTo(e.clientX,getcoordinates(e.clientY));
        undostack.push(pointsdesc);
        tool.stroke();
    }
    ismousedown=false;

})

// for getting coordinates of canvas
function getcoordinates(y)
{
    let bound=canvas.getBoundingClientRect();
    return y-bound.y;
}






function redraw()
{
    for(let i=0;i<undostack.length;i++)
    {
        let {x,y,desc}=undostack[i];
        if(desc=="md")
        {
            tool.beginPath();
            tool.moveTo(x,y);
        }
        else if(desc=="mm")
        {
            tool.lineTo(x,y);
            tool.stroke();
        }
    }
}






//undo
let undo=document.querySelector("#undo");

/*
undo.addEventListener("click",function(){

     undomaker();

});*/




function undomaker(){
//clear board
 tool.clearRect(0,0,canvas.width,canvas.height);

 //pop last point
 while(undostack.length>0)
 {
     let cob=undostack[undostack.length-1];
     if(cob.desc=="md")
     {
         redostack.push(undostack.pop());
         break;
     }
     else if(cob.desc=="mm")
     {
         redostack.push(undostack.pop());
     }
    

 }
 //redraw
 redraw();
}






//redo

function redomaker(){
    tool.clearRect(0,0,canvas.width,canvas.height);

 
     
    while(redostack.length>0)
    {
        let cob=redostack[redostack.length-1];
        if(cob.desc=="md")
        {
            undostack.push(redostack.pop());
            break;
        }
        else if(cob.desc=="mm")
        {
            undostack.push(redostack.pop());
        }
     
   
    }
    redraw();
   

}


//upload / download image


















let isminimized=false;
let stickypad=document.querySelector(".stickypad");
let close=document.querySelector(".close");
let minimize=document.querySelector(".minimize");
let textarea=document.querySelector(".text-area");


let tools=document.querySelectorAll(".tool-image")
for(let i=0;i<tools.length;i++)
{
    tools[i].addEventListener("click",function(e){
        let ctool =e.currentTarget;
        let name=ctool.getAttribute("id");
        if(name=="pencil")
        {
            scaleactive=false;

            tool.strokeStyle="black";
        }
        else if(name=="eraser")
        {
            scaleactive=false;

            if(darktheme==true)
            tool.strokeStyle="black";

            else if(darktheme==false)
            tool.strokeStyle="white";
        }
        else if(name=="sticky")
        {
            createsticky();

        }
        else if(name=="undo")
        {
            undomaker();

        }
        else if(name=="redo")
        {
           
            redomaker();

        }
        else if(name=="download")
        {
           
            downloadboard();

        }
        else if(name=="upload")
        {
           
            uploadFile();

        }
        else if(name=="clear")
        {
           if(darktheme)
           {
            tool.fillStyle = "black";
        
            tool.fillRect(0, 0, canvas.width, canvas.height);
           }
           else
            tool.clearRect(0,0,canvas.width,canvas.height);

        }
        else if(name=="scale")
        {
            scaleactive=true;
        }
    
    })
}



function downloadboard()
{
    let a=document.createElement("a");

    a.download="file.png";

    let url=canvas.toDataURL("image/png;base64");

    a.href=url;

    a.click();

    a.remove();
}

// upload
let imgInput = document.querySelector("#acceptImg");

// dialog box open
function uploadFile() {
    // dialog box select ok 
    imgInput.click();      
    imgInput.addEventListener("change", function () {
        
          
        let imgObj = imgInput.files[0];
        // console.log(imgObj);
        // img => link 
        let imgLink = URL.createObjectURL(imgObj);
        let textBox = createbox();
        let img = document.createElement("img");
        img.setAttribute("class", "upload-img");
        img.src = imgLink;
        textBox.appendChild(img);
    })
}


function createbox(){
    let stickypad = document.createElement("div");
    let navbar = document.createElement("div");
    let close = document.createElement("div");
    let minimize = document.createElement("div");
    let textarea = document.createElement("div");
    //    add classes
    stickypad.setAttribute("class", "stickypad");
    navbar.setAttribute("class", "navbar");
    close.setAttribute("class", "close");
    minimize.setAttribute("class", "minimize");
    textarea.setAttribute("class", "text-area");

    navbar.appendChild(minimize);
    navbar.appendChild(close);
    stickypad.appendChild(navbar);
    stickypad.appendChild(textarea);

    document.body.appendChild(stickypad);

        
let initialx=null;
let initialy=null;
let isStickydown=false;

//let navbar=document.querySelector(".navbar");
navbar.addEventListener("mousedown",function(e){
    initialx=e.clientX;
    initialy=e.clientY;
    isStickydown=true;
});


canvas.addEventListener("mousemove",function(e){
    if(isStickydown===true)
    {

        let finalx=e.clientX;
        let finaly=e.clientY;

        let dx=finalx-initialx
        let dy=finaly-initialy;

        let {top, left} = stickypad.getBoundingClientRect();
        stickypad.style.top = top + dy +"px";
        stickypad.style.left = left + dx +"px";
        initialx=finalx;
        initialy=finaly;
    }
});

window.addEventListener("mouseup",function(){
    isStickydown=false;
})



close.addEventListener("click",function(){
    stickypad.remove();
});

minimize.addEventListener("click",function(){
    if(!isminimized)
    {
        isminimized=true;
    textarea.style.display= "none";
    }
    else
    {
    textarea.style.display= "block";
       isminimized=false;
    }

});





    return textarea;
}


function createsticky()
{
   

    let textarea=createbox();
    let textBox = document.createElement("textarea");
    textBox.setAttribute("class" ,"textarea");
    textarea.appendChild(textBox);
    //document.body.appendChild(stickypad);
    

     

}
// color and size

function changecolor(value){
 
    tool.strokeStyle=value;
}

function pensizeChange(value){
    tool.lineWidth=value;
}

function erasersizeChange(value){
    tool.lineWidth=value;
}


var u=0;
let b=document.querySelector("#hide");
let hider=document.querySelector('.hider');
function hh(){
    
    u++;
    if(u%2==0){
        hider.style.display="none";
    }
  
   
  

    else
    hider.style.display="inline"


}

let scaleactive=null;



let darktheme=false;
let d=0;
let dark=document.querySelector('#darklight');
dark.addEventListener('click',function(){
   
    if(d%2==0)
    {
        tool.fillStyle = "black";
        
        tool.fillRect(0, 0, canvas.width, canvas.height);
        tool.strokeStyle="white";
        darktheme=true;       
    }
    else{
        tool.fillStyle = "white";
        tool.fillRect(0, 0, canvas.width, canvas.height);
        tool.strokeStyle="black";
        darktheme=false;       
    }
 
d++;
});



