import responses from '../data/responses'

export function getAutoReply(contact, userText) {
  const characterData = responses.find(r => r.characterId === contact.characterId)
  if (!characterData) return '...'
  const text = userText.toLowerCase()
  for (const trigger of characterData.triggers) {
    if (trigger.keywords.some(kw => text.includes(kw))) return _random(trigger.responses)
  }
  return _random(characterData.defaultResponses)
}

function _random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
