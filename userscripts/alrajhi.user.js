// ==UserScript==
// @name         AlRajhi Login Automation
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @author       Mohammad ALTAWEEL (@mtawil7)
// @match        https://www.almubasher.com.sa/portal/auth/*
// ==/UserScript==

(() => {
    'use strict'

    var handleId = 'alrajhibank'

    var username = localStorage.getItem('username')
    var password = localStorage.getItem('password')

    if (!username) {
        username = prompt('Please type your bank username (just for the first time)')
        localStorage.setItem('username', username)
    }

    if (!password) {
        password = prompt('Please type your bank password (it will be saved into your localStorage)')
        localStorage.setItem('password', password)
    }

    var step1 = document.querySelector('input#username')
    var step2 = document.querySelector('input#otp')

    if (step1) {
        step1.type = 'password'
        step1.value = username

        document.querySelector('input#password').value = password
        setTimeout(() => {
            document.querySelector('a#confirm').click()
        }, 1000)

    } else if (step2) {
        fetch('http://127.1:3000/token?handle_id='+handleId)
            .then((response) => response.text())
            .then((token) => {
                if (/^\d+$/.test(token)) {
                    step2.value = token
                    document.otp.submit()
                }
            })
    }
})()