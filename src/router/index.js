import { createRouter, createWebHistory } from 'vue-router';
import Auth from '../Auth.vue';
import Cookies from 'js-cookie';
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const routes = [
  {
    path: '/',
    component: Auth,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/settings/Base.vue'),
      },
      {
        path: '/home',
        alias: '/',
        name: 'home',
        component: () => import('../views/home/Base.vue'),
      },
      {
        path: '/users',
        component: () => import('../views/users/Base.vue'),
        children: [
          {
            path: '',
            name: 'user list',
            component: () => import('../views/users/List.vue'),
            meta: {
              requiredPermissions: ['users:manage'],
            },
          },
          {
            path: ':id(\\d+)',
            name: 'profile',
            component: () => import('../views/users/Profile.vue'),
            meta: {
              requiredPermissions: ['users:manage', 'user_permissions:manage'],
            },
          },
        ],
      },
      {
        path: '/permissions',
        component: () => import('../views/permissions/Base.vue'),
        children: [
          {
            path: '',
            name: 'permission list',
            component: () => import('../views/permissions/List.vue'),
            meta: {
              requiredPermissions: ['permissions:manage'],
            },
          },
        ],
      },
      {
        path: '/offices',
        component: () => import('../views/offices/Base.vue'),
        children: [
          {
            path: '',
            name: 'office list',
            component: () => import('../views/offices/List.vue'),
            meta: {
              requiredPermissions: ['offices:manage'],
            },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const token = Cookies.get('auth_token', { domain: location.hostname });
  
  if (to.meta.requiresAuth && token === undefined) {
    return '/login';
  } else if (to.meta.requiresAuth && token !== undefined) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('auth_token', { domain: location.hostname })}`;
    const permissions = ['announcements', 'users', 'permissions', 'offices', 'user_permissions'];
    
    return await axios.post(`${import.meta.env.VITE_API_URL}/auth?permissions=${permissions.join()}`)
    .then(response => {
      Cookies.set('auth_user', JSON.stringify({
        avatar: response.data.avatar,
        name: response.data.name,
      }), { domain: location.hostname });

      const permissions = response.data.permissions.map(permission => {
        return {
          n: permission.name,
          o: to.meta.requiredPermissions?.includes(permission.name) && permission.offices?.length > 0
            ? permission.offices.map(office => office.id)
            : [],
        }
      });

      if (to.meta.requiredPermissions && permissions.find(x => to.meta.requiredPermissions.includes(x.n)) === undefined) return '/';

      Cookies.set('auth_permissions', JSON.stringify(permissions));
    })
    .catch(() => {
      Cookies.remove('auth_token', { domain: location.hostname });
      return '/login';
    });
  } else if (token !== undefined) {
    return '/';
  }
});

export default router;