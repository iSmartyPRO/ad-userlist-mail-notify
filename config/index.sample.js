module.exports = {
    adUrl: "ldap://dc1.example.com",
    baseDN: "OU=Account,DC=example,DC=com",
    username: "aduselist@example.com",
    fromName: "Example Users",
    password: "Parol",
    mailServer: "exchange.example.com",
    branches: {
        'CO': {
            ouName: "CO",
            description: "Центральный офис",
            data: [],
            notificationEmail: "co@example.com"
        },
        'Branch1': {
            ouName: "Branch1",
            description: "Объект №1",
            data: [],
            notificationEmail: "branch1@example.com"

        },
        'Branch2': {
            ouName: "Branch2",
            description: "Объект №2",
            data: [],
            notificationEmail: "branch1@example.com"
        }
    },
    cc: ['co@example.com', 'admins@example.com'],
    mode: "production",
    dev: {
        to: 'admins@example.com'
    },
    timezone: "Europe/Moscow",
    cronJob: "00 11 * * 5", // every Friday at 11:00
    //cronJob: "*/1 * * * *", // every minute for test purposes
    //cronJob: "*/20 * * * * *", // every 20 seconds
}