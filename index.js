const ActiveDirectory = require("activedirectory2");
const nodemailer = require("nodemailer");
const moment = require("moment");
const hbs = require("nodemailer-express-handlebars");
const handlebars = require("handlebars");
const cron = require("node-cron");

const config = require("./config");

process.env.TZ = config.timezone;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

handlebars.registerHelper("inc", function(index) {
    index++;
    return index;
});

function getUsers() {
    return new Promise((resolve, reject) => {
        var adConfig = {
            url: config.adUrl,
            baseDN: config.baseDN,
            username: config.username,
            password: config.password,
            attributes: {
                user: [
                    "sAMAccountName",
                    "description",
                    "mail",
                    "dn",
                    "name",
                    "employeeNumber",
                    "title",
                ],
                group: [],
            },
        };
        let branches = config.branches;
        var ad = new ActiveDirectory(adConfig);
        let query = `cn=*`;
        ad.findUsers(query, false, function(err, users) {
            if (err) {
                reject(err);
            }
            //if ((!users) || (users.length == 0)) console.log('No users found.')
            users.forEach((user) => {
                for (branch in branches) {
                    if (
                        user.dn == `CN=${user.name},OU=Users,OU=${branch},${config.baseDN}`
                    ) {
                        branches[branch].data.push(user);
                    }
                }
            });
            resolve(branches);
        });
    });
}

async function sendMail(to, branchName, data) {
    ``;
    moment.locale("ru");
    let currentDateTime = moment().format("LLLL");
    let transporter = nodemailer.createTransport({
        pool: true,
        maxConnctions: 1,
        maxMessages: 1,
        rateDelta: 3000,
        rateLimit: 1,

        host: config.mailServer,
        port: 465,
        secure: false,
        auth: {
            user: config.username,
            pass: config.password,
        },
    });
    let hbsOptions = {
        viewEngine: {
            extname: ".hbs",
            viewPath: __dirname + "/view/email/",
            layoutsDir: __dirname + "/view/email",
            defaultLayout: "layout",
            partialsDir: __dirname + "/view/email/partials/",
        },
        viewPath: __dirname + "/view/email",
        extName: ".hbs",
    };
    transporter.use("compile", hbs(hbsOptions));
    try {
        let mailOptions;
        if (config.mode == "development") {
            mailOptions = {
                from: `${config.fromName} <${config.username}>`,
                to: config.dev.to,
                subject: `✔ Список пользователей объекта - ${branchName}, кол-во пользователей: ${data.length}`, // Subject line
                template: "users",
                context: { data, branchName, currentDateTime },
            };
        } else if (config.mode == "production") {
            mailOptions = {
                from: `${config.fromName} <${config.username}>`, // sender address
                to, // list of receivers,
                cc: config.cc,
                subject: `✔ Список пользователей объекта - ${branchName}, кол-во пользователей: ${data.length}`, // Subject line
                template: "users",
                context: { data, branchName, currentDateTime },
            };
        }
        await transporter.sendMail(mailOptions, function(err, res) {
            if (err) console.log(err);
        });
    } catch (err) {
        console.log(err);
    }
}

cron.schedule(config.cronJob, function() {
    getUsers()
        .then((d) => {
            let branches = config.branches;
            for (branch in branches) {
                sendMail(
                    branches[branch].notificationEmail,
                    branches[branch].description,
                    branches[branch].data
                );
                branches[branch].data = []; // clear branch data, bug fix
            }
        })
        .catch((err) => console.log(err));
});