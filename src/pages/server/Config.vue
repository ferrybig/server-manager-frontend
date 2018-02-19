<template>
	<div>
		<template v-if="info">
			<fieldset
				v-for="(groupValue, groupKey) in info.values"
				:key="groupKey"
			>
				<legend>{{ groupKey }}</legend>
				<fieldset
					v-for="(value, key) in groupValue"
					:key="key"
				>
					<legend>{{ key }}</legend>
					<p>{{ info.format[groupKey][key].description }}</p>
					<input
						:value="value"
						@input="e => setConfig(groupKey, key, e.currentTarget.value)"
					>
				</fieldset>
			</fieldset>
		</template>
		<div v-else>
			Loading...
		</div>
		<div>
			Last update:
			<pre>{{ updated }}</pre>
		</div>
	</div>
</template>
<script>


export default {
	props: {
		server: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			config: {

			},
		};
	},
	computed: {

		info() {
			return this.$store.state.serverInfo[this.server];
		},
	},
	methods: {
		setConfig(groupKey, key, value) {
			if (!this.config[groupKey]) {
				this.config[groupKey] = {};
			}
			this.config[groupKey][key] = value;
		},
		getConfig(groupKey, key) {
			if (!this.config[groupKey]) {
				return this.info[groupKey][key];
			}
			if (this.config[groupKey][key] === undefined) {
				return this.info[groupKey][key];
			}
			return this.config[groupKey][key];
		},
	},
};
</script>
