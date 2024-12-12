import { getUrlParams, isFunction } from "/js/utils.js";
class SimpleRouter {
  constructor(params) {
    this.routes = params.routes || {};
    this.beforeFn = null;
    this.afterFn = null;
  }
  init(container) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container
    const that = this;
    window.addEventListener("load", function (event) {
      that.urlChange();
    });
    window.addEventListener("hashchange", function (event) {
      that.urlChange({to: getUrlParams(event.newURL), from: getUrlParams(event.oldURL)});
    });
    return this;
  }
  urlChange(params) {
    const currentHash = getUrlParams();
    const route = this.route(currentHash.path);
    if (route) {
      return this.refresh(currentHash, params?.from).then(() => this.afterFn?.(currentHash, route.cache || {}));
    }
    // if route dosen't exist then redirect to start page
    if (location.search) {
      location.replace(location.origin + location.pathname + `#/list${location.search}`)
    } else {
      location.hash = `/list`;
    }
  }
  async refresh(currentHash, from) {
    const route = this.route(currentHash.path)
    const routeRender = route.render;
    const renderDom = this.container;
    const renderStr = await routeRender.call(this, currentHash, renderDom);
    const that = this
    return new Promise((resolve, reject) => {
      if (isFunction(this.beforeFn)) {
        this.beforeFn({
          from,
          to: {
            path: currentHash.path,
            query: currentHash.query,
          },
          next() {
            renderDom.innerHTML = renderStr
            resolve()
          },
          cache(params) { // cache something for 'from route'
            const fromRoute = that.route(from?.path)
            if (fromRoute) {
              fromRoute.cache = {
                ...params
              }
            }
          }
        });
      } else {
        renderDom.innerHTML = renderStr
        resolve()
      }
    })
  }
  route(path, render) { // route registration & route seek
    if (typeof path === 'string') {
      path = path.replace(/\s*/g, "");

      if (isFunction(render)) {
        this.routes[path] = {
          render,
        };
      }

      return this.routes.find(route => route.path === path)
    }
  }
  beforeEach(callback) {
    if (isFunction(callback)) {
      this.beforeFn = callback;
    }
  }
  afterEach(callback) {
    if (isFunction(callback)) {
      this.afterFn = callback;
    }
  }
  push(path) {
    location.hash = path
  }
}

export default SimpleRouter;
