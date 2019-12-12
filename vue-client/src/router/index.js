import Vue from 'vue'
import Router from 'vue-router'
import PostsComponent from '@/components/PostsComponent'
import LoginComponent from '@/components/LoginComponent'
import PostComponent from '@/components/PostComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent
    },
    {
      path: '/post',
      name: 'posts',
      component: PostsComponent
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostComponent
    }
  ]
})
