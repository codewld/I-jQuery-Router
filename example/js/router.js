(function () {

    class Router {

        constructor() {
            this.routerMap = {}
            this.pathParams = []
        }

        /**
         * 初始化方法
         * @param routerMap json格式的参数表
         */
        initial(routerMap) {
            this.routerMap = routerMap
            if (typeof jQuery == 'undefined') {
                window.alert('请引入 jQuery-Router 所依赖的 jQuery')
                return
            }
            jQuery(() => onHashChange())
            window.addEventListener('hashchange', () => {
                jQuery(() => onHashChange())
            })

            /**
             * 获取url中的路径参数并进行匹配
             */
            const onHashChange = () => {
                // 获取url中的有效路径参数
                let hash = location.hash.slice(location.hash.indexOf('#') + 1)
                if (hash.indexOf('?') !== -1) {
                    hash = hash.slice(0, hash.indexOf('?'))   
                }
                if (hash.charAt(0) === '/') {
                    hash = hash.slice(1)
                }
                if (hash.charAt(hash.length - 1) === '/') {
                    hash = hash.slice(0, hash.length - 1)
                }

                // 将路径参数转化为数组
                this.pathParams = hash.split('/')

                // 创建初始匹配结果
                let matchRes = {
                    son: this.routerMap
                }

                matchAndLoad(0, matchRes)
            }

            /**
             * 匹配路由并加载组件
             * 使用递归方式，保证元素加载
             * @param matchRes 匹配结果
             */
            const matchAndLoad = (i, matchRes) => {
                if (i >= this.pathParams.length) {
                    return
                }
                let tempMatchRes = matchRes.son[this.pathParams[i]]
                if (tempMatchRes) {
                    if (tempMatchRes.redirect) {
                        matchRes = tempMatchRes.redirect
                    } else {
                        matchRes = tempMatchRes
                    }

                    // 加载匹配到的组件
                    $('#router-view-' + (i + 1)).load(matchRes.path, () => {
                        matchAndLoad(i + 1, matchRes)
                    })
                } else {
                    $('#router-view-1').load(routerMap['404'].path)
                }
            }
        }

        /**
         * 在路径后追加
         */
        append(str) {
            location.hash = location.hash + str
        }
        
        /**
         * 跳转路径
         */
        to(str) {
            location.hash = str
        }
    }

    window.$router = new Router()
})()