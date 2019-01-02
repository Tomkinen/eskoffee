console.log(`${Date()}\nEskoffee Caffeine Decision Support starting up`);

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv-extended");
const schedule = require("node-schedule");
let store = [];
const maxLimit = 720;
const masterUser = "OFFICE";
let hourCount = 0;

let initialOfficeLevels = new Array(maxLimit).fill(0);
let initialOfficeLevelsLong = new Array(maxLimit).fill(0);
store.push({
  userName: masterUser,
  caffeineLevel: initialOfficeLevels,
  caffeineLong: initialOfficeLevelsLong,
  caffeineMax: 0,
  caffeineLongMax: 0,
  caffeineCurrent: 0,
  caffeineLongCurrent: 0,
  caffeineLevelObject: {},
  caffeineLongObject: {}
});

function calculateCaffeineLevels() {
  console.log(
    `${Date()}\nEskoffee Caffeine Decision Support calculating caffeine levels`
  );
  hourCount++;
  let officeCaffeineLevel = 0;
  store.forEach(function(userData) {
    const currentCaffeineLevel =
      userData.caffeineLevel[userData.caffeineLevel.length - 1];
    let newCaffeineLevel = 0;
    if (currentCaffeineLevel < 0.1) {
      newCaffeineLevel = 0;
    } else {
      newCaffeineLevel =
        Number(currentCaffeineLevel) - Number(currentCaffeineLevel) / 2 / 300;
    }
    userData.caffeineLevel.push(newCaffeineLevel);
    userData.caffeineLevel.shift();
    if (userData.userName !== masterUser) {
      officeCaffeineLevel =
        Number(officeCaffeineLevel) + Number(newCaffeineLevel);
      store[0].caffeineLevel[
        store[0].caffeineLevel.length - 1
      ] = officeCaffeineLevel;
    }
    if (hourCount === 60) {
      userData.caffeineLong.push(newCaffeineLevel);
      userData.caffeineLong.shift();
      if (userData.userName !== masterUser) {
        store[0].caffeineLong[
          store[0].caffeineLong.length - 1
        ] = officeCaffeineLevel;
      }
    }
    userData.caffeineMax = Math.max(...userData.caffeineLevel);
    if (userData.caffeineLongMax < userData.caffeineMax) {
      userData.caffeineLongMax = userData.caffeineMax;
    }
    userData.caffeineCurrent =
      userData.caffeineLevel[userData.caffeineLevel.length - 1];
    userData.caffeineLongCurrent =
      userData.caffeineLong[userData.caffeineLong.length - 1];
    userData.caffeineLevelObject = Object.assign({}, userData.caffeineLevel);
    userData.caffeineLongObject = Object.assign({}, userData.caffeineLong);
  });
  if (hourCount === 60) {
    hourCount = 0;
  }
  console.log(
    `${Date()}\nEskoffee Caffeine Decision Support calculated office caffeine level: ${Number(
      officeCaffeineLevel
    ).toFixed(5)}`
  );
}

schedule.scheduleJob("* * * * *", calculateCaffeineLevels);

const app = express();
const serverHttp = require("http").Server(app);

dotenv.load();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/state", function(req, res) {
  console.log(`${Date()}\nEskoffee Caffeine Decision Support GET /api/state`);
  res.setHeader("Content-Type", "application/json");
  res.send(store);
});

app.post("/api/user/add", function(req, res) {
  console.log(
    `${Date()}\nEskoffee Caffeine Decision Support POST /api/user/add`
  );
  if (
    store.find(store => store.userName === req.body.userName.toUpperCase()) ===
      undefined &&
    store.length < maxLimit &&
    req.body.userName.length < maxLimit
  ) {
    let initialLevels = new Array(maxLimit).fill(0);
    let initialLevelsLong = new Array(maxLimit).fill(0);
    store.push({
      userName: req.body.userName.toUpperCase(),
      caffeineLevel: initialLevels,
      caffeineLong: initialLevelsLong,
      caffeineMax: 0,
      caffeineLongMax: 0,
      caffeineCurrent: 0,
      caffeineLongCurrent: 0,
      caffeineLevelObject: {},
      caffeineLongObject: {}
    });
    store = store
      .filter(e => e.userName === masterUser)
      .concat(
        store
          .filter(e => e.userName !== masterUser)
          .sort((a, b) => a.userName.localeCompare(b.userName))
      );
  }
  res.setHeader("Content-Type", "application/json");
  res.send(store);
});

app.post("/api/user/remove", function(req, res) {
  console.log(
    `${Date()}\nEskoffee Caffeine Decision Support POST /api/user/remove`
  );
  if (req.body.userName !== masterUser) {
    const storeTemp = store.filter(function(obj) {
      return obj.userName !== req.body.userName;
    });
    store = storeTemp;
  }
  res.setHeader("Content-Type", "application/json");
  res.send(store);
});

app.post("/api/drink/add", function(req, res) {
  console.log(
    `${Date()}\nEskoffee Caffeine Decision Support POST /api/drink/add`
  );
  store.filter(function(obj) {
    let caffeineNumber = Number(req.body.caffeine);
    if (
      obj.userName === req.body.userName &&
      req.body.userName !== masterUser &&
      !isNaN(caffeineNumber) &&
      caffeineNumber > 0 &&
      caffeineNumber < maxLimit &&
      obj.caffeineLevel[obj.caffeineLevel.length - 1] < maxLimit
    ) {
      obj.caffeineLevel[obj.caffeineLevel.length - 1] =
        Number(obj.caffeineLevel[obj.caffeineLevel.length - 1]) +
        Number(caffeineNumber);
    }
  });
  let officeCaffeineLevel = 0;
  store.forEach(function(userData) {
    if (userData.userName !== masterUser) {
      officeCaffeineLevel =
        Number(officeCaffeineLevel) +
        Number(userData.caffeineLevel[userData.caffeineLevel.length - 1]);
      store[0].caffeineLevel[
        store[0].caffeineLevel.length - 1
      ] = officeCaffeineLevel;
      store[0].caffeineLevelObject = Object.assign({}, store[0].caffeineLevel);
      store[0].caffeineLongObject = Object.assign({}, store[0].caffeineLong);
    }
  });
  store.forEach(function(userData) {
    userData.caffeineMax = Math.max(...userData.caffeineLevel);
    if (userData.caffeineLongMax < userData.caffeineMax) {
      userData.caffeineLongMax = userData.caffeineMax;
    }
    userData.caffeineCurrent =
      userData.caffeineLevel[userData.caffeineLevel.length - 1];
    userData.caffeineLongCurrent =
      userData.caffeineLong[userData.caffeineLong.length - 1];
    userData.caffeineLevelObject = Object.assign({}, userData.caffeineLevel);
    userData.caffeineLongObject = Object.assign({}, userData.caffeineLong);
  });
  res.setHeader("Content-Type", "application/json");
  res.send(store);
});

app.use("/", express.static(path.join(__dirname, "frontend")));

app.get("/*", (req, res) => {
  res.sendFile("frontend/index.html", { root: path.join(__dirname) });
});

serverHttp.listen(process.env.server_port);

console.log(
  `${Date()}\nEskoffee Caffeine Decision Support started in port: ${process.env
    .server_port}`
);
