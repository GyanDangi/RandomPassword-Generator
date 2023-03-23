const inputSlider=document.querySelector('[data-lengthSlider]');
const lengthDisplay=document.querySelector('[data-lengthNumber]');

const passwordDisplay=document.querySelector('[data-passwordDisplay]')
const copyBtn=document.querySelector('[data-copy]');
const copyMsg=document.querySelector('[data-copyMsg]');

const uppercaseCheck=document.querySelector('#uppercase');
const lowercaseCheck=document.querySelector('#lowercase');
const numberCheck =document.querySelector('#numbers');
const symbolCheck= document.querySelector('#symbols');


const indicator=document.querySelector('[data-indicator]');
const generateBtn=document.querySelector('.generateButton');

const allCheckBox=document.querySelectorAll('input[type=checkbox]');

const symbols='!@#$%^&*()_-+={}[]|/?.<,>~:`;"'

// Setting all default things:
let password ="";
let passwordLength=10;
let checkCount=0;
// circle color is white
setIndicator('#ccc')
handleSlider();

// set password length
function handleSlider(){
        inputSlider.value=passwordLength;
        lengthDisplay.innerHTML=passwordLength;
        const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){ 
    indicator.style.backgroundColor=color;
    // shadow 
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max){
  return  Math.floor(Math.random()*(max-min)) +min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}


function generateLowerCase(){
    return  String.fromCharCode(getRandomInteger(97,123));
}


function generateUpperCase(){
    return  String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randNum=getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSymbol=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower &&(hasNum || hasSymbol) && passwordLength>=8){
        setIndicator('#0f0');
    }
    else if((hasUpper || hasLower) && (hasNum || hasSymbol) && passwordLength>=6){
        setIndicator('#ff0');
    }
    else{
        setIndicator('#f00');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText='copied';
    }
    catch(e){
        copyMsg.innerText='failed';
    }
    // to make copy wala span visible
    copyMsg.classList.add('active');

    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 1000);
}


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange () { 
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    })
    // special case
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click',()=>{
    // none of thee checkbox are selected
    if(checkCount ==0) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start
    console.log("lets start the journery");
    // remove old password:
    password="";

    //  let's puts the stuff mentnionded by the checkboxes

    // if(uppercaseCheck.checked){
    //     password +=  generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password +=  generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password +=  generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password +=  generateSymbol();
    // }

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }
    console.log("working")
    // compulsory addition :
    for(let i=0; i<funcArr.length; i++){

        password += funcArr[i]();
    }
    console.log('compulsory done')
    // remaining addition:
    for(let i=0; i<passwordLength -funcArr.length; i++){
        let ranIndex= getRandomInteger(0,funcArr.length);
        password +=funcArr[ranIndex]();
    }

    // shuffle the password:
    password =shufflePassword(Array.from(password));


    // show in UI
    passwordDisplay.value=password;


    // strength ab dhikayege:
    calStrength();
})