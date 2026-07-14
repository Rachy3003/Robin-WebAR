const onxrloaded = () => {
  XR8.addCameraPipelineModule(LandingPage.pipelineModule())
  LandingPage.configure({
    mediaSrc: './assets/preview.jpg'
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)

const byId = id => document.getElementById(id)
const speech = byId('robin-speech')
const answerPanel = byId('answer-panel')
const answerTopic = byId('answer-topic')
const answerQuestion = byId('answer-question')
const answerText = byId('answer-text')

window.addEventListener('robin-placed', () => {
  document.body.classList.add('is-placed')
})

window.addEventListener('robin-prompt-ready', () => {
  speech?.classList.add('is-visible')
})

window.addEventListener('robin-reset', () => {
  document.body.classList.remove('is-placed')
  speech?.classList.remove('is-visible')
  answerPanel?.classList.remove('is-visible')
})

window.addEventListener('robin-card-selected', event => {
  const card = event.detail
  answerTopic.textContent = card.topic
  answerTopic.style.color = card.color
  answerQuestion.textContent = card.question
  answerText.textContent = card.answer
  answerPanel.classList.add('is-visible')
})

byId('answer-close')?.addEventListener('click', () => answerPanel.classList.remove('is-visible'))
