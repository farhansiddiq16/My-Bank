
import { faker } from "@faker-js/faker"
import chalk from "chalk"
import inquirer from "inquirer"

class Customer {
    firstName: string
    lastName: string
    age: number
    gender: string
    mobNumber: number
    accNumber: number

    constructor(
        fName: string,
        lName: string,
        age: number,
        gender: string,
        mob: number,
        acc: number) 
        {
        this.firstName = fName
        this.lastName = lName
        this.age = age
        this.gender = gender
        this.mobNumber = mob
        this.accNumber = acc
    }
}

interface BankAccount {
    accnumber: number,
    balance: number,
}

class Bank {
    customer: Customer[] = []
    account: BankAccount[] = []

    addCustomer(obj: Customer) {
        this.customer.push(obj)
    }
    addaccountNumber(obj: BankAccount) {
        this.account.push(obj)
    }
    transation(accObj: BankAccount) {
        let newAccount = this.account.filter((acc) => acc.accnumber !== accObj.accnumber)
        this.account = [...newAccount, accObj]
    }
}

let myBank = new Bank()

for (let i: number = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male")
    let lName = faker.person.lastName()
    let num = parseInt(faker.phone.number())
    let cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i)
    myBank.addCustomer(cus)
    myBank.addaccountNumber({ accnumber: cus.accNumber, balance: 1000 * i })
}

async function bankServise(myBank: Bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Select any one Service",
            choices: ["Veiw Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        })

        if (service.select === "Veiw Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Pleace enter your Account Number"
            })

            let account = myBank.account.find((acc) => acc.accnumber == res.number)
            if (!account) {
                console.log(chalk.red.bold.italic("Invaild account number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accnumber)
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} Your account balance is $${chalk.gray(account.balance)}`);
            }
        }

        if (service.select === "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Pleace enter your Account Number"
            })
            let account = myBank.account.find((acc) => acc.accnumber == res.number)
            if (!account) {
                console.log(chalk.red.bold.italic("Invaild account number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Pleace enter your Amount"
                })
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Balance is not available"));

                }
                let newBalnce = account.balance - ans.rupee
                myBank.transation({ accnumber: account.accnumber, balance: newBalnce })
                console.log("Your remaning Balance is", newBalnce);

            }
        }
        if (service.select === "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Pleace enter your Account Number"
            })
            let account = myBank.account.find((acc) => acc.accnumber == res.number)
            if (!account) {
                console.log(chalk.red.bold.italic("Invaild account number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Pleace enter your Amount"
                })
                let newBalnce = account.balance + ans.rupee
                myBank.transation({ accnumber: account.accnumber, balance: newBalnce })
                console.log("Your Balance is", newBalnce);
            }
        }
        if (service.select === "Exit") {
            process.exit()
        }

    } while (true);
}

bankServise(myBank)


