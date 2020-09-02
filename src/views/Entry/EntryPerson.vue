<template>
  <el-main class="view">
    <el-container>
      <h1 v-if="chineseName" class="main-title">{{ chineseName }} <small v-if="foreignName" class="text-muted">{{ foreignName }}</small></h1>
      <h1 v-else class="main-title">{{ foreignName }}</h1>
      <el-link icon="el-icon-edit" :underline="false" class="entry-edit-button" @click="handleEdit()">让我来完善信息</el-link>
    </el-container>
    <el-row>
      <el-col class="entry-main-info">
        <el-row class="media">
          <img v-if="coverUrl" class="cover" :src="id | personCoverUrl" :alt="`${chineseName ? chineseName : foreignName}的封面`" />
          <div v-else class="no-cover">暂无封面</div>
          <div class="media-body">
            <p v-if="Object.keys(otherNames).length">别名：<span v-for="(value, id, index) in otherNames">{{ (index ? ' / ' : '') + value }}</span></p>
            <p>{{ typePerson | birthdayCall }}：{{ birthday }}</p>
            <p>{{ typePerson | birthplaceCall }}：{{ birthplace }}</p>
          </div>
        </el-row>
        <el-row>
          <h2 class="title">简介</h2>
          <pre class="intro">{{ intro }}</pre>
        </el-row>
      </el-col>
    </el-row>
    <el-row v-if="typePerson !== valueOfPersonHuman" class="entry-swiper">
      <h2 class="title">成员<small class="see-more-disable"> 查看全部(绝赞开发中)</small></h2>
      <EntryPersonSwiperMember :items="members"></EntryPersonSwiperMember>
    </el-row>
  </el-main>
</template>

<script>
  import { Col, Link } from 'element-ui'
  import EntryPersonSwiperMember from './private/EntryPersonSwiperMember'
  import moduleEntryPerson from '@/store/modules/entry/entryPerson'

  export default {
    name: 'EntryPerson',
    
    metaInfo () {
      return {
        title: `${this.chineseName ? this.chineseName : this.foreignName}`,
        meta: [{
          vmid: 'description',
          name: 'description',
          content: `${this.chineseName} ${this.foreignName}简介、作品一览`,
        }]
      }
    },
      
    components: {
      'el-col': Col,
      'el-link': Link,
      EntryPersonSwiperMember
    },
    
    props: {
      id: {
        type: String,
        required: true,
        validator: value => parseInt(value) > 0
      }
    },
    
    asyncData ({ store, route: { params: { id }}}) {
      store.registerModule('entryPerson', moduleEntryPerson) // 注册是为了使用action
      return store.dispatch('entryPerson/FETCH_ENTRY', { id })
    },
    
    destroyed () {
      if (this.$store.hasModule('entryPerson')) this.$store.unregisterModule('entryPerson')
    },
    
    computed: {
      recordId () {
        return this.$store.state.entry.persons[this.id].recordId
      },
      valueOfPersonHuman () {
        return this.$store.getters['business/valueOfPersonHuman']
      },
      chineseName () {
        return this.$store.state.entry.persons[this.id].chineseName
      },
      foreignName () {
        return this.$store.state.entry.persons[this.id].foreignName
      },
      coverUrl () {
        return this.$store.state.entry.persons[this.id].coverUrl
      },
      otherNames () {
        return this.$store.state.entry.persons[this.id].otherNames
      },
      typePerson () {
        return this.$store.state.entry.persons[this.id].typePerson
      },
      birthday () {
        return this.$store.state.entry.persons[this.id].birthday
      },
      birthplace () {
        return this.$store.state.entry.persons[this.id].birthplace
      },
      intro () {
        return this.$store.state.entry.persons[this.id].intro
      },
      members () {
        return this.$store.state.entry.persons[this.id].members
      }
    },
    
    methods: {
      handleEdit() {
        this.$store.commit('SET_ACTIVE_RECORD_ID_FOR_EDIT', { id: this.recordId })
        this.$store.commit('SET_PERSON_RECORD', { entry: this.$store.state.entry.persons[this.id] })
        this.$router.push('/edit/persons')
      }
    }
  }
</script>

<style lang="sass">
  @import "@/assets/css/main"
  @import "@/assets/css/entry"
</style>