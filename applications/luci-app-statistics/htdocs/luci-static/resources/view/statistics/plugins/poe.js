'use strict';
'require baseclass';
'require fs';
'require form';

return baseclass.extend({
	title: _('PoE Plugin Configuration'),
	description: _('The PoE plugin will monitor power output of the PoE ports. Data is typically read from /sys/class/poe/sys_ports/  port*/power ( \'*\' denotes the port to be read, e.g. port0 )'),

	addFormOptions: function(s) {
		var o;

		o = s.option(form.Flag, 'enable', _('Enable this plugin'));

		o = s.option(form.DynamicList, 'Device', _('Monitor PoE port(s)'), _('Empty value = monitor all'));
		o.load = function(section_id) {
			return Promise.all([
				L.resolveDefault(fs.list('/sys/class/poe/sys_ports'), [])
			]).then(L.bind(function(res) {
				var entries = res[0].concat(res[1]);

				for (var i = 0; i < entries.length; i++)
					if (entries[i].type == 'directory')
						o.value(entries[i].name);

				return this.super('load', [ section_id ]);
			}, this));
		};

		o.optional = true;
		o.depends('enable', '1');

		o = s.option(form.Flag, 'IgnoreSelected', _('Monitor all except specified'));
		o.default = '0';
		o.optional = true;
		o.depends('enable', '1');
	},

	configSummary: function(section) {
		var zones = L.toArray(section.Device),
		    invert = section.IgnoreSelected == '1';

		if (zones.length)
			return (invert
				? _('Monitoring all PoE ports except %s')
				: _('Monitoring PoE ports %s')
			).format(zones.join(', '));
		else
			return _('Monitoring all PoE ports');
	}
});
