var webviewContainerObserver = new MutationObserver(
    function(mutations){
        mutations.forEach(function(mutation){
            if(mutation.type === 'childList' && mutation.addedNodes.length > 0){
                mutation.addedNodes.forEach(function (node) {
                    console.log('webviewContainer mutation:', node);
                    if(node.classList.contains('find-in-page')) {
                        initFindInPageResultsObserver(node);
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

var findInPageResultsObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        alertOnStartingOver(mutation.target);
    });
});
var findInPageResultsObserverConfig = {
    characterData: true,
    attributes: false,
    childList: false,
    subtree: true
};

function initFindInPageResultsObserver(target) {
    console.log('initFindInPageResultsObserver', target);
    findInPageResultsObserver.observe(target, findInPageResultsObserverConfig);
}

var alertMessageContainer = document.createElement('div');
alertMessageContainer.className = 'find-in-page-alert';
var alertMessage = document.createElement('div');
alertMessage.textContent = 'Searching started over';
alertMessageContainer.appendChild(alertMessage);

function alertOnStartingOver(results) {
    console.log('alertOnStartingOver', results);
    counter = results.textContent.split(' / ');
    webpageview = results.parentNode.parentNode.parentNode.parentNode.parentNode;
    if ((counter[0] === counter[1]) && !webpageview.contains(webpageview.findInPageAlert)) {
        webpageview.findInPageAlert = webpageview.appendChild(alertMessageContainer);
        setTimeout(function () {
            webpageview.removeChild(webpageview.findInPageAlert);
        }, 3000);
        results.parentNode.style.backgroundColor = 'red';
    } else {
        results.parentNode.style.backgroundColor = null;
    }
}