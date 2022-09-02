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
            window.addEventListener('hashchange', hashchangeEvent => {
                jQuery(() => onHashChange(hashchangeEvent))
            })

            /**
             * 获取url中的路径参数并进行匹配
             */
            const onHashChange = (hashchangeEvent) => {
                let newPathList = []
                let oldPathList = []
                let pathInfoList = []
                if (hashchangeEvent) {
                    newPathList = getPathList(hashchangeEvent.newURL)
                    oldPathList = getPathList(hashchangeEvent.oldURL)
                } else {
                    newPathList = getPathList(location.hash)
                }
                for (let i = 0, startChange = false; i < newPathList.length; i++) {
                    let isChange = !(startChange === false && i < oldPathList.length && oldPathList[i] === newPathList[i])
                    if (isChange) {
                        startChange = true
                    }
                    let pathInfo = {
                        path: newPathList[i],
                        isChange: isChange
                    }
                    pathInfoList.push(pathInfo)
                }

                // 创建初始匹配结果
                let matchRes = {
                    son: this.routerMap
                }

                matchAndLoad(1, matchRes, pathInfoList)
            }

            /**
             * 将URL转化为路径数组
             */
            const getPathList = (url) => {
                // 获取url中的有效路径参数
                let hash = url.slice(url.indexOf('#') + 1)
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
                let pathList = hash.split('/')

                return pathList
            }

            /**
             * 匹配路由并加载组件
             * 使用递归方式，保证元素加载
             * @param matchRes 匹配结果
             */
            const matchAndLoad = (i, matchRes, pathInfoList) => {
                if (i > pathInfoList.length) {
                    return
                }
                let tempMatchRes = matchRes.son[pathInfoList[i - 1].path]
                if (tempMatchRes) {
                    if (tempMatchRes.redirect) {
                        matchRes = matchRes.son[tempMatchRes.redirect]
                    } else {
                        matchRes = tempMatchRes
                    }

                    
                    // 加载匹配到的组件
                    if (pathInfoList[i - 1].isChange) {
                        $('#router-view-' + i).load(matchRes.path, () => {
                            matchAndLoad(i + 1, matchRes, pathInfoList)
                        })
                    } else {
                        matchAndLoad(i + 1, matchRes, pathInfoList)
                    }
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