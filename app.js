const chatPath = '/Users/'+process.env.USER+'/Library/Messages/chat.db'

const db = new require('better-sqlite3')(chatPath)
const moment = require('moment-range').extendMoment(require('moment'))
const express = require('express')
const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})

app.get('/token', (req, res) => {
    var startDate = moment(), token, lastRecord

    while (true) {
    	// throw an exception if we didn't get any token message in 3m
        if (!req.query.handle_id || moment.range(startDate, moment()).diff() > 180000) {
            throw new Error('Didn\'t hear anything from your bank')
        }

        /*
         * This is the SQL query that getting the last token message.
         *
         * If you wondering what is this number (978307200), Apple messages
         * are using Core Data timestamp for their sms records:
         * https://www.epochconverter.com/coredata
         *
         * And I added 10 seconds more to fix the internet slowness issues.
         */
        lastRecord = db.prepare(' \
            SELECT text \
            FROM message \
            JOIN handle ON message.handle_id = handle.ROWID \
            WHERE handle.id = ? \
                AND (date / 1000000000 + 978307200 + 10) > ? \
            ORDER BY message.ROWID DESC \
        ').get(req.query.handle_id, startDate.unix())

        if (lastRecord) {
            token = lastRecord.text
            token = token.replace(/[^\d]/g, '').trim()
            return res.send(token)
        }
    }
})

app.listen(3000)
