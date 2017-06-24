/* ******************

 Responses

 ******************* */
var get_response = () => {
    const responses = [
        {
            text: 'kInDlY fOlLoW bAcK pLs',
            image: 'images/spongebob.jpg'
        },
        {
            text: 'But did they ask you to follow them?',
            image: 'images/ooo.png'
        },
        {
            text: 'But did they ask you to follow them?',
            image: 'images/annoyed_child.png'
        }
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = get_response;
