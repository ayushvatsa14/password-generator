let lengthSlider=document.querySelector("[data-lengthSlider]");
let lengthDisplay=document.querySelector("[data-lengthDisplay]");

let passwordDisplay=document.querySelector("[data-passwordDisplay]");

let copyButton=document.querySelector("[data-copyButton]");
let copyPassword=document.querySelector("[data-copyPassword]");

let uppercaseCheck=document.querySelector("#uppercase");
let lowercaseCheck=document.querySelector("#lowercase");

let numbersCheck=document.querySelector("#number");
let symbolsCheck=document.querySelector("#symbol");

let indicator=document.querySelector("[data-indicator]");
let generateButton=document.querySelector("[data-generateButton]");

let allCheckbox=document.querySelectorAll("input[type=checkbox]");

let passwordLength=10;
let checkCount=0;
let symbolString='~!@#$%^&*()[`]{};,./<>?:"';
let password="";
setIndicator("#ccc");

function handleSlider()
{
    lengthSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    let mini=lengthSlider.min;
    let maxi=lengthSlider.max;

    lengthSlider.style.backgroundSize=((passwordLength-mini)*100/(maxi-mini)) + "% 100%";
}

handleSlider();

function getInteger(min,max)
{
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateNumber()
{
    return getInteger(0,9);
}

function setIndicator(color)
{
    indicator.style.backgroundColor=color;
}

function generateUppercase()
{
    return String.fromCharCode(getInteger(65,91));
}

function generateLowercase()
{
    return String.fromCharCode(getInteger(97,123));
}

function generateSymbol()
{
    return symbolString.charAt(getInteger(0,symbolString.length));
}

function handleCheckbox()
{
    checkCount=0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked)
        {
            checkCount++;
        }
    });

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
}

function shufflePassword(passwordArray)
{
    for(let i=1; i<=5; i++)
    {
        randomIndex1=getInteger(0,passwordArray.length);
        randomIndex2=getInteger(0,passwordArray.length);

        let temp=passwordArray[randomIndex1];
        passwordArray[randomIndex1]=passwordArray[randomIndex2];
        passwordArray[randomIndex2]=temp;
    }

    return passwordArray.join("");
}

function calcStrength()
{
    let hasUppercase=false;
    let hasLowercase=false;
    let hasNumber=false;
    let hasSymbol=false;

    if(uppercaseCheck.checked)
    {
        hasUppercase=true;
    }

    if(lowercaseCheck.checked)
    {
        hasLowercase=true;
    }

    if(uppercaseCheck.checked)
    {
        hasNumber=true;
    }

    if(uppercaseCheck.checked)
    {
        hasSymbol=true;
    }

    if(hasUppercase && hasLowercase && (hasNumber || hasSymbol) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if((hasUppercase || hasLowercase) && (hasNumber || hasSymbol) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }
}

async function copyContent()
{
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyPassword.innerText='copied';
    }
    catch(e)
    {
        copyPassword.innerText='failed';
    }

    copyPassword.style.opacity=1;

    setTimeout(() => {
        copyPassword.style.opacity=0;
    }, 2000);
}

lengthSlider.addEventListener('input',(event) => {
    passwordLength=event.target.value;
    handleSlider();
});

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckbox);
});

generateButton.addEventListener('click',() => {
    if(checkCount<=0)
    {
        return;
    }

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
    }

    password='';
    let funArr=[];

    if(uppercaseCheck.checked)
    {
        funArr.push(generateUppercase);
    }

    if(lowercaseCheck.checked)
    {
        funArr.push(generateLowercase);
    }

    if(numbersCheck.checked)
    {
        funArr.push(generateNumber);
    }

    if(symbolsCheck.checked)
    {
        funArr.push(generateSymbol);
    }

    for(let i=0; i<checkCount; i++)
    {
        password=password + funArr[i]();
    }

    for(let i=0; i<passwordLength-funArr.length; i++)
    {
        password=password + funArr[getInteger(0,funArr.length)]();
    }

    password=shufflePassword(Array.from(password));
    passwordDisplay.value=password;
    calcStrength();
});