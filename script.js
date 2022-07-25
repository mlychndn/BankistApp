'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

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
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
// Elements
const inputUser = document.querySelector('.login__input--user');
const inputPassword = document.querySelector('.login__input--pin');
const loginBtn = document.querySelector('.login__btn');
const sortBtn = document.querySelector('.btn--sort');
const welcome = document.querySelector('.welcome');

const movementContainer = document.querySelector('.movements');
const mainContainer = document.querySelector('.app');
const balanceValue = document.querySelector('.balance__value');
const inSummaryValue = document.querySelector('.summary__value--in');
const outSummaryValue = document.querySelector('.summary__value--out');
const intrestSummary = document.querySelector('.summary__value--interest');
const inputFormTo = document.querySelector('.form__input--to');
const inputFormAmount = document.querySelector('.form__input--amount');
const transferBtn = document.querySelector('.form__btn--transfer');
const closeBtn = document.querySelector('.form__btn--close');
const loanBtn = document.querySelector('.form__btn--loan');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');

const closeInputUser = document.querySelector('.form__input--user');
const closeInputPassword = document.querySelector('.form__input--pin');
const labelDate = document.querySelector('.date');
const labelTimer = document.querySelector('.timer');

let storeValue = {};
let flag = '';
let accountHolderName = '';
let loginFlag = false;

function accountMovements(account) {
  movementContainer.innerHTML = '';
  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  account.movements.forEach((moves, idx) => {
    let moveStatus = moves >= 0 ? 'deposit' : 'withdrawal';

    let movementEl = `<div class="movements__row">
    <div class="movements__type movements__type--${moveStatus}">${
      idx + 1
    } ${moveStatus}</div>
    <div class="movements__date">${account.movementsDates[idx]}</div>
    <div class="movements__value">${moves}€</div>
  </div>`;

    movementContainer.insertAdjacentHTML('afterbegin', movementEl);
  });
}

function totalBankBalance(movement, type) {
  let balance = '';
  if (movement && !type) {
    balance = movement.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    return balance;
  } else if (movement && type === 'in') {
    balance = movement
      .filter(moves => moves > 0)
      .reduce((acc, curr) => acc + curr, 0);
    return balance;
  } else if (movement && type === 'out') {
    balance = movement
      .filter(moves => moves < 0)
      .reduce((acc, curr) => {
        //console.log('acc', acc);
        return Math.abs(acc + curr);
      }, 0);
    //console.log('balance', balance);
    return balance;
  }
}

function totalIntrest(account) {
  let intrest = account.movements
    .filter(move => move > 0)
    .map(bal => (bal * account.interestRate) / 100)
    .filter(bal => bal > 1)
    .reduce((acc, curr) => acc + curr, 0);

  intrestSummary.textContent = `${intrest}€`;
}

//totalIntrest(account1);

// function getUserName(name) {
//   let userName = name.toLowerCase().split(' ');

//   let uName = '';
//   userName.forEach(name => {
//     uName = uName + name[0];
//   });

//   return uName;
// }
// //getUserName(account1.owner);
// function createUserNameAndPassword(accounts) {
//   // console.log(accounts);
//   let userNamePassword = accounts.map(account => {
//     let credential = {};
//     credential.userName = getUserName(account.owner);
//     credential.password = account.pin;

//     return credential;
//   });
//   // console.log('credentials', userNamePassword);
//   return userNamePassword;
// }

function getUserName(accounts) {
  //console.log(accounts[0]);
  accounts.forEach(account => {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}

//accountMovements(account1.movements);
getUserName(accounts);
// accounts.forEach(account => {
//   console.log(account.userName);
// });

function refreshAccount(account) {
  balanceValue.textContent = `${totalBankBalance(account.movements)}€`;
  // let inBalance = totalBankBalance(account.movements, 'in');
  inSummaryValue.textContent = `${totalBankBalance(account.movements, 'in')}€`;
  outSummaryValue.textContent = `${totalBankBalance(
    account.movements,
    'out'
  )}€`;
  totalIntrest(account);
}

loginBtn.addEventListener('click', event => {
  event.preventDefault();
  loginFlag = true;
  let inputUserName = inputUser.value;
  let inputUserPassword = inputPassword.value;

  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const date = `${now.getDate()}`.padStart(2, 0);
  const hour = now.getHours();
  const mins = now.getMinutes();

  labelDate.textContent = `${date}/${month}/${year}  ${hour}:${mins}`;

  accounts.forEach(account => {
    if (
      account.userName === inputUserName &&
      account.pin === inputUserPassword * 1
    ) {
      storeValue = account;
      accountHolderName = inputUserName;
      welcome.textContent = 'Welcome 🙏';
      inputUser.value = '';
      inputPassword.value = '';
      mainContainer.style.opacity = 100;
      accountMovements(account);
      refreshAccount(account);
    }
  });
});

sortBtn.addEventListener('click', () => {
  if (!flag) {
    storeValue.movements = storeValue.movements.sort((a, b) => b - a);
    accountMovements(storeValue);
    flag = 'asc';
  } else if (flag === 'asc') {
    storeValue.movements = storeValue.movements.sort((a, b) => a - b);
    accountMovements(storeValue);
    flag = '';
  }
});

transferBtn.addEventListener('click', event => {
  event.preventDefault();
  let transferTo = inputFormTo.value;
  let transferBalance = inputFormAmount.value * 1;

  console.log('balance', transferBalance);

  let reciverAccount = accounts.find(
    account => account.userName === transferTo
  );

  let debitAccount = accounts.find(
    account => account.userName === accountHolderName
  );

  let balance = totalBankBalance(storeValue.movements);

  if (balance > transferBalance) {
    reciverAccount.movements.push(transferBalance);
    debitAccount.movements.push(transferBalance * -1);
  }
  accountMovements(reciverAccount);
  totalBankBalance(reciverAccount.movements);

  if (accountHolderName === reciverAccount.userName) {
    refreshAccount(reciverAccount);
  }

  accountMovements(debitAccount);
  totalBankBalance(debitAccount.movements);

  if (accountHolderName === debitAccount.userName) {
    refreshAccount(debitAccount);
  }
  inputFormTo.value = '';
  inputFormAmount.value = '';
});

closeBtn.addEventListener('click', event => {
  event.preventDefault();

  let closeInput = closeInputUser.value;
  let closePin = closeInputPassword.value;

  let findAccountHolder = accounts.find(account => {
    return account.userName === closeInput && account.pin === closePin * 1;
  });

  if (findAccountHolder && findAccountHolder.userName === accountHolderName) {
    let deleteIndex = accounts.findIndex(
      account => account.userName === accountHolderName
    );
    accounts.splice(deleteIndex, 1);
    mainContainer.style.opacity = 0;
    //console.log(accounts);
  }
});

loanBtn.addEventListener('click', event => {
  event.preventDefault();

  let bankBalance = storeValue.movements.reduce((acc, curr) => acc + curr);
  let maxCredit = storeValue.movements[0];
  storeValue.movements.forEach(bal => {
    if (bal > maxCredit) {
      maxCredit = bal;
    }
    // return acc;
  }, storeValue.movements[0]);

  if (+inputLoanAmount.value > 0 && +inputLoanAmount.value <= maxCredit * 10) {
    let loanCreditAccount = accounts.find(
      account => account.userName === accountHolderName
    );
    //console.log(loanCreditAccount);
    loanCreditAccount.movements.push(+inputLoanAmount.value);
    storeValue.movements = loanCreditAccount.movements;
    refreshAccount(loanCreditAccount);
    accountMovements(storeValue);
    inputLoanAmount.value = '';
  } else {
    alert('Sorry, you are not eligible for loan');
  }
});

let count = 60;
setInterval(() => {
  if (loginFlag) {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const date = `${now.getDate()}`.padStart(2, 0);
    const hour = now.getHours();
    const mins = now.getMinutes();

    // console.log(`${year} ${month} ${date}`);
    labelDate.textContent = `${date}/${month}/${year}  ${hour}:${mins}`;

    let secondTimer = Number(labelTimer.textContent.split(':')[1]);
    let minTimer = Number(labelTimer.textContent.split(':')[0]);

    count = count - 1;
    count === 0 ? (count = 60) : count;
    if (count === 59) {
      minTimer = minTimer - 1;
    }
    secondTimer = count;
    if (secondTimer === 60) {
      secondTimer = 0;
    }
    minTimer = `${minTimer}`.padStart(2, 0);
    secondTimer = `${secondTimer}`.padStart(2, 0);

    labelTimer.textContent = `${minTimer}:${secondTimer}`;

    if (labelTimer.textContent === '00:00') {
      loginFlag = false;
      mainContainer.style.opacity = 0;
      labelTimer.textContent = '05:00';
      return;
    }
  }
}, 1000);
//////////////////////////////REVISION//////////////////////
// const movRev = account1.movements;
// console.log(movRev);
// let boolResult = movRev.some(mov => mov < 0);
// console.log(boolResult);
// boolResult = movRev.every(mov => mov < 0);
// console.log(boolResult);

// let nestedArray = [[34, 56, 78], 56, [90, 67, [89, 67], 89]];
// console.log(nestedArray.flat(2));

// let accoutKhol = accounts.flatMap(acc => acc.movements);
// console.log('khol', accoutKhol);
// // for flatMap depth goes upto 1

// console.log(0.1 + 0.2 === 0.3);

// Number.parseFloat('3.2es');
