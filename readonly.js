define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "dialog.error"
    ];
    main.provides = ["readonly"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var showError = imports["dialog.error"].show;
        
        var shouldShowError = options.shouldShowError;
        
        /***** Initialization *****/
        
        var plugin = new Plugin("Ajax.org", main.consumes);

        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;
            
            if (shouldShowError)
                showError("Workspace is read only.");
        }
        
        /***** Lifecycle *****/
        
        plugin.on("load", function(){
            load();
        });
        
        /***** Register and define API *****/
        
        plugin.freezePublicAPI({});
        
        register(null, { readonly : plugin });
    }
});