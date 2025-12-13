/**
 * Greeting Messages
 * Heartfelt greeting messages displayed on the home page
 */

type GreetingGenerator = (name: string) => [string, string]

export const greetingMessages: GreetingGenerator[] = [
  (name) => [`Welcome back, ${name}.`, 'How are you feeling today?'],
  (name) => [`Good to see you, ${name}.`, 'Take a moment to breathe.'],
  (name) => [`Hey ${name}, remember:`, 'Progress, not perfection.'],
  (name) => [`Hi ${name}!`, 'Your wellbeing matters.'],
  (name) => [`Welcome, ${name}.`, 'Every small step counts.'],
  (name) => [`Hello ${name}.`, "You're doing better than you think."],
  (name) => [`${name}, it's good`, 'to have you here today.'],
  (name) => [`Hey ${name},`, "let's make today brighter."],
  (name) => [`${name}, you showed up.`, 'That already matters.'],
  (name) => [`Hi ${name}.`, 'Be gentle with yourself today.'],
  (name) => [`Welcome, ${name}.`, "You're stronger than you know."],
  (name) => [`Hey ${name},`, 'one breath at a time.'],
  (name) => [`${name}, remember:`, 'Rest is productive too.'],
  (name) => [`Hello ${name}.`, 'Your feelings are valid.'],
  (name) => [`Hi ${name}!`, 'Small wins add up.'],
  (name) => [`${name}, take it slow.`, "There's no rush here."],
  (name) => [`Welcome back, ${name}.`, 'You belong here.'],
  (name) => [`Hey ${name}.`, "It's okay to not be okay."],
  (name) => [`${name}, you matter.`, 'Never forget that.'],
  (name) => [`Hi ${name},`, "let's check in together."],
]

/**
 * Get a random greeting for the given name
 */
export function getRandomGreeting(name: string): [string, string] {
  const randomIndex = Math.floor(Math.random() * greetingMessages.length)
  return greetingMessages[randomIndex](name)
}

