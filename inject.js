const domain = psl.get(window.location.hostname)
const hostname = window.location.hostname

if (domain) {
    chrome.storage.local.get({ '__injector': [] }, function(result) {
        const found = result['__injector'].filter(r => {
            if (r?.match_sub) {
                return domain === r.url
            }

            return hostname === r.url
        })?.[0]

        if (!found) { return }

        if (found?.enabled && found?.code) {
            try {
                eval(found.code)
                chrome.extension.sendMessage(
                    { kind: 'badge' }, 
                    () => {}
                )
            }
            catch (e) {
                console.error('Exception thrown when evaluating your js. Check the syntax.')
            }
        }
    })
}