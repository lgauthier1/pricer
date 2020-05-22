export default {
  data() {
    return {
      db: null
    }
  },
  created() {
    db.ref('private').on(
      'value', (snapshot) => {
        this.db = snapshot.val()
      })
  },
}
