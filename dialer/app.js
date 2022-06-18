let callActive =0;
let communication =[];
let dialpadBtnContainer = document.getElementById('dialpad-btn-container');
sendMessege('Dialer Live');

window.onbeforeunload = (event) => {
    if(callActive){
      return "Call is Active. Are you sure you want to close?";
      // return 
    }
    else {
      sendMessege('closed dialer');
      return null;
    }    
};



let arr =[
    {title:"1",subtitle:"_"},
    {title:"2",subtitle:"ABC"},
    {title:"3",subtitle:"DEF"},
    {title:"4",subtitle:"GHI"},
    {title:"5",subtitle:"JKL"},
    {title:"6",subtitle:"MNO"},
    {title:"7",subtitle:"PQRS"},
    {title:"8",subtitle:"TUV"},
    {title:"9",subtitle:"WXYZ"},
    {title:"*",subtitle:"-"},
    {title:"0",subtitle:"+"},
    {title:"#",subtitle:"-"},
];




/// DIALPAD LOGIC
let cursorLocation=0;
let ind=-1;

// ADDED BUTTON TO DIAL PAD
arr.forEach(item => {
    ind++;
    dialpadBtnContainer.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn flexCol centerRow centerCol" id="dialpad${ind}">
            <p class="title-text removeDefaultPara fontColor">${item.title}</p>
            <p class="subline-text removeDefaultPara fontColor">${item.subtitle}</p>
        </div>
    </div>`;
});

ind=-1;

// ADDED EVENT LISTENERS TO DIALPAD
setTimeout(()=>{
arr.forEach(item => {
   ind++;
    let current = document.getElementById("dialpad"+ind);
    current.onclick = function () {
        sendMessege(`typed ${item.title}`);
        let dialpadInput = document.getElementById('dialpad-input');
        let val = dialpadInput.value;
        dialpadInput.selectionStart = cursorLocation;
        dialpadInput.value = val.slice(0, cursorLocation) + item.title + val.slice(cursorLocation,val.length);
        cursorLocation++;
        handleFocus(dialpadInput.value.slice(0,cursorLocation));


    }


});
},500);




// ADDING CALL BUTTON TO DIALPAD
dialpadBtnContainer.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn dialpad-btn-empty flexCol centerRow centerCol">
            <p class="title-text removeDefaultPara fontColor"></p>
            <p class="subline-text removeDefaultPara fontColor"></p>
        </div>
    </div>`;

dialpadBtnContainer.innerHTML += 
    `<div class="dialbtn-wrapper">
        <div class="dialpad-btn-caller flexCol centerRow centerCol" id="dialpad-caller-btn">
            <img class='dialpad-btn-caller-icon' src="/dialer/images/phone.png"/>
        </div>
    </div>`;



// DIALPAD INPUT FOCUS HANDELING  
document.getElementById('dialpad-input').addEventListener('click',function(event){
    let dialpadInput = document.getElementById('dialpad-input');
    cursorLocation = dialpadInput.selectionStart;
})

// DIALPAD 
document.getElementById('dialpad-input-btn-backspace').addEventListener('click',function (event){
    sendMessege('clicked backspace');
    event.preventDefault();
    if(cursorLocation<=0)
        return;
    let dialpadInput = document.getElementById('dialpad-input');
    let val = dialpadInput.value;
    dialpadInput.selectionStart = cursorLocation;
    let begin = val.slice(0,cursorLocation-1);
    let end = val.slice(cursorLocation,val.length);
    dialpadInput.value = begin + end;
    if(cursorLocation>0)
        cursorLocation--;
    handleFocus(dialpadInput.value.slice(0,cursorLocation));
});


function handleFocus(str){
    let focusWidth = getWidthOfText(str,'Courier New',"25px");
    console.log(focusWidth);
    let dialpadInput = document.getElementById('dialpad-input');
    dialpadInput.scrollLeft = focusWidth;
}

function getWidthOfText(txt, fontname, fontsize){
    if(getWidthOfText.c === undefined){
        getWidthOfText.c=document.createElement('canvas');
        getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
    }
    var fontspec = fontsize + ' ' + fontname;
    if(getWidthOfText.ctx.font !== fontspec)
        getWidthOfText.ctx.font = fontspec;
    return getWidthOfText.ctx.measureText(txt).width;
}

document.getElementById("dialpad-caller-btn").addEventListener('click',handleCallButtonTheme);

function handleCallButtonTheme(){
    let btn = document.getElementById("dialpad-caller-btn");
    callActive = (callActive+1)%2;
    if(callActive){
        sendMessege(`calling ${document.getElementById('dialpad-input').value}`)
        btn.style.backgroundColor='#BA0001';
    }
    else{ 
        sendMessege('ended');
        btn.style.backgroundColor='#49B568';
    }

}




///////////////////communication login



function sendMessege(messege){
  console.log('Dialer:'+messege);
  window.opener.recieveMessege(messege);
  communication.push("Parent#"+messege);
  document.getElementById('messeges').innerHTML+=`Dialer: ${messege} </br>`;
}

function recieveMessege(messege){
  console.log('Dialer:'+ messege);
  communication.push("Dialer#"+messege);
  document.getElementById('messeges').innerHTML+=`Parent: ${messege} </br>`;
  
}


document.getElementById('send-messege').addEventListener('click',()=>{
  sendMessege(document.getElementById('messege-area').value);
  document.getElementById('messege-area').value='';
})