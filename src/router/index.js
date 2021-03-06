import Vue from 'vue'
import Router from 'vue-router'
import store from '../stores/store'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Register from '@/components/Register'
import ForgetPassword from '@/components/ForgetPassword'
import Article from '@/components/Article'
import User from '@/components/User'
import RecommendationUsers from '@/components/RecommendationUsers'
import NewCollection from '@/components/NewCollection'
import Collection from '@/components/Collection'
import EditCollection from '@/components/EditCollection'
import NoteBook from '@/components/NoteBook'
import Subscription from '@/components/Subscription'
import UserSubscription from '@/components/subscription/UserSubscription'
import IndexSubscription from '@/components/subscription/Index'
import CollectionSubscription from '@/components/subscription/CollectionSubscription'
import NoteBookSubscription from '@/components/subscription/NoteBookSubscription'
import Bookmarks from '@/components/Bookmarks'
import Notification from '@/components/Notification'
import LikeNotification from '@/components/notification/Like'
import FollowNotification from '@/components/notification/Follow'
import CommentNotification from '@/components/notification/Comment'
import OthersNotification from '@/components/notification/Others'
import ChatsNotification from '@/components/notification/Chat'
import ChatContent from '@/components/notification/ChatContent'
import RequestNotification from '@/components/notification/Request'
import AllRequestsNotification from '@/components/notification/AllRequests'
import CollectionRequestNotification from '@/components/notification/CollectionRequest'
import Search from '@/components/Search'
import NoteBookCenter from '@/components/NoteBookCenter'
import Settings from '@/components/Settings'
import BasicSetting from '@/components/setting/Basic'
import Blacklist from '@/components/setting/Blacklist'
import Recycle from '@/components/Recycle'
import RecycleBody from '@/components/recycle/RecycleBody'
import UserCenterSubscription from '@/components/UserCenterSubscription'
import UserFollowCenter from '@/components/UserFollowCenter'
import Followers from '@/components/follow/Followers'
import Fans from '@/components/follow/Fans'
import FollowCollection from '@/components/subscription/FollowCollection'
import LikeNoteBook from '@/components/subscription/LikeNoteBook'
import Notebooks from '@/components/write/Notebooks'
import Note from '@/components/write/Note'

Vue.use(Router)

if (localStorage.getItem('token')) {
  store.commit('set_token', localStorage.getItem('token'))
}

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/sign_in',
      name: 'signIn',
      component: Login
    },
    {
      path: '/sign_up',
      name: 'signUp',
      component: Register
    },
    {
      path: '/users/password/mobile_reset',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      path: '/recommendations/users',
      name: 'RecommendationUsers',
      component: RecommendationUsers
    },
    {
      path: '/p/:id',
      name: 'Article',
      component: Article
    },
    {
      path: '/u/:id',
      name: 'User',
      component: User
    },
    {
      path: '/c/:id',
      name: 'Collection',
      component: Collection
    },
    {
      path: '/collections/new',
      name: 'NewCollection',
      component: NewCollection
    },
    {
      path: '/collections/:id/edit',
      name: 'EditCollection',
      component: EditCollection
    },
    {
      path: '/nb/:id',
      name: 'NoteBook',
      component: NoteBook
    },
    {
      path: '/users/:id/subscriptions',
      component: UserCenterSubscription,
      children: [
        {
          path: '',
          name: 'FollowCollection',
          component: FollowCollection
        },
        {
          path: 'liked_notes',
          name: 'LikeNoteBook',
          component: LikeNoteBook
        }
      ]
    },
    {
      path: '/users/:id/following',
      component: UserFollowCenter,
      children: [
        {
          path: '',
          name: 'Followers',
          component: Followers
        },
        {
          path: 'fans',
          name: 'Fans',
          component: Fans
        }
      ]
    },
    {
      path: '/subscription',
      component: Subscription,
      children: [
        {
          path: '',
          name: 'IndexSubscription',
          component: IndexSubscription
        },
        {
          path: ':id/user',
          name: 'UserSubscription',
          component: UserSubscription
        },
        {
          path: ':id/collection',
          name: 'CollectionSubscription',
          component: CollectionSubscription
        },
        {
          path: ':id/notebook',
          name: 'NoteBookSubscription',
          component: NoteBookSubscription
        }
      ]
    },
    {
      path: '/bookmarks',
      name: 'Bookmarks',
      component: Bookmarks
    },
    {
      path: '/notifications',
      component: Notification,
      redirect: '/notifications/comments',
      children: [
        {
          path: 'comments',
          name: 'CommentNotification',
          component: CommentNotification
        },
        {
          path: 'likes',
          name: 'LikeNotification',
          component: LikeNotification
        },
        {
          path: 'follows',
          name: 'FollowNotification',
          component: FollowNotification
        },
        {
          path: 'others',
          name: 'OthersNotification',
          component: OthersNotification
        },
        {
          path: 'chats',
          name: 'ChatsNotification',
          component: ChatsNotification
        },
        {
          path: 'chats/:id',
          name: 'ChatContent',
          component: ChatContent
        },
        {
          path: 'requests',
          name: 'RequestNotification',
          component: RequestNotification
        },
        {
          path: 'allRequests',
          name: 'AllRequestsNotification',
          component: AllRequestsNotification
        },
        {
          path: 'collections/:id/submissions',
          name: 'CollectionRequestNotification',
          component: CollectionRequestNotification
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/writer/notebooks',
      component: NoteBookCenter,
      children: [
        {
          path: ':id',
          component: Notebooks,
          children: [
            {
              path: 'notes/:nbId',
              name: 'Note',
              component: Note
            }
          ]
        }
      ]
    },
    {
      path: '/writer/recycle',
      component: Recycle,
      children: [
        {
          path: ':id',
          name: 'RecycleBody',
          component: RecycleBody
        }
      ]
    },
    {
      path: '/settings',
      component: Settings,
      redirect: '/settings/basic',
      children: [
        {
          path: 'basic',
          name: 'BasicSetting',
          component: BasicSetting
        },
        {
          path: 'blacklist',
          name: 'Blacklist',
          component: Blacklist
        }
      ]
    }
  ]
})
