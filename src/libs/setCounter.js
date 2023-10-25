import Counter from '../models/Counter'

export const setCounter = async (modelName) => {
  try {
    const counter = await Counter.find({ modelName })
    const count = Array.isArray(counter) ? counter.length : console.error('counter is not an array')
    const newCounter = new Counter({
      modelName,
      count: count + 1,
    })
    await newCounter.save()
    return count + 1
  } catch (err) {
    console.error(err)
  }
}
