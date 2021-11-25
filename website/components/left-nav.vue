<template>
  <div class="right-nav">
    <div class="sidebar-groups">
      <div v-for="group in props.navs" :key="group.name" class="sidebar-group">
        <div class="sidebar-group-title">
          <span>{{ group.name }}</span>
        </div>
        <div class="sidebar">
          <div
            v-for="navItem in group.children"
            :key="navItem.name"
            class="sidebar-item"
          >
            <router-link :to="'/component' + navItem.path" class="sidebar-link">
              <span>{{ navItem.name }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// import navs from '../nav.config.json'
const props = defineProps({
  navs: Array,
})

</script>
<style lang="scss" scoped>
.right-nav {
  /* padding: 36px 0; */
  .sidebar-groups {
    .sidebar-group {
      padding-bottom: 20px;
    }
    .sidebar-group-title {
      font-weight: bold;
      padding: 10px 0;
    }
    .sidebar {
      .sidebar-item {
        font-size: 14px;
        padding: 10px 0;
        .sidebar-link {
          color: #444444;
          text-decoration: none;
          transition: color 0.2s;
          &:hover {
            color: #409eff;
          }
        }
        :deep(.router-link-active) {
          color: #409eff;
        }
      }
    }
  }
}
</style>
