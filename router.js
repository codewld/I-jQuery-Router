(function () {

    class Router {

        constructor() {
            this.routerMap = {}
            this.path = undefined
            this.oldPath = undefined
            this.param = ''
            this.oldParam = ''
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
                jQuery(() => onHashChange())
            })

            /**
             * 获取url中的路径参数并进行匹配
             */
            const onHashChange = () => {
                // 路径信息
                this.oldPath = this.path
                this.path = getPath(location.hash)
                let pathList
                if (this.path !== undefined) {
                    pathList = this.path.split('/')
                } else {
                    pathList = []
                }
                let oldPathList
                if (this.oldPath !== undefined) {
                    oldPathList = this.oldPath.split('/')
                } else {
                    oldPathList = []
                }

                // 参数信息
                this.oldParam = this.param
                this.param = getParam(location.hash)

                // 生成路径信息
                let pathInfoList = []
                for (let i = 0, startChange = this.oldParam !== this.param; i < pathList.length; i++) {
                    let isChange = true
                    if (startChange === false && i < oldPathList.length && oldPathList[i] === pathList[i]) {
                        isChange = false
                    }
                    if (i === pathList.length - 1 && pathList.length < oldPathList.length) {
                        isChange = true
                    }
                    if (isChange) {
                        startChange = true
                    }

                    let pathInfo = {
                        path: pathList[i],
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
             * 获取hash中的路径信息
             */
            const getPath = (hash) => {
                let path = hash.slice(hash.indexOf('#') + 1)
                if (path.indexOf('?') !== -1) {
                    path = path.slice(0, path.indexOf('?'))
                }
                if (path.charAt(0) === '/') {
                    path = path.slice(1)
                }
                if (path.charAt(path.length - 1) === '/') {
                    path = path.slice(0, path.length - 1)
                }
                return path
            }

            /**
             * 获取hash中的参数信息
             */
            const getParam = (hash) => {
                if (hash.indexOf('?') === -1) {
                    return ''
                }
                return hash.slice(hash.indexOf('?') + 1)
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
        append(subPath) {
            setHash(this.path + subPath, this.param)
        }
        
        /**
         * 跳转路径
         */
        to(path) {
            setHash(path, this.param)
        }

        /**
         * 设置参数
         */
        setParam(param) {
            setHash(this.path, param)
        }

        /**
         * 直接改变hash
         */
        changeHash(hash) {
            location.hash = hash
        }
    }

    const setHash = (path, param) => {
        if (path.indexOf('?') !== -1) {
            location.hash = '#404'
            console.log('路径不准携带参数')
            return
        }
        if (path.charAt(0) === '/') {
            path = path.slice(1)
        }
        if (path.charAt(path.length - 1) === '/') {
            path = path.slice(0, path.length - 1)
        }
        if (param != '') {
            location.hash = '/' + path + '?' + param
        } else {
            location.hash = '/' + path
        }
    }

    window.$router = new Router()
})()