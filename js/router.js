(function () {

    function Router() {
        this.routerMap = {}
        this.pathParams = []
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
        /**
         * 获取url中的路径参数并进行匹配
         */
        function onHashChange() {
            this.pathParams = getPathParams()

            matchAndLoad(0, {
                son: routerMap
            })

            /**
             * 获取路径参数组成的数组
             */
            function getPathParams() {
                let hash = location.hash.slice(location.hash.indexOf("#") + 1)
                if (hash.charAt(0) === "/") {
                    hash = hash.slice(1)
                }
                if (hash.charAt(hash.length - 1) === "/") {
                    hash = hash.slice(0, hash.length - 1)
                }
                return hash.split("/")
            }
        }



        /**
         * 匹配路由并加载组件
         * 使用递归方式，保证元素加载完成后再继续下一步
         * @param matchRes 匹配结果
         */
        function matchAndLoad(i, matchRes) {
            if (i < this.pathParams.length) {
                if (matchRes.son.hasOwnProperty(this.pathParams[i])) {
                    // 匹配路径表（根据重定向与否）
                    if (matchRes.son[this.pathParams[i]].redirect !== undefined) {
                        matchRes = matchRes.son[matchRes.son[this.pathParams[i]].redirect]
                    } else {
                        matchRes = matchRes.son[this.pathParams[i]]
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

    window.$router = new Router()
})()