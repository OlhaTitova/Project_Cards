'use strict'

import { createVisit } from './cardsAction.js'
export { checkSession, loginBtn, createVisitBtn }

const loginBtn = document.querySelector('[data-target="#authorizationModal"]')
const createVisitBtn = document.querySelector('[data-target="#formModal"]')
document.addEventListener('DOMContentLoaded', checkSession)

function checkSession() {
    const isAutorizated = localStorage.getItem('autorizated')
    if (isAutorizated) {
        loginBtn.hidden = true
        createVisitBtn.hidden = false
        createVisit()
    } else return false

    return isAutorizated
}
