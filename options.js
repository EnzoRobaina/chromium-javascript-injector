const q = (query, expectingSingleResult = false) => {
    const r = document.querySelectorAll(query)
    if (!expectingSingleResult) {
        return r;
    }

    return (r?.length === 1) ? r[0] : r 
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
        const mergedResult = { ...result["__injector"], ...obj }
        chrome.storage.local.set({ "__injector": mergedResult }, callback)
    })
}

const removeFromStorage = (domain, callback = fn) => {
    chrome.storage.local.get({ "__injector": {} }, function(result) {
        const newResult = { ...result["__injector"] }
        delete newResult[domain]

        chrome.storage.local.set({ "__injector": newResult }, callback)
    })
}

const appendNewItem = (data = null) => {
    const template = q('#item', true)
    const scroller = q('#scroller', true)

    const newItem = template.content.cloneNode(true)

    newItem.querySelector('button.remove-me').addEventListener('click', function(e) {
        const parent = e.target.parentElement
        const domain = parent.querySelector('[name="domain"]').value
        if (domain) {
            removeFromStorage(domain, () => {
                parent.remove()
            })
        }
        else {
            parent.remove()
        }
    })

    if (data) {
        newItem.querySelector('[name="domain"]').value = data?.domain
        newItem.querySelector('[name="code"]').value = data?.script
        if (data?.match_sub) {
            newItem.querySelector('[name="match_sub"]').setAttribute('checked', true)
        }
        if (data?.enabled) {
            newItem.querySelector('[name="enabled"]').setAttribute('checked', true)
        }
    }
    scroller.appendChild(newItem)
    scroller.scrollTop = scroller.scrollHeight
}

document.addEventListener('DOMContentLoaded', function(e) {
    const add = q('#add', true)
    const save = q('#save', true)

    save.setAttribute('disabled', true)
    add.setAttribute('disabled', true)

    chrome.storage.local.get({ "__injector": {} }, function(result) {
        if (!Object.keys(result["__injector"])?.length) {
            appendNewItem()
        }
        else {
            Object.entries(result["__injector"]).forEach(entry => {
                appendNewItem({ domain: entry[0], ...entry[1] })
            })
        }

        save.removeAttribute('disabled')
        add.removeAttribute('disabled')
    })

    add.addEventListener('click', function(e) {
        appendNewItem()
    })

    save.addEventListener('click', (e) => {
        const itens = q('div.row.item')
        const savedChangesSpan = q('#saved-changes', true)

        let toSave = {}

        itens.forEach(item => {
            const domain = item.querySelector('[name="domain"]').value

            if (domain) {
                const script = item.querySelector('[name="code"]').value
                const match_sub = item.querySelector('[name="match_sub"]').checked
                const enabled = item.querySelector('[name="enabled"]').checked
    
                const obj = {}
    
                obj[domain] = { script, match_sub, enabled }

                toSave = { ...toSave, ...obj }
            }
        })
        
        save.setAttribute('disabled', true)
        add.setAttribute('disabled', true)

        addToStorage(toSave, () => { 
            save.removeAttribute('disabled')
            add.removeAttribute('disabled')

            savedChangesSpan.style.display = 'block'

            setTimeout(() => {
                savedChangesSpan.style.display = 'none'
            }, 1000)
        })
    })
})