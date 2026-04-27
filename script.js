
let loads = [];

window.onload = function(){
loads=[];
renderTable();
updateSummary();
updateVoltage();
}

function togglePF(){
const type = document.getElementById('loadType').value;
const pf = document.getElementById('pf');

if(type==='R'){
pf.value = 1;
pf.disabled = true;
}else{
pf.disabled = false;
}
}

togglePF();

function updateInputLabel(){

const mode = document.getElementById('mode').value;
const label = document.getElementById('inputLabel');

if(mode==='amp') label.innerText='Current (A)';
if(mode==='kw') label.innerText='Power (kW)';
if(mode==='hp') label.innerText='Horsepower (HP)';
}



function updateVoltage(){

const phase = document.getElementById('phase').value;
const voltage = document.getElementById('voltage');

if(phase==='1'){
voltage.value = 220;
}else{
voltage.value = 380;
}

}

function calculate(){

const phase = document.getElementById('phase').value;
const mode = document.getElementById('mode').value;

const V = parseFloat(document.getElementById('voltage').value)||0;
const input = parseFloat(document.getElementById('inputValue').value)||0;
const pf = parseFloat(document.getElementById('pf').value)||1;
const overloadPercent = parseFloat(document.getElementById('overloadPercent').value)||125;

let amp=0;
let kw=0;
let hp=0;

if(mode==='amp'){
amp=input;

if(phase==='1'){
kw=(V*amp*pf)/1000;
}else{
kw=(1.732*V*amp*pf)/1000;
}

hp=kw*1.341;

}else if(mode==='kw'){

kw=input;
hp=kw*1.341;

if(phase==='1'){
amp=(kw*1000)/(V*pf);
}else{
amp=(kw*1000)/(1.732*V*pf);
}

}else{

hp=input;
kw=hp/1.341;

if(phase==='1'){
amp=(kw*1000)/(V*pf);
}else{
amp=(kw*1000)/(1.732*V*pf);
}

}

const overload = amp*(overloadPercent/100);

let cable='2.5 mm²';

if(overload>20) cable='4 mm²';
if(overload>30) cable='6 mm²';
if(overload>40) cable='10 mm²';
if(overload>60) cable='16 mm²';

document.getElementById('resultAmp').innerText=amp.toFixed(2)+' A';
document.getElementById('resultKw').innerText=kw.toFixed(2)+' kW';
document.getElementById('resultHp').innerText=hp.toFixed(2)+' HP';
document.getElementById('resultOverload').innerText=overload.toFixed(2)+' A';
document.getElementById('resultCable').innerText=cable;

}

function addLoad(){

const amp=parseFloat(document.getElementById('resultAmp').innerText)||0;
const kw=parseFloat(document.getElementById('resultKw').innerText)||0;
const hp=parseFloat(document.getElementById('resultHp').innerText)||0;
const overload=parseFloat(document.getElementById('resultOverload').innerText)||0;
const cable=document.getElementById('resultCable').innerText;

loads.push({amp,kw,hp,overload,cable});

renderTable();
updateSummary();
updateVoltage();
}

function renderTable(){

const table=document.getElementById('loadTable');
table.innerHTML='';

loads.forEach((load,index)=>{

table.innerHTML += `
<tr>
<td>${index+1}</td>
<td>${load.amp.toFixed(2)} A</td>
<td>${load.kw.toFixed(2)} kW</td>
<td>${load.hp.toFixed(2)} HP</td>
<td>${load.overload.toFixed(2)} A</td>
<td>${load.cable}</td>
<td><button class="danger" onclick="deleteLoad(${index})">ลบ</button></td>
</tr>
`;

});

}

function updateSummary(){

let amp=0;
let kw=0;
let hp=0;

loads.forEach(load=>{
amp+=load.amp;
kw+=load.kw;
hp+=load.hp;
});

document.getElementById('sumAmp').innerText=amp.toFixed(2)+' A';
document.getElementById('sumKw').innerText=kw.toFixed(2)+' kW';
document.getElementById('sumHp').innerText=hp.toFixed(2)+' HP';

}

function deleteLoad(index){

loads.splice(index,1);

renderTable();
updateSummary();
updateVoltage();

}

function clearLoads(){

loads=[];

renderTable();
updateSummary();
updateVoltage();

}
