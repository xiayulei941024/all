import "/style/page.less";

import Router from "/js/router.js";
import routes from "/js/routes.js";
import { postData, getUrlParams } from "/js/utils.js";
const readStatApi = "/news/updateReadNumH";

const container = document.getElementById('app');

const router = new Router({ routes });
router.beforeEach((transition) => {
  // cache old page's scrollTop
  transition.cache({scrollTop: container.scrollTop})
  // setTimeout(() => {
  transition.next();
  // }, 1000);
});
router.afterEach((route, cache) => {
  if (route.path === '/detail') {
    container.scrollTop = 0
  }
  if (route.path === '/list') {
    container.scrollTop = cache.scrollTop
  }
});

router.init(container)

container.addEventListener('click', (event) => {
  const el = event.target;
  const parent = el.offsetParent;
  if (parent.classList.contains('news-item')) {
    router.push(`/detail?newsId=${parent.id}`)
  }
  if (el.classList.contains('show-more')) {
    const isSpread = el.getAttribute('spread') === '1'
    el.innerText = isSpread ? '展开' : '收起'
    el.setAttribute('spread', isSpread ? '0' : '1')
    if (parent.classList.contains('multi-line-ellipsis')) {
      isSpread ? parent.classList.add('clamp') : parent.classList.remove('clamp')
    }
  }
})

// period read count
postData(readStatApi, { id: getUrlParams().query.periodId }).then(res => {
  console.log(`update read count: `, res?.code)
})


