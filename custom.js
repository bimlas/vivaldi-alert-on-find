var webviewContainerObserver = new MutationObserver(
    function(mutations){
        mutations.forEach(function(mutation){
            if(mutation.type === 'childList' && mutation.addedNodes.length > 0){
                mutation.addedNodes.forEach(function (node) {
                    if(node.className === 'find-in-page') {
                        initFindBoxObserver(node);
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

function initFindBoxObserver(target) {
    console.log('initFindBoxObserver', target);
    findInPageResultsObserver.observe(target, findInPageResultsObserverConfig);
}

function alertOnStartingOver(results) {
    console.log('alertOnStartingOver', results);
    counter = results.textContent.split(' / ');
    if (counter[0] === counter[1]) {
        results.parentNode.style.backgroundColor = 'red';
    } else {
        results.parentNode.style.backgroundColor = null;
    }
}