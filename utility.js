

const escapeQuotes = (inputString) => {
    if (typeof inputString !== 'string') {
        return inputString;
    }
    return inputString.replace(/['"]/g, match => match + match);
}

module.exports = {
    escapeQuotes
}