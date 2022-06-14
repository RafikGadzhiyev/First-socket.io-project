let socket;
const messageForm = document.querySelector('.content-container__message-form');
const messageField = document.querySelector('.message-form__message-field');
const messagesContainer = document.querySelector('.content-container__messages-container');
const nameFormContainer = document.querySelector('.name-container');
const userNameField = document.querySelector('.name-form__name-field');
const connectButton = document.querySelector('.name-form__connect-button');
const users = JSON.parse(localStorage.getItem('users')) || [];

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    if (messageField && messageField.value) {
        socket.emit('new message', {
            message: messageField.value,
            messageOwner: userNameField.value
        });
        messageField.value = '';
    }
})

connectButton.onclick = (e) => {
    e.preventDefault();
    socket = io();
    socket.auth = {
        name: userNameField.value
    };
    socket.on('connect', () => {
        nameFormContainer.remove();
    })



    socket.on('new message', (data) => {
        messagesContainer.insertAdjacentHTML('beforeend', `
            <div
                class = 'messages-container__message ${data.messageOwner === userNameField.value ? 'you' : ''}'
            >
                ${data.messageOwner !== userNameField.value ?
                `<h3
                    class = 'message__owner'
                >
                    ${data.messageOwner}
                </h3>` : ''
            }
                <div
                    class = 'message__content-container'
                >
                    <span>
                        ${data.message}
                    </span>
                </div>
            </div>
        `)
        messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
    })

    socket.on('connected new user', (name) => {
        users.push(name);
        localStorage.setItem('users', JSON.stringify(Array.from(new Set(users))));
        const alertContainer = document.createElement('div');
        alertContainer.classList.add('alert-container');
        alertContainer.insertAdjacentHTML('beforeend', `
            <span className="alert-container__user-name">${name} has connected!</span>
        `);
        document.body.appendChild(alertContainer);
        setTimeout(() => alertContainer.remove(), 3000);
    })
}
