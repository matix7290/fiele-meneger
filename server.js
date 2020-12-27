//zmienne, stałe

var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000
var path = require("path")
var bodyParser = require("body-parser")
var formidable = require('formidable')
var hbs = require('express-handlebars')
const { isArray } = require("util")
let files_info = { file: [] }
var ids = 1
var context = files_info
var context_info = null

app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: "views/partials",
}))

app.set('view engine', 'hbs')
app.get("/style", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/css/style.css"))
})

app.get("/icons", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/css/css-file-icons.css"))
})

app.get("/uploadedfiles/:name", function (req, res) {
    const options = { root: path.join(__dirname + "/static/upload") }
    const fileName = req.params.name
    res.sendFile(fileName, options)
})

app.get("/", function (req, res) {
    res.redirect("/upload")
    context_info = null
})

app.get("/upload", function (req, res) {
    res.render('upload.hbs')
    context_info = null
})

app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', context)
    context_info = null
})

app.get("/info", function (req, res) {
    res.render('info.hbs', context_info)
})

app.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'
    form.keepExtensions = true
    form.multiples = true
    form.parse(req, function (err, fields, files) {
        res.redirect("/filemanager")
        for (let i = 0; i < form.openedFiles.length; i++) {
            files_info.file.push({ id: ids, icon: form.openedFiles[i].name.substr(form.openedFiles[i].name.lastIndexOf(".") + 1), name: form.openedFiles[i].name, size: form.openedFiles[i].size, type: form.openedFiles[i].type, real_name: form.openedFiles[i].path.substr(form.openedFiles[i].path.lastIndexOf("/")), path: form.openedFiles[i].path, savedate: Date.now() })
            ids++
        }
    })
})

app.get("/delall", function (req, res) {
    files_info.file = []
    ids = 1
    res.redirect("/filemanager")
})

app.get("/delthis/:name", function (req, res) {
    const index = req.params.name
    for (let i = 0; i < files_info.file.length; i++) {
        if(files_info.file[i].id == index) {
            files_info.file.splice(i, 1)
        }
    }
    res.redirect("/filemanager")
})

app.get("/info/:name", function (req, res) {
    const index = req.params.name
    for (let i = 0; i < files_info.file.length; i++) {
        if(files_info.file[i].id == index) {
            context_info = files_info.file[i]
        }
    }
    res.redirect("/info")
})

//nasłuch na określonym porcie

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})