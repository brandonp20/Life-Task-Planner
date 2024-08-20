(function() {
    let loginOverlay, mainContainer;

    function initialize(overlay, container) {
        loginOverlay = overlay;
        mainContainer = container;
        if (!loginOverlay || !mainContainer) {
            console.error('Login overlay or main container not provided');
            return false;
        }
        return true;
    }

    function showLogin() {
        if (!loginOverlay || !mainContainer) {
            console.error('Login functions not properly initialized');
            return;
        }
        loginOverlay.style.display = 'flex';
        mainContainer.style.opacity = '0.25';
        mainContainer.style.pointerEvents = 'none';
    }

    function hideLogin() {
        if (!loginOverlay || !mainContainer) {
            console.error('Login functions not properly initialized');
            return;
        }
        loginOverlay.style.display = 'none';
        mainContainer.style.opacity = '1';
        mainContainer.style.pointerEvents = 'auto';
    }

    window.loginFunctions = {
        initialize: initialize,
        showLogin: showLogin,
        hideLogin: hideLogin
    };
})();