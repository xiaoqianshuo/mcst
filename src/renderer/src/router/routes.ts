import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

export const routes: Readonly<RouteRecordRaw[]> = [
  {
    name: 'Console',
    path: '/',
    component: () => import('@renderer/views/console/consoleView.vue'),
    meta: {
      title: '控制台'
    }
  },
  {
    name: 'Player',
    path: '/player',
    component: () => import('@renderer/views/player/playerView.vue'),
    meta: {
      title: '玩家管理'
    }
  },
  {
    name: 'PlayerInfo',
    path: '/playerinfo/:name',
    component: () => import('@renderer/views/playerInfo/playerInfoView.vue'),
    meta: {
      title: '玩家信息'
    }
  },
  {
    name: 'Mods',
    path: '/mods',
    component: () => import('@renderer/views/mods/modsView.vue'),
    meta: {
      title: '模组管理'
    }
  }
]
