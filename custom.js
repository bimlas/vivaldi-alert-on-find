var webviewContainerObserver = new MutationObserver(
    function(mutations){
        mutations.forEach(function(mutation){
            if(mutation.type === 'childList' && mutation.addedNodes.length > 0){
                mutation.addedNodes.forEach(function (node) {
                    console.log('webviewContainer mutation:', node);
                    if(node.classList.contains('find-in-page')) {
                        initFindInPageObserver(node);
                    }
                });
            }
        });
    }
);
var webviewContainerObserverConfig = {
    characterData: false,
    attributes: false,
    childList: true,
    subtree: true
};

(function observeWebviewContainer() {
    console.log('observeWebviewContainer');
    var webviewContainer = document.querySelector('#webview-container');
    if (webviewContainer === null) {
        setTimeout(observeWebviewContainer, 300);
        return;
    }
    webviewContainerObserver.observe(webviewContainer, webviewContainerObserverConfig);
})();

var findInPageObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        console.log('findInPageResults mutation:', mutation.target);
        if (mutation.target.id === 'fip-input-text') {
            setTimeout(function () {
                saveInitialCounter(mutation.target);
            }, 100);
        } else if (mutation.type === 'characterData') {
            alertOnStartingOver(mutation.target);
        }
    });
});
var findInPageObserverConfig = {
    characterData: true,
    attributes: true,
    childList: false,
    subtree: true
};

function initFindInPageObserver(target) {
    console.log('initFindInPageObserver', target);
    findInPageObserver.observe(target, findInPageObserverConfig);
}

var alertMessageContainer = document.createElement('div');
alertMessageContainer.className = 'find-in-page-alert';
var alertMessage = document.createElement('div');
alertMessage.textContent = 'Searching started over';
alertMessageContainer.appendChild(alertMessage);

function saveInitialCounter(fipInputText) {
    webpageview = fipInputText.parentNode.parentNode.parentNode.parentNode;
    webpageview.findInPageAlertInitialCounter = fipInputText.parentNode.getElementsByClassName('fip-results')[0].textContent;
    console.log('saveInitialCounter', webpageview.findInPageAlertInitialCounter);
}

function alertOnStartingOver(results) {
    console.log('alertOnStartingOver', results);
    counter = results.textContent;
    webpageview = results.parentNode.parentNode.parentNode.parentNode.parentNode;
    if ((counter === webpageview.findInPageAlertInitialCounter) && !webpageview.contains(webpageview.findInPageAlert)) {
        webpageview.findInPageAlert = webpageview.appendChild(alertMessageContainer);
        setTimeout(function () {
            webpageview.removeChild(webpageview.findInPageAlert);
        }, 3000);
        results.parentNode.style.backgroundColor = 'red';
    } else {
        results.parentNode.style.backgroundColor = null;
    }
}