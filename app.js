var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var mongoose = require('mongoose');
var dbConnection = require('./src/database/connection');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registrationRouter = require('./routes/register');

const uploadSprintRouter = require('./routes/upload-artifacts');
const tempUploadArtifactRouter = require('./routes/upload.artifact');
const downlaodArtifactRouter = require('./routes/download.artifact');
const getArtifactsRouter = require('./routes/get.artifacts');

const addProjectRouter = require('./routes/add-project');
const getProjectDetailsRouter = require('./routes/get-project-detail');
const addMemberRouter = require('./routes/add-members');
const getSprintRouter = require('./routes/get-sprint');
const removeRouter = require('./routes/remove');
const modifyDocRouter = require('./routes/modify-doc');
const updateSprintRouter = require('./routes/update-sprint');
const getProjectsRouter = require('./routes/get-projects');

const addSprint = require('./routes/add-sprint');
const testUploadSprint = require('./routes/test');

var app = express();
app.use(cors());
var originsWhitelist = [
  'http://localhost:4200'
];

var corsOptions = {
  origin: function (origin, callback) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
}

// app.use(cors(corsOptions));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registrationRouter);
//app.use('/upload', uploadArtifactRouter);
app.use('/add-project', addProjectRouter);


// app.use('/upload-artifacts', uploadArtifactRouter);
app.use('/upload-sprint', uploadSprintRouter);
app.use('/upload-artifact', tempUploadArtifactRouter);
app.use('/download-artifact', downlaodArtifactRouter);
app.use('/get-artifacts', getArtifactsRouter);
app.use('/sprint-test', testUploadSprint);

app.use('/sprints', addSprint); 

app.use('/project', getProjectDetailsRouter);
app.use('/members/api', addMemberRouter);
app.use('/remove', removeRouter);

app.use('/modify', modifyDocRouter);
app.use('/sprint', getSprintRouter);
app.use('/update-sprint', updateSprintRouter);
app.use('/get-project', getProjectsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;


