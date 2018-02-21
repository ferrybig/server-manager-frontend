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
						:value="getConfig(groupKey, key)"
						@input="e => setConfig(groupKey, key, e.currentTarget.value)"
					>
				</fieldset>
			</fieldset>
		</template>
		<div v-else>
			Loading...
		</div>
	</div>
</template>
<script>
import Vue from 'vue';

export default {
	props: {
		server: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			config: {},
			oldConfig: {},
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
				Vue.set(this.config, groupKey, {});
				Vue.set(this.oldConfig, groupKey, {});
			}
			if (this.config[groupKey][key] === undefined) {
				Vue.set(this.config[groupKey], key, value);
				Vue.set(this.oldConfig[groupKey], key, this.info.values[groupKey][key]);
			} else {
				this.config[groupKey][key] = value;
			}
		},
		getConfig(groupKey, key) {
			if (!this.config[groupKey]) {
				return this.info.values[groupKey][key];
			}
			if (this.config[groupKey][key] === undefined) {
				return this.info.values[groupKey][key];
			}
			return this.config[groupKey][key];
		},
	},
};
</script>
