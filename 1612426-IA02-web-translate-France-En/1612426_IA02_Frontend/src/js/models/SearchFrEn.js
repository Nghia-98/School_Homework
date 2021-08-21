export default class Search {
  constructor(query) {
    this.query = query
  }
  async getResult() {
    try {
      console.log('this.query', this.query)
      const res = await fetch(`http://localhost:4321/translate/${this.query}`)
      const data = await res.json()
      this.result = data
      console.log('this.result: ', this.result);
      return this.result
    } catch (error) {
      alert(error)
    }
  }
}