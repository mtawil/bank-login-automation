// ==UserScript==
// @name         Alinma Login Automation
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @author       Mohammad ALTAWEEL (@mtawil7)
// @match        https://online.alinma.com/ibweb/public/login.jsf*
// ==/UserScript==

(() => {
    'use strict'

    var handleId = 'alinmabank'

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

    var step1 = document.querySelector('#loginForm\\:userIdInput')
    var step2 = document.querySelector('#loginForm\\:loginBttn')
    var step3 = document.querySelector('#loginForm\\:userPasswordInput')
    var step4 = document.querySelector('#mobileTokenform\\:textInput')

    if (step1) {
        step1.type = 'password'
        step1.value = username
        document.querySelector('#loginForm\\:loginBttn_submit').click()

    } else if (step2 && !step3) {
        step2.click()

    } else if (step3) {
        step3.value = password
        document.querySelector('#loginForm\\:authenticationOptions_radioGroup\\:0').click()
        step2.click()

    } else if (step4) {
        fetch('http://127.1:3000/token?handle_id='+handleId)
            .then((response) => response.text())
            .then((token) => {
                if (/^\d+$/.test(token)) {
                    step4.value = token
                    document.querySelector('#mobileTokenform\\:inputSubmit_submit').click()
                }
            })
    }
})()