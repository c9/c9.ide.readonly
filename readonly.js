define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "layout"
    ];
    main.provides = ["readonly"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var layout = imports.layout;
        
        /***** Initialization *****/
        
        var plugin = new Plugin("Ajax.org", main.consumes);

        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;
            
            layout.showError("Workspace is read only");
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