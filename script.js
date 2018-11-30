//Array of workDays
let days = [];
let numberOfDays = 0;
let spacing = 35;

//The main method
loadPage();

//The class that represents a day, includes the shift time, tboxes and daily pay
class WorkDay{
  constructor(start, end, tbox_start, tbox_end, pay){
    this.Start = start;
    this.End = end;
    this.Tbox_start = tbox_start;
    this.Tbox_end = tbox_end;
    this.Pay = pay;
  }
}

//Initialize method
function loadPage(){
  var div = document.createElement("div");
  div.setAttribute("id", "div_top");

  //Create a button
  function newBtn(text, onClick, id){
    var btn = document.createElement("button");
    var t = document.createTextNode(text);
    btn.appendChild(t);
    btn.onclick = onClick;
    document.body.appendChild(div);
    btn.setAttribute("id", id);
    div.appendChild(btn);
  }

  //Reset button
  newBtn("Reset", function reset(){ location.reload();}, "btn_reset");

  //New day button
  newBtn("+", btn_addOnClick, "btn_add");

  //Wage selector
  var input_wage = document.createElement("input");
  input_wage.setAttribute("id", "input_wage");
  input_wage.setAttribute("value", 28);
  input_wage.setAttribute("maxlength", "3");
  div.appendChild(input_wage);

  var p_wage = document.createElement("p");
  p_wage.setAttribute("id", "p_wage");
  p_wage.innerHTML = "Wage:";
  div.appendChild(p_wage);

  //Calculate button
  newBtn("Calculate", btn_calculateOnClick, "btn_calculate");
}

//Take shift start time and ending time as input, return wage as output
function calculateWage(arr){

  //Converts the minutes to decimal value, i.e: 16:30 -> 16.5, 16:05 -> 16.08
  function minutesToDecimal(minutes){
    //Divide by 60 in order to make time decimal and remove any periods.
    let decimal = String(minutes / 60).replace(`.`, ``);
    //If the number is bigger than 0.1, remove the zero, i.e: 07 -> 7
    if (decimal >= 0.1)
      decimal = decimal.replace(0, ``);

    return decimal;
  }

  let wage = document.getElementById("input_wage").value;
  let overtime = 8;//After 8 hours of work it is considered overtime, 7 on friday
  let pay = 0;
  let averagePay = 0;
  let weeklyHours = 0;
  let totalHoursWorked = 0;
  let totalOvertimeHours = 0;
  let totalOvertimePay = 0;
  let count = 0;

  for (let day of arr)
  {
    count++;
    //Take the input and make an array out of it, [0] = Hour, [1] = Minutes
    let end = day.End.split(":");
    let start = day.Start.split(":");

    let startMinutes = minutesToDecimal(start[1]);
    let endMinutes = minutesToDecimal(end[1]);
    let shiftStart = Number(start[0] + "." + startMinutes);
    let shiftEnd = Number(end[0] + "." + endMinutes);

    let hoursWorked = shiftEnd - shiftStart;
    totalHoursWorked += hoursWorked;

    let overtimeHours = hoursWorked - overtime;
    let overtimePay = 0;

    //Overtime system
    if (overtimeHours > 0)
    {
      let extraOvertime = 0;
      let extra = false;

      //150% Overtime system - if worked over 10 hours
      if (hoursWorked > 10){
        extra = true;
        extraOvertime = hoursWorked - 10;
        overtimePay += extraOvertime * wage * 1.5;
      }

      totalOvertimeHours += overtimeHours;
      if (extra)
        overtimeHours -= extraOvertime;

      overtimePay += overtimeHours * wage * 1.25;
      totalOvertimePay += overtimePay;

      if (extra)
        overtimeHours += extraOvertime;
    }

    let dailyPay = (hoursWorked - overtimeHours) * wage + overtimePay;
    pay += dailyPay;
    averagePay += dailyPay;
  }

  let msg = `You have worked ${totalHoursWorked.toFixed(1)} hours and earned a total of ${Math.round(pay)} shekels.`;
  msg += `<br>Your average pay is ${(averagePay/count).toFixed(0)} shekels per day.`;

  if (totalOvertimePay > 0)
    msg += `<br>That includes ${totalOvertimeHours.toFixed(1)} hours overtime that yielded ${Math.round(totalOvertimeHours*wage*1.25 - totalOvertimeHours*wage)} extra shekels.`;

  document.getElementById("para").innerHTML = msg;
}

//onClick
// TODO: change style.top/left programatically
function btn_addOnClick(){
  let day = new WorkDay();
  numberOfDays++;
  var div = document.createElement("div");
  div.classList.add("div_day");

  //p
  var p = document.createElement("p");
  p.classList.add("p");
  p.innerHTML = `Day ${numberOfDays}`;
  p.style.top = 73 + numberOfDays * spacing + "px";
  div.appendChild(p);

  for(let i = 0; i < 2; i++){
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    let textValue = "";
    switch (i) {
      case 0:
      input.classList.add("tbox_start");
      day.Tbox_start = input;
      textValue = "09:00";
      break;
      case 1:
      input.classList.add("tbox_end");
      day.Tbox_end = input;
      textValue = "17:00";
      break;
      }
    input.style.top = 90 + numberOfDays * spacing + "px";
    input.setAttribute("value", textValue);
    input.setAttribute("maxlength", "5");
    div.appendChild(input);
  }
  document.body.appendChild(div);
  days.push(day);
}
function btn_calculateOnClick(){
  for (d of days){
    d.Start = d.Tbox_start.value;
    d.End = d.Tbox_end.value;
  }
  calculateWage(days);
}
