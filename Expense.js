const balanceElement = document.getElementById('balance');

const incomeElement = document.getElementById('income');

const expenseElement = document.getElementById('expense');

const descriptionInput = document.getElementById('description');

const amountInput = document.getElementById('amount');

const typeInput = document.getElementById('type');

const addButton = document.getElementById('add-transaction');

const transactionList = document.getElementById('transaction-list');

const allButton = document.getElementById('filter-All');

const incomeButton = document.getElementById('filter-Income');

const expenseButton = document.getElementById('filter-Expense');

let editingTransactionId = null;

let transactions =  JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction() {

    const description = descriptionInput.value;

    const amount = Number(amountInput.value);

    const type = typeInput.value;

    if (description.trim() === ''  || amount <=0 || !Number.isFinite(amount)) {
        alert('please enter a valid description and amount.');
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        date: new Date()
    };


    if(editingTransactionId !== null) {
        const transactionToUpdate = transactions.find(function(item) {
            return item.id === editingTransactionId;
        });

        transactionToUpdate.description = description;
        transactionToUpdate.amount = amount;
        transactionToUpdate.type = type;

    }else {
        transactions.push(transaction);
    };

    localStorage.setItem('transactions', JSON.stringify(transactions));


    editingTransactionId = null;

    updateBalance();
    displayTransaction(transactions);
    console.log(transaction)

    descriptionInput.value = '';
    amountInput.value = '';
    typeInput.value = 'income';

};

addButton.addEventListener('click', function() {
    addTransaction();
});

allButton.addEventListener('click', function() {
    filterTransactions('all');
});

incomeButton.addEventListener('click', function() {
    filterTransactions('income')
});

expenseButton.addEventListener('click', function() {
    filterTransactions('expense')
});

function updateBalance() {
    let totalIncome = 0;

    let totalExpenses = 0;

    transactions.forEach(function(transaction) {
        if(transaction.type === 'income') {
            totalIncome = totalIncome + transaction.amount;
        }

        if(transaction.type === 'expense') {
            totalExpenses += transaction.amount;
        }
    });

    const balance = totalIncome - totalExpenses;


    balanceElement.textContent = `ksh ${balance.toFixed(2)}`;

    incomeElement.textContent = `ksh ${totalIncome.toFixed(2)}`;

    expenseElement.textContent = `ksh ${totalExpenses.toFixed(2)}`;

};

function displayTransaction(list) {
    transactionList.innerHTML = '';

    list.forEach(function(transaction) {
        const listItem = document.createElement('li');
        const transactionDate = new Date(transaction.date);
        const formattedDate = transactionDate.toLocaleDateString();

        const transactionInfo = document.createElement('span');

        const amountElement = document.createElement('span');

        listItem.textContent = `Your: ${transaction.description} is Amount:Ksh ${transaction.amount.toFixed(2)} on: ${formattedDate}`;

        if(transaction.type === 'income') {
            amountElement.classList.add('income');
        } else {
            amountElement.classList.add('expense');
        }

        listItem.appendChild(transactionInfo);
        listItem.appendChild(amountElement);

        if(transaction.type === 'income') {
            listItem.classList.add('income');
        }else {
            listItem.classList.add('expense');
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';


        deleteButton.addEventListener('click', function() {
            transactions = transactions.filter(function(item) {
                return item.id !== transaction.id;
            });

            localStorage.setItem('transactions', JSON.stringify(transactions));

            updateBalance();
            displayTransaction(transactions);
        });

    
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';

        
        editButton.addEventListener('click', function() {
            const transactionToEdit = transactions.find(function(item) {
                return item.id === transaction.id;
            });

            editingTransactionId = transactionToEdit.id;

            descriptionInput.value = transactionToEdit.description;
            amountInput.value = transactionToEdit.amount;
            typeInput.value = transactionToEdit.type;
        });


        listItem.appendChild(deleteButton);
        listItem.appendChild(editButton);

        transactionList.appendChild(listItem);
    });
}

function filterTransactions(type) {
    const filteredTransactions = transactions.filter(function(history) {
        if(type === 'all') {
            return true;
        }

        if (type === 'income') {
            return history.type === 'income';
        }

        if (type === 'expense') {
            return history.type === 'expense'
        }
    });

    displayTransaction(filteredTransactions);
};

updateBalance();
displayTransaction(transactions);