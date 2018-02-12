var DEBUG = false;

(function observeFindInPageInstanceCreated() {
    DEBUG && console.log('observeFindInPageInstanceCreated');
    var webviewContainer = document.querySelector('#webview-container');
    if (webviewContainer === null) {
        setTimeout(observeFindInPageInstanceCreated, 300);
        return;
    }
    webviewContainerObserver.observe(webviewContainer, {
        characterData: false,
        attributes: false,
        childList: true,
        subtree: true
    });
})();

var webviewContainerObserver = new MutationObserver(
    function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function (node) {
                    DEBUG && console.log('webviewContainer mutation: addedNode: ', node);
                    if (node.classList.contains('find-in-page')) {
                        node.alertParentNode = getClosestParentByClass(node, 'webpageview');
                        observeFindInPageChanged.observe(node, {
                            characterData: true,
                            attributes: true,
                            childList: false,
                            subtree: true
                        });
                    }
                });
            }
        });
    }
);

var observeFindInPageChanged = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        DEBUG && console.log('findInPageResults mutation:', mutation.type, mutation.target);
        if (mutation.target.id === 'fip-input-text') {
            saveInitialState(mutation.target);
        } else if (mutation.type === 'characterData') {
            alertIfStartedOver(mutation.target);
        }
    });
});

function saveInitialState(fipInputText) {
    setTimeout(function waitUntilAllMatchCounted() {
        saveInitialValues(fipInputText);
    }, 100);
}

function saveInitialValues(fipInputText) {
    var fip = getClosestParentByClass(fipInputText, 'find-in-page');
    fip.alertInitialCounter = fip.querySelector('.fip-results').textContent;
    fip.alertSearchFor = fipInputText.value;
    DEBUG && console.log('saveInitialValues', fip.alertInitialCounter, fip.alertSearchFor);
}

function alertIfStartedOver(results) {
    DEBUG && console.log('alertIfStartedOver', results);
    var counter = results.textContent;
    // Text object has no classList, so parent has to be passed.
    var fip = getClosestParentByClass(results.parentNode, 'find-in-page');
    var fipInputText = fip.querySelector('#fip-input-text');
    var newFindEntryOpenedWithoutChangingText = fip.alertSearchFor === undefined;
    if (newFindEntryOpenedWithoutChangingText) {
        saveInitialState(fipInputText);
        return;
    }
    if ((counter === fip.alertInitialCounter) &&
        (fipInputText.value === fip.alertSearchFor) &&
        (!fip.alertParentNode.contains(fip.alertParentNode.alert))) {
        showAlertOnNode(fip.alertParentNode);
    }
}

function showAlertOnNode(node) {
    var alertMessageContainer = document.createElement('div');
    alertMessageContainer.className = 'find-in-page-alert';
    var alertMessage = document.createElement('div');
    alertMessage.textContent = 'Searching started over';
    alertMessageContainer.appendChild(alertMessage);
    node.alert = node.appendChild(alertMessageContainer);
    setTimeout(function () {
        node.removeChild(node.alert);
    }, 3000);
}

function getClosestParentByClass(node, className) {
    while (!(node.classList.contains(className))) {
        node = node.parentNode;
    }
    return node;
}