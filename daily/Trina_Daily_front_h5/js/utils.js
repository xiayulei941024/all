const domain = import.meta.env.VITE_API_URL;
// const domain = "http://10.42.144.197";
// const domain = "http://insightapi-dev.trinasolar.com";

console.log(import.meta.env);
export async function postData(url = "", data = {}) {
  try {
    const response = await fetch(domain + url, {
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    const ret = await response.json();
    if (ret.code === 200) {
      return ret;
    }
    return {
      code: ret.code,
      error: {
        message: ret.message,
      },
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export const getUrlParams = (hash) => {
  const [hashDeatail, queryString] = (hash || location.hash).split("?");
  const path = hashDeatail.split("#")[1];
  const params = queryString?.split?.("&") || [];
  const query = params.reduce((prev, next) => {
    const [k, v] = next?.split?.("=");
    return {
      ...prev,
      [k]: v,
    };
  }, {});

  return {
    path,
    query,
  };
};

export const isFunction = (fn) =>
  Object.prototype.toString.call(fn) === "[object Function]";

export const cacheRequestData = (api) => {
  let cacheData = null;
  let cacheId = null;
  return async (id) => {
    if (cacheData && cacheId === id) {
      return cacheData;
    }

    const response = await postData(api, { id });
    if (response.error) {
      return {
        error: response.error.message + `<br> \n periodid: ${id}`,
      };
    }

    cacheId = id;
    cacheData = response.data;
    return cacheData;
  };
};

export const newsCatagory = [
  { color: "#83DAAD", label: "宏观形势", value: 1, key: "macroEnvironment" },
  { color: "#EDBF45", label: "行业动态", value: 2, key: "industryTrends" },
  {
    color: "#8E63B7",
    label: "产业链动态",
    value: 3,
    key: "supplyChainDynamics",
  },
  {
    color: "#E8954F",
    label: "国际能源观察",
    value: 4,
    key: "internationalEnergy",
  },
  { color: "#697798", label: "其他", value: 0, key: "other" },
];

export const listClassify = (list) => {
  const classified = list.reduce(
    (base, it) => {
      base[it.classReal]?.push(it);
      return base;
    },
    { 1: [], 2: [], 3: [], 4: [], 0: [] }
  );
  const ret = newsCatagory.map((cat) => {
    if (classified[cat.value].length >= 2) {
      return classified[cat.value].sort((a, b) => a.orderNews - b.orderNews);
    }
    return classified[cat.value];
  });
  return ret.flat();
};

export const siteLogoUrlMap = {
  "clean energy wire": "Clean Energy Wire.png",
  cnbc: "CNBC.png",
  "cpia-光伏热点新闻": "CPIA-光伏热点新闻.png",
  "doe energy.gov": "DOE Energy.Gov.png",
  err能研微讯: "ERR能研微讯.png",
  "green tech media": "Green Tech Media.png",
  iea: "IEA.png",
  "infolink consulting": "InfoLink Consulting.png",
  irena: "IRENA.png",
  "pv magazine": "PV magazine.png",
  "pv tech": "PV Tech.png",
  "renew economy": "Renew Economy.png",
  "renewable energy world": "Renewable Energy World.png",
  reuters: "Reuters.png",
  solarzoom: "solarzoom.png",
  中国政府网: "中国政府网.png",
  中国电力企业联合会: "中国电力企业联合会.png",
  光伏們: "光伏們.png",
  光伏前沿: "光伏前沿.png",
  光伏在线: "光伏在线.png",
  光伏资讯: "光伏资讯.png",
  全球光伏: "全球光伏.png",
  北极星售电网: "北极星售电网.png",
  北极星太阳能光伏: "北极星太阳能光伏.png",
  华夏能源: "华夏能源.png",
  国家发改委: "国家发改委.png",
  国家能源局: "国家能源局.png",
  国际太阳能光伏网: "国际太阳能光伏网.png",
  工信部: "工信部.png",
  智汇光伏: "智汇光伏.png",
  电联新媒: "电联新媒.png",
  索比: "索比.png",
  能源一号: "能源一号.png",
  能源日参: "能源日参.png",
  落基山研究所: "落基山研究所.png",
  赶碳号科技: "赶碳号科技.png",
  钙钛矿太阳能电池: "钙钛矿太阳能电池.png",
  集邦新能源: "集邦新能源.png",
  黑鹰光伏: "黑鹰光伏.png",
  "中创碳投": "中创碳投.png"
};
