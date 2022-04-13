"use strict";

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2021-12-18T13:15:33.035Z",
    "2021-12-19T09:48:16.867Z",
    "2021-12-20T06:04:23.907Z",
    "2021-12-21T14:18:46.235Z",
    "2021-12-22T16:33:06.386Z",
    "2021-12-23T14:43:26.374Z",
    "2021-12-24T18:49:59.371Z",
    "2021-12-25T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
    movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'ja-JP', 
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2021-12-18T13:15:33.035Z",
    "2021-12-19T09:48:16.867Z",
    "2021-12-20T06:04:23.907Z",
    "2021-12-21T14:18:46.235Z",
    "2021-12-22T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "de-DE",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const btnLogout = document.getElementById("btn--logout")

const loginForm = document.getElementById("loginForm")
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// date calculation
const formatDate = function(date,locale) {
  const calcDaysPassed = (date1,date2) => Math.trunc(Math.abs(date2-date1)/(1000*60*60*24))
  const daysPassed = calcDaysPassed(new Date(),date)
  
  if(daysPassed==0) return 'Today'
  if(daysPassed==1) return 'Yesterday'
  if(daysPassed<=7) return `${daysPassed} days ago`
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(locale).format(date)
  
}
// Step1 : movements box:

    // format currency
    const formatCur = function(value,locale,currency){
    return new Intl.NumberFormat(locale,{
      style:'currency',
      currency:currency
    }).format(value)
  }
  // not req const currformatted = formatCur(currentUser.movements,currentUser.locale,currentUser.currency)
  const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  // sorting
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    let type = mov > 0 ? "deposit" : "withdrawal";
  // date:
  const date = new Date(acc.movementsDates[i]);
  const displayDate = formatDate(date,acc.locale)
  const currformatted = formatCur(mov,acc.locale,acc.currency)

    const html = `      <div class="movements__row">
                          <div class="movements__type movements__type--${type}">
                              ${i + 1} ${type}
                         </div>
                         <div class="movements__date">${displayDate}</div>
                        <div class="movements__value">${currformatted}</div>
                      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// This prints elements but in the exact order not in reverse order
// that is latest transaction is displayed at bottom
// const displayMovements = function (movements) {
//   containerMovements.innerHTML = "";
//   movements.forEach((mov, i) => {
//     let element = document.createElement("element");
//     let type = mov > 0 ? "deposit" : "withdrawal";
//     element.innerHTML = `      <div class="movements__row">
//                               <div class="movements__type movements__type--${type}">
//                                   ${i + 1} ${type}
//                              </div>
//                             <div class="movements__value">${mov}</div>
//                           </div>`;
//     // containerMovements.insertAdjacentHTML("afterbegin", html);
//     containerMovements.appendChild(element);
//   });
// };
// displayMovements(account1.movements);

// step 2 : computing usernames

const createUsername = function (acc) {
  acc.forEach((accs) => {
    accs.username = accs.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");

    // return username;
  });
};

createUsername(accounts);


// Step3: Calculating balance
const displayBalance = function (accs) {
  const balance = accs.movements.reduce((acc, val) => acc + val, 0);
  accs.balance = balance;
  labelBalance.textContent = formatCur(accs.balance,accs.locale,accs.currency);
};

// displayBalance(account1.movements);

// step4: Calculating summaries

const displaySummaries = function (accs) {
  const incomes = accs.movements
    .filter((val) => val > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = formatCur(incomes,accs.locale,accs.currency);

  const outcomes = accs.movements
    .filter((val) => val < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCur(Math.abs(outcomes),accs.locale,accs.currency);

  const interest = accs.movements
    .filter((val) => val > 0)
    .map((deposit) => (deposit * accs.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = formatCur(interest,accs.locale,accs.currency);
};

// Update UI:
const updateUI = function (currentUser) {
  containerApp.style.opacity = "100";
  displayMovements(currentUser);
  displayBalance(currentUser);
  displaySummaries(currentUser);
};


let currentUser,timer;
// step5: Login Access
// step12: timer
const logoutTimer = function(){
  let time = 600
  const tick = function(){
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec =String(time%60).padStart(2,0)
    labelTimer.textContent=`${min}:${sec}`
    // time--

    if(time==0) {
      clearInterval(logoutTimer)
      containerApp.style.opacity = 0
      loginForm.style.opacity = 100
      btnLogout.classList.add("hide")
      labelWelcome.textContent = "Log in to get started"
    }

    time--
  }
  // setInterval(,1000) 
  tick();
  timer = setInterval(tick,1000) 

  return timer;
};


btnLogin.addEventListener("click", loginAccess);

function loginAccess(e) {
  e.preventDefault();

  currentUser = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    loginForm.style.opacity = 0
    btnLogout.classList.remove("hide")
    labelWelcome.textContent = `Welcome Back ${
      currentUser.owner.split(" ")[0]
    }`;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }
    labelDate.textContent = new Intl.DateTimeFormat(currentUser.locale,options).format(now)
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();

    if(timer) clearInterval(timer)
    timer = logoutTimer();
    updateUI(currentUser);
  }
}

// logout button functionality
btnLogout.addEventListener("click",function(){
  if(timer) clearInterval(timer)
  containerApp.style.opacity = 0
  labelWelcome.textContent = "Log in to get started"
  loginForm.style.opacity = 100
  btnLogout.classList.add("hide")
})

// Step6: Transfering money
btnTransfer.addEventListener("click", transferMoney);

function transferMoney(e) {
  e.preventDefault();

  // to get amount
  const amount = Number(inputTransferAmount.value);
  let recieverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";
  // checking amount is available
  if (
    amount > 0 &&
    recieverAcc &&
    amount <= currentUser.balance &&
    recieverAcc?.username !== currentUser.username
  ) {
    currentUser.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // add transfer date
    currentUser.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentUser);

    clearInterval(timer)
    timer = logoutTimer();
  }
}

// step 7: closing account

const closeAcc = function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = "0";
    labelWelcome.textContent = "Log in to get started";
  }

  inputCloseUsername.value = inputClosePin.value = "";
};

btnClose.addEventListener("click", closeAcc);

// step 8: Loan

const loan = function (e) {
  e.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some((mov) => mov >= amount * 0.1)) {
    setTimeout(function() {    
      currentUser.movements.push(amount);
      currentUser.movementsDates.push(new Date().toISOString());
      updateUI(currentUser)
      clearInterval(timer)
      timer = logoutTimer();
    },2500)

  }
  inputLoanAmount.value = "";
};

btnLoan.addEventListener("click", loan);

//Step 9:  Sort

let sorted = false;
const sorting = function (e) {
  e.preventDefault();

  displayMovements(currentUser, !sorted);
  sorted = !sorted;
};

btnSort.addEventListener("click", sorting);

