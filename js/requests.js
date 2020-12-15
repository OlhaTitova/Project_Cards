const user = {
    email: 'example@gmail.com',
    password: 'password',
}

async function test() {
    const resonse = await fetch('https://ajax.test-danit.com/api/cards/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    console.log(resonse)
    const data = await resonse.text()
    console.log(data)
}
test()
