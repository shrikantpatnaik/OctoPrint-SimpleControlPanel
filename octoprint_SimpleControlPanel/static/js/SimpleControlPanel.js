$(function() {
    function SimpleControlPanelViewModel(parameters) {
        var self = this;
        self.pluginName = "SimpleControlPanel";
        self.settings = parameters[0];

        self.currentBrightness = ko.observable();

        self.currentBrightness.subscribe(function(newValue) {
            $.ajax({
                type: "PATCH",
                contentType: "application/json",
                data: JSON.stringify({
                    brightness: newValue
                }),
                url: self.buildPluginUrl('/brightness'),
                error: function (error) {
                    console.log(error)
                }
            })
        });

        self.getBackendValue = function() {
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                url: self.buildPluginUrl('/brightness'),
                success: function(data) {
                    self.currentBrightness(data['current_brightness'])
                }
            })
        };

        self.onBeforeBinding = function() {
            self.getBackendValue();
            setInterval(self.getBackendValue, 1000)

        };

        self.buildPluginUrl = function (path) {
            return window.PLUGIN_BASEURL + self.pluginName + path;
        };
    }

    // This is how our plugin registers itself with the application, by adding some configuration
    // information to the global variable OCTOPRINT_VIEWMODELS
    OCTOPRINT_VIEWMODELS.push([
        // This is the constructor to call for instantiating the plugin
        SimpleControlPanelViewModel,

        // This is a list of dependencies to inject into the plugin, the order which you request
        // here is the order in which the dependencies will be injected into your view model upon
        // instantiation via the parameters argument
        ["settingsViewModel"],

        // Finally, this is the list of selectors for all elements we want this view model to be bound to.
        ["#navbar_plugin_SimpleControlPanel"]
    ]);
});
