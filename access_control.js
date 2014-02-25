/**
 * Access control dialogs
 */
define(function(require, exports, module) {
"use strict";

    main.consumes = ["Plugin", "api", "dialog.alert", "dialog.question"];
    main.provides = ["access_control"];
    return main;

    function main(options, imports, register) {
        var Plugin   = imports.Plugin;
        var api      = imports.api;
        var alert    = imports["dialog.alert"].show;
        var question = imports["dialog.question"].show;

        var plugin = new Plugin("Ajax.org", main.consumes);

        var loaded = false;
        function load() {
            if (loaded) return;
            loaded = true;

            api.collab.get("access_info", function (err, info) {
                if (err) return alert("Error", info);

                if (!info.member) {
                    // Do you want to request access to this workspace
                    showRequestAccessDialog();
                }
                else if (info.pending) {
                    // Already requested, do you want to cancel ?
                    showCancelAccessDialog();
                }
                else {
                    console.log("Just a read-only member !");
                }
            });
        }

        function showRequestAccessDialog() {
            question("Workspace Access",
              "You don't currently have access to this workspace",
              "Would you like to request access ?",
              function(){
                  // Yes
                  api.collab.post("request_access", function (err, member) {
                      if (err) return alert("Error", err);
                      alert("Done", "Access request sent", "We have sent an access request to the admin of this workspace. You can come back when the admin grants your access");
                  });
              },
              function(){
                  // No - nothing
              }
            );
        }

        function showCancelAccessDialog() {
            question("Workspace Access",
              "Request access pending approval",
              "Would you like to cancel your access reqyest ?",
              function(){
                  // Yes
                  api.collab.delete("cancel_request", function (err) {
                      if (err) return alert("Error", err);
                      alert("Done", "Access request cancelled", "We don't currently have access to this workspace");
                  });
              },
              function(){
                  // No - nothing
              }
            );
        }

        /***** Lifecycle *****/
        plugin.on("load", function(){
            load();
        });
        plugin.on("enable", function(){

        });
        plugin.on("disable", function(){
        });

        plugin.on("unload", function(){
            loaded = false;
        });

        plugin.freezePublicAPI({
        });

        register(null, {
            access_control : plugin
        });
    }
});