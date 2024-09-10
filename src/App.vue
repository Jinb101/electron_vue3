<script setup>
import { RouterLink, RouterView } from 'vue-router';

const top = (type) => {
  switch (type) {
    case 1:
      window.electron.minimize();
      break;
    case 2:
      window.electron.maximize();
      break;
    case 3:
      window.electron.close();
      break;
  }
};
</script>

<template>
    <div id="app" class="pt-[40px]">
        <div
            class="h-[40px] fixed top-0 left-0 w-full flex justify-end items-center py-1 z-50"
            style="-webkit-app-region: drag;"
        >
            <el-icon @click.stop="top(1)" class="mr-2"
                     style="-webkit-app-region: no-drag;"
                     size="22"><Minus /></el-icon>
            <el-icon
                style="-webkit-app-region: no-drag;"
                @click.stop="top(2)" class="mr-2" size="22"><FullScreen /></el-icon>
            <el-icon
                style="-webkit-app-region: no-drag;"
                @click.stop="top(3)" class="mr-2" size="22"><Close /></el-icon>
        </div>
        <RouterView />
    </div>
</template>

<style></style>
