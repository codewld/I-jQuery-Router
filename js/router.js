(function () {

    function Router() {
        this.routerMap = {}
    }

    /**
     * 初始化方法
     * @param routerMap json格式的参数表
     */
    Router.prototype.initial = function (routerMap) {
        this.routerMap = routerMap
        if (typeof jQuery == 'undefined') {
            window.alert("请引入 jQuery-Router 所依赖的 jQuery")
            return
        }
        $(document).ready(() => {
            onHashChange()
        })
        window.addEventListener('hashchange', () => {
            $(document).ready(() => {
                onHashChange()
            })
        })

    }

    /**
     * 在路径后追加
     */
    Router.prototype.append = function (str) {
        location.hash = location.hash + str
    }

     /**
     * 跳转路径
     */
      Router.prototype.to = function (str) {
        location.hash = str
    }

    /**
     * 获取url中的路径参数并进行匹配
     */
    function onHashChange() {
        // 获取url中的有效路径参数
        let hash = location.hash.slice(location.hash.indexOf("#") + 1)
        if (hash.charAt(0) === "/") {
            hash = hash.slice(1)
        }
        if (hash.charAt(hash.length - 1) === "/") {
            hash = hash.slice(0, hash.length - 1)
        }

        // 将路径参数转化为数组
        pathParams = hash.split("/")

        // 创建初始匹配结果
        let matchRes = {
            son: routerMap
        }

        matchAndLoad(0, matchRes)
    }

    /**
     * 匹配路由并加载组件
     * 使用递归方式，保证元素加载
     * @param matchRes 匹配结果
     */
    function matchAndLoad(i, matchRes) {
        if (i < pathParams.length) {
            if (matchRes.son.hasOwnProperty(pathParams[i])) {
                // 匹配路径表（根据重定向与否）
                if (matchRes.son[pathParams[i]].redirect !== undefined) {
                    matchRes = matchRes.son[matchRes.son[pathParams[i]].redirect]
                } else {
                    matchRes = matchRes.son[pathParams[i]]
                }

                // 加载匹配到的组件
                $('#router-view-' + (i + 1)).load(matchRes.path, () => {
                    matchAndLoad(i + 1, matchRes)
                })
            } else {
                $('#router-view-1').load(routerMap["404"].path)
            }
        }
    }

    window.$router = new Router()
})()