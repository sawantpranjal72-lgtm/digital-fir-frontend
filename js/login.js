const modal=document.getElementById("loginModal");
const btn=document.getElementById("loginBtn");
const close=document.querySelector(".close");

if(btn){
btn.onclick=function(){
modal.style.display="flex";
}
}

if(close){
close.onclick=function(){
modal.style.display="none";
}
}

window.addEventListener("click",function(e){
if(e.target==modal){
modal.style.display="none";
}
});


const togglePassword=document.getElementById("togglePassword");
const password=document.getElementById("password");

if(togglePassword){
togglePassword.onclick=function(){
password.type=password.type==="password"?"text":"password";
}
}


let captcha;

function generateCaptcha(){

const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

captcha="";

for(let i=0;i<6;i++){
captcha+=chars.charAt(Math.floor(Math.random()*chars.length));
}

document.getElementById("captchaText").innerText=captcha;

}

generateCaptcha();


const forgotModal=document.getElementById("forgotModal");
const forgotLink=document.getElementById("forgotLink");
const closeForgot=document.querySelector(".closeForgot");

if(forgotLink){
forgotLink.onclick=function(e){
e.preventDefault();
forgotModal.style.display="flex";
}
}

if(closeForgot){
closeForgot.onclick=function(){
forgotModal.style.display="none";
}
}


document.getElementById("loginForm").addEventListener("submit",function(e){

e.preventDefault();

const email=document.getElementById("email").value;
const passwordVal=document.getElementById("password").value;
const captchaInput=document.getElementById("captchaInput").value;

if(captchaInput!==captcha){
alert("Invalid captcha");
generateCaptcha();
return;
}

fetch("http://localhost:8080/api/auth/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email:email,
password:passwordVal
})

})

.then(res=>res.json())

.then(data=>{

if(!data.token){
alert("Login failed");
return;
}

localStorage.setItem("token",data.token);
localStorage.setItem("role",data.role);

if(data.role==="ROLE_ADMIN"){
window.location.href="admin.html";
}

else if(data.role==="ROLE_POLICE"){
window.location.href="police-dashboard.html";
}

else{
window.location.href="dashboard.html";
}

});

});