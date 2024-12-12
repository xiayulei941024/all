import skew from "/assets/skew.svg";
import eye from "/assets/eye.svg";
import clock from "/assets/clock.svg";
import {
  postData,
  getUrlParams,
  cacheRequestData,
  listClassify,
  siteLogoUrlMap,
} from "/js/utils.js";

const newsDetailApi = "/news/markDownToHtml";
const newsListApi = "/news/selectPublishNews";

const snMap = Object.entries(import.meta.globEager("/assets/[0-9].svg")).reduce(
  (init, [k, v]) => {
    const sn = k.match(/\/assets\/([0-9]).svg/)[1];
    return {
      ...init,
      [sn]: v.default,
    };
  },
  {}
);

const fetchNewsData = cacheRequestData(newsListApi);

const routes = [
  {
    path: "/list",
    async render(route) {
      const params = getUrlParams();

      const { readNum, title, pubTime, list, error } = await fetchNewsData(
        params.query.periodId
      );

      const renderLogo = (name) => {
        let url = siteLogoUrlMap[name.trim().toLowerCase()]
        url = url ? `/logos/${url}` : '/logos/trinasolar-logo.png'
        return `<span class="source-logo"><img src="${url}" alt="${name}-logo"></span>`;
      };


      const footer = () => {
        return `<div style="color:#008BD6;text-align:center;">--Powered by AI--</div>`
      }

      const newsItem = (params) => {
        const { sn, title, siteName, abstractReal, addMode, id } = params;
        const tags = String(sn).padStart(2, "0").split("");

        return `
              <div class="news-item leading-24" id=${id} mode=${addMode}>
                <span class="sn-tag">
                  ${snMap[tags[0]]}
                  ${snMap[tags[1]]}
                </span>
                <p class="news-title text-20 font-semibold leading-28 color-85">
                  ${title}
                </p>
                <p class="comming-source color-45">
                  ${renderLogo(siteName)}
                  <span>${siteName}</span>
                </p>
                <p class="news-summary">
                  ${abstractReal}
                </p>
                <p>
                  <span class="read-all color-primary">阅读全文</span>
                </p>
                <div class="split-bar flex">
                  <span class="bottom-line"></span>
                  <span class="flex">
                    ${skew}
                    ${skew}
                    ${skew}
                  </span>
                </div>
              </div>
            `;
      };

      const listRender = () => {
        const listString = listClassify(list)
          ?.map?.((it, idx) => newsItem({ ...it, sn: idx + 1 }))
          ?.join("\r");
        return `
          <div class="page-wrapper">
            <header class="page-header">
              <p class="font-semibold text-20 color-85">
                ${title}
              </p>
              <p class="sub-info flex items-center color-45">
                ${eye}
                <span class="mr-24 ml-8">${readNum}人阅读</span>
                ${clock}
                <span class="ml-8">${pubTime}</span>
              </p>
            </header>
            <section class="page-title flex items-center justify-center">
              <span class="block sm"></span>
              <span class="block"></span>
              <h2 class="page-title-text">今日要闻</h2>
              <span class="block"></span>
              <span class="block sm"></span>
            </section>
            <article class="news-list flex flex-col">${listString}</article>
            ${footer()}
          </div>
        `;
      };

      return error ? error : listRender();
    },
  },
  {
    path: "/detail",
    async render(route) {
      const params = getUrlParams();

      const renderLogo = (name) => {
        const key = name.replace(/.+>(.+)<.+/g,"$1").trim().toLowerCase()
        const url = siteLogoUrlMap[key]
        if (!url) {
          return ''
        }
        return `<span class="source-logo"><img src="/logos/${url}" alt="${key}-logo"></span>`;
      };

      const detailRender = (data) => {
        const { markContent, abstractReal, siteName, title } = data;
        return `
        <div class="page-wrapper">
          <article class="article">
            <div class="news-detail leading-24">
              <section class="news-title text-20 font-semibold leading-28 color-85">
                ${title}
              </section>
              <section class="comming-source color-65 text-14">
                ${renderLogo(siteName)}
                ${siteName}
              </section>
              <section class="news-summary color-45">
                <div class="multi-line-ellipsis clamp">
                ${abstractReal}
                <span class="show-more color-primary" spread="0">展开</span>
                </div>
              </section>
              <section class="news-content leading-24">
                ${markContent}
              </section>
            </div>
          </article>
        </div>
        `;
      };

      const detail = await postData(newsDetailApi, { id: params.query.newsId });
      if (detail.error) {
        return detail.error.message;
      }
      const ret = detailRender(detail.data);
      return ret;
    },
  },
];
export default routes;
