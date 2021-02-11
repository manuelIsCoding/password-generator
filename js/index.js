'use strict';


const createTag = (tagName, properties) => {
    const DOMElement = document.createElement(tagName);
    return Object.assign(DOMElement, properties);
}

const generatePassword = (includeUppercase, includeNums, includeSpecialChars, length) => {
    const numbers = '0123456789';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!#$={}[]()@';

    let toUse = lowercase;
    if (includeUppercase === true) toUse += uppercase;
    if (includeNums === true) toUse += numbers;
    if (includeSpecialChars === true) toUse += specialChars;

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * toUse.length);
        result += toUse[randomIndex];
    }
    return result;
}

const listeningCloseNotify = () => {
    const body = document.querySelector('body');
    const notification = document.querySelector('.notification');
    const closeButton = document.querySelector('.close-notify');
    setTimeout(() => {
        body.removeChild(notification);
    }, 5000);
    closeButton.addEventListener('click', () => {
        body.removeChild(notification);
    });
}

const sendNotify = text => {
    if (document.querySelector('.notification') !== null) return null;

    const div = createTag('div', {className: 'notification'});
    const p = createTag('p', {innerHTML: text});
    const divChild = createTag('div', {
        className: 'close-notify',
        innerHTML: '×'});
    div.appendChild(p);
    div.appendChild(divChild);
    document.querySelector('#main-header').before(div);
    listeningCloseNotify();
}

window.addEventListener('load', () => {
    const gpText = document.getElementById('gp-text');
    gpText.addEventListener('click', () => {
        if (gpText.innerHTML.length) {
            const selection = document.createRange();
            selection.selectNodeContents(gpText);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(selection);
            const res = document.execCommand('copy');
            window.getSelection().removeRange(selection);
            sendNotify('Text copied to clipboard!');
        }
    });

    const generateButton = document.getElementById('generate-btn');
    generateButton.addEventListener('click', e => {
        e.preventDefault();
        const parameters = document.querySelectorAll('.parameter');
        const length = parseInt(document.querySelector('#pass-length').value);
        
        let includeUppercase, includeNumbers, includeSpecialChars = false;
        parameters.forEach(parameEl => {
            if (parameEl.checked === true && parameEl.name === 'in-numbers')
                includeNumbers = !includeNumbers;
            if (parameEl.checked === true && parameEl.name === 'in-specialchars')
                includeSpecialChars = !includeSpecialChars;
            if (parameEl.checked === true && parameEl.name == 'in-uppercase')
                includeUppercase = !includeUppercase;
        });
        const generatedPassword = generatePassword(includeUppercase, includeNumbers, includeSpecialChars, length);
        document.querySelector('#gp-text').innerHTML = generatedPassword;
    });
});