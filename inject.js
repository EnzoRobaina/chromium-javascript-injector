const KEY = '__injector'
const log = console.log
log('injecting')

const domain = psl.get(window.location.hostname)

if (domain) {
    chrome.storage.local.get(null, function(result) {
        log(result)
        const data = result?.[KEY]?.[domain]

        log('data', data)

        if (data?.enabled && data?.script) {
            eval(data.script)
        }
    })
}