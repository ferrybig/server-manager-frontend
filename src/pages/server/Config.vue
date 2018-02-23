<template>
	<div>
		<template v-if="info">
			<fieldset
				v-for="(groupValue, groupKey) in info.values"
				:key="groupKey"
			>
				<legend>{{ groupKey }}</legend>
				<server-property
					v-for="(value, key) in groupValue"
					:key="key"
					:name="key"
					:description="info.format[groupKey][key].description"
					:format="info.format[groupKey][key].format"
					:value="getConfig(groupKey, key)"
					@input="e => setConfig(groupKey, key, e)"
				/>
			</fieldset>
			<button :disabled="!hasUpdates">
				Save
			</button>
		</template>
		<div v-else>
			Loading...
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import ServerProperty from '@/components/properties';

export default {
	components: {
		ServerProperty,
	},
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
		hasUpdates() {
			return Object.keys(this.config).length > 0;
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
