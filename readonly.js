define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "dialog.notifcation"
    ];
    main.provides = ["readonly"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var notify = imports["dialog.notifcation"].show;
        
        var shouldShowError = options.shouldShowError;
        
        /***** Initialization *****/
        
        var plugin = new Plugin("Ajax.org", main.consumes);

        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;
            
            if (shouldShowError) {
                notify("<div class='c9-update'>A new version of "
                    + "Cloud9 is available. Click this bar to update to the new "
                    + "version (requires a restart).</div>", true);
            }
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