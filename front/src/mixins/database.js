export default {
  data() {
    return {
      db: null
    }
  },
  created() {
    db.ref('public').on(
      'value', (snapshot) => {
        this.db = snapshot.val()
      })
  },
}
