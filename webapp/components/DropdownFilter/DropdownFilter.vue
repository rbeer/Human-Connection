<template>
  <dropdown offset="8">
    <a
      :v-model="selected"
      slot="default"
      slot-scope="{ toggleMenu }"
      name="dropdown"
      class="dropdown-filter"
      href="#"
      @click.prevent="toggleMenu()"
    >
      <base-icon name="filter" />
      <label class="label" for="dropdown">{{ selected }}</label>
      <base-icon class="dropdown-arrow" name="angle-down" />
    </a>
    <ds-menu
      slot="popover"
      slot-scope="{ toggleMenu }"
      class="dropdown-menu-popover"
      :routes="filterOptions"
    >
      <ds-menu-item
        slot="menuitem"
        slot-scope="item"
        class="dropdown-menu-item"
        :route="item.route"
        :parents="item.parents"
        @click.stop.prevent="filter(item.route, toggleMenu)"
      >
        {{ item.route.label }}
      </ds-menu-item>
    </ds-menu>
  </dropdown>
</template>
<script>
import Dropdown from '~/components/Dropdown'

export default {
  components: {
    Dropdown,
  },
  props: {
    selected: { type: String, default: '' },
    filterOptions: { type: Array, default: () => [] },
  },
  methods: {
    filter(option, toggleMenu) {
      this.$emit('filter', option)
      toggleMenu()
    },
  },
}
</script>
<style lang="scss">
.dropdown-filter {
  user-select: none;
  display: flex;
  align-items: center;
  height: 100%;
  padding: $space-xx-small;
  color: $text-color-soft;

  > .label {
    margin: 0 $space-xx-small;
  }
}

.dropdown-menu {
  user-select: none;
  display: flex;
  align-items: center;
  height: 100%;
  padding: $space-xx-small;
  color: $text-color-soft;
}

.dropdown-menu-popover {
  a {
    padding: $space-x-small $space-small;
    padding-right: $space-base;
  }
}
</style>
