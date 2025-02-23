const date = new Date
let thaitime = date.toLocaleString("th-TH", { 
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false  // ใช้เวลาแบบ 24 ชั่วโมง
});

//abstract log
class Log {
    getTime() {
        //convert for elastic form
        return new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }).replace(' ','T')+"Z"
    }

    log(target, event) {
        return {
            timestamp,
            event
        }
    }
}

class Authen extends Log {
    log(target, event= "") {
        return {
            timestamp: this.getTime(),
            event,
            user_id: target.user_id,
            provider: target.provider,
            email: target._json.email
        }
    }
}

class API extends Log {
    log(target, event = "") {
        return {
            timestamp: this.getTime(),
            event,
            user_id: target.user_id,
            provider: target.provider,
            email: target._json.email
        }
    }
}

//creator class
class LoggerFactory {
    static createLoger(event) {
        switch (event) {
            case "login" :
                return new Authen();
            case "API" :
                return new API();
            default:
                throw new Error("Invalid event");
        }
    }
}

const loginLog = LoggerFactory.createLoger("login");
const APILog = LoggerFactory.createLoger("API");

module.exports = { loginLog, APILog }