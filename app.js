const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 8000;
require("dotenv").config();
const nodeMail = require("nodemailer");
const handlebars = require("express-handlebars");
const hbs = require("hbs")
const { engine } = require('express-handlebars');

const staticPath =path.join(__dirname,'./public')
const templatePath =path.join(__dirname,'./views/pages')
const partialPath=path.join(__dirname,'./views/partials')

app.use(express.static(staticPath));
app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: "main"}));
app.set("view engine","hbs")
// app.engine('handlebars', hbs({defaultLayout: 'main'}));
// app.engine('hbs', hbs.engine({
//   extname: 'hbs',
//   defaultLayout: 'layout',
//   layoutsDir: __dirname + '/views/layout/',
//   partialsDir: __dirname + '/views/partials'
// }))
app.set("views", templatePath)
hbs.registerPartials(partialPath);

// const layoutPath = path.join(__dirname, './views/layouts/main'); 
// app.engine('handlebars', hbs({ layoutsDir: layoutPath }));


app.use(express.json())
app.use(express.urlencoded({ extended: true }));




async function mainMail(name, email, message) {
  const transporter = await nodeMail.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.GMAIL_USER,
    to: process.env.EMAIL,
    html: `You got a message from
            Email : ${email}
            Name: ${name}
            Message: ${message}`,
  };
  try {
    await transporter.sendMail(mailOption);
    return Promise.resolve("Message Sent Successfully!");
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}
app.post("/contact", async (req, res, next) => {
  const {name, email, message} = req.body;
  try {
    await mainMail(name, email, message);
    res.send("Message Successfully Sent!");
  } catch (error) {
    res.send(error);
  }
});

app.get("/",(req,res)=>{
  res.render('home',{
      title:"home",
  })
})
app.get("/contact",(req,res)=>{
  res.render('contact',{
      title:"contact",
  })
})
app.get("/about",(req,res)=>{
  res.render('about',{
      title:"about",
  })
})
app.get("/portfolio",(req,res)=>{
  res.render('portfolio',{
      title:"portfolio",
  })
})
app.get("/team",(req,res)=>{
  res.render('team',{
      title:"team",
  })
})
app.get("/pricing",(req,res)=>{
  res.render('pricing',{
      title:"pricing",
  })
})
app.get("/services",(req,res)=>{
  res.render('services',{
      title:"services",
  })
})

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "/views/pages/home"));
// });

// app.get('/', (req, res) => {
//   //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
//   res.render('main', {layout : 'layout'});
//   });

app.listen(port, () => {
  console.log(`This is running on ${port} `);
});
