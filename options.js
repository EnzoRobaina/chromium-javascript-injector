const $ = (query, expectingSingleResult = false) => {
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

const addToStorage = (objList, callback = fn) => {
    if (!objList) { return }

    chrome.storage.local.get({ "__injector": [] }, function(result) {
        const urls = objList.map(obj => obj.url)

        let clonedResult = [ ...result["__injector"] ]
        clonedResult = clonedResult.filter(r => {
            return !new Boolean(urls[r.url])
        })

        const mergedResult = [ ...clonedResult, ...objList ]

        chrome.storage.local.set({ "__injector": mergedResult }, callback)
    })
}

const removeFromStorage = (url, callback = fn) => {
    chrome.storage.local.get({ "__injector": {} }, function(result) {
        let newResult = [ ...result["__injector"] ]

        let indexOf = -1

        for (let i = 0; i < newResult.length; i++) {
            const r = newResult[i]
            if (r?.url === url) {
                indexOf = i;
            }
        }

        if (indexOf >= 0) {
            newResult.splice(indexOf, 1)
        }

        chrome.storage.local.set({ "__injector": newResult }, callback)
    })
}

const appendNewItem = (data = null) => {
    const template = $('#item', true)
    const scroller = $('#scroller', true)

    const newItem = template.content.cloneNode(true)

    newItem.querySelector('button.remove-me').addEventListener('click', function(e) {
        const parent = e.target.parentElement
        const url = parent.querySelector('[name="url"]').value
        if (url) {
            removeFromStorage(url, () => {
                parent.remove()
            })
        }
        else {
            parent.remove()
        }
    })

    if (data) {
        newItem.querySelector('[name="url"]').value = data?.url
        newItem.querySelector('[name="code"]').value = data?.code
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
    const add = $('#add', true)
    const save = $('#save', true)

    save.setAttribute('disabled', true)
    add.setAttribute('disabled', true)

    chrome.storage.local.get({ "__injector": [] }, function(result) {
        if (result["__injector"].length === 0) {
            appendNewItem()
        }
        else {
            result["__injector"].forEach(entry => {
                appendNewItem(entry)
            })
        }

        save.removeAttribute('disabled')
        add.removeAttribute('disabled')
    })

    add.addEventListener('click', function(e) {
        appendNewItem()
    })

    save.addEventListener('click', (e) => {
        const itens = $('div.row.item')
        const savedChangesSpan = $('#saved-changes', true)

        let toSave = []

        itens.forEach(item => {
            const url = item.querySelector('[name="url"]').value

            if (url) {
                const code = item.querySelector('[name="code"]').value
                const match_sub = item.querySelector('[name="match_sub"]').checked
                const enabled = item.querySelector('[name="enabled"]').checked
    
                const obj = { url, code, match_sub, enabled }
    
                toSave.push(obj)
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