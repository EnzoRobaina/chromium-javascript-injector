const q = (query) => {
    return document.querySelectorAll(query)
}

const c = (tag, options = {}) => {
    const r = document.createElement(tag)
    if (!r) { return null }

    if (options != null) {
        Object.entries(options).forEach((entry, i) => {
            r.setAttribute(entry[0], entry[1])
        })
    }

    return r
}

const removeProtocol = (url) => {
    return url.replace(/(^\w+:|^)\/\//, '');
}

const fn = () => {}

const addToStorage = (obj, callback = fn) => {
    chrome.storage.local.get({ "__injector": {} }, function(result) {
        const mergedResult = {...result["__injector"], ...obj}
        chrome.storage.local.set({ "__injector": mergedResult }, callback)
    })
}

document.addEventListener('DOMContentLoaded', function(e) {
    document.body.style.background = 'red'

    const save = q('#save')[0]
    save.addEventListener('click', (e) => {
        console.log('clicked')
        const itens = q('div.row.item')
        itens.forEach(item => {
            const domain = item.querySelector('input[type="text"]').value
            const script = item.querySelector('textarea').value
            const enabled = item.querySelector('input[type="checkbox"]').checked

            const obj = {}

            obj[domain] = { script, enabled }

            addToStorage(obj, () => { 
                save.style.background = 'black'
                setTimeout(() => {
                    save.style.background = 'green'
                }, 1000)
            })
        })        
    })
})