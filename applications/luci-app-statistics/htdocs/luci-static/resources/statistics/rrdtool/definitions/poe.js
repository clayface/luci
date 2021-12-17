/* Licensed to the public under the Apache License 2.0. */

'use strict';
'require baseclass';

return baseclass.extend({
	title: _('PoE Output'),

	rrdargs: function(graph, host, plugin, plugin_instance, dtype) {
		return {
			title: "%H: Power output of %pi",
			alt_autoscale: true,
			vlabel: "mW",
			number_format: "%5.0lf mW",
			data: {
				types: [ "power" ],
				options: {
					power: {
						color: "ff0000",
						title: "Power",
						noarea: true
					}
				}
			}
		};
	}
});
