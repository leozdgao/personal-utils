angular.module('app.directives')

/* Form builder options
*  - name: name of the form
*  - formClass: class of the form
*  - keys: fields showed in the form
*      - label: label text of the field
*      - attrs: extra attributes for the field
*      - validate: validate logic for the field
*  - buttonGroup: definition of the buttons
*      - text: text of the button
*      - className: class of the button
*      - click: click event handler, if it is the submit button, it should return a promise.
*/

.factory('CompanyFormOptions', [function(){
    return function() {
        return {
            formClass: "form-horizontal",
            keys: {
                name: {
                    label: "Company Name",
                    attrs: {
                        "ng-required": true
                    },
                    validate: {
                        required: "Company Name is requied."
                    }
                },
                clientId: {
                    label: "ClientID",
                    attrs: {
                        "ng-required": true,
                        "tooltip-trigger": "focus",
                        "tooltip-placement": "right",
                        tooltip: '"Recommend that clientID starts with \'30\' and its length better be 10."'
                    },
                    validate: {
                        required: "ClientID is requied."
                    }
                },
                serverFolder: {
                    label: "Server Folder",
                    attrs: {
                        "ng-required": true,
                        "tooltip-trigger": "focus",
                        "tooltip-placement": "right",
                        tooltip: '"Folder name on server 208."'
                    },
                    validate: {
                        required: "Server folder is requied."
                    }
                }, 
                perforceFolder: {
                    label: "Perforce Folder",
                    attrs: {
                        "ng-required": true,
                        "tooltip-trigger": "focus",
                        "tooltip-placement": "right",
                        tooltip: '"Folder name on P4v."'
                    },
                    validate: {
                        required: "Perforce folder is requied."
                    }
                } 
            },
            buttonGroup: [
                // exist by default
                {
                    isSubmit: true,
                    text: "Submit",
                    className: "btn btn-primary btn-sm",
                    click: function() {}
                },{
                    text: "Cancel",
                    className: "btn btn-default btn-sm",
                    click: function() {}
                }
                // maybe some extra buttons
            ]
        }
    }
}])