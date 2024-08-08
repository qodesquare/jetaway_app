let rand_generator = (length = 2, textCase = 'u') => {
    let random = (Math.random() + 1).toString(36).substring(length)

    if (textCase == 'l')
        return random.toLowerCase()
    return random.toUpperCase()
}

module.exports = { rand_generator }