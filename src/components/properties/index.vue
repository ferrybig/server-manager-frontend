<template>
	<div class="property">
		<p>
			{{ name }}
			<span @click.prevent="help = !help">[?]</span>
		</p>
		<transition name="help">
			<p v-if="help">
				<label class="property__description">
					{{ description }}
				</label>
			</p>
		</transition>
		<property-list
			v-if="type === 'list'"
			:value="value"
			@input="e => $emit('input', e)"
		/>
		<property-text-field
			v-else
			:value="value"
			@input="e => $emit('input', e)"
		/>
	</div>
</template>

<script>
import PropertyTextField from './PropertyTextField';
import PropertyList from './PropertyList';

export default {
	name: '',
	components: {
		PropertyTextField,
		PropertyList,
	},
	model: {
		prop: 'value',
		event: 'input',
	},

	props: {
		description: {
			type: String,
			default: '',
		},
		value: {
			type: String,
			required: true,
		},
		format: {
			type: Object,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			help: false,
		};
	},
	computed: {
		type() {
			return this.getType(this.format);
		},
	},
	// Methods
	methods: {
		getType(format) {
			switch (format.name) {
			case 'list':
				return 'list';
			default:
				return 'text';
			}
		},
		input(evt) {
			this.$emit('input', evt);
		},
	},
};
</script>

