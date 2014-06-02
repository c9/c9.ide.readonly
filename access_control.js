/**
 * Access control dialogs
 */
define(function(require, exports, module) {
"use strict";

    main.consumes = ["Plugin", "api", "dialog.alert", "dialog.question", "dialog.error"];
    main.provides = ["access_control"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var api = imports.api;
        var showAlert = imports["dialog.alert"].show;
        var showQuestion = imports["dialog.question"].show;
        var showError = imports["dialog.error"].show;

        var plugin = new Plugin("Ajax.org", main.consumes);
        var readonly = options.readonly;

        var loaded = false;
        function load() {
            if (loaded) return;
            loaded = true;
            
            if (!readonly)
                return;

            api.collab.get("access_info", function (err, info) {
                if (err) return showAlert("Error", info);

                if (info.private) {
                    if (!info.member) {
                        // Do you want to request access to this workspace
                        showRequestAccessDialog();
                    }
                    else if (info.pending) {
                        // Already requested, do you want to cancel ?
                        showCancelAccessDialog();
                    }
                }
                else {
                    if (!info.member)
                        showError("Workspace is read only. Use the Collaborate tab to request access.");
                }
                
            });
        }

        function showRequestAccessDialog(write) {
            showQuestion("Workspace Access",
              "You don't currently have " + (write ? "write " : "")
              + "access to this workspace",
              "Would you like to request access?",
              function(){
                  // Yes
                 requestAccess();
              },
              function(){
                  // No - nothing
              }
            );
        }
        
        function requestAccess() {
             api.collab.post("request_access", function (err, member) {
                 if (err) return showAlert("Error Requesting access", err.message || err);
                 showAlert("Done", "Access request sent", "We have sent an access request to the admin of this workspace. You can come back when the admin grants your access");
             });
        }

        function showCancelAccessDialog() {
            showQuestion("Workspace Access",
              "Request access pending approval",
              "Would you like to cancel your access request?",
              function(){
                  // Yes
                  api.collab.delete("cancel_request", function (err) {
                      if (err) return showAlert("Error", err);
                      showAlert("Done", "Access request cancelled", "We don't currently have access to this workspace");
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
            requestAccess: requestAccess,
            
            showRequestAccessDialog: showRequestAccessDialog
        });

        register(null, {
            access_control: plugin
        });
    }
});