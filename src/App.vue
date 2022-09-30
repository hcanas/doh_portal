<template>
  <suspense>
    <router-view :key="$route.fullPath" />
  </suspense>
</template>