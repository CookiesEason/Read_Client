<template>
  <el-container>
    <el-header>
      <nav-component/>
    </el-header>
    <el-container style="margin: 50px auto">
      <el-aside width="280px">
        <div class="aside">
          <ul class="menu">
            <li @click="index('note')" :class="activeClass === 1 ? 'active':''">
              <a>
                <div class="setting-icon"><i class="el-icon-tickets"></i></div>
                <span>文章</span>
              </a>
            </li>
            <li @click="index('user')" :class="activeClass === 2 ? 'active':''">
              <a>
                <div class="setting-icon"><i class="el-icon-user-solid"></i></div>
                <span>用户</span>
              </a>
            </li>
            <li  @click="index('collection')" :class="activeClass === 3 ? 'active':''">
              <a>
                <div class="setting-icon"><i class="el-icon-menu"></i></div>
                <span>专题</span>
              </a>
            </li>
            <li  @click="index('notebook')" :class="activeClass === 4 ? 'active':''">
              <a>
                <div class="setting-icon"><i class="el-icon-notebook-1"></i></div>
                <span>文集</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="search-recent">
          <div class="search-recent-header clearfix"><span>最近搜索</span> <a @click="removeAll">清空</a></div>
          <ul class="search-recent-item-wrap" ref="recentItemList">
            <li v-for="(history, n) in historys" :key="n">
              <a @click="$router.push('/search?q='+history)" v-if="history!=''">
                <i class="ic-search-history el-icon-time"></i> <span>{{history}}</span>
              </a>
            </li>
          </ul>
        </div>
      </el-aside>
      <el-container style="margin-left: 40px;">
        <div class="search-content" v-if="isNote">
          <div class="sort-type" style="padding-bottom: 0">
            <a class="active">
              综合排序
            </a>
<!--            <a class="">-->
<!--              热门文章-->
<!--              ·-->
<!--            </a>-->
<!--            <a class="">-->
<!--              最新发布-->
<!--              ·-->
<!--            </a>-->
<!--            <a class="">-->
<!--              最新评论-->
<!--            </a>-->
          </div>
          <div class="result">{{totals}} 个结果</div>
          <ul class="note-list">
            <li v-for="(article, n)  in articles" :key="n">
              <div class="content">
                <div class="author">
                  <router-link tag="a" :to="/u/ + article.userId" target="_blank" class="avatar">
                    <img :src="article.headUrl">
                  </router-link>
                  <div class="info">
                    <router-link tag="a" :to="/u/ + article.userId" class="nickname">{{article.nickname}}</router-link>
                    <span class="time">{{article.createdDate}}</span>
                  </div>
                </div>
                <router-link tag="a" :to="/p/ + article.articleId" target="_blank" class="title" v-html="article.title"></router-link>
                <p class="abstract" v-html="article.content"></p>
                <div class="meta">
                  <router-link tag="a" :to="/p/ + article.articleId">
                    <i class="iconfont el-icon-third-liulan"></i> {{article.clicks}}
                  </router-link>
                  <router-link tag="a" :to="/p/ + article.articleId">
                    <i class="iconfont el-icon-third-pinglun2"></i> {{article.comments}}
                  </router-link>
                  <span><i class="iconfont el-icon-third-aixin"></i> {{article.likes}}</span>
                </div>
              </div>
            </li>
          </ul>
          <el-pagination
            style="text-align: center"
            background
            v-if="totals > 0"
            :page-size="3"
            :current-page.sync="currentPage"
            @current-change="pageChange"
            layout="prev, pager, next"
            :total="totals">
          </el-pagination>
        </div>
        <div class="search-content" v-if="isUser">
          <div class="sort-type">
            <a class="active">
              综合排序
            </a>
          </div>
          <div class="result">{{totals}} 个结果</div>
          <ul class="user-list">
            <li v-for="(user, n) in users" :key="n">
              <router-link tag="a" :to="/u/ + user.userId" target="_blank" class="avatar">
                <img :src="user.headUrl">
              </router-link>
              <div class="info">
                <router-link tag="a" :to="/u/ + user.userId" target="_blank" class="name">
                  {{user.nickname}}
                </router-link>
                <div class="meta"><span>关注 {{user.followers}}</span> <span>粉丝 {{user.fans}}</span> <span>文章 {{user.articles}}</span></div>
                <div class="meta">
                  <span>
                    写了 {{user.words}} 字，获得了 {{user.likes}} 个喜欢
                  </span>
                </div>
              </div>
              <el-button v-show="user.userId != userId" v-if="!user.isFollowed" type="success" round class="follow"
                         @click="followUser(n)">
                <i class="el-icon-plus"/><span>关注</span></el-button>
              <el-button v-show="user.userId != userId" v-else type="info" round class="follow"
                         @click="followUser(n)">
                <i class="el-icon-check"/><span>已关注</span></el-button>
            </li>
          </ul>
          <el-pagination
            style="text-align: center"
            background
            v-if="totals > 0"
            :page-size="10"
            :current-page.sync="currentPage"
            @current-change="pageChange"
            layout="prev, pager, next"
            :total="totals">
          </el-pagination>
        </div>
        <div class="search-content" v-if="isCollection">
          <div class="sort-type">
            <a class="active">
              综合排序
            </a>
          </div>
          <div class="result">{{totals}} 个结果</div>
          <ul class="user-list">
            <li v-for="(topic, n) in topics" :key="n">
              <router-link tag="a" :to="/c/ + topic.id" target="_blank" class="avatar">
                <img :src="topic.topicHeadUrl">
              </router-link>
              <div class="info">
                <router-link tag="a" :to="/c/ + topic.id" target="_blank" class="name">
                  {{topic.name}}
                </router-link>
                <div class="meta">
                  <span>
                    收录了 {{topic.articles}} 篇文章，{{topic.followers}} 人关注
                  </span>
                </div>
              </div>
              <el-button v-if="!topic.isFollowed" type="success" round class="follow"
                         @click="followCollection(n)">
                <i class="el-icon-plus"/><span>关注</span></el-button>
              <el-button v-else type="info" round class="follow"
                         @click="followCollection(n)">
                <i class="el-icon-check"/><span>已关注</span></el-button>
            </li>
          </ul>
          <el-pagination
            style="text-align: center"
            background
            v-if="totals > 0"
            :page-size="10"
            :current-page.sync="currentPage"
            @current-change="pageChange"
            layout="prev, pager, next"
            :total="totals">
          </el-pagination>
        </div>
        <div class="search-content" v-if="isNotebook">
          <div class="sort-type">
            <a class="active">
              综合排序
            </a>
          </div>
          <div class="result">{{totals}} 个结果</div>
          <ul class="user-list">
            <li v-for="(notebook, n) in notebooks" :key="n">
              <router-link tag="a" :to="/c/ + notebook.id" target="_blank" class="avatar">
                <img src="../assets/avatar-notebook-default.png">
              </router-link>
              <div class="info">
                <router-link tag="a" :to="/nb/ + notebook.id" target="_blank" class="name">
                  {{notebook.name}}
                </router-link>
                <div class="meta">
                  <span>
                    {{notebook.articles}} 篇文章，{{notebook.followers}} 人关注
                  </span>
                </div>
              </div>
              <el-button v-if="!notebook.isFollowed" type="success" round class="follow"
                         @click="followNotebook(n)">
                <i class="el-icon-plus"/><span>关注</span></el-button>
              <el-button v-else type="info" round class="follow"
                         @click="followNotebook(n)">
                <i class="el-icon-check"/><span>已关注</span></el-button>
            </li>
          </ul>
          <el-pagination
            style="text-align: center"
            background
            v-if="totals > 0"
            :page-size="10"
            :current-page.sync="currentPage"
            @current-change="pageChange"
            layout="prev, pager, next"
            :total="totals">
          </el-pagination>
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import NavComponent from './common/Nav'
export default {
  name: 'Search',
  components: {
    NavComponent
  },
  data () {
    return {
      isNote: true,
      isUser: false,
      isCollection: false,
      isNotebook: false,
      activeClass: 1,
      content: '',
      users: [],
      articles: [],
      topics: [],
      notebooks: [],
      currentPage: 1,
      totalPages: 1,
      totals: 0,
      type: 'article',
      userId: '',
      order: 'likes',
      historys: []
    }
  },
  created () {
    if (this.$route.query.q !== '') {
      this.searchContent(this.$route.query.q)
    }
    this.setHistoryItems(this.content)
    this.userId = localStorage.getItem('userId')
  },
  watch: {
    $route () {
      this.searchContent(this.$route.query.q)
      this.content = this.$route.query.q
    }
  },
  methods: {
    searchContent (searchContent) {
      let _this = this
      _this.content = searchContent
      this.axios.get('/api/search', {
        params: {
          'page': 1,
          'content': searchContent,
          'type': 'article',
          'order': 'likes'
        }
      }).then(function (res) {
        if (res.data.code) {
          _this.articles = res.data.data.list
          _this.totalPages = res.data.data.totalPages
          _this.totals = res.data.data.totalElements
        }
      })
    },
    index (type) {
      if (type === 'note') {
        this.isNote = true
        this.isUser = false
        this.isCollection = false
        this.isNotebook = false
        this.activeClass = 1
        let _this = this
        _this.type = 'article'
        _this.currentPage = 1
        this.axios.get('/api/search', {
          params: {
            'page': 1,
            'content': _this.content,
            'type': 'article',
            'order': 'likes'
          }
        }).then(function (res) {
          if (res.data.code) {
            _this.articles = res.data.data.list
            _this.totalPages = res.data.data.totalPages
            _this.totals = res.data.data.totalElements
          }
        })
      } else if (type === 'user') {
        this.isNote = false
        this.isUser = true
        this.isCollection = false
        this.isNotebook = false
        this.activeClass = 2
        let _this = this
        _this.type = 'user'
        _this.currentPage = 1
        this.axios.get('/api/search', {
          params: {
            'page': 1,
            'content': _this.content,
            'type': type
          }
        }).then(function (res) {
          if (res.data.code) {
            _this.users = res.data.data.list
            _this.totalPages = res.data.data.totalPages
            _this.totals = res.data.data.totalElements
          }
        })
      } else if (type === 'collection') {
        this.isNote = false
        this.isUser = false
        this.isCollection = true
        this.isNotebook = false
        this.activeClass = 3
        let _this = this
        _this.type = 'topic'
        _this.currentPage = 1
        this.axios.get('/api/search', {
          params: {
            'page': 1,
            'content': _this.content,
            'type': 'topic'
          }
        }).then(function (res) {
          if (res.data.code) {
            _this.topics = res.data.data.list
            _this.totalPages = res.data.data.totalPages
            _this.totals = res.data.data.totalElements
          }
        })
      } else {
        this.isNote = false
        this.isUser = false
        this.isCollection = false
        this.isNotebook = true
        this.activeClass = 4
        let _this = this
        _this.type = 'notebook'
        _this.currentPage = 1
        this.axios.get('/api/search', {
          params: {
            'page': 1,
            'content': _this.content,
            'type': type
          }
        }).then(function (res) {
          if (res.data.code) {
            _this.notebooks = res.data.data.list
            _this.totalPages = res.data.data.totalPages
            _this.totals = res.data.data.totalElements
          }
        })
      }
    },
    pageChange (page) {
      this.search(this.content, this.type, page)
    },
    search (searchContent, type, page) {
      let _this = this
      this.axios.get('/api/search', {
        params: {
          'page': page,
          'content': searchContent,
          'type': type,
          'order': _this.order
        }
      }).then(function (res) {
        if (res.data.code) {
          if (type === 'user') {
            _this.users = res.data.data.list
          } else if (type === 'notebook') {
            _this.notebooks = res.data.data.list
          } else if (type === 'topic') {
            _this.topics = res.data.data.list
          } else {
            _this.articles = res.data.data.list
          }
          _this.totalPages = res.data.data.totalPages
          _this.totals = res.data.data.totalElements
        }
      })
    },
    removeAll () {
      localStorage.historyItems = ''
      this.historys = []
    },
    followUser (index) {
      this.users[index].isFollowed = !this.users[index].isFollowed
      let _this = this
      this.axios.put('/api/follow', {
        'fromUserId': localStorage.getItem('userId'),
        'toUserId': this.users[index].userId
      }).then(function (res) {
        if (_this.users[index].isFollowed) {
          _this.$message({
            message: '关注成功',
            type: 'success',
            center: true
          })
        } else {
          _this.$message({
            message: '取消关注成功',
            type: 'success',
            center: true
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    followCollection (index) {
      this.topics[index].isFollowed = !this.topics[index].isFollowed
      let _this = this
      this.axios.put('/api/follow/topic', {
        'typeId': _this.topics[index].id,
        'userId': localStorage.getItem('userId')
      }).then(function (res) {
        if (res.data.code) {
          if (_this.topics[index].isFollowed) {
            _this.$message({
              message: '关注成功',
              type: 'success',
              center: true
            })
          } else {
            _this.$message({
              message: '取关成功',
              type: 'success',
              center: true
            })
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    followNotebook (index) {
      this.notebooks[index].isFollowed = !this.notebooks[index].isFollowed
      let _this = this
      this.axios.put('/api/follow/notebook', {
        'typeId': _this.notebooks[index].id,
        'userId': localStorage.getItem('userId')
      }).then(function (res) {
        if (res.data.code) {
          if (_this.notebooks[index].isFollowed) {
            _this.$message({
              message: '关注成功',
              type: 'success',
              center: true
            })
          } else {
            _this.$message({
              message: '取关成功',
              type: 'success',
              center: true
            })
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    setHistoryItems (keyword) {
      let { historyItems } = localStorage
      if (historyItems === undefined) {
        localStorage.historyItems = keyword
      } else {
        let lista = []
        lista = historyItems.split('|')
        lista = Array.from(new Set(lista))
        if (lista.length > 6) {
          lista.splice(5)
        }
        // eslint-disable-next-line eqeqeq
        historyItems = keyword + '|' + lista.filter(e => e != keyword).join('|')
        localStorage.historyItems = historyItems
      }
      this.historys = localStorage.historyItems.split('|')
      this.historys = Array.from(new Set(this.historys))
    }
  }
}
</script>

<style scoped>
  a {
    cursor: pointer;
    text-decoration: none;
  }
  ul,li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  li {
    line-height: 20px;
  }
  .aside {
    overflow: auto;
  }
  .aside ul {
    margin-bottom: 0;
    list-style: none;
  }
  .aside .menu .setting-icon {
    margin-right: 15px;
    width: 32px;
    height: 32px;
    text-align: center;
    color: #fff;
    background-color: #a0a0a0;
    border-radius: 4px;
    display: inline-block;
    vertical-align: middle;
  }
  .aside .menu .setting-icon i {
    margin-top: 7px;
    font-size: 17px;
    display: block;
  }
  .aside .menu span {
    vertical-align: middle;
  }
  .aside .menu a {
    padding: 10px 15px;
    font-size: 15px;
    display: block;
  }
  .aside .menu li {
    height: 52px;
  }
  .aside .menu li.active a, .aside .menu li:hover a {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
  .aside {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  .search-recent-header {
    padding-left: 15px;
    padding-right: 15px;
    height: 20px;
    margin-bottom: 10px;
  }
  .search-recent-header span {
    float: left;
    font-size: 14px;
    color: #969696;
  }
  .search-recent-header a {
    float: right;
    font-size: 13px;
    color: #969696;
    background-color: transparent;
    border-width: 0;
    padding: 0;
  }
  .search-recent-item-wrap li a .ic-search-history {
    float: left;
    margin-right: 10px;
    font-size: 18px;
    color: #787878;
  }
  .search-recent-item-wrap li a {
    display: block;
    height: 40px;
    line-height: 20px;
    padding: 10px 15px;
    font-size: 14px;
    color: #333;
    position: relative;
  }
  .search-recent-item-wrap li a span {
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    padding-right: 30px;
  }
  .search-recent .search-recent-item-wrap li a:hover {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
  .search-recent .search-recent-header a:hover {
    color: #2f2f2f;
  }
  .search-recent .search-recent-item-wrap li a .ic-unfollow {
    position: absolute;
    right: 15px;
    top: 13px;
    color: #a0a0a0;
  }
  .search-recent .search-recent-item-wrap li a .ic-unfollow:hover {
    color: #2f2f2f;
  }
  .search-content {
    position: relative;
    min-width: 630px;
  }
  .sort-type {
    padding-bottom: 20px;
    font-size: 13px;
  }
  .sort-type a, .sort-type span {
    color: #969696;
  }
  .result {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 13px;
    color: #b4b4b4;
  }
  .sort-type a.active, .sort-type a:hover {
    color: #2f2f2f;
  }
  .note-list {
    padding-top: 10px;
    clear: both;
  }
  .note-list li {
    position: relative;
    width: 100%;
    margin: 0 0 15px;
    padding: 15px 2px 20px 0;
    border-bottom: 1px solid #f0f0f0;
    word-wrap: break-word;
  }
  .note-list .author .avatar, .note-list .author .info {
    display: inline-block;
    vertical-align: middle;
  }
  .note-list .author .avatar {
    margin: 0 5px 0 0;
  }
  .note-list .author .info .nickname {
    vertical-align: middle;
  }
  .note-list .author a {
    color: #333;
  }
  .avatar {
    width: 24px;
    height: 24px;
    display: block;
    cursor: pointer;
  }
  .avatar img {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 50%;
  }
  .note-list .author .info span {
    display: inline-block;
    padding-left: 3px;
    color: #969696;
    vertical-align: middle;
  }
  .note-list .title {
    float: none;
    font-size: 18px;
    color: #333;
    margin-top: 10px;
    display: inherit;
    font-weight: 700;
    line-height: 1.5;
  }
  .note-list .abstract {
    margin: 0 0 8px;
    font-size: 13px;
    line-height: 24px;
    color: #999;
    width: 600px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    overflow: hidden;
  }
  .note-list .meta a {
    margin-right: 10px;
    color: #b4b4b4;
  }
  .note-list .meta span {
    margin-right: 10px;
    color: #b4b4b4;
  }
  .note-list .meta a:hover {
    color: #787878;
  }
  .user-list li {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
    line-height: normal;
  }
  .user-list .avatar {
    width: 52px;
    height: 52px;
    margin-right: 8px;
    vertical-align: middle;
    display: inline-block;
  }
  .user-list .info {
    vertical-align: middle;
    display: inline-block;
    max-width: 450px;
  }
  .user-list .name {
    font-size: 15px;
    font-weight: 700;
    color: #333;
  }
  .user-list .meta {
    padding-top: 2px;
    font-size: 0;
    color: #969696;
  }
  .user-list .meta span {
    margin-right: 10px;
    padding-right: 10px;
    font-size: 12px;
    border-right: 1px solid #969696;
  }
  .user-list .meta span:last-child {
    border: none;
  }
  .user-list .follow {
    float: right;
    margin-top: 7px;
    outline: none;
  }
  .avatar-collection {
    width: 52px;
    height: 52px;
    margin-right: 8px;
    vertical-align: middle;
    display: inline-block;
  }
  .avatar-collection img {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 10%;
  }
  .title >>> .search-result-highlight {
    font-style: normal;
    color: #ea6f5a;
  }
  .abstract >>> .search-result-highlight{
    font-style: normal;
    color: #ea6f5a;
  }
</style>
