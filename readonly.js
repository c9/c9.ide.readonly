define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "dialog.error"
    ];
    main.provides = ["readonly"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var showError = imports["dialog.error"].show;
        
        /***** Initialization *****/
        
        var plugin = new Plugin("Ajax.org", main.consumes);

        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;
            
            showError("This workspace is read only; see the Collaborate tab if you would like write access.");
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