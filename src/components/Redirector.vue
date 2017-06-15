<template>
  <div></div>
</template>

<script>
export default{
  name: 'redirector',
  created () {
    var entrance = window.location.href.match(/\/([a-z0-9]+)\.html/)
    if (entrance && entrance[1]) {
      window.entrance = entrance[1]
      switch (window.entrance) {
        case 'home':
          this.$router.push('/home')
          this.$router.go(1)
          break
        case 'evaluation':
          this.$router.push('/evaluation')
          this.$router.go(1)
          break
        case 'prewarn':
          this.$router.push('/warning')
          this.$router.go(1)
          break
      }
    } else {
      window.entrance = null
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
