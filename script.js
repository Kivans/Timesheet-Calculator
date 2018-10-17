//Converts the minutes to decimal value, i.e: 16:30 -> 16.5, 16:05 -> 16.08
function minutesToDecimal(minutes)
{
  //Divide by 60 in order to make time decimal and remove any periods.
  let decimal = String(minutes / 60).replace(`.`, ``);
  //If the number is bigger than 0.1, remove the zero, i.e: 07 -> 7
  if (decimal >= 0.1)
    decimal = decimal.replace(0, ``);

  return decimal;
}

//Take shift start time and ending time as input, return wage as output
function calculateWage(arr, month)
{
  let wage = 32;
  let overtime = 8;//After 8 hours of work it is considered overtime, 7 on friday
  let pay = 0;
  let averagePay = 0;
  let weeklyHours = 0;
  let weeklyHoursLimit = 42;
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

    let hoursWorked = shiftEnd - shiftStart - 0.5;//deduct 0.5 for lunch break
    totalHoursWorked += hoursWorked;
    weeklyHours += hoursWorked;

    if (day.DayOfWeek == "Friday"){
      overtime = 7;
    }
    else {
      overtime = 8;
    }

    let overtimeHours = hoursWorked - overtime;
    let overtimePay = 0;



    if (weeklyHours > weeklyHoursLimit){
      overtimeHours = weeklyHours - weeklyHoursLimit;
    }

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
    //Deduct 30 minutes for a lunch break & overtime

    let dailyPay = (hoursWorked - overtimeHours) * wage + overtimePay;
    pay += dailyPay;
    averagePay += dailyPay;

    //End of week / Friday
    if (day.DayOfWeek == "Friday"){
      weeklyHours = 0;
    }

    if (overtimeHours > 0)
      console.log(`On ${month} ${day.DayOfMonth} you have worked ${hoursWorked.toFixed(2)} hours, ${overtimeHours.toFixed(2)} of them overtime.`);
    else {
      console.log(`On ${month} ${day.DayOfMonth} you have worked ${hoursWorked.toFixed(2)} hours.`);
      }

  }
  let msg = `You have worked ${totalHoursWorked.toFixed(1)} hours and earned a total of ${Math.round(pay)} shekels.`;
  msg += `<br>Your average pay is ${(averagePay/count).toFixed(0)} shekels per day.`;
  if (totalOvertimePay > 0)
    msg += `<br>That includes ${totalOvertimeHours.toFixed(1)} hours overtime that yielded ${Math.round(totalOvertimeHours*wage*1.25 - totalOvertimeHours*wage)} extra shekels.`;
  return msg;
}

function WorkDay(start, end, dayOfMonth, dayOfWeek)
{
  this.Start = start;
  this.End = end;
  this.DayOfWeek = dayOfWeek;
  this.DayOfMonth = dayOfMonth;
}

//October hours
let day1 = new WorkDay("06:45", "16:15", 13);
let day2 = new WorkDay("06:00", "15:30", 14, "Friday");
let day3 = new WorkDay("11:55", "20:45", 16);
let day4 = new WorkDay("07:00", "16:10", 17);
let day5 = new WorkDay("05:50", "15:30", 18);
let day6 = new WorkDay("06:45", "16:05", 20);
let day7 = new WorkDay("05:50", "16:20", 21 , "Friday");
let day8 = new WorkDay("07:45", "15:30", 23);
let day9 = new WorkDay("11:00", "21:09", 25);
let day10 = new WorkDay("06:50", "16:00", 26);
let day11 = new WorkDay("11:00", "21:11", 27);
let day12 = new WorkDay("05:56", "15:35", 28 ,"Friday");
let day13 = new WorkDay("06:40", "15:55", 30);

//Generates an array with all the created days
let days = [day1, day2, day3, day4, day5, day6, day7, day8, day9, day10, day11, day12, day13];
/*let days = [];
function pushDays(){
  for (let i = 0; i< 4; i++){
    days.push(new WorkDay("06:50", "15:05", "Sunday"));
    days.push(new WorkDay("06:50", "15:05", "Monday"));
    days.push(new WorkDay("06:50", "15:05", "Tuesday"));
    days.push(new WorkDay("06:50", "15:05", "Wednesday"));
    days.push(new WorkDay("06:50", "15:05", "Thursday"));
    days.push(new WorkDay("05:59", "15:27", "Friday"));
  }

pushDays();*/
document.getElementById("javascript").innerHTML =
calculateWage(days, "September");
