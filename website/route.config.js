import { defineAsyncComponent } from 'vue'
import navConfig from './nav.config.json'

const LoadingComponent = {
  template: `<div v-loading="true" style="min-height: 500px; width: 100%;"></div>`,
}
const ErrorComponent = {
  template: `
    <div style="text-align: center;padding: 100px 0;">Loading error. Please refresh the page and try again</div>`,
}
export const getAsyncComponent = func => {
  return defineAsyncComponent({
    loader: func,
    delay: 0,
    timeout: 30000,
    errorComponent: ErrorComponent,
    loadingComponent: LoadingComponent,
  })
}

const loadPage = name => {
  return getAsyncComponent(() => import(/* webpackChunkName: "pages" */ `./pages/${name}.vue`))
}

const loadDocs = path => {
  return getAsyncComponent(() => import(/* webpackChunkName: "docs" */`./docs${path}.md`))
}

const registerRoute = navConfig => {
  let route = []
  route.push({
    path: `/component`,
    redirect: `/component/installation`,
    component: loadPage('component'),
    children: [],
  })
  const index = 0
  navConfig.forEach(nav => {
    if (nav.href) return
    if (nav.groups) {
      nav.groups.forEach(group => {
        group.list.forEach(nav => {
          addRoute(nav, index)
        })
      })
    } else if (nav.children) {
      nav.children.forEach(nav => {
        addRoute(nav, index)
      })
    } else {
      addRoute(nav, index)
    }
  })
  function addRoute (page, index) {
    const component = loadDocs(page.path)
    const child = {
      path: page.path.slice(1),
      meta: {
        title: page.title || page.name,
        description: page.description,
      },
      name: 'component-' + (page.title || page.name) + page.path.slice(1),
      component: component.default || component,
    }

    route[index].children.push(child)
  }
  return route
}

let route = registerRoute(navConfig)

const generateMiscRoutes = function () {
  let guideRoute = {
    path: `/guide`, // 指南
    redirect: `/guide/design`,
    component: loadPage('guide'),
    children: [{
      path: 'design', // 设计原则
      name: 'guide-design',
      meta: {},
      component: loadPage('design'),
    }, {
      path: 'nav', // 导航
      name: 'guide-nav',
      meta: {},
      component: loadPage('nav'),
    }],
  }

  let resourceRoute = {
    path: `/resource`, // 资源
    meta: {},
    name: 'resource',
    component: loadPage('resource'),
  }

  let indexRoute = {
    path: `/`, // 首页
    meta: {},
    name: 'home',
    component: loadPage('index'),
  }

  return [guideRoute, resourceRoute, indexRoute]
}

route = route.concat(generateMiscRoutes())

route = route.concat([{
  path: '/',
  redirect: { path: `/` },
}, {
  path: '/*',
  redirect: { path: `/` },
}])

export default route
