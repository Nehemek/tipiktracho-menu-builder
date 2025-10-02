import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    color: 1 + Math.round(Math.random() * 3),
    tag:   1 + Math.round(Math.random() * 3),
    font:  1 + Math.round(Math.random() * 3),
    style: 1 + Math.round(Math.random() * 3)
  }),

  actions: {
    setColor(newColor: number) {
      this.color = newColor
      },

    setTag(newTag: number) {
      this.tag = newTag
      },

    setFont(newFont: number) {
      this.font = newFont
      },

    setStyle(newStyle: number) {
      this.style = newStyle
      },
  },
  // other options...
})